'use client';

import { useState } from 'react'
import { Button, Input, Switch } from '@seven-design/components'

function CustomContentSwitch() {
  const [switch1, setSwitch1] = useState(true)
  const [switch2, setSwitch2] = useState(false)
  const [switch3, setSwitch3] = useState(true)

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>自定义开关内容测试</h3>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Switch
            checkedNode="开"
            unCheckedNode="关"
            checked={switch1}
            onChange={setSwitch1}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>文字内容</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Switch
            checkedNode="1"
            unCheckedNode="0"
            checked={switch2}
            onChange={setSwitch2}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>数字内容</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Switch
            checkedNode="✓"
            unCheckedNode="✗"
            checked={switch3}
            onChange={setSwitch3}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>符号内容</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Switch
            checkedNode={<span style={{ color: 'green', fontWeight: 'bold' }}>开</span>}
            unCheckedNode={<span style={{ color: 'red', fontWeight: 'bold' }}>关</span>}
            defaultChecked={true}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>React元素内容</span>
        </div>
      </div>

      <p style={{ fontSize: '12px', color: '#666' }}>
        状态: 开关1={switch1 ? '开' : '关'}, 开关2={switch2 ? '1' : '0'}, 开关3={switch3 ? '✓' : '✗'}
      </p>
    </div>
  )
}

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

          {/* 自定义内容测试 */}
          <CustomContentSwitch />
        </section>
      </main>
    </div>
  )
}

export default App
