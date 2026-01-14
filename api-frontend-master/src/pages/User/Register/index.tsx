import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { history, Link } from 'umi';
// 注意：这里的 userRegisterRequest 对应你后端生成的接口定义
import { userRegisterUsingPost } from '@/services/api-backend/userController';

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');

  const handleSubmit = async (values: API.UserRegisterRequest) => {
    const { userPassword, checkPassword } = values;
    // 校验处理
    if (userPassword !== checkPassword) {
      message.error('两次输入的密码不一致！');
      return;
    }

    try {
      // 1. 调用注册接口
      const res = await userRegisterUsingPost(values);
      if (res.data) {
        message.success('注册成功！');
        // 2. 注册成功后跳转到登录页
        history.push('/user/login');
      }
    } catch (error) {
      message.error('注册失败，请重试！');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <LoginForm
        submitter={{ searchConfig: { submitText: '注册' } }}
        title="API 开放平台注册"
        onFinish={async (values) => {
          await handleSubmit(values as API.UserRegisterRequest);
        }}
      >
        <Tabs activeKey={type} onChange={setType} centered>
          <Tabs.TabPane key="account" tab={'账号密码注册'} />
        </Tabs>
        <ProFormText
          name="userAccount"
          fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
          placeholder={'请输入账号'}
          rules={[{ required: true, message: '账号是必填项！' }]}
        />
        <ProFormText.Password
          name="userPassword"
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          placeholder={'请输入密码'}
          rules={[{ required: true, min: 8, message: '密码至少 8 位！' }]}
        />
        <ProFormText.Password
          name="checkPassword"
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          placeholder={'请再次输入密码'}
          rules={[{ required: true, message: '确认密码是必填项！' }]}
        />
        <div style={{ marginBottom: 24 }}>
          <Link to="/user/login">已有账号？点击登录</Link>
        </div>
      </LoginForm>
    </div>
  );
};

export default Register;