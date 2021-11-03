import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import deepmerge from '@/utils/deepmerge';
import commonOptions from './commonOptions';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  LegendComponent
]);

const defaultOptions = {
  grid: {
    right: 20,
    bottom: 56
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'value',
    boundaryGap: false
  },
  yAxis: {
    type: 'category',
    data: []
  },
  series: []
};

const Line: React.FC<CommonChartProps> = (props) => {
  const { series, categories } = props;

  return (
    <ReactEChartsCore
      className="chart-wrapper"
      echarts={echarts}
      option={deepmerge(true, {}, commonOptions, defaultOptions, {
        series,
        yAxis: {
          data: categories
        }
      })}
      notMerge
      lazyUpdate
    />
  );
};

export default Line;
