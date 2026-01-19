'use client';

import React from "react"

import { forwardRef } from 'react'
import { classnames, useControllableState } from '@seven-design/core'
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
  /** 选中时的值 */
  activeValue?: boolean | string | number
  /** 未选中时的值 */
  inactiveValue?: boolean | string | number
  /** 自定义类名 */
  className?: string
  /** 值改变时的回调 */
  onChange?: (value: boolean | string | number) => void
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
    activeValue = true,
    inactiveValue = false,
    className,
    onChange,
    name,
    id,
  } = props

  const [isChecked, setIsChecked] = useControllableState(checked, defaultChecked, onChange)

  const handleChange = () => {
    if (disabled || loading) return
    const newValue = isChecked === activeValue ? inactiveValue : activeValue
    setIsChecked(newValue as boolean)
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
      'is-checked': isChecked === activeValue,
      'is-disabled': disabled || loading,
      'is-loading': loading,
    },
    className
  )

  return (
    <div
      className={classes}
      role="switch"
      aria-checked={isChecked === activeValue}
      aria-disabled={disabled || loading}
      tabIndex={disabled || loading ? -1 : 0}
      onClick={handleChange}
      onKeyDown={handleKeyDown}
    >
      <input
        ref={ref}
        type="checkbox"
        className="sd-switch__input"
        checked={isChecked === activeValue}
        disabled={disabled || loading}
        onChange={handleChange}
        name={name}
        id={id}
        aria-hidden="true"
      />
      <span className="sd-switch__core">
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
      </span>
    </div>
  )
})

Switch.displayName = 'Switch'
