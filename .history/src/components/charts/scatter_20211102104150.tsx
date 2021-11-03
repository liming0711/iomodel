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
  // tooltip: {
  //   formatter: '{a} <br/>{b}: {c} ({d}%)',
  //   position: (
  //     point: [number, number],
  //     _param: any,
  //     _dom: any,
  //     _rect: any,
  //     size: TooltipPositionSize
  //   ) => {
  //     const padding1 = 12; // tooltip 距离左右边框的最小距离
  //     const padding2 = 32; // tooltip 从鼠标位置向下的偏移距离
  //     const [x, y] = point;
  //     const { viewSize, contentSize } = size;
  //     const position: TooltipLayoutOption = {
  //       top: y + padding2
  //     };

  //     const horizentol = ['left', 'right'][Number(x < viewSize[0] / 2)];
  //     if (horizentol === 'left') {
  //       position.right = Math.max(padding1, viewSize[0] - x - padding1 - contentSize[0]);
  //     } else {
  //       position.left = Math.max(padding1, x - padding1 - contentSize[0]);
  //     }

  //     return position;
  //   }
  // },
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
  singleAxis: singleAxis,
  series: series
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
