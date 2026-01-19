'use client';

import { useState } from 'react'
import { Button, Input, Switch } from '@seven-design/components'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [switchChecked, setSwitchChecked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>SevenDesign 组件库调试环境</h1>
        <p>本地开发和测试组件的 Playground</p>
      </header>

      <main className="app-main">
        {/* Button 示例 */}
        <section className="demo-section">
          <h2>Button 按钮</h2>
          <div className="demo-row">
            <Button>默认按钮</Button>
            <Button type="primary">主要按钮</Button>
            <Button type="success">成功按钮</Button>
            <Button type="warning">警告按钮</Button>
            <Button type="danger">危险按钮</Button>
            <Button type="info">信息按钮</Button>
          </div>
          <div className="demo-row">
            <Button plain>朴素按钮</Button>
            <Button type="primary" plain>
              主要按钮
            </Button>
            <Button type="success" plain>
              成功按钮
            </Button>
          </div>
          <div className="demo-row">
            <Button round>圆角按钮</Button>
            <Button type="primary" round>
              主要按钮
            </Button>
          </div>
          <div className="demo-row">
            <Button size="large">大型按钮</Button>
            <Button>默认按钮</Button>
            <Button size="small">小型按钮</Button>
          </div>
          <div className="demo-row">
            <Button loading={loading} type="primary" onClick={handleClick}>
              {loading ? '加载中...' : '点击加载'}
            </Button>
            <Button disabled>禁用按钮</Button>
          </div>
        </section>

        {/* Input 示例 */}
        <section className="demo-section">
          <h2>Input 输入框</h2>
          <div className="demo-column">
            <Input placeholder="请输入内容" value={inputValue} onInput={setInputValue} />
            <Input placeholder="可清空的输入框" clearable />
            <Input placeholder="密码输入框" type="password" showPassword />
            <Input placeholder="禁用状态" disabled />
            <div className="demo-row">
              <Input placeholder="大尺寸" size="large" />
              <Input placeholder="默认尺寸" />
              <Input placeholder="小尺寸" size="small" />
            </div>
          </div>
        </section>

        {/* Switch 示例 */}
        <section className="demo-section">
          <h2>Switch 开关</h2>
          <div className="demo-row">
            <Switch checked={switchChecked} onChange={setSwitchChecked} />
            <Switch defaultChecked />
            <Switch disabled />
            <Switch loading />
          </div>
          <p className="demo-tip">当前状态: {switchChecked ? '开启' : '关闭'}</p>
        </section>
      </main>
    </div>
  )
}

export default App
