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
    const _opData: CommonDataProps[] = [];
    const _fileData: CommonDataProps[] = [];
    const _opColumns: ColumnProps[] = [];
    const _opDataSource: any[] = [];
    const _fileColumns: ColumnProps[] = [];
    const _fileDataSource: any[] = [];
    const { op_data = [], topn_file_ops_data = [], times = [] } = (data ?? {});
    op_data.forEach((item) => {
      _opData.push({
        name: item[0],
        type: 'line',
        data: item[1]
      });
      _opColumns.push({
        key: item[0],
        title: item[0],
        dataIndex: item[0]
      });
    });
    topn_file_ops_data.forEach((item) => {
      _fileData.push({
        name: item[0],
        type: 'line',
        data: item[1]
      });
      _fileColumns.push({
        key: item[0],
        title: item[0],
        dataIndex: item[0]
      })
    });

    times.forEach((item, index) => {
      const dataItem1: { [key: string]: number | string } = {
        key: index,
        time: item
      };
      const dataItem2: { [key: string]: number | string } = {
        key: index,
        time: item
      };
      _opColumns.forEach((c, i) => {
        dataItem1[c.dataIndex] = op_data[i][1][index];
      });
      _fileColumns.forEach((c, i) => {
        dataItem2[c.dataIndex] = topn_file_ops_data[i][1][index];
      });
      _opDataSource.push(dataItem1);
      _fileDataSource.push(dataItem2);
    });
    const timeItem = {
      key: 'time',
      title: 'Time',
      dataIndex: 'time'
    };
    _opColumns.push(timeItem);
    _fileColumns.push({
      ...timeItem,
      fixed: 'right'
    });

    setUrReadColumns(_opColumns);
    setUrReadDataSource(_opDataSource);
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
