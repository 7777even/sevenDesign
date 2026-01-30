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

  // 计算可见区域的起始和结束索引
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const itemHeightWithGap = itemHeight + gap
    const visibleCount = Math.ceil(containerHeight / itemHeightWithGap) + 2 // 多渲染2个防止空白
    const start = Math.floor(scrollTop / itemHeightWithGap)
    const end = Math.min(start + visibleCount, data.length)

    return {
      startIndex: Math.max(0, start),
      endIndex: Math.max(0, end - 1),
      offsetY: start * itemHeightWithGap
    }
  }, [scrollTop, containerHeight, itemHeight, gap, data.length])

  // 计算可见项和总高度
  const { visibleItems, totalHeight } = useMemo(() => {
    return {
      visibleItems: data.slice(startIndex, endIndex + 1).map((item, index) => ({
        item,
        index: startIndex + index
      })),
      totalHeight: data.length * (itemHeight + gap)
    }
  }, [data, startIndex, endIndex])

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
          {visibleItems.map(({ item, index }) => (
            <div
              key={getItemKey(item, index)}
              className="sd-virtual-list__item"
              style={{
                height: itemHeight,
                paddingTop: gap / 2,
                paddingBottom: gap / 2,
                position: 'absolute',
                top: (index - startIndex) * (itemHeight + gap),
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