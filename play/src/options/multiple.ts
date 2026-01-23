import { CascaderOption } from '@seven-design-ui/components'

export const multipleOptions: CascaderOption[] = [
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
      {
        value: 'ningbo',
        label: '宁波',
        disableCheckbox: true,
        children: [
          { value: 'jiangbei', label: '江北' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [
          { value: 'zhonghuamen', label: '中华门' },
        ],
      },
    ],
  },
]