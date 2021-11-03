import React, { useState, useEffect } from 'react';
import { Table, Empty } from 'antd';
import Panel from '@/components/panel';
import ScatterChart from '@/components/charts/scatter';
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
  dataIndex?: string;
  children?: ColumnProps[];
  fixed?: 'left' | 'right';
}
interface OverlapProps {
  [key: string]: {
    'read': {
      [key: string]: [[number, number], number][]
    }
  }
}
const aa: OverlapProps = {
  '2020-11-02_12:12:12': {
    'read': {
      'file_name_1':[
        [[0, 1024], 20],
        [[2048, 1024], 100]
      ],
      'file_name_2':[
        [[128, 1024], 77]
      ]
    }
  },
  '2020-11-03_12:12:12': {
    'read': {
      'file_name_3':[
        [[256, 10240], 30],
        [[2048, 1024], 110]
      ]
    }
  }
};

const OverlapPanel: React.FC<{ data: OverlapProps | undefined }> = (props) => {
  const { data } = props;
  const [overlapSeries, setOverlapSeries] = useState<any>([]);
  const [overlapAxis, setOverlapAxis] = useState<any[]>([]);
  const [overlapTitle, setOverlapTitle] = useState<any[]>([]);
  const [overlapColumns, setOverlapColumns] = useState<any[]>([]);
  const [overlapDataSource, setOverlapDataSource] = useState<any[]>([]);

  useEffect(() => {
    // if (isEmptyObject(data)) {
    //   return;
    // }
    const columns: ColumnProps[] = [{
      key: 'name',
      title: 'File Name',
      dataIndex: 'name'
    }];
    const dataSource: any[] = [];
    const title: any = [];
    const singleAxis: any = [];
    const series: any = [];

    const keys = Object.keys(aa);
    keys.forEach((key) => {
      const files = Object.keys(aa[key].read);
      files.forEach((filename, idx) => {
        const dataItem: any = { name: filename };
        title.push({
          textBaseline: 'middle',
          top: ((title.length + 2) * 100) / (files.length + 1) + '%',
          text: filename
        });
        aa[key]['read'][filename].forEach((item) => {
          const title = `[${item[0].join(', ')}]`;
          let existItem = columns.find((v) => v.title === title);
          if (!existItem) {
            columns.push({
              key: `${key}__${title}`,
              title: title,
              children: [
                { key: `${title}_offset`, title: 'Offset', dataIndex: `${title}_offset` },
                { key: `${title}_length`, title: 'Length', dataIndex: `${title}_length` },
                { key: `${title}_count`, title: 'Count', dataIndex: `${title}_count` },
              ]
            });
          }
          dataItem[`${title}_offset`] = item[0][0];
          dataItem[`${title}_length`] = item[0][1];
          dataItem[`${title}_count`] = item[1];
        });
        dataSource.push(dataItem);
      });
    });

    title.forEach((item: any, idx: number) => {
      const axisItem = {
        left: 200,
        type: 'category',
        boundaryGap: false,
        data: [],
        top: (idx * 100) / (title.length + 1) + 8 + '%',
        height: 100 / (title.length + 1) - 5 + '%'
      };
      const seriesItem = {
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: [],
        symbolSize: function (dataItem: number[]) {
          return dataItem[1];
        }
      };
      // File Name 不参与计算，所以使用slice避开
      columns.slice(1).forEach((c, i) => {
        const date = (c.key as string).split('__')[0];
        const files = aa[date]['read'][item.text];
        const file = files && files.find((f) => {
          const title = `[${f[0].join(', ')}]`;
          return c.title === title;
        });
        (axisItem.data as string[]).push(c.title);
        (seriesItem.data as [number, number][]).push([i, file ? file[1] : 0]);
      });
      singleAxis.push(axisItem);
      series.push(seriesItem);
    });

    setOverlapTitle(title);
    setOverlapAxis(singleAxis);
    setOverlapSeries(series);
    setOverlapColumns(columns);
    setOverlapDataSource(dataSource);
  }, [data]);

  return (
    <div className="io-container-item">
      <Panel title="重叠读分析（图表）">
        <ScatterChart title={overlapTitle} axis={overlapAxis} data={overlapSeries} />
      </Panel>
      <Panel title="重叠读分析（数据）">
        <Table
          columns={overlapColumns}
          dataSource={overlapDataSource}
          size="small"
          bordered
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

export default OverlapPanel;
