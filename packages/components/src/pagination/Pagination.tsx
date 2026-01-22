import { forwardRef, useState, useCallback, useMemo } from 'react'
import { classnames } from '@seven-design-ui/core'
import './pagination.css'

export type PaginationSize = 's' | 'm'

export interface PaginationProps {
  /** 总数量 */
  total: number
  /** 默认页码 */
  defaultCurrent?: number
  /** 默认每页容量 */
  defaultPageSize?: number
  /** 当前页码 */
  current?: number
  /** 每页容量 */
  pageSize?: number
  /** 页码改变回调 */
  onChange?: (page: number, pageSize: number) => void
  /** 每页容量改变回调 */
  onPageSizeChange?: (pageSize: number) => void
  /** 最大页码按钮数，默认7 */
  pagerCount?: number
  /** 分页器大小 */
  size?: PaginationSize
  /** 每页容量选项 */
  pageSizeOptions?: number[]
  /** 是否显示每页容量选择器 */
  showSizeChanger?: boolean
  /** 是否显示跳转输入框 */
  showQuickJumper?: boolean
  /** 自定义类名 */
  className?: string
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>((props, ref) => {
  const {
    total,
    defaultCurrent = 1,
    defaultPageSize = 10,
    current: controlledCurrent,
    pageSize: controlledPageSize,
    onChange,
    onPageSizeChange,
    pagerCount = 7,
    size = 'm',
    pageSizeOptions = [10, 20, 50, 100],
    showSizeChanger = true,
    showQuickJumper = false,
    className,
    ...rest
  } = props

  // 使用受控状态管理当前页码
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent)
  const current = controlledCurrent ?? internalCurrent

  // 使用受控状态管理每页容量
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize)
  const pageSize = controlledPageSize ?? internalPageSize

  // 计算总页数
  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize])

  // 处理页码改变
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === current) return

    const newPage = Math.max(1, Math.min(page, totalPages))

    if (controlledCurrent === undefined) {
      setInternalCurrent(newPage)
    }

    onChange?.(newPage, pageSize)
  }, [current, totalPages, pageSize, onChange, controlledCurrent])

  // 处理每页容量改变
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    if (controlledPageSize === undefined) {
      setInternalPageSize(newPageSize)
    }

    onPageSizeChange?.(newPageSize)

    // 容量改变后，跳转到第一页
    const newPage = 1
    if (controlledCurrent === undefined) {
      setInternalCurrent(newPage)
    }

    onChange?.(newPage, newPageSize)
  }, [onPageSizeChange, onChange, controlledCurrent, controlledPageSize])

  // 计算页码按钮列表
  const pageItems = useMemo(() => {
    const items: (number | 'prev-more' | 'next-more')[] = []

    if (totalPages <= pagerCount) {
      // 总页数不超过最大显示数，直接显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      // 需要折叠的情况
      const leftCount = Math.floor((pagerCount - 2) / 2) // 左侧显示的页码数
      const rightCount = pagerCount - 2 - leftCount // 右侧显示的页码数

      // 始终显示第一页
      items.push(1)

      if (current <= leftCount + 2) {
        // 当前页靠近左侧
        for (let i = 2; i <= Math.min(pagerCount - 2, totalPages - 1); i++) {
          items.push(i)
        }
        if (totalPages > pagerCount - 1) {
          items.push('next-more')
        }
      } else if (current >= totalPages - rightCount - 1) {
        // 当前页靠近右侧
        if (totalPages > pagerCount - 1) {
          items.push('prev-more')
        }
        for (let i = Math.max(2, totalPages - (pagerCount - 3)); i <= totalPages - 1; i++) {
          items.push(i)
        }
      } else {
        // 当前页在中间
        items.push('prev-more')
        for (let i = current - leftCount; i <= current + rightCount; i++) {
          items.push(i)
        }
        items.push('next-more')
      }

      // 始终显示最后一页
      if (totalPages > 1) {
        items.push(totalPages)
      }
    }

    return items
  }, [totalPages, pagerCount, current])

  // 跳转输入框状态
  const [jumpValue, setJumpValue] = useState('')

  const handleJump = useCallback(() => {
    const page = parseInt(jumpValue, 10)
    if (!isNaN(page)) {
      handlePageChange(page)
      setJumpValue('')
    }
  }, [jumpValue, handlePageChange])

  // 如果没有数据，不显示分页器
  if (total === 0) {
    return null
  }

  const classes = classnames(
    'sd-pagination',
    `sd-pagination--${size}`,
    className
  )

  return (
    <div ref={ref} className={classes} {...rest}>
      {/* 上一页按钮 */}
      <button
        type="button"
        className={classnames('sd-pagination__item', 'sd-pagination__prev', {
          'is-disabled': current === 1
        })}
        disabled={current === 1}
        onClick={() => handlePageChange(current - 1)}
        aria-label="上一页"
      >
        ‹
      </button>

      {/* 页码按钮 */}
      {pageItems.map((item, index) => {
        if (item === 'prev-more') {
          return (
            <span key={`more-${index}`} className="sd-pagination__more sd-pagination__more--prev">
              ...
            </span>
          )
        }

        if (item === 'next-more') {
          return (
            <span key={`more-${index}`} className="sd-pagination__more sd-pagination__more--next">
              ...
            </span>
          )
        }

        return (
          <button
            key={item}
            type="button"
            className={classnames('sd-pagination__item', 'sd-pagination__page', {
              'is-active': item === current
            })}
            onClick={() => handlePageChange(item)}
          >
            {item}
          </button>
        )
      })}

      {/* 下一页按钮 */}
      <button
        type="button"
        className={classnames('sd-pagination__item', 'sd-pagination__next', {
          'is-disabled': current === totalPages
        })}
        disabled={current === totalPages}
        onClick={() => handlePageChange(current + 1)}
        aria-label="下一页"
      >
        ›
      </button>

      {/* 每页容量选择器 */}
      {showSizeChanger && (
        <div className="sd-pagination__size-changer">
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="sd-pagination__size-select"
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option} 条/页
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 跳转输入框 */}
      {showQuickJumper && (
        <div className="sd-pagination__jumper">
          <span className="sd-pagination__jumper-text">跳至</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleJump()}
            className="sd-pagination__jumper-input"
            placeholder={current.toString()}
          />
          <span className="sd-pagination__jumper-text">页</span>
        </div>
      )}

      {/* 总数信息 */}
      <div className="sd-pagination__total">
        共 {total} 条
      </div>
    </div>
  )
})

Pagination.displayName = 'Pagination'