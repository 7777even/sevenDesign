/**
 * 类名合并工具
 */
export type ClassValue = 
  | string 
  | number 
  | boolean 
  | undefined 
  | null 
  | ClassValue[]
  | Record<string, boolean | undefined | null>

export function classnames(...classes: ClassValue[]): string {
  const result: string[] = []
  
  for (const cls of classes) {
    if (!cls) continue
    
    if (typeof cls === 'string' && cls.trim()) {
      result.push(cls.trim())
    } else if (typeof cls === 'number') {
      result.push(String(cls))
    } else if (Array.isArray(cls)) {
      const inner = classnames(...cls)
      if (inner) result.push(inner)
    } else if (typeof cls === 'object') {
      for (const key in cls) {
        if (cls[key]) {
          result.push(key)
        }
      }
    }
  }
  
  return result.join(' ')
}

/**
 * 创建 BEM 风格的类名生成器
 */
export function createBEM(block: string) {
  const b = () => block
  const e = (element: string) => `${block}__${element}`
  const m = (modifier: string) => `${block}--${modifier}`
  const em = (element: string, modifier: string) => `${block}__${element}--${modifier}`

  return { b, e, m, em }
}
