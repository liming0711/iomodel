import React, { useState, useEffect } from 'react';
import { Table, Modal, Empty, List } from 'antd';
import Panel from '@/components/panel';
import BarChart from '@/components/charts/bar';
import { isEmptyObject } from '@/utils/tools';

interface ParabufferProps {
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

const IOContent: React.FC<ParabufferProps> = (props) => {
  const { pb } = props;
  const [barSeries, setBarSeries] = useState<CommonDataProps[]>([]);
  const [parabufferColumns, setParabufferColumns] = useState<any>({});
  const [parabufferDataSource, setParabufferDataSource] = useState<any>({});
  const [parabufferTimes, setParabufferTimes] = useState<string[]>([]);
  const [parabufferCurrent, setParabufferCurrent] = useState<string>('');
  const [parabufferFileDataSource, setParabufferFileDataSource] = useState<any>([]);
  const [parabufferVisible, setParabufferVisible] = useState<boolean>(false);

  useEffect(() => {
    console.log('--- pb ---', pb);
    if (isEmptyObject(pb)) {
      return;
    }
    const keys = Object.keys(pb);
    const columnsGroup: any = {};
    const dataSourceGroup: any = {};
    const pbFilenames: any = [];
    
    keys.forEach((key) => {
      const column: any[] = [];
      const data: any = [];
      pbFilenames.push({
        time: key,
        filename: isEmptyObject(pb[key]) ? '无' : Object.keys(pb[key]).join(', ')
      });
      Object.keys(pb[key]).forEach((filename) => {
        column.push({
          title: filename,
          children: [
            { title: 'Host', dataIndex: `host_${filename}`, key: `host_${filename}` },
            { title: 'Offset', dataIndex: `offset_${filename}`, key: `offset_${filename}` },
            { title: 'Length', dataIndex: `length_${filename}`, key: `length_${filename}` },
            { title: 'Size', dataIndex: `size_${filename}`, key: `size_${filename}` }
          ]
        });
        pb[key][filename].forEach((item: any, index: number) => {
          if (data[index]) {
            data[index][`host_${filename}`] = item[3];
            data[index][`offset_${filename}`] = item[0];
            data[index][`length_${filename}`] = item[1];
            data[index][`size_${filename}`] = item[2];
          } else {
            data.push({
              [`host_${filename}`]: item[3],
              [`offset_${filename}`]: item[0],
              [`length_${filename}`]: item[1],
              [`size_${filename}`]: item[2]
            });
          }
        })
      });
      columnsGroup[key] = column;
      dataSourceGroup[key] = data;
    });
    console.log('--- columnsGroup ---', columnsGroup, dataSourceGroup);
    setParabufferTimes(keys);
    setParabufferCurrent(keys[0]);
    setParabufferColumns(columnsGroup);
    setParabufferDataSource(dataSourceGroup);
    setParabufferFileDataSource(pbFilenames);
  }, [pb]);

  const onParabufferTimeClick = (value: string) => {
    console.log(value);
    setParabufferCurrent(value);
  };

  const onParabufferRowClick = (record: any) => {
    console.log('--- onParabufferRowClick ---', record);
    setParabufferVisible(true);
  };

  return (
    <>
      <div className="io-container-item">
        <Panel title="符合统计-ParaBuffer模式文件 (数据)" wrapClassName="parabuffer-wrapper">
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
                emptyText: <Empty description="暂无数据" />
              }}
            />
          </div>
        </Panel>
        <Panel title="符合条件的文件">
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
              emptyText: <Empty description="暂无数据" />
            }}
          />
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
    </>
  );
};

export default IOContent;
