import React from "react"
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { classnames } from '@seven-design/core'
import './button.css'

export type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
export type ButtonSize = 'large' | 'default' | 'small'
export type NativeType = 'button' | 'submit' | 'reset'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 按钮类型 */
  type?: ButtonType
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 是否为朴素按钮 */
  plain?: boolean
  /** 是否为圆角按钮 */
  round?: boolean
  /** 是否为圆形按钮 */
  circle?: boolean
  /** 是否为加载中状态 */
  loading?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 原生 button 的 type 属性 */
  nativeType?: NativeType
  /** 图标组件 */
  icon?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    type = 'default',
    size = 'default',
    plain = false,
    round = false,
    circle = false,
    loading = false,
    disabled = false,
    nativeType = 'button',
    icon,
    className,
    children,
    ...rest
  } = props

  const classes = classnames(
    'sd-button',
    `sd-button--${type}`,
    `sd-button--${size}`,
    {
      'sd-button--plain': plain,
      'sd-button--round': round,
      'sd-button--circle': circle,
      'sd-button--loading': loading,
      'is-disabled': disabled || loading,
    },
    className
  )

  return (
    <button ref={ref} type={nativeType} className={classes} disabled={disabled || loading} {...rest}>
      {loading && (
        <span className="sd-button__loading-icon">
          <svg viewBox="0 0 1024 1024" className="sd-button__spinner">
            <path
              fill="currentColor"
              d="M512 64a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.2a32 32 0 0 1 0 45.248L692.992 376.32a32 32 0 0 1-45.248-45.248L783.552 195.2a32 32 0 0 1 45.248 0zM376.32 647.744a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
            />
          </svg>
        </span>
      )}
      {icon && !loading && <span className="sd-button__icon">{icon}</span>}
      {children && <span className="sd-button__text">{children}</span>}
    </button>
  )
})

Button.displayName = 'Button'
