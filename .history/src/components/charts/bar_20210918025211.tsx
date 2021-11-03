import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import deepmerge from '@/util/deepmerge';
import commonOptions from './commonOptions';
import { CommonChartProps } from './line';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
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

const Bar: React.FC<CommonChartProps> = (props) => {
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

export default Bar;
