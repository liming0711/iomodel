import React, { useState, useEffect } from 'react';
import { Table, Modal, Empty, List } from 'antd';
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
  const [parabufferColumns, setParabufferColumns] = useState<ColumnProps[]>([]);
  const [proportionDataSource, setProportionDataSource] = useState<any[]>([]);
  const [readWriteDataSource, setReadWriteDataSource] = useState<any[]>([]);
  const [operationDataSource, setOperationDataSource] = useState<any[]>([]);
  const [fileDataSource, setFileDataSource] = useState<any[]>([]);
  const [parabufferDataSource, setParabufferDataSource] = useState<any[]>([]);
  const [parabufferTimes, setParabufferTimes] = useState<string[]>([]);
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
    // setParabufferColumns
    // const aa = [
    //   {
    //     title: 'file_1',
    //     children: [
    //       { title: 'Host', dataIndex: 'host1', key: 'host1' },
    //       { title: 'Offset', dataIndex: 'offset1', key: 'offset1' },
    //       { title: 'Length', dataIndex: 'length1', key: 'length1' },
    //       { title: 'Size', dataIndex: 'size1', key: 'size1' }
    //     ]
    //   }
      // {
      //   title: 'Time',
      //   dataIndex: 'time',
      //   key: 'time',
      //   // fixed: 'right'
      // }
    // ];
    // const bb = [
    //   { host1: 'computer1', offset1: 23, length1: 11, size1: '32MB', host2: 'computer1', offset2: 23, length2: 11, size2: '32MB', host3: 'computer1', offset3: 23, length3: 11, size3: '32MB', host4: 'computer1', offset4: 23, length4: 11, size4: '32MB', host5: 'computer1', offset5: 23, length5: 11, size5: '32MB', time: '2021-09-23_15:44:30' },
    //   { host1: 'computer2', offset1: 23, length1: 11, size1: '32MB', host2: 'computer2', offset2: 23, length2: 11, size2: '32MB', host3: 'computer2', offset3: 23, length3: 11, size3: '32MB', host4: 'computer2', offset4: 23, length4: 11, size4: '32MB', host5: 'computer2', offset5: 23, length5: 11, size5: '32MB', time: '2021-09-23_15:44:30' },
    //   { host1: 'computer3', offset1: 23, length1: 11, size1: '32MB', host2: 'computer3', offset2: 23, length2: 11, size2: '32MB', host3: 'computer3', offset3: 23, length3: 11, size3: '32MB', host4: 'computer3', offset4: 23, length4: 11, size4: '32MB', host5: 'computer3', offset5: 23, length5: 11, size5: '32MB', time: '2021-09-23_15:44:30' },
    //   { host1: 'computer4', offset1: 23, length1: 11, size1: '32MB', host2: 'computer4', offset2: 23, length2: 11, size2: '32MB', host3: 'computer4', offset3: 23, length3: 11, size3: '32MB', host4: 'computer4', offset4: 23, length4: 11, size4: '32MB', host5: 'computer4', offset5: 23, length5: 11, size5: '32MB', time: '2021-09-23_15:44:30' },
    //   { host1: 'computer5', offset1: 23, length1: 11, size1: '32MB', host2: 'computer5', offset2: 23, length2: 11, size2: '32MB', host3: 'computer5', offset3: 23, length3: 11, size3: '32MB', host4: 'computer5', offset4: 23, length4: 11, size4: '32MB', host5: 'computer5', offset5: 23, length5: 11, size5: '32MB', time: '2021-09-23_15:44:30' },
    //   { host1: 'computer6', offset1: 23, length1: 11, size1: '32MB', host2: 'computer6', offset2: 23, length2: 11, size2: '32MB', host3: 'computer6', offset3: 23, length3: 11, size3: '32MB', host4: 'computer6', offset4: 23, length4: 11, size4: '32MB', host5: 'computer6', offset5: 23, length5: 11, size5: '32MB', time: '2021-09-23_15:44:30' }
    // ];

    // const test = {
    //   '2021-09-23_15:43:15': {
    //     grapes_input2017070112_0006: [
    //       [298806164, 298805760, 462783462, 'comput34'],
    //       [597611924, 298805760, 462783462, 'comput35'],
    //       [896417684, 298805760, 462783462, 'comput36'],
    //       [1195223444, 298805760, 462783462, 'comput37'],
    //       [1494029204, 298805760, 462783462, 'comput38'],
    //       [1792834964, 149402880, 462783462, 'comput39'],
    //       [2091640724, 298805760, 462783462, 'comput40'],
    //       [2539849364, 149402880, 462783462, 'comput43'],
    //       [2689252244, 298805760, 462783462, 'comput44'],
    //       [2988058004, 298805760, 462783462, 'comput45'],
    //       [3286863764, 298805760, 462783462, 'comput46'],
    //       [3585669524, 298805760, 462783462, 'comput47'],
    //       [3884475284, 149402880, 462783462, 'comput48']
    //     ],
    //     postvar2017070112_006: [[99532800, 99532800, 462783462, 'comput34'], [199065600, 99532800, 462783462, 'comput35'], [298598400, 99532800, 462783462, 'comput36'], [398131200, 99532800, 462783462, 'comput37'], [497664000, 99532800, 462783462, 'comput38'], [597196800, 99532800, 462783462, 'comput39'], [696729600, 99532800, 462783462, 'comput40'], [796262400, 99532800, 462783462, 'comput43'], [895795200, 99532800, 462783462, 'comput44'], [995328000, 99532800, 462783462, 'comput45'], [1094860800, 99532800, 462783462, 'comput46'], [1194393600, 99532800, 462783462, 'comput47'], [1293926400, 99532800, 462783462, 'comput48'], [1393459200, 99532800, 462783462, 'comput49'], [1492992000, 99532800, 462783462, 'comput50'], [1592524800, 99532800, 462783462, 'comput51'], [1692057600, 99532800, 462783462, 'comput52'], [1791590400, 99532800, 462783462, 'comput53'], [1891123200, 99532800, 462783462, 'comput54'], [1990656000, 99532800, 462783462, 'comput55'], [2090188800, 99532800, 462783462, 'comput56'], [2189721600, 99532800, 462783462, 'comput57'], [2289254400, 99532800, 462783462, 'comput58'], [2388787200, 99532800, 462783462, 'comput59'], [2488320000, 82944000, 462783462, 'comput60'], [2571264000, 66355200, 462783462, 'comput61'], [2637619200, 66355200, 462783462, 'comput62'], [2703974400, 66355200, 462783462, 'comput63'], [2770329600, 66355200, 462783462, 'comput64']]
    //   },
    //   '2021-09-23_15:43:30': {},
    //   '2021-09-23_15:43:45': {}
    // };
    const keys = Object.keys(pb);
    // const columns: any[] = [];
    // const dataSource: any[] = [];
    
    // keys.forEach((key) => {
    //   let dataItem: any = {
    //     time: key
    //   };
    //   Object.keys(pb[key]).forEach((file) => {
    //     pb[key][file].forEach((item: [number, number, number, string], index: number) => {
    //       dataItem[`offset${index}`] = item[0];
    //       dataItem[`length${index}`] = item[0];
    //       dataItem[`size${index}`] = item[0];
    //       dataItem[`host${index}`] = item[3];
    //     })
    //   });
    //   dataSource.push(dataItem);
    // });
    setParabufferTimes(keys);
  }, [pb]);

  const onParabufferRowClick = (record: any) => {
    console.log('--- onParabufferRowClick ---', record);
    setParabufferVisible(true);
  };

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
      <div className="io-container-item">
        <Panel title="操作类型次数统计 Top10（图表）">
          <LineChart series={opSeries} categories={opCategories} />
        </Panel>
        <Panel title="操作类型次数统计 Top10（数据）">
          <Table
            dataSource={operationDataSource}
            columns={operationColumns}
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
      <div className="io-container-item">
        <Panel title="文件操作次数统计 Top10（图表）">
          <LineChart series={fileSeries} categories={opCategories} options={{ grid: { bottom: 72 } }} />
        </Panel>
        <Panel title="文件操作次数统计 Top10（数据）">
          <Table
            dataSource={fileDataSource}
            columns={fileColumns}
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
      <div className="io-container-item">
        <Panel title="符合统计-ParaBuffer模式文件 (数据)" wrapClassName="parabuffer-wrapper">
          <div className="parabuffer-time">
            <List
              size="small"
              header={(
                <div style={{
                  height: '61px',
                  lineHeight: '61px',
                  textAlign: 'center'
                }}>Time</div>
              )}
              footer={null}
              bordered
              dataSource={parabufferTimes}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </div>
          <div className="parabuffer-content">
            <Table
              dataSource={bb}
              columns={aa}
              size="small"
              pagination={{
                hideOnSinglePage: true
              }}
              bordered
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    onParabufferRowClick(record);
                  }
                };
              }}
              locale={{
                emptyText: <Empty description="暂无数据" />
              }}
            />
          </div>
        </Panel>
      </div>
      <Modal
        title={<span>可视化图表</span>}
        visible={parabufferVisible}
        onCancel={() => setParabufferVisible(false)}
        footer={null}
        centered
        width="80%"
        wrapClassName="parabuffer-modal"
      >
        <BarChart type="column" series={barSeries} categories={['Total']} />
      </Modal>
    </div>
  );
};

export default IOContent;
