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

const defaultOptions: any = {
  grid: {
    right: 24,
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

type BarChartProps = CommonChartProps & {
  type?: 'bar' | 'column'
}

const Bar: React.FC<BarChartProps> = (props) => {
  const { type = 'bar', series = [], categories, options = {} } = props;
  if (type === 'column') {
    defaultOptions.xAxis = {
      type: 'category',
      data: []
    };
    defaultOptions.yAxis = {
      type: 'value',
      boundaryGap: true
    };
  }

  return (
    series.length === 0 ? <Empty description="暂无数据" /> : (
      <ReactEChartsCore
        className="chart-wrapper"
        echarts={echarts}
        option={deepmerge(
          true,
          {},
          commonOptions,
          defaultOptions,
          options,
          { series },
          type === 'bar' ? {
            yAxis: {
              data: categories
            }
          } : {
            xAxis: {
              data: categories
            }
          }
        )}
        notMerge
        lazyUpdate
      />
    )
  );
};

export default Bar;
