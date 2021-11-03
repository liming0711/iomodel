import React, { useState, useEffect } from 'react';
import { Table, Empty } from 'antd';
import Panel from '@/components/panel';
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

const UnalignedPanel: React.FC<{ data: OperationOptions | undefined }> = (props) => {
  const { data } = props;
  const [overlapSeries, setOverlapSeries] = useState<any>([
    {singleAxisIndex:0, coordinateSystem:'singleAxis', type:'scatter', symbolSize: function (dataItem: any) { return dataItem[1] * 4; }, data:[[0,5],[1,1],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,2],[12,4],[13,1],[14,1],[15,3],[16,4],[17,6],[18,4],[19,4],[20,3],[21,3],[22,2],[23,5]]},
    {singleAxisIndex:1, coordinateSystem:'singleAxis', type:'scatter', symbolSize: function (dataItem: any) { return dataItem[1] * 4; }, data:[[0,7],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,5],[11,2],[12,2],[13,6],[14,9],[15,11],[16,6],[17,7],[18,8],[19,12],[20,5],[21,5],[22,7],[23,2]]},
    {singleAxisIndex:2, coordinateSystem:'singleAxis', type:'scatter', symbolSize: function (dataItem: any) { return dataItem[1] * 4; }, data:[[0,1],[1,1],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,3],[11,2],[12,1],[13,9],[14,8],[15,10],[16,6],[17,5],[18,5],[19,5],[20,7],[21,4],[22,2],[23,4]]},
    {singleAxisIndex:3, coordinateSystem:'singleAxis', type:'scatter', symbolSize: function (dataItem: any) { return dataItem[1] * 4; }, data:[[0,7],[1,3],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,1],[9,0],[10,5],[11,4],[12,7],[13,14],[14,13],[15,12],[16,9],[17,5],[18,5],[19,10],[20,6],[21,4],[22,4],[23,1]]},
    {singleAxisIndex:4, coordinateSystem:'singleAxis', type:'scatter', symbolSize: function (dataItem: any) { return dataItem[1] * 4; }, data:[[0,1],[1,3],[2,0],[3,0],[4,0],[5,1],[6,0],[7,0],[8,0],[9,2],[10,4],[11,4],[12,2],[13,4],[14,4],[15,14],[16,12],[17,1],[18,8],[19,5],[20,3],[21,7],[22,3],[23,0]]},
    {singleAxisIndex:5, coordinateSystem:'singleAxis', type:'scatter', symbolSize: function (dataItem: any) { return dataItem[1] * 4; }, data:[[0,2],[1,1],[2,0],[3,3],[4,0],[5,0],[6,0],[7,0],[8,2],[9,0],[10,4],[11,1],[12,5],[13,10],[14,5],[15,7],[16,11],[17,6],[18,0],[19,5],[20,3],[21,4],[22,2],[23,0]]},
    {singleAxisIndex:6, coordinateSystem:'singleAxis', type:'scatter', symbolSize: function (dataItem: any) { return dataItem[1] * 4; }, data:[[0,1],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,1],[11,0],[12,2],[13,1],[14,3],[15,4],[16,0],[17,0],[18,0],[19,0],[20,1],[21,2],[22,2],[23,6]]}
  ]);
  const [overlapAxis, setOverlapAxis] = useState<any[]>([]);
  const [overlapTitle, setOverlapTitle] = useState<any[]>([
    {textBaseline:'middle', top:"7.142857142857143%", text:'Saturday'},
    {textBaseline:'middle', top:"21.428571428571427%", text:'Friday'},
    {textBaseline:'middle', top:"35.714285714285715%", text:'Thursday'},
    {textBaseline:'middle', top:"50%", text:'Wednesday'},
    {textBaseline:'middle', top:"64.28571428571429%", text:'Tuesday'},
    {textBaseline:'middle', top:"78.57142857142857%", text:'Monday'},
    {textBaseline:'middle', top:"92.85714285714286%", text:'Sunday'}
  ]);
  const [overlapColumns, setOverlapColumns] = useState<ColumnProps[]>([]);
  const [overlapDataSource, setOverlapDataSource] = useState<any[]>([]);

  useEffect(() => {
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

    setOverlapSeries(_opData);
    setOverlapColumns(_opColumns);
    setOverlapDataSource(_opDataSource);
  }, [data]);

  return (
    <div className="io-container-item">
      <Panel title="重叠读分析（图表）">
        <ScatterChart data={overlapSeries} />
      </Panel>
      <Panel title="重叠读分析（数据）">
        <Table
          dataSource={overlapDataSource}
          columns={overlapColumns}
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
