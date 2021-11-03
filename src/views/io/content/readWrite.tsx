import React, { useState, useEffect } from 'react';
import { Table, Empty } from 'antd';
import Panel from '@/components/panel';
import PieChart from '@/components/charts/pie';
import BarChart from '@/components/charts/bar';
import LineChart from '@/components/charts/line';
import { ReadWriteResult } from '../index';

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

const proportionColumns = [
  { key: 'SEQ,R', title: '顺序,读', dataIndex: 'SEQ,R' },
  { key: 'SEQ,W', title: '顺序,写', dataIndex: 'SEQ,W' },
  { key: 'RND,R', title: '随机,读', dataIndex: 'RND,R' },
  { key: 'RND,W', title: '随机,写', dataIndex: 'RND,W' }
];

const ReadWritePanel: React.FC<{ data: ReadWriteResult | undefined }> = (props) => {
  const { data } = props;
  const [pieData, setPieData] = useState<PieDataProps[]>([]);
  const [barSeries, setBarSeries] = useState<CommonDataProps[]>([]);
  const [rwSeries, setRwSeries] = useState<CommonDataProps[]>([]);
  const [rwCategories, setRwCategories] = useState<string[]>([]);
  const [readWriteColumns, setReadWriteColumns] = useState<ColumnProps[]>([]);
  const [proportionDataSource, setProportionDataSource] = useState<any[]>([]);
  const [readWriteDataSource, setReadWriteDataSource] = useState<any[]>([]);

  useEffect(() => {
    const _pieData: PieDataProps[] = [];
    const _barData: CommonDataProps[] = [];
    const _rwData: CommonDataProps[] = [];
    const _rwColumns: any[] = [];
    const _rwDataSource: any[] = [];
    const { total_count = {}, op_data = [], times = [] } = (data ?? {});
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
  }, [data]);

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

export default ReadWritePanel;
