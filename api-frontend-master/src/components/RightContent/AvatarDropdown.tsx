import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Avatar, Menu, Spin, message } from 'antd';
import type { ItemType } from 'antd/es/menu/hooks/useItems';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { userLogoutUsingPost } from "@/services/yuapi-backend/userController";
import AutoAvatar from '../AutoAvatar';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  /**
   * 退出登录并跳转
   */
  const loginOut = async () => {
    try {
      await userLogoutUsingPost();
      const { search, pathname } = window.location;
      const urlParams = new URL(window.location.href).searchParams;
      const redirect = urlParams.get('redirect');

      // 1. 清理全局状态（必须清理 loginUser 才能触发重新加载或拦截）
      setInitialState((s) => ({ ...s, loginUser: undefined }));

      // 2. 跳转到登录页，并记录当前页面以便登录后回来
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: pathname + search,
          }),
        });
      }
      message.success('已退出登录');
    } catch (error) {
      message.error('退出失败，请重试');
    }
  };

  /**
   * 菜单点击事件
   */
  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    </span>
  );

  // 如果 initialState 还没准备好，显示加载
  if (!initialState) {
    return loading;
  }

  // 获取 loginUser（对应 app.tsx 中的定义）
  const { loginUser } = initialState;

  // 关键：只要 loginUser 存在且 userAccount 有值，就停止加载
  // 解决了数据库 userName 为 null 导致的死循环转圈问题
  if (!loginUser || !loginUser.userAccount) {
    return loading;
  }

  const menuItems: ItemType[] = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const menuHeaderDropdown = (
    <Menu 
      className={styles.menu} 
      selectedKeys={[]} 
      onClick={onMenuClick} 
      items={menuItems} 
    />
  );

  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <AutoAvatar 
          user={loginUser}
          size="small" 
          className={styles.avatar} 
        />
        {/* <Avatar 
          size="small" 
          className={styles.avatar} 
          src={loginUser.userAvatar || undefined} 
          alt="avatar" 
        /> */}
        {/* 展示账号名称 */}
        <span className={`${styles.name} anticon`}>
          {loginUser.userAccount}
        </span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;