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
        [[0, 1024], 2],
        [[2048, 1024], 100]
      ],
      'file_name_2':[
        [[0, 3123], 30],
        [[321, 1024], 77]
      ]
    }
  },
  '2020-11-03_12:12:12': {
    'read': {
      'file_name_3':[
        [[256, 10240], 10],
        [[2048, 1024], 110]
      ]
    }
  }
};
const cc = [{
  key: 'name',
  title: 'File Name',
  dataIndex: 'name'
}, {
  key: 'range_1',
  title: '[0, 1024]',
  children: [{
    key: 'offset1',
    title: 'Offset',
    dataIndex: 'offset1'
  }, {
    key: 'length1',
    title: 'Length',
    dataIndex: 'length1'
  }, {
    key: 'count1',
    title: 'Count',
    dataIndex: 'count1'
  }]
}, {
  key: 'range_2',
  title: '[1024, 2048]',
  children: [{
    key: 'offset2',
    title: 'Offset',
    dataIndex: 'offset2'
  }, {
    key: 'length2',
    title: 'Length',
    dataIndex: 'length2'
  }, {
    key: 'count2',
    title: 'Count',
    dataIndex: 'count2'
  }]
}];
const dd = [{
  name: 'file_name_1', offset1: 1024, length1: 54, count1: 10, offset2: 2048, length2: 32, count2: 17
}, {
  name: 'file_name_2', offset1: 10242, length1: 542, count1: 102, offset2: 20482, length2: 322, count2: 172
}];

const OverlapPanel: React.FC<{ data: OverlapProps | undefined }> = (props) => {
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
  const [overlapAxis, setOverlapAxis] = useState<any[]>([
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'5%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'19.285714285714285%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'33.57142857142857%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'47.857142857142854%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'62.142857142857146%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'76.42857142857143%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'90.71428571428571%', height:'4.2857142857142865%', axisLabel:{interval:2}}
  ]);
  const [overlapTitle, setOverlapTitle] = useState<any[]>([
    {textBaseline:'middle', top:"7.142857142857143%", text:'Saturday'},
    {textBaseline:'middle', top:"21.428571428571427%", text:'Friday'},
    {textBaseline:'middle', top:"35.714285714285715%", text:'Thursday'},
    {textBaseline:'middle', top:"50%", text:'Wednesday'},
    {textBaseline:'middle', top:"64.28571428571429%", text:'Tuesday'},
    {textBaseline:'middle', top:"78.57142857142857%", text:'Monday'},
    {textBaseline:'middle', top:"92.85714285714286%", text:'Sunday'}
  ]);
  // const [overlapColumns, setOverlapColumns] = useState<any[]>([]);
  // const [overlapDataSource, setOverlapDataSource] = useState<any[]>([]);

  useEffect(() => {
    // const _opData: CommonDataProps[] = [];
    // const _fileData: CommonDataProps[] = [];
    const columns: ColumnProps[] = [];
    const dataSource: any[] = [];
    // const _fileColumns: ColumnProps[] = [];
    // const _fileDataSource: any[] = [];
    // ----------------------------------
    // const aa = {
    //   '2020-11-02_12:12:12': {
    //     'read': {
    //       'file_name_1':[
    //         [[0, 1024], 2],
    //         [[2048, 1024], 100]
    //       ],
    //       'file_name_2':[
    //         [[0, 3123], 30],
    //         [[321, 1024], 77]
    //       ]
    //     }
    //   },
    //   '2020-11-03_12:12:12': {
    //     'read': {
    //       'file_name_3':[
    //         [[256, 10240], 10],
    //         [[2048, 1024], 110]
    //       ]
    //     }
    //   }
    // };
    // -----------------------
    // {
    //   key: 'range_1',
    //   title: '[0, 1024]',
    //   children: [{
    //     key: 'offset1',
    //     title: 'Offset',
    //     dataIndex: 'offset1'
    //   }, {
    //     key: 'length1',
    //     title: 'Length',
    //     dataIndex: 'length1'
    //   }, {
    //     key: 'count1',
    //     title: 'Count',
    //     dataIndex: 'count1'
    //   }]
    // }
    // if (isEmptyObject(data)) {
    //   return;
    // }
    const keys = Object.keys(aa);
    keys.forEach((key) => {
      const files = Object.keys(aa[key].read);
      files.forEach((filename) => {
        const dataItem: any = { name: filename };
        aa[key]['read'][filename].forEach((item) => {
          const key = `[${item[0].join(', ')}]`;
          let existItem = columns.find((v) => v.key === key);
          if (!existItem) {
            columns.push({
              key,
              title: key,
              children: []
            });
            existItem = columns[columns.length - 1];
          }
          existItem.children!.push({
            key: `${filename}_${key}_offset`,
            title: 'Offset',
            dataIndex: `${filename}_${key}_offset`
          });
          // columnItem.children!.push({
          //   key: `${filename}_offset`,
          //   title: 'Offset',
          //   dataIndex: `${filename}_offset`
          // });
        });
        dataSource.push({ name: filename });
      });
    });
    console.log('--- columns ---', columns);

    // setOverlapSeries(_opData);
    // setOverlapColumns(cc);
    // setOverlapDataSource(dd);
  }, [data]);

  return (
    <div className="io-container-item">
      <Panel title="重叠读分析（图表）">
        <ScatterChart title={overlapTitle} axis={overlapAxis} data={overlapSeries} />
      </Panel>
      <Panel title="重叠读分析（数据）">
        <Table
          dataSource={dd}
          columns={cc}
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
