import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { classnames } from '@seven-design-ui/core'
import './virtual-list.css'

export interface VirtualListProps<T = any> {
  /** 数据源数组 */
  data: T[]
  /** 列表高度 */
  height: number | string
  /** 子项等高模式下的子项高度 */
  itemHeight?: number
  /** 子项渲染函数 */
  renderItem: (item: T, index: number) => React.ReactNode
  /** 异步加载数据的方法 */
  requestMore?: () => Promise<void>
  /** 作为子项key的值在item中对应的属性字段 */
  itemKey?: keyof T
  /** 子项间隔 */
  gap?: number
  /** 滚动事件 */
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: React.ReactNode
  /** 是否启用动态高度模式（不等高） */
  dynamic?: boolean
  /** 动态高度模式下的预估高度 */
  estimatedItemHeight?: number
}

export const VirtualList = forwardRef<HTMLDivElement, VirtualListProps>((props, ref) => {
  const {
    data,
    height,
    itemHeight = 50,
    renderItem,
    requestMore,
    itemKey,
    gap = 0,
    onScroll,
    className,
    children,
    dynamic = false,
    estimatedItemHeight = 50,
    ...rest
  } = props

  // 容器引用
  const containerRef = useRef<HTMLDivElement>(null)
  // 滚动位置
  const [scrollTop, setScrollTop] = useState(0)
  // 是否正在加载更多数据
  const [loading, setLoading] = useState(false)
  // 动态高度模式下存储每个项的实际高度
  const itemHeightsRef = useRef<Map<number, number>>(new Map())
  // 存储每个项的DOM引用，用于ResizeObserver
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  // 强制更新组件
  const [, forceUpdate] = useState({})

  // 计算容器高度
  const containerHeight = useMemo(() => {
    if (typeof height === 'number') return height
    if (typeof height === 'string') {
      // 处理字符串类型的高度，如 '100px', '50vh' 等
      const match = height.match(/^(\d+)(px|vh|vw|%)?$/)
      if (match) {
        const value = parseInt(match[1])
        const unit = match[2] || 'px'
        if (unit === 'px') return value
        // 对于 vh, vw, % 等，需要计算实际像素值
        if (unit === 'vh') return (value / 100) * window.innerHeight
        if (unit === 'vw') return (value / 100) * window.innerWidth
        // % 需要父容器高度，这里暂时返回默认值
        return 400
      }
    }
    return 400
  }, [height])

  // 获取项的高度（动态模式下从缓存获取，否则使用固定高度）
  const getItemHeight = useCallback((index: number) => {
    if (dynamic) {
      return itemHeightsRef.current.get(index) || estimatedItemHeight
    }
    return itemHeight
  }, [dynamic, itemHeight, estimatedItemHeight])

  // 计算项的位置信息（累积高度）
  const getItemPosition = useCallback((index: number) => {
    let top = 0
    for (let i = 0; i < index; i++) {
      top += getItemHeight(i) + gap
    }
    return top
  }, [getItemHeight, gap])

  // 计算可见区域的起始和结束索引
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    if (!dynamic) {
      // 等高模式：使用原有的简单计算
      const itemHeightWithGap = itemHeight + gap
      const visibleCount = Math.ceil(containerHeight / itemHeightWithGap) + 2
      const start = Math.floor(scrollTop / itemHeightWithGap)
      const end = Math.min(start + visibleCount, data.length)

      return {
        startIndex: Math.max(0, start),
        endIndex: Math.max(0, end - 1),
        offsetY: start * itemHeightWithGap
      }
    }

    // 动态高度模式：二分查找起始索引
    let start = 0
    let end = data.length - 1
    let startIndex = 0

    while (start <= end) {
      const mid = Math.floor((start + end) / 2)
      const midTop = getItemPosition(mid)

      if (midTop < scrollTop) {
        startIndex = mid
        start = mid + 1
      } else {
        end = mid - 1
      }
    }

    // 向前多渲染一个，防止快速滚动时出现空白
    startIndex = Math.max(0, startIndex - 1)

    // 计算结束索引
    let endIndex = startIndex
    let accumulatedHeight = getItemPosition(startIndex)

    while (endIndex < data.length && accumulatedHeight < scrollTop + containerHeight) {
      accumulatedHeight += getItemHeight(endIndex) + gap
      endIndex++
    }

    // 向后多渲染2个，防止快速滚动时出现空白
    endIndex = Math.min(endIndex + 2, data.length - 1)

    return {
      startIndex,
      endIndex,
      offsetY: getItemPosition(startIndex)
    }
  }, [dynamic, scrollTop, containerHeight, itemHeight, gap, data.length, getItemPosition, getItemHeight])

  // 计算可见项和总高度
  const { visibleItems, totalHeight } = useMemo(() => {
    const items = data.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }))

    let total = 0
    if (dynamic) {
      // 动态高度：累加所有项的高度
      for (let i = 0; i < data.length; i++) {
        total += getItemHeight(i) + gap
      }
    } else {
      // 等高模式：简单乘法
      total = data.length * (itemHeight + gap)
    }

    return {
      visibleItems: items,
      totalHeight: total
    }
  }, [data, startIndex, endIndex, dynamic, getItemHeight, itemHeight, gap])

  // 滚动事件处理
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop: newScrollTop } = event.currentTarget
    setScrollTop(newScrollTop)

    // 检查是否需要加载更多数据
    if (requestMore && !loading) {
      const { scrollHeight, clientHeight } = event.currentTarget
      const threshold = 100 // 距离底部100px时触发加载

      if (newScrollTop + clientHeight >= scrollHeight - threshold) {
        setLoading(true)
        requestMore().finally(() => setLoading(false))
      }
    }

    onScroll?.(event)
  }, [requestMore, loading, onScroll])

  // 获取元素的key
  const getItemKey = useCallback((item: any, index: number) => {
    if (itemKey && item[itemKey] !== undefined) {
      return item[itemKey]
    }
    return `virtual-list-item-${index}`
  }, [itemKey])

  // 设置项的DOM引用
  const setItemRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(index, element)
    } else {
      itemRefs.current.delete(index)
    }
  }, [])

  // 使用ResizeObserver监听项高度变化（仅在动态模式下）
  useEffect(() => {
    if (!dynamic) return

    const resizeObserver = new ResizeObserver((entries) => {
      let hasChanged = false

      entries.forEach((entry) => {
        const element = entry.target as HTMLDivElement
        const index = parseInt(element.dataset.index || '-1', 10)

        if (index >= 0) {
          const newHeight = entry.contentRect.height
          const oldHeight = itemHeightsRef.current.get(index)

          if (oldHeight !== newHeight) {
            itemHeightsRef.current.set(index, newHeight)
            hasChanged = true
          }
        }
      })

      if (hasChanged) {
        forceUpdate({})
      }
    })

    // 观察所有已渲染的项
    itemRefs.current.forEach((element) => {
      resizeObserver.observe(element)
    })

    return () => {
      resizeObserver.disconnect()
    }
  }, [dynamic, visibleItems])

  // 当数据变化时，清理不存在项的高度缓存
  useEffect(() => {
    if (!dynamic) return

    const validIndices = new Set(data.map((_, index) => index))
    const cachedIndices = Array.from(itemHeightsRef.current.keys())

    cachedIndices.forEach((index) => {
      if (!validIndices.has(index)) {
        itemHeightsRef.current.delete(index)
      }
    })
  }, [data, dynamic])


  // 样式类名
  const classes = classnames(
    'sd-virtual-list',
    {
      'sd-virtual-list--loading': loading
    },
    className
  )

  return (
    <div
      ref={ref}
      className={classes}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      {...rest}
    >
      <div
        ref={containerRef}
        className="sd-virtual-list__container"
        style={{ height: totalHeight }}
      >
        <div
          className="sd-virtual-list__content"
          style={{
            transform: `translateY(${offsetY}px)`
          }}
        >
          {visibleItems.map(({ item, index }) => {
            const itemTop = dynamic 
              ? getItemPosition(index) - offsetY
              : (index - startIndex) * (itemHeight + gap)
            
            const itemStyle: React.CSSProperties = {
              position: 'absolute',
              top: itemTop,
              width: '100%',
              paddingTop: gap / 2,
              paddingBottom: gap / 2
            }

            if (!dynamic) {
              itemStyle.height = itemHeight
            }

            return (
              <div
                key={getItemKey(item, index)}
                ref={(el) => dynamic && setItemRef(index, el)}
                data-index={dynamic ? index : undefined}
                className="sd-virtual-list__item"
                style={itemStyle}
              >
                {renderItem(item, index)}
              </div>
            )
          })}
        </div>
      </div>
      {loading && (
        <div className="sd-virtual-list__loading">
          加载中...
        </div>
      )}
      {children}
    </div>
  )
})

VirtualList.displayName = 'VirtualList'