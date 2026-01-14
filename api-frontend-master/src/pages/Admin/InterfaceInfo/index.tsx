import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { SortOrder } from 'antd/es/table/interface';
import {
  addInterfaceInfoUsingPost,
  deleteInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingGet,
  offlineInterfaceInfoUsingPost,
  onlineInterfaceInfoUsingPost,
  updateInterfaceInfoUsingPost
} from '@/services/api-backend/interfaceInfoController';
import CreateModal from '@/pages/Admin/InterfaceInfo/components/CreateModal';
import UpdateModal from "@/pages/Admin/InterfaceInfo/components/UpdateModal";

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPost({
        ...fields,
      });
      hide();
      message.success('创建成功');
      handleModalVisible(false);
      return true;
    } catch (error: any) {
      hide();
      message.error('创建失败，' + error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields:  API.InterfaceInfo) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      await updateInterfaceInfoUsingPost({
        id: currentRow.id,
        ...fields
      });
      hide();
      message.success('操作成功');
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  /**
   * 发布接口
   *
   * @param record
   */
  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      await onlineInterfaceInfoUsingPost({
        id: record.id
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  /**
   * 下线接口
   *
   * @param record
   */
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPost({
        id: record.id
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteInterfaceInfoUsingPost({
        id: record.id
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'index',
      width: 48,
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      copyable: true,
      fixed: 'left', // 固定在左侧
      width: 150,
      render: (dom, record) => {
        return (
          <a onClick={() => {
            setCurrentRow(record);
            setShowDetail(true);
          }}>
            {dom}
          </a>
        );
      },
      formItemProps: {
        rules: [{ required: true }],
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      ellipsis: true, // 开启省略号
      width: 150,
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
      width: 100,
      render: (_, record) => {
        const color = record.method === 'POST' ? 'blue' : 'green';
        return <span style={{ fontWeight: 'bold', color }}>{record.method}</span>;
      }
    },
    {
      title: 'URL',
      dataIndex: 'url',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      hideInForm: true,
      valueEnum: {
        0: { text: '关闭', status: 'Default' },
        1: { text: '开启', status: 'Processing' },
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 160,
    },
    // 以下复杂的 JSON 字段在表格中隐藏，仅在新建/修改和详情中显示
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
      hideInTable: true, 
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
      hideInTable: true,
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right', // 固定在右侧
      width: 180,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a key="modify" onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            修改
          </a>
          {record.status === 0 ? (
            <a key="online" onClick={() => handleOnline(record)}>发布</a>
          ) : (
            <a key="offline" style={{ color: '#ff4d4f' }} onClick={() => handleOffline(record)}>下线</a>
          )}
          <Button
            type="text"
            key="remove"
            danger
            size="small"
            onClick={() => handleRemove(record)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.InterfaceInfo, API.PageParams>
        headerTitle={'接口管理'}
        actionRef={actionRef}
        rowKey="id"
        // 1. 强制表格布局，防止因内容撑开变形
        tableLayout="fixed" 
        // 2. 默认滚动条，处理多列情况
        scroll={{ x: 1200 }} 
        // 3. 搜索表单配置：缩小占用空间
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false, // 默认展开搜索
          span: 8, // 每行显示三个搜索项
        }}
        // 4. 分页器优化
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (
          params,
          sort: Record<string, SortOrder>,
          filter: Record<string, React.ReactText[] | null>,
        ) => {
          const res: any = await listInterfaceInfoByPageUsingGet({
            ...params,
          });
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={640}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        title="接口详情信息"
      >
        {currentRow?.name && (
          <ProDescriptions<API.InterfaceInfo>
            column={1} // 改为单列展示，适合长文本
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            columns={columns as ProDescriptionsItemProps<API.InterfaceInfo>[]}
          />
        )}
      </Drawer>
      <CreateModal
        columns={columns}
        onCancel={() => {
          handleModalVisible(false);
        }}
        onSubmit={(values) => {
          handleAdd(values);
        }}
        visible={createModalVisible}
      />
    </PageContainer>
  );
};
export default TableList;
