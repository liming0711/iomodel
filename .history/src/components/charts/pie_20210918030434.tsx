import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import deepmerge from '@/utils/deepmerge';
import commonOptions from './commonOptions';
import { CommonChartProps } from './line';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PieChart,
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

type PieChartProps = {
  data: PieDataItem[];
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
      size: TooltipLayoutOption
    ) => {
      const padding1 = 12;
      const padding2 = 32;
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
  series: {
    type: 'pie',
    radius: '50%',
    label: {
      formatter: '{b}: {d}%',
      bleedMargin: 0
    },
    data: []
  }
};

const Pie: React.FC<PieChartProps> = (props) => {
  const { data } = props;

  return (
    <ReactEChartsCore
      className="chart-wrapper"
      echarts={echarts}
      option={deepmerge(true, {}, commonOptions, defaultOptions, {
        series: data
      })}
      notMerge
      lazyUpdate
    />
  );
};

export default Pie;
