import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import deepmerge from '@/utils/deepmerge';
import commonOptions from './commonOptions';
import { Empty } from 'antd';

echarts.use([
  TooltipComponent,
  GridComponent,
  ScatterChart,
  CanvasRenderer,
  LegendComponent
]);

type PieDataItem = {
  value: number;
  name: string;
  itemStyle?: {
    color: string;
  }
};

type ScatterChartProps = {
  data: PieDataItem[];
  options?: any;
};

type TooltipPositionSize = {
  viewSize: [number, number],
  contentSize: [number, number]
};

type TooltipLayoutOption = {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
};

const defaultOptions = {
  tooltip: {
    formatter: '{a} <br/>{b}: {c} ({d}%)',
    position: (
      point: [number, number],
      _param: any,
      _dom: any,
      _rect: any,
      size: TooltipPositionSize
    ) => {
      const padding1 = 12; // tooltip 距离左右边框的最小距离
      const padding2 = 32; // tooltip 从鼠标位置向下的偏移距离
      const [x, y] = point;
      const { viewSize, contentSize } = size;
      const position: TooltipLayoutOption = {
        top: y + padding2
      };

      const horizentol = ['left', 'right'][Number(x < viewSize[0] / 2)];
      if (horizentol === 'left') {
        position.right = Math.max(padding1, viewSize[0] - x - padding1 - contentSize[0]);
      } else {
        position.left = Math.max(padding1, x - padding1 - contentSize[0]);
      }

      return position;
    }
  },
  // series: {
  //   type: 'pie',
  //   radius: '50%',
  //   label: {
  //     formatter: '{b}: {d}%',
  //     bleedMargin: 0
  //   },
  //   data: []
  // }
  tooltip: {
    position: 'top'
  },
  singleAxis: [
    {"left":150,"type":"category","boundaryGap":false,"data":["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"],"top":"5%","height":"4.2857142857142865%","axisLabel":{"interval":2}},
    {"left":150,"type":"category","boundaryGap":false,"data":["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"],"top":"19.285714285714285%","height":"4.2857142857142865%","axisLabel":{"interval":2}},
    {"left":150,"type":"category","boundaryGap":false,"data":["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"],"top":"33.57142857142857%","height":"4.2857142857142865%","axisLabel":{"interval":2}},
    {"left":150,"type":"category","boundaryGap":false,"data":["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"],"top":"47.857142857142854%","height":"4.2857142857142865%","axisLabel":{"interval":2}},
    {"left":150,"type":"category","boundaryGap":false,"data":["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"],"top":"62.142857142857146%","height":"4.2857142857142865%","axisLabel":{"interval":2}},
    {"left":150,"type":"category","boundaryGap":false,"data":["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"],"top":"76.42857142857143%","height":"4.2857142857142865%","axisLabel":{"interval":2}},
    {"left":150,"type":"category","boundaryGap":false,"data":["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"],"top":"90.71428571428571%","height":"4.2857142857142865%","axisLabel":{"interval":2}}
  ],
  series: [
    {"singleAxisIndex":0,"coordinateSystem":"singleAxis","type":"scatter","data":[[0,5],[1,1],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,2],[12,4],[13,1],[14,1],[15,3],[16,4],[17,6],[18,4],[19,4],[20,3],[21,3],[22,2],[23,5]]},
    {"singleAxisIndex":1,"coordinateSystem":"singleAxis","type":"scatter","data":[[0,7],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,5],[11,2],[12,2],[13,6],[14,9],[15,11],[16,6],[17,7],[18,8],[19,12],[20,5],[21,5],[22,7],[23,2]]},
    {"singleAxisIndex":2,"coordinateSystem":"singleAxis","type":"scatter","data":[[0,1],[1,1],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,3],[11,2],[12,1],[13,9],[14,8],[15,10],[16,6],[17,5],[18,5],[19,5],[20,7],[21,4],[22,2],[23,4]]},
    {"singleAxisIndex":3,"coordinateSystem":"singleAxis","type":"scatter","data":[[0,7],[1,3],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,1],[9,0],[10,5],[11,4],[12,7],[13,14],[14,13],[15,12],[16,9],[17,5],[18,5],[19,10],[20,6],[21,4],[22,4],[23,1]]},
    {"singleAxisIndex":4,"coordinateSystem":"singleAxis","type":"scatter","data":[[0,1],[1,3],[2,0],[3,0],[4,0],[5,1],[6,0],[7,0],[8,0],[9,2],[10,4],[11,4],[12,2],[13,4],[14,4],[15,14],[16,12],[17,1],[18,8],[19,5],[20,3],[21,7],[22,3],[23,0]]},
    {"singleAxisIndex":5,"coordinateSystem":"singleAxis","type":"scatter","data":[[0,2],[1,1],[2,0],[3,3],[4,0],[5,0],[6,0],[7,0],[8,2],[9,0],[10,4],[11,1],[12,5],[13,10],[14,5],[15,7],[16,11],[17,6],[18,0],[19,5],[20,3],[21,4],[22,2],[23,0]]},
    {"singleAxisIndex":6,"coordinateSystem":"singleAxis","type":"scatter","data":[[0,1],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,1],[11,0],[12,2],[13,1],[14,3],[15,4],[16,0],[17,0],[18,0],[19,0],[20,1],[21,2],[22,2],[23,6]]}
  ]
};

const Pie: React.FC<ScatterChartProps> = (props) => {
  const { data = [], options = {} } = props;

  return (
    data.length === 0 ? <Empty description="暂无数据" /> : (
      <ReactEChartsCore
        className="chart-wrapper"
        echarts={echarts}
        option={deepmerge(true, {}, commonOptions, defaultOptions, options, {
          series: { data }
        })}
        notMerge
        lazyUpdate
      />
    )
  );
};

export default Pie;
