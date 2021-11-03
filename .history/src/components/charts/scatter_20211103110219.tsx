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
  title: {
    textBaseline: string;
    top: string;
    text: string;
  }[];
  axis: {
    left: number;
    type: string;
    data: string[];
    top: string;
    height: string;
    boundaryGap: boolean;
    axisLabel?: {
      interval: number;
    };
  }[];
  data: ScatterDataItem[];
};

const defaultOptions = {
  tooltip: {
    position: 'top',
    formatter: '{b0}: {c0}'
  },
  title: [],
  singleAxis: [],
  series: []
};

const Scatter: React.FC<ScatterChartProps> = (props) => {
  const { title = [], axis = [], data = [] } = props;

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
        style={{ height: 480 }}
      />
    )
  );
};

export default Scatter;
