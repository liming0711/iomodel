import React, { useState, useEffect } from 'react';
import { Table, Empty } from 'antd';
import Panel from '@/components/panel';
import { OperationOptions } from '@/requests';
import { isEmptyObject } from '@/utils/tools';

interface CommonDataProps {
  name: string;
  data: number[];
  type: 'bar' | 'line';
}
interface ColumnProps {
  key: React.Key;
  title: string;
  dataIndex: string;
  fixed?: 'left' | 'right';
}

const UnalignedPanel: React.FC<{ data: OperationOptions | undefined }> = (props) => {
  const { data } = props;
  const [urReadColumns, setUrReadColumns] = useState<ColumnProps[]>([]);
  const [urReadDataSource, setUrReadDataSource] = useState<any[]>([]);
  const [urWriteColumns, setUrWriteColumns] = useState<ColumnProps[]>([]);
  const [urWriteDataSource, setUrWriteDataSource] = useState<any[]>([]);

  const handleData = (_data: any) => {};

  useEffect(() => {
    // 2021-10-18_16:51:50: {read: {…}, write: {…}}
    // 2021-10-18_16:52:40: {read: {…}, write: {…}}
    // 2021-10-18_16:53:30: {read: {…}, write: {…}}
    // 2021-10-18_16:54:20: {read: {…}, write: {…}}
    // 2021-10-18_16:55:10: {read: {…}, write: {…}}
    // 2021-10-18_16:56:00: {read: {…}, write: {…}}
    // 2021-10-18_16:56:50: {read: {…}, write: {…}}
    // 2021-10-18_16:57:40: {read: {…}, write: {…}}
    console.log('--- UR ---', data);
    if (isEmptyObject(data)) {
      return;
    }
    const readColumns: ColumnProps[] = [];
    const readDataSource: any[] = [];
    const writeColumns: ColumnProps[] = [];
    const writeDataSource: any[] = [];
    
    const keys = Object.keys(data!);
    const readData = keys.map((key) => data!.[key].read);

    setUrReadColumns(readColumns);
    setUrReadDataSource(readDataSource);
    setUrWriteColumns(writeColumns);
    setUrWriteDataSource(writeDataSource);
  }, [data]);

  return (
    <div className="io-container-item">
      <Panel title="非对齐读操作统计">
        <Table
          dataSource={urReadDataSource}
          columns={urReadColumns}
          size="small"
          pagination={{
            hideOnSinglePage: true
          }}
          locale={{
            emptyText: <Empty description="暂无数据" />
          }}
        />
      </Panel>
      <Panel title="非对齐写操作统计">
        <Table
          dataSource={urWriteDataSource}
          columns={urWriteColumns}
          size="small"
          pagination={{
            hideOnSinglePage: true
          }}
          locale={{
            emptyText: <Empty description="暂无数据" />
          }}
        />
      </Panel>
    </div>
  );
};

export default UnalignedPanel;
