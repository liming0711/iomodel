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
import { Empty } from 'antd';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  LegendComponent
]);

type CommonChartSeriesProps = {
  name: string;
  data: number[];
};

export type CommonChartProps = {
  categories: string[];
  series: CommonChartSeriesProps[];
  options?: any;
};

const defaultOptions = {
  grid: {
    right: 30,
    bottom: 56
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: []
};

const Line: React.FC<CommonChartProps> = (props) => {
  const { series = [], categories, options = {} } = props;

  return (
    series.length === 0 ? <Empty description="暂无数据" /> : (
      <ReactEChartsCore
        className="chart-wrapper"
        echarts={echarts}
        option={deepmerge(true, {}, commonOptions, defaultOptions, options, {
          series,
          xAxis: {
            data: categories
          }
        })}
        notMerge
        lazyUpdate
      />
    )
  );
};

export default Line;
