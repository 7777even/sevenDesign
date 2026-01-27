'use client';

import { useState, useRef } from 'react'
import { Button, Input, Switch, Pagination, Cascader, Form } from '@seven-design-ui/components'
import { basicOptions, disabledOptions, multipleOptions, hoverOptions } from './options'

function CustomContentSwitch() {
  const [switch1, setSwitch1] = useState(true)
  const [switch2, setSwitch2] = useState(false)
  const [switch3, setSwitch3] = useState(true)
  const [switch4, setSwitch4] = useState(false)

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>自定义开关内容和背景色测试</h3>

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

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Switch
            checkedColor="green"
            unCheckedColor="red"
            checked={switch4}
            onChange={setSwitch4}
          />
          <span style={{ fontSize: '12px', color: '#666' }}>自定义背景色</span>
        </div>
      </div>

      <p style={{ fontSize: '12px', color: '#666' }}>
        状态: 开关1={switch1 ? '开' : '关'}, 开关2={switch2 ? '1' : '0'}, 开关3={switch3 ? '✓' : '✗'}, 开关4={switch4 ? '绿' : '红'}
      </p>
    </div>
  )
}

function App() {
  const [inputValue, setInputValue] = useState('')
  const [switchChecked, setSwitchChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paginationPage, setPaginationPage] = useState(1)
  const [paginationSize, setPaginationSize] = useState(10)
  const [cascaderValue, setCascaderValue] = useState()
  const [multipleCascaderValue, setMultipleCascaderValue] = useState([])
  const formRef = useRef()

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPaginationPage(page)
    setPaginationSize(pageSize)
    console.log(`页码: ${page}, 每页容量: ${pageSize}`)
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

        {/* Pagination 示例 */}
        <section className="demo-section">
          <h2>Pagination 分页器</h2>

          {/* 基础使用 */}
          <div className="demo-column">
            <h3>基础使用</h3>
            <Pagination
              total={100}
              defaultCurrent={1}
              defaultPageSize={10}
              onChange={handlePaginationChange}
            />
            <p className="demo-tip">当前页码: {paginationPage}, 每页容量: {paginationSize}</p>
          </div>

          {/* 不同大小 */}
          <div className="demo-column">
            <h3>不同大小</h3>
            <div className="demo-row">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Pagination total={50} size="s" />
                <span style={{ fontSize: '12px', color: '#666' }}>小尺寸 (s)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Pagination total={50} size="m" />
                <span style={{ fontSize: '12px', color: '#666' }}>中等尺寸 (m)</span>
              </div>
            </div>
          </div>

          {/* 自定义页码按钮数 */}
          <div className="demo-column">
            <h3>自定义最大页码按钮数</h3>
            <Pagination total={200} pagerCount={5} defaultCurrent={10} />
            <p className="demo-tip">最大显示5个页码按钮</p>
          </div>

          {/* 自定义每页容量选项 */}
          <div className="demo-column">
            <h3>自定义每页容量选项</h3>
            <Pagination
              total={500}
              pageSizeOptions={[5, 10, 20, 50]}
              defaultPageSize={5}
            />
            <p className="demo-tip">每页容量选项: 5, 10, 20, 50</p>
          </div>

          {/* 跳转功能 */}
          <div className="demo-column">
            <h3>跳转功能</h3>
            <Pagination
              total={100}
              showQuickJumper={true}
              defaultCurrent={5}
            />
            <p className="demo-tip">可以直接跳转到指定页码</p>
          </div>
        </section>

        {/* Cascader 示例 */}
        <section className="demo-section">
          <h2>Cascader 级联选择器</h2>

          {/* 基础使用 */}
          <div className="demo-column">
            <h3>基础使用</h3>
            <Cascader
              options={basicOptions}
              value={cascaderValue}
              onChange={setCascaderValue}
              placeholder="请选择城市"
            />
            <p className="demo-tip">选中值: {cascaderValue || '无'}</p>
          </div>

          {/* 禁用选项 */}
          <div className="demo-column">
            <h3>禁用选项</h3>
            <Cascader
              options={disabledOptions}
              placeholder="请选择城市（杭州被禁用）"
            />
          </div>

          {/* 清空功能 */}
          <div className="demo-column">
            <h3>可清空</h3>
            <Cascader
              options={basicOptions}
              defaultValue={['zhejiang', 'hangzhou', 'xihu']}
              clearable
              placeholder="可清空的级联选择器"
            />
          </div>

          {/* 仅显示最后一级 */}
          <div className="demo-column">
            <h3>仅显示最后一级</h3>
            <Cascader
              options={basicOptions}
              showAllLevels={false}
              placeholder="仅显示最后一级标签"
            />
          </div>

          {/* 多选 */}
          <div className="demo-column">
            <h3>多选</h3>
            <Cascader
              options={multipleOptions}
              value={multipleCascaderValue}
              onChange={setMultipleCascaderValue}
              multiple
              placeholder="请选择多个城市"
            />
            <p className="demo-tip">选中值: {multipleCascaderValue.join(', ') || '无'}</p>
          </div>

          {/* 悬停展开 */}
          <div className="demo-column">
            <h3>悬停展开</h3>
            <Cascader
              options={hoverOptions}
              expandTrigger="hover"
              placeholder="鼠标悬停展开子菜单"
            />
          </div>
        </section>

        {/* Form 示例 */}
        <section className="demo-section">
          <h2>Form 表单</h2>

          {/* 基础表单 */}
          <div className="demo-column">
            <h3>基础表单</h3>
            <Form
              ref={formRef}
              onFinish={(values) => {
                console.log('表单提交成功:', values)
                alert('表单提交成功！')
              }}
              onFinishFailed={(errors) => {
                console.log('表单提交失败:', errors)
                alert('表单校验失败，请检查输入！')
              }}
              style={{ maxWidth: '400px' }}
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input type="password" placeholder="请输入密码" />
              </Form.Item>

              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '邮箱格式不正确' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                  提交
                </Button>
                <Button onClick={() => formRef.current?.resetFields()}>
                  重置
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* 表单方法测试 */}
          <div className="demo-column">
            <h3>表单方法测试</h3>
            <div className="demo-row">
              <Button onClick={() => formRef.current?.validateField('username').then(() => alert('用户名校验通过')).catch(() => alert('用户名校验失败'))}>
                校验用户名
              </Button>
              <Button onClick={() => formRef.current?.validateAllFields().then((values) => alert('表单校验通过')).catch(() => alert('表单校验失败'))}>
                校验全部
              </Button>
              <Button onClick={() => formRef.current?.setFieldValue('username', 'admin')}>
                设置用户名
              </Button>
              <Button onClick={() => alert(`用户名值: ${formRef.current?.getFieldValue('username') || '空'}`)}>
                获取用户名
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
