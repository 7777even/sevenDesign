import { CascaderOption } from '@seven-design-ui/components'

export const hoverOptions: CascaderOption[] = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          { value: 'xihu', label: '西湖' },
          { value: 'xiasha', label: '萧山' },
        ],
      },
    ],
  },
]