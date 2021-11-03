import React, { useState, useEffect } from 'react';
import { Table, Empty } from 'antd';
import Panel from '@/components/panel';
import PieChart from '@/components/charts/pie';
import BarChart from '@/components/charts/bar';
import LineChart from '@/components/charts/line';
import { ReadWriteResult } from './index';
import { OperationOptions, ProjectInfoOptions } from '@/requests';

interface IOContentProps {
  info: ProjectInfoOptions[] | undefined;
  rw: ReadWriteResult | undefined;
  op: OperationOptions | undefined;
  pb: OperationOptions | undefined;
}

interface PieDataProps {
  name: string;
  value: number;
  [key: string]: number | string;
}
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

const ReadWriteType = {
  'SEQ,R': '顺序读',
  'SEQ,W': '顺序写',
  'RND,R': '随机读',
  'RND,W': '随机写'
};

const summaryColumns = [
  { key: 'project', title: 'Project', dataIndex: 'project' },
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
  { key: 'start_time', title: 'Create Time', dataIndex: 'start_time' }
];
const proportionColumns = [
  { key: 'SEQ,R', title: '顺序,读', dataIndex: 'SEQ,R' },
  { key: 'SEQ,W', title: '顺序,写', dataIndex: 'SEQ,W' },
  { key: 'RND,R', title: '随机,读', dataIndex: 'RND,R' },
  { key: 'RND,W', title: '随机,写', dataIndex: 'RND,W' }
];

const aa = [
  {
    title: 'Company',
    children: [
      {
        title: 'Host',
        dataIndex: 'host',
        key: 'host'
      },
      {
        title: 'Offset',
        dataIndex: 'offset',
        key: 'offset'
      },
      {
        title: 'Length',
        dataIndex: 'length',
        key: 'length'
      },
      {
        title: 'Size',
        dataIndex: 'size',
        key: 'size'
      }
    ]
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    // fixed: 'right'
  }
];
const bb = [
  { host: 'computer1', offset: 23, length: 11, size: '32MB', time: '2021-09-23_15:44:30' },
  { host: 'computer2', offset: 23, length: 11, size: '32MB', time: '2021-09-23_15:44:30' },
  { host: 'computer3', offset: 23, length: 11, size: '32MB', time: '2021-09-23_15:44:30' },
  { host: 'computer4', offset: 23, length: 11, size: '32MB', time: '2021-09-23_15:44:30' },
  { host: 'computer5', offset: 23, length: 11, size: '32MB', time: '2021-09-23_15:44:30' },
  { host: 'computer6', offset: 23, length: 11, size: '32MB', time: '2021-09-23_15:44:30' }
];

const IOContent: React.FC<IOContentProps> = (props) => {
  const { info = [], rw, op, pb } = props;
  const [pieData, setPieData] = useState<PieDataProps[]>([]);
  const [barSeries, setBarSeries] = useState<CommonDataProps[]>([]);
  const [rwSeries, setRwSeries] = useState<CommonDataProps[]>([]);
  const [rwCategories, setRwCategories] = useState<string[]>([]);
  const [opSeries, setOpSeries] = useState<CommonDataProps[]>([]);
  const [fileSeries, setFileSeries] = useState<CommonDataProps[]>([]);
  const [opCategories, setOpCategories] = useState<string[]>([]);
  const [readWriteColumns, setReadWriteColumns] = useState<ColumnProps[]>([]);
  const [operationColumns, setOperationColumns] = useState<ColumnProps[]>([]);
  const [fileColumns, setFileColumns] = useState<ColumnProps[]>([]);
  const [proportionDataSource, setProportionDataSource] = useState<any[]>([]);
  const [readWriteDataSource, setReadWriteDataSource] = useState<any[]>([]);
  const [operationDataSource, setOperationDataSource] = useState<any[]>([]);
  const [fileDataSource, setFileDataSource] = useState<any[]>([]);

  useEffect(() => {
    const _pieData: PieDataProps[] = [];
    const _barData: CommonDataProps[] = [];
    const _rwData: CommonDataProps[] = [];
    const _rwColumns: any[] = [];
    const _rwDataSource: any[] = [];
    const { total_count = {}, op_data = [], times = [] } = (rw ?? {});
    Object.keys(total_count).forEach((item) => {
      const name = ReadWriteType[item as keyof typeof ReadWriteType];
      _pieData.push({
        name,
        value: total_count[item],
        key: item,
        [item]: total_count[item]
      });
      _barData.push({ name, data: [total_count[item]], type: 'bar' })
    });

    op_data.forEach((item) => {
      _rwData.push({
        name: item[0],
        type: 'line',
        data: item[1]
      });
      _rwColumns.push({
        key: item[0],
        title: item[0],
        dataIndex: item[0]
      });
    });
    times.forEach((item, index) => {
      const dataItem: { [key: string]: number | string } = {
        key: index,
        time: item
      };
      _rwColumns.forEach((c, i) => {
        dataItem[c.dataIndex] = op_data[i][1][index];
      });
      _rwDataSource.push(dataItem);
    });
    _rwColumns.push({
      key: 'time',
      title: 'Time',
      dataIndex: 'time'
    });

    setPieData(_pieData);
    setBarSeries(_barData);
    setRwSeries(_rwData);
    setRwCategories(times);
    setReadWriteColumns(_rwColumns);
    setReadWriteDataSource(_rwDataSource);
    setProportionDataSource([total_count]);
  }, [rw]);

  useEffect(() => {
    const _opData: CommonDataProps[] = [];
    const _fileData: CommonDataProps[] = [];
    const _opColumns: ColumnProps[] = [];
    const _opDataSource: any[] = [];
    const _fileColumns: ColumnProps[] = [];
    const _fileDataSource: any[] = [];
    const { op_data = [], topn_file_ops_data = [], times = [] } = (op ?? {});
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

    setOpSeries(_opData);
    setFileSeries(_fileData);
    setOpCategories(times);
    setOperationColumns(_opColumns);
    setOperationDataSource(_opDataSource);
    setFileColumns(_fileColumns);
    setFileDataSource(_fileDataSource);
  }, [op]);

  useEffect(() => {
    console.log('--- pb ---', pb);
  }, [pb]);

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
            locale={{
              emptyText: <Empty description="暂无数据" />
            }}
          />
        </div>
      </Panel>
      <div className="io-container-item">
        <Panel title="总读写比例（图表）">
          <div className="total-chart-wrapper">
            <PieChart data={pieData} />
            <BarChart series={barSeries} categories={['Total']} />
          </div>
        </Panel>
        <Panel title="总读写比例（数据）">
          <Table
            dataSource={proportionDataSource}
            columns={proportionColumns}
            size="small"
            pagination={false}
            locale={{
              emptyText: <Empty description="暂无数据" />
            }}
          />
        </Panel>
      </div>
      <div className="io-container-item">
        <Panel
          title="读写分布 Top10（图表）"
          subtitle={rwSeries.length !== 0 ? '缩写注释：RND - 随机， R - 读， W - 写' : ''}
        >
          <LineChart series={rwSeries} categories={rwCategories} />
        </Panel>
        <Panel title="读写分布 Top10（数据）">
          <Table
            dataSource={readWriteDataSource}
            columns={readWriteColumns}
            size="small"
            locale={{
              emptyText: <Empty description="暂无数据" />
            }}
          />
        </Panel>
      </div>
      <div className="io-container-item">
        <Panel title="操作类型次数统计 Top10（图表）">
          <LineChart series={opSeries} categories={opCategories} />
        </Panel>
        <Panel title="操作类型次数统计 Top10（数据）">
          <Table
            dataSource={operationDataSource}
            columns={operationColumns}
            size="small"
            locale={{
              emptyText: <Empty description="暂无数据" />
            }}
          />
        </Panel>
      </div>
      <div className="io-container-item">
        <Panel title="文件操作次数统计 Top10（图表）">
          <LineChart series={fileSeries} categories={opCategories} options={{ grid: { bottom: 72 } }} />
        </Panel>
        <Panel title="文件操作次数统计 Top10（数据）">
          <Table
            dataSource={fileDataSource}
            columns={fileColumns}
            size="small"
            locale={{
              emptyText: <Empty description="暂无数据" />
            }}
          />
        </Panel>
      </div>
      <div className="io-container-item">
        <Panel title="文件操作次数统计 Top10（数据）">
          <Table
            dataSource={bb}
            columns={aa}
            size="small"
            locale={{
              emptyText: <Empty description="暂无数据" />
            }}
          />
        </Panel>
      </div>
    </div>
  );
};

export default IOContent;
