import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  SingleAxisComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import deepmerge from '@/utils/deepmerge';
import { Empty } from 'antd';
import { Axis } from 'echarts/core';

echarts.use([
  TitleComponent,
  TooltipComponent,
  ScatterChart,
  CanvasRenderer,
  SingleAxisComponent
]);

type ScatterDataItem = {
  singleAxisIndex: number;
  coordinateSystem: string;
  type: string;
  symbolSize: (value: any) => number;
  data: number[][];
};

type ScatterChartProps = {
  title: 
  data: ScatterDataItem[];
};

const defaultOptions = {
  tooltip: {
    position: 'top'
  },
  title: [],
  singleAxis: [],
  series: []
};

const Scatter: React.FC<ScatterChartProps> = (props) => {
  const { data = [] } = props;

  return (
    data.length === 0 ? <Empty description="暂无数据" /> : (
      <ReactEChartsCore
        className="chart-wrapper"
        echarts={echarts}
        option={deepmerge(true, {}, defaultOptions, {
          title,
          singleAxis: axis,
          series: data
        })}
        notMerge
        lazyUpdate
        style={{ height: 400 }}
      />
    )
  );
};

export default Scatter;
