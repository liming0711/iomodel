import React, { useState, useEffect } from 'react';
import { Table, Modal, Empty, List } from 'antd';
import Panel from '@/components/panel';
import PieChart from '@/components/charts/pie';
import BarChart from '@/components/charts/bar';
import LineChart from '@/components/charts/line';
import { ReadWriteResult } from './index';
import { OperationOptions, ProjectInfoOptions } from '@/requests';
import { isEmptyObject } from '@/utils/tools';

interface IOContentProps {
  info: ProjectInfoOptions[] | undefined;
  rw: ReadWriteResult | undefined;
  op: OperationOptions | undefined;
  pb: any | undefined;
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
const proportionColumns = [
  { key: 'SEQ,R', title: '顺序,读', dataIndex: 'SEQ,R' },
  { key: 'SEQ,W', title: '顺序,写', dataIndex: 'SEQ,W' },
  { key: 'RND,R', title: '随机,读', dataIndex: 'RND,R' },
  { key: 'RND,W', title: '随机,写', dataIndex: 'RND,W' }
];

const aa = [
  {
    title: 'file_1',
    children: [
      { title: 'Host', dataIndex: 'host1', key: 'host1' },
      { title: 'Offset', dataIndex: 'offset1', key: 'offset1' },
      { title: 'Length', dataIndex: 'length1', key: 'length1' },
      { title: 'Size', dataIndex: 'size1', key: 'size1' }
    ]
  },
  {
    title: 'file_2',
    children: [
      { title: 'Host', dataIndex: 'host2', key: 'host2' },
      { title: 'Offset', dataIndex: 'offset2', key: 'offset2' },
      { title: 'Length', dataIndex: 'length2', key: 'length2' },
      { title: 'Size', dataIndex: 'size2', key: 'size2' }
    ]
  },
  {
    title: 'file_3',
    children: [
      { title: 'Host', dataIndex: 'host3', key: 'host3' },
      { title: 'Offset', dataIndex: 'offset3', key: 'offset3' },
      { title: 'Length', dataIndex: 'length3', key: 'length3' },
      { title: 'Size', dataIndex: 'size3', key: 'size3' }
    ]
  },
  {
    title: 'file_4',
    children: [
      { title: 'Host', dataIndex: 'host4', key: 'host4' },
      { title: 'Offset', dataIndex: 'offset4', key: 'offset4' },
      { title: 'Length', dataIndex: 'length4', key: 'length4' },
      { title: 'Size', dataIndex: 'size4', key: 'size4' }
    ]
  },
  {
    title: 'file_5',
    children: [
      { title: 'Host', dataIndex: 'host5', key: 'host5' },
      { title: 'Offset', dataIndex: 'offset5', key: 'offset5' },
      { title: 'Length', dataIndex: 'length5', key: 'length5' },
      { title: 'Size', dataIndex: 'size5', key: 'size5' }
    ]
  }
];
const bb = [
  { key: 'haha1', host1: 'computer1', offset1: 23, length1: 11, size1: '32MB', host2: 'computer1', offset2: 23, length2: 11, size2: '32MB', host3: 'computer1', offset3: 23, length3: 11, size3: '32MB', host4: 'computer1', offset4: 23, length4: 11, size4: '32MB', host5: 'computer1', offset5: 23, length5: 11, size5: '32MB' },
  { key: 'haha2', host1: 'computer2', offset1: 23, length1: 11, size1: '32MB', host2: 'computer2', offset2: 23, length2: 11, size2: '32MB', host3: 'computer2', offset3: 23, length3: 11, size3: '32MB', host4: 'computer2', offset4: 23, length4: 11, size4: '32MB', host5: 'computer2', offset5: 23, length5: 11, size5: '32MB' },
  { key: 'haha3', host1: 'computer3', offset1: 23, length1: 11, size1: '32MB', host2: 'computer3', offset2: 23, length2: 11, size2: '32MB', host3: 'computer3', offset3: 23, length3: 11, size3: '32MB', host4: 'computer3', offset4: 23, length4: 11, size4: '32MB', host5: 'computer3', offset5: 23, length5: 11, size5: '32MB' },
  { key: 'haha4', host1: 'computer4', offset1: 23, length1: 11, size1: '32MB', host2: 'computer4', offset2: 23, length2: 11, size2: '32MB', host3: 'computer4', offset3: 23, length3: 11, size3: '32MB', host4: 'computer4', offset4: 23, length4: 11, size4: '32MB', host5: 'computer4', offset5: 23, length5: 11, size5: '32MB' },
  { key: 'haha5', host1: 'computer5', offset1: 23, length1: 11, size1: '32MB', host2: 'computer5', offset2: 23, length2: 11, size2: '32MB', host3: 'computer5', offset3: 23, length3: 11, size3: '32MB', host4: 'computer5', offset4: 23, length4: 11, size4: '32MB', host5: 'computer5', offset5: 23, length5: 11, size5: '32MB' },
  { key: 'haha6', host1: 'computer6', offset1: 23, length1: 11, size1: '32MB', host2: 'computer6', offset2: 23, length2: 11, size2: '32MB', host3: 'computer6', offset3: 23, length3: 11, size3: '32MB', host4: 'computer6', offset4: 23, length4: 11, size4: '32MB', host5: 'computer6', offset5: 23, length5: 11, size5: '32MB' }
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
  const [parabufferColumns, setParabufferColumns] = useState<any>({});
  const [proportionDataSource, setProportionDataSource] = useState<any[]>([]);
  const [readWriteDataSource, setReadWriteDataSource] = useState<any[]>([]);
  const [operationDataSource, setOperationDataSource] = useState<any[]>([]);
  const [fileDataSource, setFileDataSource] = useState<any[]>([]);
  const [parabufferDataSource, setParabufferDataSource] = useState<any>({});
  const [parabufferTimes, setParabufferTimes] = useState<string[]>([]);
  const [parabufferCurrent, setParabufferCurrent] = useState<string>('');
  const [parabufferFileDataSource, setParabufferFileDataSource] = useState<any>([]);
  const [parabufferVisible, setParabufferVisible] = useState<boolean>(false);

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
    setProportionDataSource([total_count]); // TODO 这个表格有问题，总是报错没有 key
  }, [rw]);

  return (
    <>
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
          subtitle={rwSeries.length !== 0 ? <div className="read-write-desc">缩写注释：RND - 随机， R - 读， W - 写</div> : null}
        >
          <LineChart series={rwSeries} categories={rwCategories} />
        </Panel>
        <Panel title="读写分布 Top10（数据）">
          <Table
            dataSource={readWriteDataSource}
            columns={readWriteColumns}
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
    </>
  );
};

export default IOContent;
