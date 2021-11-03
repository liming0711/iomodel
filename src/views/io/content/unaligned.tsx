import React, { useState, useEffect } from 'react';
import { Table, Empty } from 'antd';
import Panel from '@/components/panel';
import { isEmptyObject } from '@/utils/tools';

interface UnalignedItemProps {
  [key: string]: number;
}
interface UnalignedProps {
  read: UnalignedItemProps;
  write: UnalignedItemProps;
}

const MAX = 50;

const columns = [{
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

const UnalignedPanel: React.FC<{ data: { [key: string]: UnalignedProps } | undefined }> = (props) => {
  const { data } = props;
  const [urReadDataSource, setUrReadDataSource] = useState<any[]>([]);
  const [urWriteDataSource, setUrWriteDataSource] = useState<any[]>([]);

  const handleData = (_data: UnalignedItemProps[]) => {
    const dataArray: any = [];
    _data.forEach((item) => {
      Object.keys(item).forEach((k) => {
        const paths = k.split(',');
        dataArray.push({
          name: paths[0],
          offset: paths[1],
          length: paths[2],
          count: item[k]
        });
      });
    });
    dataArray.sort((a: any, b: any) => b.count - a.count);
    return dataArray.slice(0, MAX);
  };

  useEffect(() => {
    if (isEmptyObject(data)) {
      return;
    }
    
    const keys = Object.keys(data!);
    const readData = keys.map((key) => data![key].read);
    const writeData = keys.map((key) => data![key].write);

    setUrReadDataSource(handleData(readData));
    setUrWriteDataSource(handleData(writeData));
  }, [data]);

  return (
    <div className="io-container-item">
      <Panel title="非对齐读操作统计">
        <Table
          dataSource={urReadDataSource}
          columns={columns}
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
          columns={columns}
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
