'use client';

import React from "react"

import { forwardRef, InputHTMLAttributes, useState, useRef, useImperativeHandle } from 'react'
import { classnames } from '@seven-design/core'
import './input.css'

export type InputSize = 'large' | 'default' | 'small'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onInput'> {
  /** 输入框类型 */
  type?: string
  /** 输入框尺寸 */
  size?: InputSize
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readOnly?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 是否显示密码切换按钮 */
  showPassword?: boolean
  /** 前置图标 */
  prefixIcon?: React.ReactNode
  /** 后置图标 */
  suffixIcon?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 输入框值 */
  value?: string
  /** 默认值 */
  defaultValue?: string
  /** 输入时的回调 */
  onInput?: (value: string) => void
  /** 值改变时的回调 */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** 清空按钮点击回调 */
  onClear?: () => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    type = 'text',
    size = 'default',
    disabled = false,
    readOnly = false,
    clearable = false,
    showPassword = false,
    prefixIcon,
    suffixIcon,
    className,
    value,
    defaultValue,
    onInput,
    onChange,
    onClear,
    onFocus,
    ...rest
  } = props

  const [showPwd, setShowPwd] = useState(false)
  const [inputValue, setInputValue] = useState(defaultValue || '')
  const internalInputRef = useRef<HTMLInputElement>(null)

  // 合并外部 ref 和内部 ref
  useImperativeHandle(ref, () => internalInputRef.current as HTMLInputElement, [])

  const inputType = showPassword ? (showPwd ? 'text' : 'password') : type
  const currentValue = value !== undefined ? value : inputValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (value === undefined) {
      setInputValue(newValue)
    }
    onChange?.(e)
    onInput?.(newValue)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // 当输入框获得焦点时，清空输入框内的文本
    const inputElement = e.target
    
    // 对于受控组件：通过回调函数通知父组件清空值
    if (value !== undefined) {
      onInput?.('')
      // 如果提供了 onChange 回调，也触发它
      if (onChange) {
        const syntheticEvent = {
          target: {
            ...inputElement,
            value: '',
          },
          currentTarget: inputElement,
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    } else {
      // 对于非受控组件：直接更新内部状态
      setInputValue('')
      // 触发 onChange 和 onInput 回调
      if (onChange) {
        const syntheticEvent = {
          target: {
            ...inputElement,
            value: '',
          },
          currentTarget: inputElement,
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
      onInput?.('')
    }
    
    // 调用外部传入的 onFocus 回调（如果提供了）
    onFocus?.(e)
  }

  const handleClear = (e: React.MouseEvent) => {
    // 阻止事件冒泡和默认行为
    e.preventDefault()
    e.stopPropagation()
    
    // 调用 onInput 回调，通知父组件清空值
    // 对于受控组件，这是必需的，因为父组件需要通过 setState 更新 value
    onInput?.('')
    
    // 对于非受控组件，更新内部状态
    if (value === undefined) {
      setInputValue('')
    }
    
    // 创建一个合成事件对象，用于触发 onChange（如果提供了 onChange 回调）
    const inputElement = internalInputRef.current
    if (inputElement && onChange) {
      const syntheticEvent = {
        target: {
          ...inputElement,
          value: '',
        },
        currentTarget: inputElement,
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }
    
    // 调用 onClear 回调
    onClear?.()
  }

  const showClearBtn = clearable && currentValue && !disabled && !readOnly

  const wrapperClasses = classnames(
    'sd-input',
    `sd-input--${size}`,
    {
      'is-disabled': disabled,
      'sd-input--prefix': !!prefixIcon,
      'sd-input--suffix': !!(suffixIcon || showClearBtn || showPassword),
    },
    className
  )

  return (
    <div className={wrapperClasses}>
      {prefixIcon && <span className="sd-input__prefix">{prefixIcon}</span>}
      <input
        ref={internalInputRef}
        type={inputType}
        className="sd-input__inner"
        disabled={disabled}
        readOnly={readOnly}
        value={currentValue}
        onChange={handleChange}
        onFocus={handleFocus}
        {...rest}
      />
      <span className="sd-input__suffix">
        {showClearBtn && (
          <span 
            className="sd-input__clear" 
            onClick={handleClear}
            onMouseDown={(e) => {
              // 防止点击清空按钮时 input 失去焦点
              e.preventDefault()
            }}
          >
            <svg 
              viewBox="0 0 1024 1024" 
              width="14" 
              height="14"
              style={{ pointerEvents: 'none' }}
            >
              <path
                fill="currentColor"
                d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336L512 457.664z"
              />
            </svg>
          </span>
        )}
        {showPassword && (
          <span className="sd-input__password" onClick={() => setShowPwd(!showPwd)}>
            {showPwd ? (
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  fill="currentColor"
                  d="M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352zm0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  fill="currentColor"
                  d="M876.8 156.8c0-9.6-3.2-16-9.6-22.4-6.4-6.4-12.8-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176C44.8 438.4 0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4 0 9.6 3.2 16 9.6 22.4 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4Zm-646.4 528c-76.8-70.4-128-128-153.6-172.8 28.8-48 80-105.6 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4Zm140.8-96c-12.8-22.4-19.2-48-19.2-76.8 0-44.8 16-83.2 48-112 32-28.8 67.2-48 112-48 28.8 0 54.4 6.4 73.6 19.2L371.2 588.8ZM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6-28.8 48-80 105.6-153.6 172.8-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176C979.199 585.6 1024 528 1024 512s-48.001-73.6-134.401-176Z"
                />
                <path
                  fill="currentColor"
                  d="M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112-32 28.8-67.2 48-112 48Z"
                />
              </svg>
            )}
          </span>
        )}
        {suffixIcon && !showClearBtn && <span className="sd-input__suffix-icon">{suffixIcon}</span>}
      </span>
    </div>
  )
})

Input.displayName = 'Input'
