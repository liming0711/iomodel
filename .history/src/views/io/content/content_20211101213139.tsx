import React from 'react';
import { Table, Empty } from 'antd';
import Panel from '@/components/panel';
import { OperationOptions, ProjectInfoOptions } from '@/requests';
import { ReadWriteResult } from '../index';
import ParabufferPanel from './parabuffer';
import FilePanel from './file';
import ReadWritePanel from './readWrite';
import UnalignedPanel from './unaligned';

interface IOContentProps {
  info: ProjectInfoOptions[] | undefined;
  rw: ReadWriteResult | undefined;
  op: OperationOptions | undefined;
  pb: any | undefined;
  ua: any | undefined;
}

const summaryColumns = [
  { key: 'project', title: 'Project', dataIndex: 'project', width: 180 },
  {
    key: 'business_type',
    title: 'Business Type',
    dataIndex: 'business_type',
    width: 160
  },
  {
    key: 'hosts',
    title: 'Host',
    dataIndex: 'hosts',
    render: (item: any) => Array.isArray(item) ? item.join(', ') : item
  },
  {
    key: 'items',
    title: 'Items',
    dataIndex: 'items',
    render: (item: any) => Array.isArray(item) ? item.join(', ') : item
  },
  { key: 'version', title: 'Version', dataIndex: 'version' },
  { key: 'work_path', title: 'Work Path', dataIndex: 'work_path' },
  { key: 'start_time', title: 'Create Time', dataIndex: 'start_time', width: 180 }
];


const IOContent: React.FC<IOContentProps> = (props) => {
  const { info = [], rw, op, pb, ua } = props;

  return (
    <div className="io-container">
      <Panel title={<span className="summary-title">IO模型分析报告</span>} center>
        <div className="summary-content">
          <Table
            dataSource={info}
            columns={summaryColumns}
            size="small"
            bordered
            pagination={false}
            rowKey="project"
            locale={{
              emptyText: <Empty description="暂无数据" />
            }}
          />
        </div>
      </Panel>
      <ReadWritePanel data={rw} />
      <FilePanel data={op} />
      <ParabufferPanel data={pb} />
      <UnalignedPanel data={ua} />
    </div>
  );
};

export default IOContent;
