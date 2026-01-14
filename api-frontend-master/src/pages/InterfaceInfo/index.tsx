import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Form, message, Input, Divider, Image, Empty } from 'antd';
import {
  getInterfaceInfoByIdUsingGet,
  invokeInterfaceInfoUsingPost,
} from '@/services/yuapi-backend/interfaceInfoController';
import { useParams } from '@@/exports';

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);
  // 新增：用于存储图片预览地址
  const [imgPreview, setImgPreview] = useState<string | undefined>();

  const params = useParams();

  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGet({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    // 每次调用前清空上一次的结果
    setInvokeRes(undefined);
    setImgPreview(undefined);
    
    try {
      const res = await invokeInterfaceInfoUsingPost({
        id: params.id,
        ...values,
        method: data?.method,
      });

      const responseData = res.data; // 这里的 res.data 通常是后端返回的完整对象
      setInvokeRes(responseData);    // 无论如何，先让用户看到原始 JSON 响应

      let finalStr = "";
      // 1. 适配多层级提取 Base64
      if (typeof responseData === 'string') {
          finalStr = responseData;
      } else if (responseData?.data && typeof responseData.data === 'string') {
          finalStr = responseData.data;
      } else if (responseData?.data?.data && typeof responseData.data.data === 'string') {
          finalStr = responseData.data.data;
      }

      // 2. 只有当提取到的字符串确实是图片格式时，才开启预览
      if (finalStr && finalStr.startsWith('data:image')) {
          setImgPreview(finalStr);
      } else {
          // 如果不是图片，清空之前的预览图，防止显示错位
          setImgPreview(undefined);
      }

      message.success('请求成功');
    } catch (error: any) {
      message.error('操作失败，' + error.message);
    }
    setInvokeLoading(false);
  };

  return (
    <PageContainer title="查看接口文档">
      <Card loading={loading}>
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="接口状态">{data.status ? '开启' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{data.updateTime}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Empty description="接口不存在" />
        )}
      </Card>
      <Divider />
      <Card title="在线测试">
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item 
            label="请求参数 (JSON格式)" 
            name="userRequestParams"
            initialValue={data?.requestParams}
          >
            <Input.TextArea placeholder='例如：{"name": "liuhao"}' />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={invokeLoading}>
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title="返回结果" loading={invokeLoading}>
        {/* 情况 A: 显示 Base64 图片预览 */}
        {imgPreview ? (
          <div style={{ textAlign: 'center' }}>
            <Image width={200} src={imgPreview} />
            <p style={{ marginTop: 10, color: '#8c8c8c' }}>生成预览成功</p>
          </div>
        ) : invokeRes ? (
          /* 情况 B: 显示文字结果或跳转链接 */
          <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
            {typeof invokeRes === 'string' && invokeRes.includes('http') ? (
              <div>
                <p style={{ marginBottom: 12 }}>{invokeRes}</p>
                <Button 
                  type="primary" 
                  onClick={() => {
                    // 匹配字符串中的第一个 URL
                    const url = invokeRes.match(/https?:\/\/[^\s，。！!]+/)?.[0];
                    if (url) window.open(url);
                  }}
                >
                  立即跳转查看图片
                </Button>
              </div>
            ) : (
              /* 普通文本或 JSON 渲染 */
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {typeof invokeRes === 'object' ? JSON.stringify(invokeRes, null, 2) : invokeRes}
              </pre>
            )}
          </div>
        ) : (
          /* 情况 C: 无结果 */
          <Empty description="暂无调用结果" />
        )}
      </Card>
    </PageContainer>
  );
};

export default Index;