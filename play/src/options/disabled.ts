import { CascaderOption } from '@seven-design-ui/components'

export const disabledOptions: CascaderOption[] = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        disabled: true,
        children: [
          { value: 'xihu', label: '西湖' },
        ],
      },
      {
        value: 'ningbo',
        label: '宁波',
        children: [
          { value: 'jiangbei', label: '江北' },
        ],
      },
    ],
  },
]