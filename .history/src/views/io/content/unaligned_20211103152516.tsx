import React, { useState, useEffect } from 'react';
import { Table, Empty } from 'antd';
import Panel from '@/components/panel';
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
interface UnalignedItemProps {
  read: { [key: string]: number };
  write: { [key: string]: number };
}

const aa = [{
  key: 'name',
  title: 'File Name',
  dataIndex: 'name'
}, {
  key: 'offset',
  title: 'Offset',
  dataIndex: 'offset'
}, {
  key: 'length',
  title: 'Length',
  dataIndex: 'length'
}, {
  key: 'count',
  title: 'Count',
  dataIndex: 'count'
}];
const bb = [{
  name: 'hahahahahaha',
  offset: 12345,
  length: 128,
  count: 12
}, {
  name: 'hahahahahaha2',
  offset: 12346,
  length: 128,
  count: 12
}, {
  name: 'hahahahahaha3',
  offset: 12347,
  length: 128,
  count: 12
}, {
  name: 'hahahahahaha4',
  offset: 12348,
  length: 128,
  count: 12
}];

const UnalignedPanel: React.FC<{ data: { [key: string]: UnalignedItemProps } | undefined }> = (props) => {
  const { data } = props;
  const [urReadColumns, setUrReadColumns] = useState<ColumnProps[]>(aa);
  const [urReadDataSource, setUrReadDataSource] = useState<any[]>(bb);
  const [urWriteColumns, setUrWriteColumns] = useState<ColumnProps[]>([]);
  const [urWriteDataSource, setUrWriteDataSource] = useState<any[]>([]);

  const handleData = (_data: any) => {
    // _data.forEach();
  };

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
    const readData = keys.map((key) => data![key].read);
    const writeData = keys.map((key) => data![key].write);
    handleData(readData);
    handleData(writeData);

    // setUrReadColumns(readColumns);
    // setUrReadDataSource(readDataSource);
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
