import { forwardRef, useState, useCallback, useMemo, useRef, useEffect, type MutableRefObject } from 'react'
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
  /** 是否支持搜索 */
  showSearch?: boolean
  /** 自定义搜索函数 */
  filterOption?: (inputValue: string, option: CascaderOption) => boolean
  /** 占位符 */
  placeholder?: string
  /** 搜索占位符 */
  searchPlaceholder?: string
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
    showSearch = false,
    filterOption,
    placeholder = '请选择',
    searchPlaceholder = '搜索选项',
    className,
    style,
    ...rest
  } = props

  // 内部状态管理
  const [internalValue, setInternalValue] = useState<(string | number)[] | (string | number) | undefined>(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const [activePath, setActivePath] = useState<CascaderOption[]>([])
  const [hoveredPath, setHoveredPath] = useState<CascaderOption[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const [focusedLevel, setFocusedLevel] = useState<number>(0)
  const [searchValue, setSearchValue] = useState<string>('')

  // 引用：容器包含触发器+下拉面板，用于点击外部检测；inputRef 仅触发器
  const containerRef = useRef<HTMLDivElement>(null)
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

      // 直接构造选中的选项，避免使用过时的selectedItems
      const selectedOptions = newValues.map(val => {
        const findOption = (options: CascaderOption[]): CascaderOption | null => {
          for (const opt of options) {
            if (opt.value === val) return opt
            if (opt.children) {
              const childResult = findOption(opt.children)
              if (childResult) return childResult
            }
          }
          return null
        }
        return findOption(options)
      }).filter(Boolean) as CascaderOption[]

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
      }
    }
  }, [multiple, valueArray, controlledValue, onChange, options])

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


  // 处理输入框点击
  const handleInputClick = useCallback(() => {
    if (disabled) return
    setIsOpen(!isOpen)
  }, [disabled, isOpen])

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

  // 默认搜索过滤函数
  const defaultFilterOption = useCallback((inputValue: string, option: CascaderOption): boolean => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase())
  }, [])

  // 搜索过滤选项
  const filterOptions = useCallback((options: CascaderOption[], searchValue: string): CascaderOption[] => {
    if (!searchValue) return options

    const filter = filterOption || defaultFilterOption

    const filterRecursively = (opts: CascaderOption[]): CascaderOption[] => {
      return opts
        .map(option => {
          // 检查当前选项是否匹配
          const currentMatch = filter(searchValue, option)

          // 递归检查子选项
          let filteredChildren: CascaderOption[] = []
          if (option.children) {
            filteredChildren = filterRecursively(option.children)
          }

          // 如果当前选项或任何子选项匹配，则包含此选项
          if (currentMatch || filteredChildren.length > 0) {
            return {
              ...option,
              children: filteredChildren.length > 0 ? filteredChildren : option.children
            }
          }

          return null
        })
        .filter(Boolean) as CascaderOption[]
    }

    return filterRecursively(options)
  }, [filterOption, defaultFilterOption])

  // 获取当前级别的选项（支持搜索）
  const getCurrentLevelOptions = useCallback((level: number): CascaderOption[] => {
    let baseOptions = options
    if (searchValue) {
      baseOptions = filterOptions(options, searchValue)
    }

    if (level === 0) return baseOptions
    if (currentActivePath.length >= level) {
      return currentActivePath[level - 1]?.children || []
    }
    return []
  }, [options, currentActivePath, searchValue, filterOptions])

  // 处理键盘导航
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return

    const currentOptions = getCurrentLevelOptions(focusedLevel)

    switch (event.key) {
      case 'Escape':
        setIsOpen(false)
        setActivePath([])
        setHoveredPath([])
        setFocusedIndex(-1)
        setFocusedLevel(0)
        setSearchValue('')
        break

      case 'ArrowDown':
        event.preventDefault()
        if (currentOptions.length > 0) {
          const nextIndex = focusedIndex < currentOptions.length - 1 ? focusedIndex + 1 : 0
          setFocusedIndex(nextIndex)
          // 模拟悬停效果
          const option = currentOptions[nextIndex]
          if (option && expandTrigger === 'hover') {
            const path = focusedLevel === 0 ? [option] : [...currentActivePath.slice(0, focusedLevel), option]
            setHoveredPath(path)
          }
        }
        break

      case 'ArrowUp':
        event.preventDefault()
        if (currentOptions.length > 0) {
          const nextIndex = focusedIndex > 0 ? focusedIndex - 1 : currentOptions.length - 1
          setFocusedIndex(nextIndex)
          // 模拟悬停效果
          const option = currentOptions[nextIndex]
          if (option && expandTrigger === 'hover') {
            const path = focusedLevel === 0 ? [option] : [...currentActivePath.slice(0, focusedLevel), option]
            setHoveredPath(path)
          }
        }
        break

      case 'ArrowRight':
        event.preventDefault()
        if (focusedIndex >= 0 && currentOptions[focusedIndex]?.children) {
          // 移动到子菜单
          const option = currentOptions[focusedIndex]
          const path = focusedLevel === 0 ? [option] : [...currentActivePath.slice(0, focusedLevel), option]
          setActivePath(path)
          setFocusedLevel(focusedLevel + 1)
          setFocusedIndex(0)
        }
        break

      case 'ArrowLeft':
        event.preventDefault()
        if (focusedLevel > 0) {
          // 移动到父菜单
          setActivePath(currentActivePath.slice(0, focusedLevel - 1))
          setFocusedLevel(focusedLevel - 1)
          setFocusedIndex(-1)
        }
        break

      case 'Enter':
        event.preventDefault()
        if (focusedIndex >= 0 && currentOptions[focusedIndex]) {
          const option = currentOptions[focusedIndex]
          const path = focusedLevel === 0 ? [] : currentActivePath.slice(0, focusedLevel)
          handleOptionClick(option, [...path, option])
        }
        break
    }
  }, [isOpen, focusedIndex, focusedLevel, getCurrentLevelOptions, expandTrigger, currentActivePath, handleOptionClick, setFocusedIndex, setFocusedLevel, setActivePath, setIsOpen, setHoveredPath, setSearchValue])

  // 点击外部关闭下拉框（必须用容器 ref：面板与触发器是兄弟，不在 inputRef 内）
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setActivePath([])
        setHoveredPath([])
        setFocusedIndex(-1)
        setFocusedLevel(0)
        setSearchValue('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, handleKeyDown])

  // 渲染菜单项
  const renderMenuItem = useCallback((
    option: CascaderOption,
    path: CascaderOption[],
    levelIndex: number,
    itemIndex: number
  ) => {
    const isSelected = valueArray.includes(option.value)
    const hasChildren = option.children && option.children.length > 0
    const isInActivePath = activePath.some(activeOption => activeOption.value === option.value)
    const isFocused = focusedLevel === levelIndex && focusedIndex === itemIndex

    const itemClasses = classnames('sd-cascader__menu-item', {
      'is-active': isSelected,
      'is-disabled': option.disabled,
      'in-active-path': isInActivePath,
      'is-focused': isFocused
    })

    return (
      <li
        key={option.value}
        className={itemClasses}
        onClick={(e) => {
          e.stopPropagation()
          handleOptionClick(option, [...path, option])
        }}
        onMouseEnter={() => {
          handleOptionHover(option, [...path, option])
          // 清除键盘聚焦状态
          setFocusedIndex(-1)
        }}
      >
        {multiple && (
          <div className="sd-cascader__menu-item-prefix">
            <div
              className={classnames('sd-cascader__menu-item-checkbox', {
                'is-checked': isSelected,
                'is-disabled': option.disableCheckbox || option.disabled
              })}
            >
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
  }, [valueArray, activePath, multiple, focusedLevel, focusedIndex, handleOptionClick, handleOptionHover])

  // 渲染菜单
  const renderMenu = useCallback((
    options: CascaderOption[],
    path: CascaderOption[] = [],
    levelIndex: number = 0
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
          {options.map((option, itemIndex) => renderMenuItem(option, path, levelIndex, itemIndex))}
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

  // 合并容器 ref 与 forwarded ref，供点击外部检测与父组件使用
  const setContainerRef = useCallback(
    (el: HTMLDivElement | null) => {
      (containerRef as MutableRefObject<HTMLDivElement | null>).current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) (ref as MutableRefObject<HTMLDivElement | null>).current = el
    },
    [ref]
  )

  return (
    <div
      ref={setContainerRef}
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
      {isOpen && (
        <div
          className={classnames('sd-cascader__panel', 'is-visible')}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999
          }}
        >
          {/* 搜索框 */}
          {showSearch && (
            <div className="sd-cascader__search">
              <input
                type="text"
                className="sd-cascader__search-input"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                  // 重置活动路径和聚焦状态
                  setActivePath([])
                  setFocusedIndex(-1)
                  setFocusedLevel(0)
                }}
                onKeyDown={(e) => {
                  // 阻止搜索框的键盘事件冒泡到全局处理
                  e.stopPropagation()
                }}
              />
            </div>
          )}

          {/* 在搜索模式下，只显示第一级过滤结果 */}
          {!searchValue ? (
            <>
              <div className="sd-cascader__menu">
                {renderMenu(options, [], 0)}
              </div>
              {currentActivePath.map((activeOption, index) => {
                const currentOptions = activeOption.children || []
                const currentPath = currentActivePath.slice(0, index + 1)

                if (currentOptions.length === 0) return null

                return (
                  <div key={index + 1} className="sd-cascader__menu">
                    {renderMenu(currentOptions, currentPath, index + 1)}
                  </div>
                )
              })}
            </>
          ) : (
            <div className="sd-cascader__menu">
              {renderMenu(getCurrentLevelOptions(0), [], 0)}
            </div>
          )}
        </div>
      )}
    </div>
  )
})

Cascader.displayName = 'Cascader'