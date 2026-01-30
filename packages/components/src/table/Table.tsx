'use client';

import React, { forwardRef, useImperativeHandle, ReactNode, useMemo, useState, useCallback } from 'react'
import { classnames } from '@seven-design-ui/core'
import './table.css'

// 表格列定义接口
export interface TableColumn<T = any> {
  /** 列的唯一标识 */
  prop?: string
  /** 列的标题 */
  label?: string
  /** 列的宽度 */
  width?: string | number
  /** 列的最小宽度 */
  minWidth?: string | number
  /** 是否固定列，可选值为 'left', 'right', true(左侧固定) */
  fixed?: boolean | 'left' | 'right'
  /** 是否可排序 */
  sortable?: boolean | 'custom'
  /** 自定义排序方法 */
  sortMethod?: (a: T, b: T) => number
  /** 自定义排序字段 */
  sortBy?: string | ((row: T, index: number) => any)
  /** 自定义渲染函数 */
  render?: (value: any, row: T, index: number) => ReactNode
  /** 格式化函数 */
  formatter?: (row: T, column: TableColumn<T>, cellValue: any, index: number) => any
  /** 筛选选项 */
  filters?: Array<{ text: string; value: any }>
  /** 自定义筛选方法 */
  filterMethod?: (value: any, row: T, column: TableColumn<T>) => boolean
  /** 筛选的初始值 */
  filteredValue?: any[]
  /** 列的类名 */
  className?: string
  /** 列的样式 */
  style?: React.CSSProperties
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 表头对齐方式 */
  headerAlign?: 'left' | 'center' | 'right'
}

// 排序状态接口
export interface SortState {
  /** 排序字段 */
  prop: string
  /** 排序顺序 */
  order: 'ascending' | 'descending'
}

// 筛选状态接口
export interface FilterState {
  /** 筛选字段 */
  prop: string
  /** 筛选值 */
  values: any[]
}

// Table组件的属性接口
export interface TableProps<T = any> {
  /** 表格数据 */
  data?: T[]
  /** 表格列配置 */
  columns?: TableColumn<T>[]
  /** 是否显示斑马纹 */
  stripe?: boolean
  /** 是否显示边框 */
  border?: boolean
  /** 表格高度 */
  height?: string | number
  /** 表格最大高度 */
  maxHeight?: string | number
  /** 是否固定表头 */
  fixedHeader?: boolean
  /** 行类名函数 */
  rowClassName?: string | ((row: T, index: number) => string)
  /** 行样式函数 */
  rowStyle?: (row: T, index: number) => React.CSSProperties
  /** 默认排序 */
  defaultSort?: SortState
  /** 排序变化回调 */
  onSortChange?: (sort: SortState | null) => void
  /** 筛选变化回调 */
  onFilterChange?: (filters: FilterState[]) => void
  /** 行点击事件 */
  onRowClick?: (row: T, index: number, event: React.MouseEvent) => void
  /** 行双击事件 */
  onRowDoubleClick?: (row: T, index: number, event: React.MouseEvent) => void
  /** 单元格点击事件 */
  onCellClick?: (row: T, column: TableColumn<T>, cellValue: any, event: React.MouseEvent) => void
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 子元素，通常是TableColumn组件 */
  children?: ReactNode
}

// Table组件的引用接口
export interface TableRef {
  /** 手动排序 */
  sort: (prop: string, order: 'ascending' | 'descending') => void
  /** 清除排序 */
  clearSort: () => void
  /** 手动筛选 */
  filter: (prop: string, values: any[]) => void
  /** 清除筛选 */
  clearFilter: (prop?: string) => void
}

// 将列宽解析为像素数值（用于固定列偏移、表格总宽等）
function parseColumnWidth(col: TableColumn, defaultVal = 80): number {
  const raw = col.width ?? col.minWidth
  if (raw == null) return defaultVal
  if (typeof raw === 'number') return raw
  const match = String(raw).match(/^(\d+(?:\.\d+)?)\s*px$/)
  return match ? Number(match[1]) : Number(raw) || defaultVal
}

// 获取列的值
function getColumnValue<T>(row: T, column: TableColumn<T>, index: number): any {
  if (column.prop) {
    return (row as any)[column.prop]
  }
  if (column.sortBy && typeof column.sortBy === 'function') {
    return column.sortBy(row, index)
  }
  return undefined
}

// 渲染单元格内容
function renderCell<T>(
  row: T,
  column: TableColumn<T>,
  index: number
): ReactNode {
  let value = getColumnValue(row, column, index)

  // 使用formatter格式化值
  if (column.formatter) {
    value = column.formatter(row, column, value, index)
  }

  // 使用render自定义渲染
  if (column.render) {
    return column.render(value, row, index)
  }

  // 默认显示值
  return value
}

// TableColumn 组件，用于兼容Element Plus风格的API
export interface TableColumnProps<T = any> extends TableColumn<T> {
  children?: ReactNode
}

export const TableColumn = forwardRef<HTMLDivElement, TableColumnProps>(
  (_props, _ref) => {
    // TableColumn 主要用于配置，不需要渲染内容
    return null
  }
)

TableColumn.displayName = 'TableColumn'

// 主要的Table组件
const Table = forwardRef<TableRef, TableProps>((props, _ref) => {
  const {
    data = [],
    columns = [],
    stripe = false,
    border = false,
    height,
    maxHeight,
    rowClassName,
    rowStyle,
    defaultSort,
    onSortChange,
    onFilterChange,
    onRowClick,
    onRowDoubleClick,
    onCellClick,
    className,
    style,
    children,
    ...rest
  } = props

  // 排序状态
  const [sortState, setSortState] = useState<SortState | null>(defaultSort || null)
  // 筛选状态
  const [filterStates, setFilterStates] = useState<FilterState[]>(() => {
    // 从列配置中获取初始筛选值
    return columns
      .filter(column => column.filteredValue && column.filteredValue.length > 0)
      .map(column => ({
        prop: column.prop!,
        values: column.filteredValue!
      }))
  })

  // 处理排序
  const handleSort = useCallback((column: TableColumn) => {
    if (!column.sortable) return

    let newOrder: 'ascending' | 'descending' = 'ascending'
    if (sortState && sortState.prop === column.prop) {
      newOrder = sortState.order === 'ascending' ? 'descending' : 'ascending'
    }

    const newSortState = { prop: column.prop!, order: newOrder }
    setSortState(newSortState)
    onSortChange?.(newSortState)
  }, [sortState, onSortChange])


  // 排序和筛选数据
  const processedData = useMemo(() => {
    let result = [...data]

    // 应用筛选
    filterStates.forEach(filter => {
      const column = columns.find(col => col.prop === filter.prop)
      if (column) {
        result = result.filter(row => {
          if (column.filterMethod) {
            // 使用自定义筛选方法
            return filter.values.some(value =>
              column.filterMethod!(value, row, column)
            )
          } else {
            // 默认筛选方法：精确匹配
            const cellValue = getColumnValue(row, column, 0)
            return filter.values.some(value => cellValue === value)
          }
        })
      }
    })

    // 应用排序
    if (sortState) {
      const column = columns.find(col => col.prop === sortState.prop)
      if (column) {
        result.sort((a, b) => {
          let aValue = getColumnValue(a, column, 0)
          let bValue = getColumnValue(b, column, 0)

          if (column.sortMethod) {
            return column.sortMethod(a, b)
          }

          // 默认排序逻辑
          if (aValue < bValue) return sortState.order === 'ascending' ? -1 : 1
          if (aValue > bValue) return sortState.order === 'ascending' ? 1 : -1
          return 0
        })
      }
    }

    return result
  }, [data, columns, sortState, filterStates])

  // 固定列：计算每列的 left/right 偏移（用于横向滚动时 sticky 定位）、是否有固定列、列总宽
  const fixedColumnMeta = useMemo(() => {
    const leftOffsets: number[] = []
    const rightOffsets: number[] = []
    let accLeft = 0
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i]
      const w = parseColumnWidth(col)
      const isLeft = col.fixed === true || col.fixed === 'left'
      leftOffsets[i] = isLeft ? accLeft : 0
      if (isLeft) accLeft += w
    }
    let accRight = 0
    for (let i = columns.length - 1; i >= 0; i--) {
      const col = columns[i]
      const w = parseColumnWidth(col)
      const isRight = col.fixed === 'right'
      rightOffsets[i] = isRight ? accRight : 0
      if (isRight) accRight += w
    }
    const hasFixed = columns.some(
      c => c.fixed === true || c.fixed === 'left' || c.fixed === 'right'
    )
    const totalWidth = columns.reduce((sum, c) => sum + parseColumnWidth(c), 0)
    return { leftOffsets, rightOffsets, hasFixedColumns: hasFixed, totalColumnsWidth: totalWidth }
  }, [columns])

  // 获取行类名
  const getRowClassName = useCallback((row: any, index: number): string => {
    let className = ''

    if (stripe && index % 2 === 1) {
      className += 'seven-table__row--striped '
    }

    if (typeof rowClassName === 'string') {
      className += rowClassName + ' '
    } else if (typeof rowClassName === 'function') {
      className += rowClassName(row, index) + ' '
    }

    return className.trim()
  }, [stripe, rowClassName])

  // 获取行样式
  const getRowStyle = useCallback((row: any, index: number): React.CSSProperties => {
    return rowStyle ? rowStyle(row, index) : {}
  }, [rowStyle])

  // 暴露方法给父组件
  useImperativeHandle(_ref, () => ({
    sort: (prop: string, order: 'ascending' | 'descending') => {
      const newSortState = { prop, order }
      setSortState(newSortState)
      onSortChange?.(newSortState)
    },
    clearSort: () => {
      setSortState(null)
      onSortChange?.(null)
    },
    filter: (prop: string, values: any[]) => {
      const newFilters = filterStates.filter(f => f.prop !== prop)
      if (values.length > 0) {
        newFilters.push({ prop, values })
      }
      setFilterStates(newFilters)
      onFilterChange?.(newFilters)
    },
    clearFilter: (prop?: string) => {
      if (prop) {
        setFilterStates(prev => prev.filter(f => f.prop !== prop))
      } else {
        setFilterStates([])
      }
      onFilterChange?.([])
    }
  }), [onSortChange, onFilterChange, filterStates])

  // 表格样式
  const tableStyle: React.CSSProperties = {
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    maxHeight: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined,
    ...style
  }

  // 表格类名
  const tableClassName = classnames(
    'seven-table',
    {
      'seven-table--border': border,
      'seven-table--stripe': stripe,
      'seven-table--fixed-header': !!(height || maxHeight),
      'seven-table--fixed-columns': fixedColumnMeta.hasFixedColumns
    },
    className
  )

  const innerTableStyle: React.CSSProperties = fixedColumnMeta.hasFixedColumns &&
    fixedColumnMeta.totalColumnsWidth > 0
    ? { minWidth: `${fixedColumnMeta.totalColumnsWidth}px` }
    : {}

  return (
    <div className={tableClassName} style={tableStyle} {...rest}>
      <div className="seven-table__wrapper">
        <table className="seven-table__inner" style={innerTableStyle}>
          {/* 表头 */}
          <thead className="seven-table__header">
            <tr>
              {columns.map((column, index) => {
                const headerClassName = classnames(
                  'seven-table__cell',
                  'seven-table__cell--header',
                  {
                    'is-sortable': !!column.sortable,
                    'is-sorting': sortState?.prop === column.prop,
                    'sort-asc': sortState?.prop === column.prop && sortState?.order === 'ascending',
                    'sort-desc': sortState?.prop === column.prop && sortState?.order === 'descending',
                    'is-filterable': !!(column.filters && column.filters.length > 0),
                    'seven-table__cell--fixed-left': column.fixed === true || column.fixed === 'left',
                    'seven-table__cell--fixed-right': column.fixed === 'right'
                  },
                  column.className
                )

                const isFixedLeft = column.fixed === true || column.fixed === 'left'
                const isFixedRight = column.fixed === 'right'
                const headerStyle: React.CSSProperties = {
                  width: column.width ? (typeof column.width === 'number' ? `${column.width}px` : column.width) : undefined,
                  minWidth: column.minWidth ? (typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth) : undefined,
                  textAlign: column.headerAlign || column.align || 'left',
                  ...(isFixedLeft && { left: fixedColumnMeta.leftOffsets[index] }),
                  ...(isFixedRight && { right: fixedColumnMeta.rightOffsets[index] }),
                  ...column.style
                }

                return (
                  <th
                    key={column.prop || index}
                    className={headerClassName}
                    style={headerStyle}
                    onClick={() => column.sortable && handleSort(column)}
                  >
                    <div className="seven-table__cell-content">
                      {column.label}
                      {column.sortable && (
                        <span className="seven-table__sort-icon">
                          <i className="seven-table__sort-icon-asc"></i>
                          <i className="seven-table__sort-icon-desc"></i>
                        </span>
                      )}
                      {column.filters && column.filters.length > 0 && (
                        <span className="seven-table__filter-icon">
                          <i className="seven-table__filter-icon-inner">筛选</i>
                        </span>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* 表体 */}
          <tbody className="seven-table__body">
            {processedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={getRowClassName(row, rowIndex)}
                style={getRowStyle(row, rowIndex)}
                onClick={(event) => onRowClick?.(row, rowIndex, event)}
                onDoubleClick={(event) => onRowDoubleClick?.(row, rowIndex, event)}
              >
                {columns.map((column, colIndex) => {
                  const isFixedLeft = column.fixed === true || column.fixed === 'left'
                  const isFixedRight = column.fixed === 'right'
                  const cellClassName = classnames(
                    'seven-table__cell',
                    {
                      'seven-table__cell--fixed-left': isFixedLeft,
                      'seven-table__cell--fixed-right': isFixedRight
                    },
                    column.className
                  )

                  const cellStyle: React.CSSProperties = {
                    width: column.width ? (typeof column.width === 'number' ? `${column.width}px` : column.width) : undefined,
                    minWidth: column.minWidth ? (typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth) : undefined,
                    textAlign: column.align || 'left',
                    ...(isFixedLeft && { left: fixedColumnMeta.leftOffsets[colIndex] }),
                    ...(isFixedRight && { right: fixedColumnMeta.rightOffsets[colIndex] }),
                    ...column.style
                  }

                  return (
                    <td
                      key={column.prop || colIndex}
                      className={cellClassName}
                      style={cellStyle}
                      onClick={(event) => onCellClick?.(row, column, getColumnValue(row, column, rowIndex), event)}
                    >
                      <div className="seven-table__cell-content">
                        {renderCell(row, column, rowIndex)}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})

Table.displayName = 'Table'

export default Table