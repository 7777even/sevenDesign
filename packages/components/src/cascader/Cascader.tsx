import { forwardRef, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { classnames } from '@seven-design-ui/core'
import './cascader.css'

// 级联选择器的选项类型
export interface CascaderOption {
  /** 选项的值 */
  value: string | number
  /** 选项的显示文本 */
  label: string
  /** 子选项 */
  children?: CascaderOption[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否禁用复选框（多选模式下） */
  disableCheckbox?: boolean
}

// 级联选择器的属性类型
export interface CascaderProps {
  /** 选项数据 */
  options: CascaderOption[]
  /** 展开触发方式 */
  expandTrigger?: 'click' | 'hover'
  /** 是否可清空 */
  clearable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 默认值 */
  defaultValue?: (string | number)[] | (string | number)
  /** 当前值（受控） */
  value?: (string | number)[] | (string | number)
  /** 值改变时的回调 */
  onChange?: (value: (string | number)[] | (string | number) | undefined, selectedOptions: CascaderOption[] | CascaderOption | undefined) => void
  /** 是否显示完整路径 */
  showAllLevels?: boolean
  /** 是否支持多选 */
  multiple?: boolean
  /** 占位符 */
  placeholder?: string
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

// 内部使用的选中项类型
interface SelectedItem {
  value: string | number
  label: string
  path: CascaderOption[]
}

export const Cascader = forwardRef<HTMLDivElement, CascaderProps>((props, ref) => {
  const {
    options,
    expandTrigger = 'click',
    clearable = false,
    disabled = false,
    defaultValue,
    value: controlledValue,
    onChange,
    showAllLevels = true,
    multiple = false,
    placeholder = '请选择',
    className,
    style,
    ...rest
  } = props

  // 内部状态管理
  const [internalValue, setInternalValue] = useState<(string | number)[] | (string | number) | undefined>(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const [activePath, setActivePath] = useState<CascaderOption[]>([])
  const [hoveredPath, setHoveredPath] = useState<CascaderOption[]>([])
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null)

  // 引用
  const inputRef = useRef<HTMLDivElement>(null)

  // 当前值（受控或内部）
  const value = controlledValue !== undefined ? controlledValue : internalValue

  // 将值转换为数组格式（便于处理）
  const valueArray = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : (value ? [value] : [])
    } else {
      return value ? (Array.isArray(value) ? [value[0]] : [value]) : []
    }
  }, [value, multiple])

  // 根据值找到对应的选项路径
  const selectedItems = useMemo((): SelectedItem[] => {
    const findOptionsByValues = (values: (string | number)[]): SelectedItem[] => {
      const result: SelectedItem[] = []

      const findPath = (options: CascaderOption[], targetValue: string | number, currentPath: CascaderOption[] = []): CascaderOption[] | null => {
        for (const option of options) {
          const newPath = [...currentPath, option]
          if (option.value === targetValue) {
            return newPath
          }
          if (option.children) {
            const childPath = findPath(option.children, targetValue, newPath)
            if (childPath) {
              return childPath
            }
          }
        }
        return null
      }

      for (const val of values) {
        const path = findPath(options, val)
        if (path) {
          const lastOption = path[path.length - 1]
          result.push({
            value: val,
            label: lastOption.label,
            path: path
          })
        }
      }

      return result
    }

    return findOptionsByValues(valueArray)
  }, [valueArray, options])

  // 显示文本
  const displayText = useMemo(() => {
    if (selectedItems.length === 0) {
      return ''
    }

    if (multiple) {
      // 多选模式：显示所有选中项的标签
      return selectedItems.map(item => item.label).join(', ')
    } else {
      // 单选模式：根据 showAllLevels 决定显示完整路径还是最后一级
      const item = selectedItems[0]
      if (showAllLevels) {
        return item.path.map(opt => opt.label).join(' / ')
      } else {
        return item.label
      }
    }
  }, [selectedItems, multiple, showAllLevels])

  // 处理选项点击
  const handleOptionClick = useCallback((option: CascaderOption, path: CascaderOption[]) => {
    if (option.disabled) return

    if (multiple) {
      // 多选模式
      const currentValues = valueArray
      const isSelected = currentValues.includes(option.value)

      let newValues: (string | number)[]
      if (isSelected) {
        // 取消选中
        newValues = currentValues.filter(v => v !== option.value)
      } else {
        // 添加选中
        newValues = [...currentValues, option.value]
      }

      const newValue = multiple ? newValues : newValues[0]
      if (controlledValue === undefined) {
        setInternalValue(newValue)
      }
      const selectedOptions = selectedItems.filter(item => newValues.includes(item.value)).map(item => item.path[item.path.length - 1])
      onChange?.(newValue, selectedOptions.length > 0 ? selectedOptions : (multiple ? [] : undefined))

      // 如果有子选项，展开子菜单
      if (option.children && !isSelected) {
        setActivePath(path)
      }
    } else {
      // 单选模式
      if (option.children) {
        // 有子选项，展开
        setActivePath(path)
      } else {
        // 没有子选项，选择并关闭
        const newValue = option.value
        if (controlledValue === undefined) {
          setInternalValue(newValue)
        }
        onChange?.(newValue, option)
        setIsOpen(false)
        setActivePath([])
        setDropdownPosition(null)
      }
    }
  }, [multiple, valueArray, controlledValue, onChange, selectedItems])

  // 处理鼠标悬停
  const handleOptionHover = useCallback((option: CascaderOption, path: CascaderOption[]) => {
    if (expandTrigger === 'hover' && option.children) {
      setHoveredPath(path)
    }
  }, [expandTrigger])

  // 当前激活的路径（用于显示子菜单）
  const currentActivePath = useMemo(() => {
    if (expandTrigger === 'hover') {
      return hoveredPath
    } else {
      return activePath
    }
  }, [expandTrigger, hoveredPath, activePath])

  // 计算下拉框位置
  const calculateDropdownPosition = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      })
    }
  }, [])

  // 处理输入框点击
  const handleInputClick = useCallback(() => {
    if (disabled) return
    if (!isOpen) {
      calculateDropdownPosition()
    }
    setIsOpen(!isOpen)
  }, [disabled, isOpen, calculateDropdownPosition])

  // 处理清空
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const newValue = multiple ? [] : undefined
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue, multiple ? [] : undefined)
    setIsOpen(false)
    setActivePath([])
    setDropdownPosition(null)
  }, [multiple, controlledValue, onChange])

  // 处理标签关闭（多选模式）
  const handleTagClose = useCallback((tagValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    const newValues = valueArray.filter(v => v !== tagValue)
    const newValue = multiple ? newValues : newValues[0] || undefined
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    const selectedOptions = selectedItems.filter(item => newValues.includes(item.value)).map(item => item.path[item.path.length - 1])
    onChange?.(newValue, selectedOptions.length > 0 ? selectedOptions : (multiple ? [] : undefined))
  }, [valueArray, multiple, controlledValue, onChange, selectedItems])

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setActivePath([])
        setHoveredPath([])
        setDropdownPosition(null)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 渲染菜单项
  const renderMenuItem = useCallback((
    option: CascaderOption,
    path: CascaderOption[]
  ) => {
    const isSelected = valueArray.includes(option.value)
    const hasChildren = option.children && option.children.length > 0
    const isInActivePath = activePath.some(activeOption => activeOption.value === option.value)

    const itemClasses = classnames('sd-cascader__menu-item', {
      'is-active': isSelected,
      'is-disabled': option.disabled,
      'in-active-path': isInActivePath
    })

    return (
      <li
        key={option.value}
        className={itemClasses}
        onClick={() => handleOptionClick(option, [...path, option])}
        onMouseEnter={() => handleOptionHover(option, [...path, option])}
      >
        {multiple && (
          <div className="sd-cascader__menu-item-prefix">
            <div className={classnames('sd-cascader__menu-item-checkbox', {
              'is-checked': isSelected,
              'is-disabled': option.disableCheckbox || option.disabled
            })}>
              {isSelected && <span></span>}
            </div>
          </div>
        )}
        <span className="sd-cascader__menu-item-label">{option.label}</span>
        {hasChildren && (
          <div className="sd-cascader__menu-item-postfix">
            <span className="sd-cascader__menu-item-arrow">›</span>
          </div>
        )}
      </li>
    )
  }, [valueArray, activePath, multiple, handleOptionClick, handleOptionHover])

  // 渲染菜单
  const renderMenu = useCallback((
    options: CascaderOption[],
    path: CascaderOption[] = []
  ) => {
    if (!options || options.length === 0) {
      return (
        <div className="sd-cascader__empty">
          无数据
        </div>
      )
    }

    return (
      <div className="sd-cascader__menu">
        <ul className="sd-cascader__menu-list">
          {options.map(option => renderMenuItem(option, path))}
        </ul>
      </div>
    )
  }, [renderMenuItem])


  // CSS 类名
  const containerClasses = classnames('sd-cascader', className)
  const inputClasses = classnames('sd-cascader__input', {
    'is-disabled': disabled,
    'is-expanded': isOpen
  })

  return (
    <div
      ref={ref}
      className={containerClasses}
      style={style}
      {...rest}
    >
      <div
        ref={inputRef}
        className={inputClasses}
        onClick={handleInputClick}
      >
        {multiple ? (
          // 多选模式：显示标签
          <>
            {selectedItems.map(item => (
              <span key={item.value} className="sd-cascader__tag">
                <span className="sd-cascader__tag-content">{item.label}</span>
                <span
                  className="sd-cascader__tag-close"
                  onClick={(e) => handleTagClose(item.value, e)}
                >
                  ×
                </span>
              </span>
            ))}
            {selectedItems.length === 0 && (
              <span className="sd-cascader__placeholder">{placeholder}</span>
            )}
          </>
        ) : (
          // 单选模式：显示文本
          displayText ? (
            <span className="sd-cascader__selected-text">{displayText}</span>
          ) : (
            <span className="sd-cascader__placeholder">{placeholder}</span>
          )
        )}

        <div className="sd-cascader__suffix">
          {clearable && valueArray.length > 0 && !disabled && (
            <span className="sd-cascader__clear" onClick={handleClear}>
              ×
            </span>
          )}
          <span className={classnames('sd-cascader__arrow', { 'is-expanded': isOpen })}>
            ⌄
          </span>
        </div>
      </div>

      {/* 下拉面板 */}
      {isOpen && dropdownPosition && (
        <div
          className="sd-cascader__panel"
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 9999
          }}
        >
          <div className="sd-cascader__menu">
            {renderMenu(options)}
          </div>
          {currentActivePath.map((activeOption, index) => {
            const currentOptions = activeOption.children || []
            const currentPath = currentActivePath.slice(0, index + 1)

            if (currentOptions.length === 0) return null

            return (
              <div key={index + 1} className="sd-cascader__menu">
                {renderMenu(currentOptions, currentPath)}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})

Cascader.displayName = 'Cascader'