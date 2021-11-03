import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import deepmerge from '@/utils/deepmerge';
import commonOptions from './commonOptions';
import { CommonChartProps } from './line';
import { Empty } from 'antd';

echarts.use([
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
  const { series = [], categories, options = {} } = props;

  return (
    series.length === 0 ? <Empty description="暂无数据" /> : (
      <ReactEChartsCore
        className="chart-wrapper"
        echarts={echarts}
        option={deepmerge(true, {}, commonOptions, defaultOptions, options, {
          series,
          yAxis: {
            data: categories
          }
        })}
        notMerge
        lazyUpdate
      />
    )
  );
};

export default Bar;
