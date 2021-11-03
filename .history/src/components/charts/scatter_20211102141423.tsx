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
  data: ScatterDataItem[];
};

const defaultOptions = {
  tooltip: {
    position: 'top'
  },
  title: [],
  singleAxis: [
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'5%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'19.285714285714285%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'33.57142857142857%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'47.857142857142854%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'62.142857142857146%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'76.42857142857143%', height:'4.2857142857142865%', axisLabel:{interval:2}},
    {left:150, type:'category', boundaryGap:false, data:["12a","1a","2a","3a","4a","5a","6a","7a","8a","9a","10a","11a","12p","1p","2p","3p","4p","5p","6p","7p","8p","9p","10p","11p"], top:'90.71428571428571%', height:'4.2857142857142865%', axisLabel:{interval:2}}
  ],
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
