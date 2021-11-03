import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import {
  TitleComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  SingleAxisComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import deepmerge from '@/utils/deepmerge';
import commonOptions from './commonOptions';
import { Empty } from 'antd';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  ScatterChart,
  CanvasRenderer,
  LegendComponent,
  SingleAxisComponent
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
  tooltip: {
    position: 'top'
  },
  title: [
    {textBaseline:'middle', top:"7.142857142857143%", text:'Saturday'},
    {textBaseline:'middle', top:"21.428571428571427%", text:'Friday'},
    {textBaseline:'middle', top:"35.714285714285715%", text:'Thursday'},
    {textBaseline:'middle', top:"50%", text:'Wednesday'},
    {textBaseline:'middle', top:"64.28571428571429%", text:'Tuesday'},
    {textBaseline:'middle', top:"78.57142857142857%", text:'Monday'},
    {textBaseline:'middle', top:"92.85714285714286%", text:'Sunday'}
  ],
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

const Pie: React.FC<ScatterChartProps> = (props) => {
  const { data = [] } = props;

  return (
    <ReactEChartsCore
      className="chart-wrapper"
      echarts={echarts}
      option={deepmerge(true, {}, defaultOptions, {
        series: { data }
      })}
      notMerge
      lazyUpdate
      style={{ height: 400 }}
    />
  );
};

export default Pie;
