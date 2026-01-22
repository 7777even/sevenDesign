'use client';

import React from "react"

import { forwardRef } from 'react'
import { classnames } from '@seven-design-ui/core'
import './switch.css'

export interface SwitchProps {
  /** 是否选中 */
  checked?: boolean
  /** 默认是否选中 */
  defaultChecked?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 选中状态显示的内容 */
  checkedNode?: React.ReactNode
  /** 未选中状态显示的内容 */
  unCheckedNode?: React.ReactNode
  /** 选中状态的背景色 */
  checkedColor?: string
  /** 未选中状态的背景色 */
  unCheckedColor?: string
  /** 自定义类名 */
  className?: string
  /** 值改变时的回调 */
  onChange?: (checked: boolean) => void
  /** 原生 input 的 name 属性 */
  name?: string
  /** 原生 input 的 id 属性 */
  id?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
  const {
    checked,
    defaultChecked = false,
    disabled = false,
    loading = false,
    checkedNode,
    unCheckedNode,
    checkedColor,
    unCheckedColor,
    className,
    onChange,
    name,
    id,
  } = props

  // 内部状态管理 - 只在非受控模式下使用
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked)

  // 判断是否为受控模式
  const isControlled = checked !== undefined

  // 当前的开关状态
  const currentChecked = isControlled ? checked : internalChecked

  const handleChange = () => {
    if (disabled || loading) return

    const newChecked = !currentChecked

    // 如果是非受控模式，更新内部状态
    if (!isControlled) {
      setInternalChecked(newChecked)
    }

    // 调用onChange回调，传递boolean值
    if (onChange) {
      onChange(newChecked)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleChange()
    }
  }

  const classes = classnames(
    'sd-switch',
    {
      'is-checked': currentChecked,
      'is-disabled': disabled || loading,
      'is-loading': loading,
    },
    className
  )

  // 计算背景色样式
  const coreStyle: React.CSSProperties = {}
  if (currentChecked && checkedColor) {
    coreStyle.backgroundColor = checkedColor
  } else if (!currentChecked && unCheckedColor) {
    coreStyle.backgroundColor = unCheckedColor
  }

  return (
    <div
      className={classes}
      role="switch"
      aria-checked={currentChecked}
      aria-disabled={disabled || loading}
      tabIndex={disabled || loading ? -1 : 0}
      onClick={handleChange}
      onKeyDown={handleKeyDown}
    >
      <input
        ref={ref}
        type="checkbox"
        className="sd-switch__input"
        checked={currentChecked}
        disabled={disabled || loading}
        onChange={handleChange}
        name={name}
        id={id}
        aria-hidden="true"
      />
      <span className="sd-switch__core" style={coreStyle}>
        {loading && (
          <span className="sd-switch__loading">
            <svg viewBox="0 0 1024 1024" className="sd-switch__spinner">
              <path
                fill="currentColor"
                d="M512 64a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32z"
              />
            </svg>
          </span>
        )}
        <span className="sd-switch__action" />
        {(currentChecked ? checkedNode : unCheckedNode) && (
          <span className="sd-switch__content">
            {currentChecked ? checkedNode : unCheckedNode}
          </span>
        )}
      </span>
    </div>
  )
})

Switch.displayName = 'Switch'
