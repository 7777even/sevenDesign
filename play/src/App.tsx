'use client';

import { useState, useRef } from 'react'
import { Button, Input, Switch, Pagination, Cascader, Form, MessageProvider, MessageContainer, $message, Table, VirtualList } from '@seven-design-ui/components'
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
    <MessageProvider>
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

          {/* Message 示例 */}
          <section className="demo-section">
            <h2>Message 消息提示</h2>

            {/* 基础用法 */}
            <div className="demo-column">
              <h3>基础用法</h3>
              <div className="demo-row">
                <Button onClick={() => $message.info('这是一条普通的消息')}>显示消息</Button>
                <Button onClick={() => $message.success('操作成功！')}>成功消息</Button>
                <Button onClick={() => $message.warning('这是一条警告消息')}>警告消息</Button>
                <Button onClick={() => $message.error('操作失败，请重试')}>错误消息</Button>
                <Button onClick={() => $message.primary('这是一条主要消息')}>主要消息</Button>
              </div>
            </div>

            {/* 不同位置 */}
            <div className="demo-column">
              <h3>不同位置</h3>
              <div className="demo-row">
                <Button onClick={() => $message.info('顶部居中消息', { placement: 'top' })}>顶部居中</Button>
                <Button onClick={() => $message.info('顶部左侧消息', { placement: 'top-left' })}>顶部左侧</Button>
                <Button onClick={() => $message.info('顶部右侧消息', { placement: 'top-right' })}>顶部右侧</Button>
                <Button onClick={() => $message.info('底部居中消息', { placement: 'bottom' })}>底部居中</Button>
              </div>
            </div>

            {/* 可关闭的消息 */}
            <div className="demo-column">
              <h3>可关闭的消息</h3>
              <div className="demo-row">
                <Button onClick={() => $message.info('可关闭的消息', { showClose: true })}>可关闭消息</Button>
                <Button onClick={() => $message.success('不会自动关闭的消息', { duration: 0, showClose: true })}>不自动关闭</Button>
              </div>
            </div>

            {/* 纯色背景 */}
            <div className="demo-column">
              <h3>纯色背景</h3>
              <div className="demo-row">
                <Button onClick={() => $message.success('纯色背景成功消息', { plain: true })}>纯色成功</Button>
                <Button onClick={() => $message.warning('纯色背景警告消息', { plain: true })}>纯色警告</Button>
                <Button onClick={() => $message.error('纯色背景错误消息', { plain: true })}>纯色错误</Button>
              </div>
            </div>

            {/* 通用API */}
            <div className="demo-column">
              <h3>通用API</h3>
              <div className="demo-row">
                <Button onClick={() => $message.open({
                  message: '自定义消息内容',
                  type: 'primary',
                  placement: 'top-right',
                  showClose: true,
                  duration: 5000,
                  plain: true
                })}>
                  通用API
                </Button>
              </div>
            </div>
          </section>

          {/* Table 示例 */}
          <section className="demo-section">
            <h2>Table 表格</h2>

            {/* 基础表格 */}
            <div className="demo-column">
              <h3>基础表格</h3>
              <Table
                data={[
                  { id: 1, name: '张三', age: 25, gender: '男', city: '北京', score: 85 },
                  { id: 2, name: '李四', age: 30, gender: '女', city: '上海', score: 92 },
                  { id: 3, name: '王五', age: 28, gender: '男', city: '广州', score: 78 },
                  { id: 4, name: '赵六', age: 22, gender: '女', city: '深圳', score: 88 }
                ]}
                columns={[
                  { prop: 'name', label: '姓名', width: 120 },
                  { prop: 'age', label: '年龄', width: 80 },
                  { prop: 'gender', label: '性别', width: 80 },
                  { prop: 'city', label: '城市', width: 120 },
                  { prop: 'score', label: '分数', width: 80 }
                ]}
                style={{ width: '100%' }}
              />
            </div>

            {/* 带斑马纹的表格 */}
            <div className="demo-column">
              <h3>带斑马纹的表格</h3>
              <Table
                data={[
                  { id: 1, name: '张三', age: 25, gender: '男', city: '北京', score: 85 },
                  { id: 2, name: '李四', age: 30, gender: '女', city: '上海', score: 92 },
                  { id: 3, name: '王五', age: 28, gender: '男', city: '广州', score: 78 },
                  { id: 4, name: '赵六', age: 22, gender: '女', city: '深圳', score: 88 }
                ]}
                columns={[
                  { prop: 'name', label: '姓名', width: 120 },
                  { prop: 'age', label: '年龄', width: 80 },
                  { prop: 'gender', label: '性别', width: 80 },
                  { prop: 'city', label: '城市', width: 120 },
                  { prop: 'score', label: '分数', width: 80 }
                ]}
                stripe={true}
                style={{ width: '100%' }}
              />
            </div>

            {/* 带边框的表格 */}
            <div className="demo-column">
              <h3>带边框的表格</h3>
              <Table
                data={[
                  { id: 1, name: '张三', age: 25, gender: '男', city: '北京', score: 85 },
                  { id: 2, name: '李四', age: 30, gender: '女', city: '上海', score: 92 }
                ]}
                columns={[
                  { prop: 'name', label: '姓名', width: 120 },
                  { prop: 'age', label: '年龄', width: 80 },
                  { prop: 'gender', label: '性别', width: 80 },
                  { prop: 'city', label: '城市', width: 120 },
                  { prop: 'score', label: '分数', width: 80 }
                ]}
                border={true}
                style={{ width: '100%' }}
              />
            </div>

            {/* 可排序的表格 */}
            <div className="demo-column">
              <h3>可排序的表格</h3>
              <Table
                data={[
                  { id: 1, name: '张三', age: 25, gender: '男', city: '北京', score: 85 },
                  { id: 2, name: '李四', age: 30, gender: '女', city: '上海', score: 92 },
                  { id: 3, name: '王五', age: 28, gender: '男', city: '广州', score: 78 },
                  { id: 4, name: '赵六', age: 22, gender: '女', city: '深圳', score: 88 }
                ]}
                columns={[
                  { prop: 'name', label: '姓名', width: 120, sortable: true },
                  { prop: 'age', label: '年龄', width: 80, sortable: true },
                  { prop: 'gender', label: '性别', width: 80, sortable: true },
                  { prop: 'city', label: '城市', width: 120, sortable: true },
                  { prop: 'score', label: '分数', width: 80, sortable: true }
                ]}
                defaultSort={{ prop: 'score', order: 'descending' }}
                style={{ width: '100%' }}
              />
            </div>

            {/* 固定表头的表格 */}
            <div className="demo-column">
              <h3>固定表头的表格</h3>
              <Table
                data={Array.from({ length: 20 }, (_, index) => ({
                  id: index + 1,
                  name: `用户${index + 1}`,
                  age: 20 + (index % 15),
                  gender: index % 2 === 0 ? '男' : '女',
                  city: ['北京', '上海', '广州', '深圳'][index % 4],
                  score: 60 + (index % 40)
                }))}
                columns={[
                  { prop: 'name', label: '姓名', width: 120 },
                  { prop: 'age', label: '年龄', width: 80 },
                  { prop: 'gender', label: '性别', width: 80 },
                  { prop: 'city', label: '城市', width: 120 },
                  { prop: 'score', label: '分数', width: 80 }
                ]}
                height={300}
                style={{ width: '100%' }}
              />
            </div>
          </section>

          {/* VirtualList 示例 */}
          <section className="demo-section">
            <h2>VirtualList 虚拟列表</h2>

            {/* 等高模式 */}
            <div className="demo-column">
              <h3>等高模式</h3>
              <VirtualList
                data={Array.from({ length: 1000 }, (_, index) => ({
                  id: index + 1,
                  name: `用户${index + 1}`,
                  age: 20 + (index % 15),
                  city: ['北京', '上海', '广州', '深圳'][index % 4]
                }))}
                height={300}
                itemHeight={50}
                itemKey="id"
                gap={8}
                renderItem={(item, index) => (
                  <div style={{
                    padding: '12px',
                    border: '1px solid #e4e7ed',
                    borderRadius: '4px',
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      年龄: {item.age} | 城市: {item.city}
                    </div>
                  </div>
                )}
              />
              <p className="demo-tip">等高虚拟列表，包含1000个项目，每个项目高度50px，间隔8px</p>
            </div>

            {/* 不等高模式 */}
            <div className="demo-column">
              <h3>不等高模式</h3>
              <VirtualList
                data={Array.from({ length: 100 }, (_, index) => ({
                  id: index + 1,
                  name: `文章${index + 1}`,
                  content: `这是第${index + 1}篇文章的内容。`.repeat(Math.floor(Math.random() * 5) + 1),
                  author: `作者${index + 1}`,
                  time: new Date().toLocaleDateString()
                }))}
                height={400}
                fixedHeight={false}
                estimatedHeight={80}
                itemKey="id"
                gap={12}
                renderItem={(item, index) => (
                  <div style={{
                    padding: '16px',
                    border: '1px solid #e4e7ed',
                    borderRadius: '8px',
                    backgroundColor: '#fff'
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{item.name}</h4>
                    <p style={{ margin: '0 0 12px 0', color: '#666', lineHeight: '1.5' }}>
                      {item.content}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#999' }}>
                      <span>{item.author}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                )}
              />
              <p className="demo-tip">不等高虚拟列表，每个项目高度不固定，使用estimatedHeight预测高度</p>
            </div>
          </section>
        </main>
      </div>
      <MessageContainer />
    </MessageProvider>
  )
}

export default App
