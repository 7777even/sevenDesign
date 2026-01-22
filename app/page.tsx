'use client'

import { useState } from 'react'
import { Button } from '../packages/components/src/button/Button'
import { Input } from '../packages/components/src/input/Input'
import { Switch } from '../packages/components/src/switch/Switch'
import '../packages/theme/src/index.css'

export default function Page() {
  const [inputValue, setInputValue] = useState('')
  const [switchChecked, setSwitchChecked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            SevenDesign
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            企业级 React UI 组件库
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            现代化、可定制、TypeScript 驱动的组件库。基于 Monorepo 架构，提供完整的开发工具链和文档体系。
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button type="primary" size="large">
              快速开始
            </Button>
            <Button size="large" plain>
              查看文档
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">精美设计</h3>
            <p className="text-gray-600">
              现代化的设计风格，参考 Element Plus，提供优雅的用户体验
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold mb-2">TypeScript</h3>
            <p className="text-gray-600">
              完整的类型定义，提供更好的开发体验和代码提示
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold mb-2">主题定制</h3>
            <p className="text-gray-600">
              基于 CSS Variables 的主题系统，轻松定制你的品牌风格
            </p>
          </div>
        </div>

        {/* Component Demos */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            组件演示
          </h2>

          {/* Button Demo */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
              Button 按钮
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 flex-wrap">
                <Button>默认按钮</Button>
                <Button type="primary">主要按钮</Button>
                <Button type="success">成功按钮</Button>
                <Button type="warning">警告按钮</Button>
                <Button type="danger">危险按钮</Button>
                <Button type="info">信息按钮</Button>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button plain>朴素按钮</Button>
                <Button type="primary" plain>
                  主要按钮
                </Button>
                <Button type="success" plain>
                  成功按钮
                </Button>
              </div>
              <div className="flex gap-3 items-center flex-wrap">
                <Button size="large">大型按钮</Button>
                <Button>默认按钮</Button>
                <Button size="small">小型按钮</Button>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button loading={loading} type="primary" onClick={handleClick}>
                  {loading ? '加载中...' : '点击加载'}
                </Button>
                <Button disabled>禁用按钮</Button>
              </div>
            </div>
          </div>

          {/* Input Demo */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
              Input 输入框
            </h3>
            <div className="space-y-4 max-w-md">
              <Input
                placeholder="请输入内容"
                value={inputValue}
                onInput={setInputValue}
              />
              <Input placeholder="可清空的输入框" clearable />
              <Input placeholder="密码输入框" type="password" showPassword />
              <Input placeholder="禁用状态" disabled />
              <div className="flex gap-3">
                <Input placeholder="大尺寸" size="large" />
                <Input placeholder="默认" />
                <Input placeholder="小尺寸" size="small" />
              </div>
              {inputValue && (
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-gray-700">输入的内容：{inputValue}</p>
                </div>
              )}
            </div>
          </div>

          {/* Switch Demo */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">
              Switch 开关
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-center flex-wrap">
                <Switch checked={switchChecked} onChange={setSwitchChecked} />
                <Switch defaultChecked />
                <Switch disabled />
                <Switch loading />
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-gray-700">
                  当前状态：{switchChecked ? '✅ 开启' : '❌ 关闭'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Installation */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4 text-center">快速安装</h2>
          <div className="max-w-2xl mx-auto">
            <pre className="bg-black/20 rounded-lg p-4 overflow-x-auto backdrop-blur">
              <code className="text-sm">
                {`# npm
npm install seven-design-ui

# pnpm
pnpm add seven-design-ui

# yarn
yarn add seven-design-ui`}
              </code>
            </pre>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-gray-600">
          <p className="mb-4">
            这是一个 Monorepo 项目演示页面。完整的开发环境包括：
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <span className="px-4 py-2 bg-white rounded-lg shadow">
              📦 packages/ - 组件库源码
            </span>
            <span className="px-4 py-2 bg-white rounded-lg shadow">
              🎮 play/ - 本地调试环境
            </span>
            <span className="px-4 py-2 bg-white rounded-lg shadow">
              📚 docs/ - Rspress 文档站点
            </span>
          </div>
          <p className="mt-6 text-sm">
            运行 <code className="bg-white px-2 py-1 rounded">pnpm dev</code> 启动 Playground
            或 <code className="bg-white px-2 py-1 rounded">pnpm docs:dev</code> 查看完整文档
          </p>
        </div>
      </div>
    </div>
  )
}
