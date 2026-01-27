'use client';

import React, { forwardRef, useImperativeHandle, useRef, ReactNode, createContext, useContext, useState, useCallback, useMemo } from 'react'
import Schema, { ValidateError, Rules } from 'async-validator'
import { classnames } from '@seven-design-ui/core'
import './form.css'

// 表单校验规则类型
export interface Rule {
  /** 校验类型 */
  type?: string
  /** 是否必填 */
  required?: boolean
  /** 错误提示信息 */
  message?: string
  /** 校验器函数 */
  validator?: (rule: Rule, value: any, callback: (error?: string) => void) => void
  /** 最小长度 */
  min?: number
  /** 最大长度 */
  max?: number
  /** 正则表达式 */
  pattern?: RegExp
  /** 自定义校验函数 */
  asyncValidator?: (rule: Rule, value: any) => Promise<void>
}

// Form.Item 组件的属性
export interface FormItemProps {
  /** 表单项名称，用于表单校验和数据提交 */
  name?: string
  /** 表单项标签 */
  label?: string
  /** 校验规则 */
  rules?: Rule[]
  /** 触发校验的事件，默认 'onBlur' */
  validateTrigger?: string | string[]
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: ReactNode
  /** 表单项布局 */
  labelCol?: {
    span?: number
    offset?: number
  }
  /** 表单控件布局 */
  wrapperCol?: {
    span?: number
    offset?: number
  }
}

// Form 组件的属性
export interface FormProps {
  /** 表单数据对象 */
  initialValues?: Record<string, any>
  /** 表单提交成功的回调 */
  onFinish?: (values: Record<string, any>) => void
  /** 表单提交失败的回调 */
  onFinishFailed?: (errors: Record<string, ValidateError[]>) => void
  /** 自定义类名 */
  className?: string
  /** 子元素 */
  children?: ReactNode
}

// Form 实例方法
export interface FormRef {
  /** 校验单个字段 */
  validateField: (name: string) => Promise<void>
  /** 校验所有字段 */
  validateAllFields: () => Promise<Record<string, any>>
  /** 重置表单 */
  resetFields: () => void
  /** 设置单个字段的值 */
  setFieldValue: (name: string, value: any) => void
  /** 获取单个字段的值 */
  getFieldValue: (name: string) => any
  /** 获取所有字段的值 */
  getFieldsValue: () => Record<string, any>
}

// Form 上下文类型
interface FormContextType {
  /** 表单数据 */
  values: Record<string, any>
  /** 表单错误信息 */
  errors: Record<string, ValidateError[]>
  /** 更新表单数据 */
  setValue: (name: string, value: any) => void
  /** 校验字段 */
  validateField: (name: string, rules?: Rule[]) => Promise<void>
  /** 注册字段 */
  registerField: (name: string, rules?: Rule[], validateTrigger?: string | string[]) => void
  /** 注销字段 */
  unregisterField: (name: string) => void
}

// 创建 Form 上下文
const FormContext = createContext<FormContextType | null>(null)

// 自定义 Hook 用于获取 Form 上下文
export const useFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('Form.Item must be used within a Form')
  }
  return context
}

// Form.Item 组件
export const FormItem = forwardRef<HTMLDivElement, FormItemProps>((props, ref) => {
  const {
    name,
    label,
    rules = [],
    validateTrigger = 'onBlur',
    className,
    children,
    labelCol,
    wrapperCol,
    ...rest
  } = props

  const formContext = useFormContext()
  const { registerField, unregisterField } = formContext
  const [fieldErrors, setFieldErrors] = useState<ValidateError[]>([])
  const fieldRef = useRef<HTMLDivElement>(null)

  // 合并外部 ref 和内部 ref
  useImperativeHandle(ref, () => fieldRef.current as HTMLDivElement, [])

  // 注册/注销字段：只在 mount/unmount（或 name 变化）时做 cleanup，避免 render 循环
  React.useEffect(() => {
    if (!name) return
    registerField(name, rules, validateTrigger)
    return () => unregisterField(name)
  }, [name, registerField, unregisterField])

  // 更新字段规则/触发方式：允许 rules/validateTrigger 变化，但不做 cleanup
  React.useEffect(() => {
    if (!name) return
    registerField(name, rules, validateTrigger)
  }, [name, rules, validateTrigger, registerField])

  // 获取当前字段的值和错误
  const fieldValue = name ? formContext.values[name] : undefined
  const fieldError = name ? formContext.errors[name] : undefined

  // 处理字段变更
  const handleFieldChange = useCallback((value: any) => {
    if (name) {
      formContext.setValue(name, value)
    }
  }, [name, formContext])

  // 处理校验触发
  const handleValidateTrigger = useCallback(async (trigger: string) => {
    const triggers = Array.isArray(validateTrigger) ? validateTrigger : [validateTrigger]
    if (triggers.includes(trigger) && name) {
      try {
        await formContext.validateField(name, rules)
        setFieldErrors([])
      } catch (errors) {
        const maybeErrors = (errors as any)?.errors ?? errors
        setFieldErrors(Array.isArray(maybeErrors) ? (maybeErrors as ValidateError[]) : [])
      }
    }
  }, [validateTrigger, name, rules, formContext])

  // 克隆子元素，注入表单相关属性
  const clonedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // 为子元素注入 value 和基础 onChange
      const childProps: any = {
        value: fieldValue,
        onChange: (e: any) => {
          const value = e?.target?.value ?? e
          handleFieldChange(value)
          // 如果 validateTrigger 包含 'onChange'，则同时触发校验
          const triggers = Array.isArray(validateTrigger) ? validateTrigger : [validateTrigger]
          if (triggers.includes('onChange')) {
            handleValidateTrigger('onChange')
          }
        },
      }

      // 根据 validateTrigger 注入其他事件处理器
      const triggers = Array.isArray(validateTrigger) ? validateTrigger : [validateTrigger]
      triggers.forEach(trigger => {
        if (trigger === 'onBlur') {
          childProps.onBlur = () => handleValidateTrigger('onBlur')
        }
        // onChange 已经在上面处理了，不需要重复添加
      })

      return React.cloneElement(child, childProps)
    }
    return child
  })

  // 计算样式类名
  const itemClasses = classnames(
    'sd-form-item',
    {
      'sd-form-item--error': (fieldError && fieldError.length > 0) || fieldErrors.length > 0,
      'sd-form-item--required': rules.some(rule => rule.required),
    },
    className
  )

  const labelClasses = classnames('sd-form-item__label', {
    'sd-form-item__label--required': rules.some(rule => rule.required),
  })

  const controlClasses = 'sd-form-item__control'

  // 获取错误信息
  const normalizedErrors: ValidateError[] = Array.isArray(fieldError)
    ? fieldError
    : Array.isArray(fieldErrors)
      ? fieldErrors
      : []
  const errorMessages = normalizedErrors.map(error => error.message).filter(Boolean)

  return (
    <div ref={fieldRef} className={itemClasses} {...rest}>
      {label && (
        <label className={labelClasses} style={labelCol ? { flex: `0 0 ${labelCol.span}%` } : undefined}>
          {label}
        </label>
      )}
      <div className={controlClasses} style={wrapperCol ? { flex: `0 0 ${wrapperCol.span}%` } : undefined}>
        <div className="sd-form-item__control-input">
          {clonedChildren}
        </div>
        {errorMessages.length > 0 && (
          <div className="sd-form-item__error">
            {errorMessages.map((message, index) => (
              <div key={index} className="sd-form-item__error-item">
                {message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

FormItem.displayName = 'FormItem'

// Form 主组件
const FormComponent = forwardRef<FormRef, FormProps>((props, ref) => {
  const {
    initialValues = {},
    onFinish,
    onFinishFailed,
    className,
    children,
    ...rest
  } = props

  // 表单状态
  const [values, setValues] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<Record<string, ValidateError[]>>({})

  // 字段注册信息
  const fieldsRef = useRef<Record<string, { rules: Rule[], validateTrigger: string | string[] }>>({})

  // 更新字段值
  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  // 注册字段
  const registerField = useCallback((name: string, rules: Rule[] = [], validateTrigger: string | string[] = 'onBlur') => {
    fieldsRef.current[name] = { rules, validateTrigger }
  }, [])

  // 注销字段
  const unregisterField = useCallback((name: string) => {
    delete fieldsRef.current[name]
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }, [])

  // 校验单个字段
  const validateField = useCallback(async (name: string, customRules?: Rule[]): Promise<void> => {
    const field = fieldsRef.current[name]
    if (!field) return

    const rules = customRules || field.rules
    if (rules.length === 0) return

    const value = values[name]
    const schema = new Schema({ [name]: rules } as Rules)

    try {
      await schema.validate({ [name]: value })
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    } catch (validationErrors) {
      const maybeErrors = (validationErrors as any)?.errors ?? validationErrors
      const errors = Array.isArray(maybeErrors) ? (maybeErrors as ValidateError[]) : []
      setErrors(prev => ({
        ...prev,
        [name]: errors
      }))
      throw errors
    }
  }, [values])

  // 校验所有字段
  const validateAllFields = useCallback(async (): Promise<Record<string, any>> => {
    const fieldNames = Object.keys(fieldsRef.current)
    const validationPromises = fieldNames.map(name => validateField(name).catch(errors => ({ name, errors })))

    const results = await Promise.all(validationPromises)
    const failedValidations = results.filter(result => result && 'errors' in result) as { name: string, errors: ValidateError[] }[]

    if (failedValidations.length > 0) {
      const allErrors = failedValidations.reduce((acc, { name, errors }) => {
        acc[name] = errors
        return acc
      }, {} as Record<string, ValidateError[]>)

      if (onFinishFailed) {
        onFinishFailed(allErrors)
      }
      throw allErrors
    }

    if (onFinish) {
      onFinish(values)
    }

    return values
  }, [validateField, values, onFinish, onFinishFailed])

  // 重置表单
  const resetFields = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  // 设置单个字段值
  const setFieldValue = useCallback((name: string, value: any) => {
    setValue(name, value)
  }, [setValue])

  // 获取单个字段值
  const getFieldValue = useCallback((name: string) => {
    return values[name]
  }, [values])

  // 获取所有字段值
  const getFieldsValue = useCallback(() => {
    return { ...values }
  }, [values])

  // 暴露 Form 实例方法
  useImperativeHandle(ref, () => ({
    validateField,
    validateAllFields,
    resetFields,
    setFieldValue,
    getFieldValue,
    getFieldsValue,
  }), [validateField, validateAllFields, resetFields, setFieldValue, getFieldValue, getFieldsValue])

  // 处理表单提交
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    validateAllFields()
  }, [validateAllFields])

  // Form 上下文值
  const contextValue: FormContextType = useMemo(() => ({
    values,
    errors,
    setValue,
    validateField,
    registerField,
    unregisterField,
  }), [values, errors, setValue, validateField, registerField, unregisterField])

  const formClasses = classnames('sd-form', className)

  return (
    <FormContext.Provider value={contextValue}>
      <form className={formClasses} onSubmit={handleSubmit} {...rest}>
        {children}
      </form>
    </FormContext.Provider>
  )
})

FormComponent.displayName = 'Form'

// 创建带有 Item 子组件的 Form
interface FormWithItem extends React.ForwardRefExoticComponent<FormProps & React.RefAttributes<FormRef>> {
  Item: typeof FormItem
}

const Form = FormComponent as FormWithItem
Form.Item = FormItem

export { Form }