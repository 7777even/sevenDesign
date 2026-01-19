'use client';

import { useCallback, useRef, useState } from 'react'

/**
 * 受控/非受控状态 Hook
 * 支持组件同时支持受控和非受控模式
 */
export function useControllableState<T>(
  value?: T,
  defaultValue?: T,
  onChange?: (value: T) => void
): [T | undefined, (value: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const stateValue = isControlled ? value : uncontrolledValue
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const setState = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onChangeRef.current?.(newValue)
    },
    [isControlled]
  )

  return [stateValue, setState]
}
