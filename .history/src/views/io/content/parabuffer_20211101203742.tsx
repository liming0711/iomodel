import React, { useState, useEffect } from 'react';
import { Table, Modal, Empty, List } from 'antd';
import Panel from '@/components/panel';
import BarChart from '@/components/charts/bar';
import { isEmptyObject } from '@/utils/tools';

interface ParabufferProps {
  data: any | undefined;
}

interface CommonDataProps {
  name: string;
  data: number[];
  type: 'bar' | 'line';
}

const aa = [
  { name: 'offset1', type: 'bar', barGap: 0, stack: 'host1', data: [123, 132] },
  { name: 'length1', type: 'bar', barGap: 0, stack: 'host1', data: [220, 182] },
  { name: 'offset2', type: 'bar', barGap: 0, stack: 'host1', data: [150, 232] },
  { name: 'length2', type: 'bar', barGap: 0, stack: 'host1', data: [54, 64] },
  { name: 'offset3', type: 'bar', barGap: 0, stack: 'host2', data: [620, 732] },
  { name: 'length3', type: 'bar', barGap: 0, stack: 'host2', data: [120, 132] },
  { name: 'offset4', type: 'bar', barGap: 0, stack: 'host2', data: [60, 72] },
  { name: 'length4', type: 'bar', barGap: 0, stack: 'host2', data: [62, 82] }
];

const ParabufferPanel: React.FC<ParabufferProps> = (props) => {
  const { data } = props;
  const [barCategories, setBarCategories] = useState<string[]>([]);
  const [barSeries, setBarSeries] = useState<any[]>(aa);
  const [parabufferColumns, setParabufferColumns] = useState<any>({});
  const [parabufferDataSource, setParabufferDataSource] = useState<any>({});
  const [parabufferTimes, setParabufferTimes] = useState<string[]>([]);
  const [parabufferCurrent, setParabufferCurrent] = useState<string>('');
  const [parabufferFileDataSource, setParabufferFileDataSource] = useState<any>([]);
  const [parabufferVisible, setParabufferVisible] = useState<boolean>(false);

  useEffect(() => {
    console.log('--- data ---', data);
    if (isEmptyObject(data)) {
      return;
    }
    const keys = Object.keys(data);
    const columnsGroup: any = {};
    const dataSourceGroup: any = {};
    const pbFilenames: any = [];
    
    keys.forEach((key) => {
      const columnItem: any[] = [];
      const dataItem: any = [];
      pbFilenames.push({
        time: key,
        filename: isEmptyObject(data[key]) ? '???' : Object.keys(data[key]).join(', ')
      });
      Object.keys(data[key]).forEach((filename) => {
        columnItem.push({
          title: filename,
          children: [
            { title: 'Host', dataIndex: `host_${filename}`, key: `host_${filename}` },
            { title: 'Offset', dataIndex: `offset_${filename}`, key: `offset_${filename}` },
            { title: 'Length', dataIndex: `length_${filename}`, key: `length_${filename}` },
            { title: 'Size', dataIndex: `size_${filename}`, key: `size_${filename}` }
          ]
        });
        data[key][filename].forEach((item: any, index: number) => {
          if (dataItem[index]) {
            dataItem[index][`host_${filename}`] = item[3];
            dataItem[index][`offset_${filename}`] = item[0];
            dataItem[index][`length_${filename}`] = item[1];
            dataItem[index][`size_${filename}`] = item[2];
          } else {
            dataItem.push({
              [`host_${filename}`]: item[3],
              [`offset_${filename}`]: item[0],
              [`length_${filename}`]: item[1],
              [`size_${filename}`]: item[2]
            });
          }
        })
      });
      columnsGroup[key] = columnItem;
      dataSourceGroup[key] = dataItem;
    });
    console.log('--- columnsGroup ---', columnsGroup, dataSourceGroup);
    setParabufferTimes(keys);
    setParabufferCurrent(keys[0]);
    setParabufferColumns(columnsGroup);
    setParabufferDataSource(dataSourceGroup);
    setParabufferFileDataSource(pbFilenames);
  }, [data]);

  const onParabufferTimeClick = (value: string) => {
    console.log(value);
    setParabufferCurrent(value);
  };

  const onParabufferRowClick = (record: any) => {
    console.log('--- onParabufferRowClick ---', record, parabufferCurrent, data[parabufferCurrent]);
    // const aa = [
    //   { name: 'offset1', type: 'bar', barGap: 0, stack: 'host1', data: [123, 132] },
    //   { name: 'length1', type: 'bar', barGap: 0, stack: 'host1', data: [220, 182] },
    //   { name: 'offset2', type: 'bar', barGap: 0, stack: 'host1', data: [150, 232] },
    //   { name: 'length2', type: 'bar', barGap: 0, stack: 'host1', data: [54, 64] },
    //   { name: 'offset3', type: 'bar', barGap: 0, stack: 'host2', data: [620, 732] },
    //   { name: 'length3', type: 'bar', barGap: 0, stack: 'host2', data: [120, 132] },
    //   { name: 'offset4', type: 'bar', barGap: 0, stack: 'host2', data: [60, 72] },
    //   { name: 'length4', type: 'bar', barGap: 0, stack: 'host2', data: [62, 82] }
    // ];
    const dataItem = data[parabufferCurrent];
    const keys = Object.keys(dataItem);
    setBarCategories(keys);
    keys.forEach((key) => {
      dataItem[key].forEach();
    });
    setParabufferVisible(true);
  };

  return (
    <>
      <div className="io-container-item">
        <Panel title="????????????-ParaBuffer???????????? (??????)" wrapClassName="parabuffer-wrapper">
          <div className="parabuffer-time">
            <List
              size="small"
              header={<div>Time</div>}
              footer={null}
              bordered
              dataSource={parabufferTimes}
              pagination={false}
              className="parabuffer-time-list"
              renderItem={item => (
                <List.Item
                  className="parabuffer-time-item"
                  onClick={() => onParabufferTimeClick(item)}
                >
                  {item}
                </List.Item>
              )}
            />
          </div>
          <div className="parabuffer-content">
            <Table
              dataSource={parabufferDataSource[parabufferCurrent]}
              columns={parabufferColumns[parabufferCurrent]}
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
                emptyText: <Empty description="????????????" />
              }}
            />
          </div>
        </Panel>
        <Panel title="?????????????????????">
          <Table
            dataSource={parabufferFileDataSource}
            columns={[{
              key: 'name',
              title: 'Name',
              dataIndex: 'filename'
            }, {
              key: 'time',
              title: 'Time',
              dataIndex: 'time'
            }]}
            size="small"
            pagination={{
              hideOnSinglePage: true
            }}
            locale={{
              emptyText: <Empty description="????????????" />
            }}
          />
        </Panel>
      </div>
      <Modal
        title={<span>???????????????</span>}
        visible={parabufferVisible}
        onCancel={() => setParabufferVisible(false)}
        footer={null}
        centered
        width="80%"
        wrapClassName="parabuffer-modal"
      >
        <BarChart type="column" series={barSeries} categories={
          ['Mon', 'Tue']
        } />
      </Modal>
    </>
  );
};

export default ParabufferPanel;
