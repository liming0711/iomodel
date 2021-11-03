import React, { useState, useEffect } from 'react';
import { Table, Empty } from 'antd';
import Panel from '@/components/panel';
import LineChart from '@/components/charts/line';
import ScatterChart from '@/components/charts/scatter';
import { OperationOptions } from '@/requests';

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

const FilePanel: React.FC<{ data: OperationOptions | undefined }> = (props) => {
  const { data } = props;
  const [opSeries, setOpSeries] = useState<CommonDataProps[]>([]);
  const [fileSeries, setFileSeries] = useState<CommonDataProps[]>([]);
  const [opCategories, setOpCategories] = useState<string[]>([]);
  const [operationColumns, setOperationColumns] = useState<ColumnProps[]>([]);
  const [fileColumns, setFileColumns] = useState<ColumnProps[]>([]);
  const [operationDataSource, setOperationDataSource] = useState<any[]>([]);
  const [fileDataSource, setFileDataSource] = useState<any[]>([]);
  const [scatterSeries, setScatterSeries] = useState<any>([]);
  const [scatterAxis, setScatterAxis] = useState<any[]>([]);
  const [scatterTitle, setScatterTitle] = useState<any[]>([]);

  useEffect(() => {
    const _opData: CommonDataProps[] = [];
    const _fileData: CommonDataProps[] = [];
    const _opColumns: ColumnProps[] = [];
    const _opDataSource: any[] = [];
    const _fileColumns: ColumnProps[] = [];
    const _fileDataSource: any[] = [];
    const title: any = [];
    const singleAxis: any = [];
    const series: any = [];
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
    topn_file_ops_data.forEach((item, idx) => {
      _fileData.push({
        name: item[0],
        type: 'line',
        data: item[1]
      });
      _fileColumns.push({
        key: item[0],
        title: item[0],
        dataIndex: item[0]
      });
      if (idx < 10) {
        title.push({
          textBaseline: 'middle',
          top: ((idx + 0.8) * 100) / 10 + '%',
          text: item[0]
        });
        singleAxis.push({
          left: 150,
          type: 'category',
          boundaryGap: false,
          data: times,
          top: (idx * 100) / 10 + '%',
          height: 100 / 10 + '%',
          axisLabel: {
            interval: 2
          }
        });
        series.push({
          singleAxisIndex: idx,
          coordinateSystem: 'singleAxis',
          type: 'scatter',
          data: item[1].map((c, i) => [i, c]),
          symbolSize: function (dataItem: number[]) {
            return dataItem[1] / 2000;
          }
        });
      }
    });

    setScatterTitle(title);
    setScatterAxis(singleAxis);
    setScatterSeries(series);

    times.forEach((item, idx) => {
      const dataItem1: { [key: string]: number | string } = {
        key: idx,
        time: item
      };
      const dataItem2: { [key: string]: number | string } = {
        key: idx,
        time: item
      };
      _opColumns.forEach((c, i) => {
        dataItem1[c.dataIndex] = op_data[i][1][idx];
      });
      _fileColumns.forEach((c, i) => {
        dataItem2[c.dataIndex] = topn_file_ops_data[i][1][idx];
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
  }, [data]);

  return (
    <>
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
        <Panel title="文件操作次数统计 Top20（折线图）">
          <LineChart series={fileSeries} categories={opCategories} options={{ grid: { bottom: 72 } }} />
        </Panel>
        <Panel title="文件操作次数统计 Top10（散点图）">
          <ScatterChart title={scatterTitle} axis={scatterAxis} data={scatterSeries} />
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
    </>
  );
};

export default FilePanel;
