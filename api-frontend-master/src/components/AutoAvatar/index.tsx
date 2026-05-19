import { UserOutlined } from '@ant-design/icons';
import { Avatar, AvatarProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { getAvatarUsingPost } from '@/services/api-backend/commonController';

interface Props extends AvatarProps {
  user?: API.UserVO;
}

const AutoAvatar: React.FC<Props> = ({ user, size, className, ...rest }) => {
  const [imgData, setImgData] = useState<string | undefined>(user?.userAvatar);

  useEffect(() => {
    // 1. 优先使用 props 里的头像
    if (user?.userAvatar) {
      setImgData(user.userAvatar);
      return;
    }

    const identifier = user?.userName || user?.userAccount;
    if (identifier) {
      getAvatarUsingPost({ name: identifier }).then((res: any) => {
        // 【核心点】适配 Umi Request 的拦截器
        // 尝试从 res.data (标准 JSON) 或 res (拦截器处理后) 中提取字符串
        let finalStr = "";
        if (typeof res === 'string') {
          finalStr = res;
        } else if (res?.data && typeof res.data === 'string') {
          finalStr = res.data;
        } else if (res?.data?.data && typeof res.data.data === 'string') {
          finalStr = res.data.data;
        }

        if (finalStr) {
          // 补齐 data: 前缀（防止后端返回不规范）
          const src = finalStr.startsWith('data:') ? finalStr : `data:image/png;base64,${finalStr}`;
          setImgData(src);
        }
      }).catch(err => {
        console.error("头像获取失败:", err);
      });
    }
  }, [user?.userAvatar, user?.userName, user?.userAccount]);

  // 这里的 typeof 检查是防止 imgData 意外变成对象导致显示 "{"
  const validSrc = typeof imgData === 'string' ? imgData : undefined;

  return (
    <Avatar
      {...rest}
      size={size}
      className={className}
      // 关键：只要数据变了，就销毁旧组件重新渲染，解决加载状态卡死
      key={validSrc ? validSrc.substring(0, 50) : 'default'}
      src={validSrc}
      icon={<UserOutlined />}
    />
  );
};

export default AutoAvatar;