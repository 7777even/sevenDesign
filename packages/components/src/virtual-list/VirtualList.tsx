import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react'
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
  /** 是否为等高模式 */
  fixedHeight?: boolean
  /** 不等高模式下的预测高度 */
  estimatedHeight?: number
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: React.ReactNode
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
    fixedHeight = true,
    estimatedHeight = 50,
    className,
    children,
    ...rest
  } = props

  // 容器引用
  const containerRef = useRef<HTMLDivElement>(null)
  // 滚动位置
  const [scrollTop, setScrollTop] = useState(0)
  // 是否正在加载更多数据
  const [loading, setLoading] = useState(false)
  // 不等高模式下的高度缓存
  const heightsRef = useRef<Map<number, number>>(new Map())

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

  // 计算可见区域的起始和结束索引（等高模式）
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    if (!fixedHeight) {
      return { startIndex: 0, endIndex: data.length - 1, offsetY: 0 }
    }

    const itemHeightWithGap = itemHeight + gap
    const visibleCount = Math.ceil(containerHeight / itemHeightWithGap) + 2 // 多渲染2个防止空白
    const start = Math.floor(scrollTop / itemHeightWithGap)
    const end = Math.min(start + visibleCount, data.length)

    return {
      startIndex: Math.max(0, start),
      endIndex: Math.max(0, end - 1),
      offsetY: start * itemHeightWithGap
    }
  }, [scrollTop, containerHeight, itemHeight, gap, data.length, fixedHeight])

  // 计算可见项和总高度
  const { visibleItems, totalHeight } = useMemo(() => {
    if (fixedHeight) {
      return {
        visibleItems: data.slice(startIndex, endIndex + 1).map((item, index) => ({
          item,
          index: startIndex + index,
          top: startIndex * (itemHeight + gap) + index * gap
        })),
        totalHeight: data.length * (itemHeight + gap)
      }
    }

    // 不等高模式
    let currentTop = 0
    const items = []

    for (let i = 0; i < data.length; i++) {
      const cachedHeight = heightsRef.current.get(i)
      const itemHeight = cachedHeight || estimatedHeight
      const itemTop = currentTop
      const itemBottom = currentTop + itemHeight + gap

      // 检查是否在可见区域
      if (itemBottom > scrollTop && itemTop < scrollTop + containerHeight) {
        items.push({
          item: data[i],
          index: i,
          top: itemTop
        })
      }

      currentTop = itemBottom
    }

    return { visibleItems: items, totalHeight: currentTop }
  }, [data, startIndex, endIndex, scrollTop, containerHeight, itemHeight, gap, estimatedHeight, fixedHeight])

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


  // 样式类名
  const classes = classnames(
    'sd-virtual-list',
    {
      'sd-virtual-list--fixed-height': fixedHeight,
      'sd-virtual-list--variable-height': !fixedHeight,
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
            transform: `translateY(${fixedHeight ? offsetY : 0}px)`
          }}
        >
          {visibleItems.map(({ item, index, top }) => (
            <div
              key={getItemKey(item, index)}
              className="sd-virtual-list__item"
              style={{
                height: fixedHeight ? itemHeight : 'auto',
                paddingTop: gap / 2,
                paddingBottom: gap / 2,
                position: 'absolute',
                top: fixedHeight ? (index - startIndex) * (itemHeight + gap) : top,
                width: '100%'
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
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