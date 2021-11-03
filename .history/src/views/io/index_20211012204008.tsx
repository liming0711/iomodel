import React, { useState, useEffect } from 'react';
import { Spin, Layout, Radio, RadioChangeEvent, message } from 'antd';
import MenuBar from '@/components/menu';
import IOContent from './content';
import {
  getAllProjects,
  getRange,
  getInfo,
  getAnalysedData,
  ReadWriteOptions,
  OperationDataOption,
  FileOperationOptions,
  AnalyseDataOption,
  ReadWriteOperationOptions,
  FileOperationItem
} from '@/requests';
import axios from 'axios';
import { convert } from '@/utils/tools';
import deepmerge from '@/utils/deepmerge';
import { MenuOption } from '@/components/menu';
import './style.less';

const { Header, Sider, Content } = Layout;

type DataItemOption = { [key: string]: number };

const test = {
  '2021-09-23_15:43:15': {
    grapes_input2017070112_0006: [[298806164, 298805760, 462783462, 'comput34'], [597611924, 298805760, 462783462, 'comput35'], [896417684, 298805760, 462783462, 'comput36'], [1195223444, 298805760, 462783462, 'comput37'], [1494029204, 298805760, 462783462, 'comput38'], [1792834964, 149402880, 462783462, 'comput39'], [2091640724, 298805760, 462783462, 'comput40'], [2539849364, 149402880, 462783462, 'comput43'], [2689252244, 298805760, 462783462, 'comput44'], [2988058004, 298805760, 462783462, 'comput45'], [3286863764, 298805760, 462783462, 'comput46'], [3585669524, 298805760, 462783462, 'comput47'], [3884475284, 149402880, 462783462, 'comput48'], [4183281044, 298805760, 462783462, 'comput49'], [4482086804, 298805760, 462783462, 'comput50'], [4780892564, 298805760, 462783462, 'comput51'], [5079698324, 149402880, 462783462, 'comput52'], [5378504084, 298805760, 462783462, 'comput53'], [5677309844, 298805760, 462783462, 'comput54'], [5976115604, 149402880, 462783462, 'comput55'], [6274921364, 298805760, 462783462, 'comput56'], [6573727124, 298805760, 462783462, 'comput57'], [6872532884, 298805760, 462783462, 'comput58'], [7171338644, 298805760, 462783462, 'comput59'], [7470144404, 298805760, 462783462, 'comput60'], [7768950164, 149402880, 462783462, 'comput61'], [8067755924, 298805760, 462783462, 'comput62'], [8366561684, 298805760, 462783462, 'comput63'], [8665367444, 282205440, 462783462, 'comput64']],
    postvar2017070112_006: [[99532800, 99532800, 462783462, 'comput34'], [199065600, 99532800, 462783462, 'comput35'], [298598400, 99532800, 462783462, 'comput36'], [398131200, 99532800, 462783462, 'comput37'], [497664000, 99532800, 462783462, 'comput38'], [597196800, 99532800, 462783462, 'comput39'], [696729600, 99532800, 462783462, 'comput40'], [796262400, 99532800, 462783462, 'comput43'], [895795200, 99532800, 462783462, 'comput44'], [995328000, 99532800, 462783462, 'comput45'], [1094860800, 99532800, 462783462, 'comput46'], [1194393600, 99532800, 462783462, 'comput47'], [1293926400, 99532800, 462783462, 'comput48'], [1393459200, 99532800, 462783462, 'comput49'], [1492992000, 99532800, 462783462, 'comput50'], [1592524800, 99532800, 462783462, 'comput51'], [1692057600, 99532800, 462783462, 'comput52'], [1791590400, 99532800, 462783462, 'comput53'], [1891123200, 99532800, 462783462, 'comput54'], [1990656000, 99532800, 462783462, 'comput55'], [2090188800, 99532800, 462783462, 'comput56'], [2189721600, 99532800, 462783462, 'comput57'], [2289254400, 99532800, 462783462, 'comput58'], [2388787200, 99532800, 462783462, 'comput59'], [2488320000, 82944000, 462783462, 'comput60'], [2571264000, 66355200, 462783462, 'comput61'], [2637619200, 66355200, 462783462, 'comput62'], [2703974400, 66355200, 462783462, 'comput63'], [2770329600, 66355200, 462783462, 'comput64']]
  },
  '2021-09-23_15:43:30': {}, '2021-09-23_15:43:45': {},
  '2021-09-23_15:44:00': {}, '2021-09-23_15:44:15': {}, '2021-09-23_15:44:30': {}, '2021-09-23_15:44:45': {},
  '2021-09-23_15:45:00': {}, '2021-09-23_15:45:15': {}, '2021-09-23_15:45:30': {}, '2021-09-23_15:45:45': {},
  '2021-09-23_15:46:00': {}, '2021-09-23_15:46:15': {}, '2021-09-23_15:46:30': {}, '2021-09-23_15:46:45': {},
  '2021-09-23_15:47:00': {}, '2021-09-23_15:47:15': {}, '2021-09-23_15:47:30': {}, '2021-09-23_15:47:45': {},
  '2021-09-23_15:48:00': {}, '2021-09-23_15:48:15': {}, '2021-09-23_15:48:30': {}, '2021-09-23_15:48:45': {},
  '2021-09-23_15:49:00': {}, '2021-09-23_15:49:15': {}, '2021-09-23_15:49:30': {}, '2021-09-23_15:49:45': {},
  '2021-09-23_15:50:00': {}
};

export interface ReadWriteResult {
  op_data: OperationDataOption;
  times: string[];
  topn_count: [string, number][];
  total_count: {
    [key: string]: number;
  };
}

export interface FileOperationResult {
  op_data: OperationDataOption;
  times: string[];
  topn_file_ops_data: OperationDataOption;
}

const IO: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [steps, setSteps] = useState<number[]>([]);
  const [interval, setInterval] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [readWrite, setReadWrite] = useState<ReadWriteResult>();
  const [operation, setOperation] = useState<any>(); // TODO
  const [info, setInfo] = useState<any>();
  const [parabuffer, setParabuffer] = useState<any>(); // any

  const handleReadWriteOperation = (
    data: AnalyseDataOption,
    mode: 'RND' | 'SEQ',
    op: 'R' | 'W',
    time: string,
    tempObj: { [key: string]: DataItemOption },
    records: { [key: string]: number }
  ) => {
    Object.keys(data).forEach((r) => {
      if (!tempObj[time]) {
        tempObj[time] = {};
      }
      const size = convert(r);
      const type = `${mode},${size},${op}`;
      if (!tempObj[time][type]) {
        tempObj[time][type] = 0;
      }
      tempObj[time][type] += data[r];

      if (!records[type]) {
        records[type] = 0;
      }
      records[type] += data[r];
    });

    return tempObj;
  };
  const handleReadWriteCount = (
    data: ReadWriteOperationOptions['distribution'],
    op: 'R' | 'W',
    time: string,
    records: any
  ) => {
    const tempObj: { [key: string]: DataItemOption } = {};
    Object.keys(data).forEach((file) => {
      const rnd = data[file].R;
      const seq = data[file].S;
      deepmerge(true, tempObj, handleReadWriteOperation(rnd, 'RND', op, time, tempObj, records));
      deepmerge(true, tempObj, handleReadWriteOperation(seq, 'SEQ', op, time, tempObj, records));
    });
    return tempObj;
  };
  const handleReadWriteData = (data: ReadWriteOptions): ReadWriteResult => {
    const times = Object.keys(data);
    const tempObj: { [key: string]: DataItemOption } = {};
    const records: DataItemOption = {};
    times.forEach((time) => {
      const read = handleReadWriteCount(data[time].read.distribution, 'R', time, records);
      const write = handleReadWriteCount(data[time].write.distribution, 'W', time, records);
      // console.log('--- Read, Write ---', read, write);
      deepmerge(true, tempObj, read, write);
    });
    const topn_count = Object
      .entries(records)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const max10Keys = topn_count.map((item) => item[0]);
    const op_data: OperationDataOption = max10Keys.map((key) => {
      const series: number[] = times.map((t) => tempObj?.[t]?.[key] ?? 0);
      return ([key, series]);
    });
    const total_count: { [key: string]: number } = {};

    Object.keys(records).forEach((key) => {
      const keyItem = key.split(',');
      const mode = keyItem[0];
      const operation = keyItem[keyItem.length - 1];
      const _key = `${mode},${operation}`;
      if (!total_count[_key]) {
        total_count[_key] = 0;
      }
      total_count[_key] += records[key];
    })

    console.log('--- All Read & Write ---', tempObj, records, topn_count, op_data, total_count);
    return { op_data, times, topn_count, total_count };
  };

  const handleFileData = (data: FileOperationOptions): FileOperationResult => {
    const operations = ['total', 'seek', 'read', 'open', 'release', 'write', 'lookup', 'atomic_open', 'unlink', 'symlink', 'rmdir', 'mkdir', 'setattr'] as (keyof Required<FileOperationItem>)[];
    const times = Object.keys(data);
    const records: { [key: string ]: number[] } = {};
    const tempObj: DataItemOption = {};
    times.forEach((t, i) => {
      const op = Object.keys(data[t]) as (keyof Required<FileOperationItem>)[];
      op.forEach((item) => {
        Object.entries(data[t][item] ?? {}).forEach((t) => {
          const key = `${t[0]},${item}`;
          if (!tempObj[key]) {
            tempObj[key] = 0;
          }
          tempObj[key] += t[1];
        });
      });
      operations.forEach((item) => {
        if (!records[item]) {
          records[item] = [];
        }
        const sum = Object.values(data[t][item] ?? {}).reduce((c, p) => c + p, 0);
        if (!records[item][i]) {
          records[item][i] = 0;
        }
        records[item][i] += sum;
      });
    });
    const op_data: OperationDataOption = Object.entries(records);
    const max10Item = Object
      .entries(tempObj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    const max10Keys = max10Item.map((item) => item[0]);
    const topn_file_ops_data: OperationDataOption = max10Keys.map((key) => {
      const _key = key.split(',')[0];
      const op = key.split(',')[1] as keyof Required<FileOperationItem>;
      const series: number[] = times.map((t) => data[t][op]?.[_key] ?? 0);
      return ([key, series]);
    });
  
    console.log('--- OPPPP ---', records, tempObj, max10Item, topn_file_ops_data);
    return { times, op_data, topn_file_ops_data };
  };

  useEffect(() => {
    if (selected && selected.length >= 2) {
      setLoading(true);
      getInfo(selected[1], selected[0])
        .then((res) => {
          console.log('--- Info ---', res);
          const { steps = [] } = res;
          setSteps(steps);
          setInfo([res]);
          getAnalysedData(selected[1], 'file_op_count', steps[0], selected[0])
            .then((res) => {
              console.log('--- file_op_count data ---', res);
              setOperation(handleFileData(res as FileOperationOptions));
            })
            .catch((err) => {
              console.log('--- file_op_count fail ---', res);
            })
            .finally(() => {
              setLoading(false);
            });

          getAnalysedData(selected[1], 'read_write', steps[0], selected[0])
            .then((res) => {
              console.log('--- read_write data ---', res);
              setReadWrite(handleReadWriteData(res as ReadWriteOptions));
            })
            .catch((err) => {
              console.log('--- read_write fail ---', err);
            })
            .finally(() => {
              setLoading(false);
            });

          getAnalysedData(selected[1], 'parabuffer', steps[0], selected[0])
            .then((res) => {
              console.log('--- parabuffer data ---', res);
              setParabuffer(test);
            })
            .catch((err) => {
              console.log('--- parabuffer fail ---', err);
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch((err) => {
          message.error(err.message);
          setLoading(false);
        });
    }
  }, [selected]);

  useEffect(() => {
    const _menus: MenuOption[] = [];
    getAllProjects()
      .then((res) => {
        console.log('--- projects ---', res);
        const requests: Promise<string[]>[] = [];
        const requests2: Promise<any>[] = [];
        (res ?? []).forEach((project) => {
          requests.push(getRange(project));
          _menus.push({
            key: project,
            title: project,
            children: []
          });
        });
        axios.all<string[]>(requests)
          .then((ranges) => {
            ranges.forEach((r, index) => {
              r.forEach((i) => {
                _menus[index].children!.push({
                  key: `${_menus[index].key}-${i}`,
                  title: i,
                  children: []
                });
                // [
                //   [getInfo1, getInfo2],
                // ]
                // [
                //   [getInfo1, getInfo2],
                // ]
                requests2.push(getInfo(_menus[index].title, i));
              })
            });
            axios.all<any>(requests2)
              .then((infos) => {
                console.log('--- infos ---', infos);
                _menus.forEach((i) => {
                  i.children!.forEach((c) => {
                    c.children = infos[0].hosts.map((h: string) => ({
                      key: `${i.key}-${c.key}-${h}`,
                      title: h
                    }));
                  })
                })
              })

            console.log('--- ranges ---', ranges, _menus, requests2);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            // setMenus(_menus);
            // console.log('--- finally ---', _menus[0].title, _menus[0]!.children![0]?.key);
            // onSelectedChange([_menus[0]!.children![0]?.key, _menus[0].title]);
            // setOpenKeys([_menus[0].title]);
            // setSelectedKeys([_menus[0]!.children![0]?.key]);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  
  const onCollapse = () => {
    setCollapsed(!collapsed);
  };
  const onSelectedChange = (selected: string[]) => {
    setSelected(selected);
  };
  const onIntervalChange = (e: RadioChangeEvent) => {
    console.log(e);
    setInterval(e.target.value);
    // getAllData(selected, e.target.value);
  };
  return (
    <Spin spinning={loading} tip="加载中..." wrapperClassName="io-loading">
      <Layout className="layout-wrapper">
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          trigger="TODO"
          className="layout-sider"
          width={240}
        >
          <MenuBar onSelectedChange={onSelectedChange} />
        </Sider>
        <Content className="layout-content">
          <Layout className="layout-wrapper io-wrapper">
            <Header className="layout-header io-header">
              <span className="io-title">{selected ?? ''}</span>
            </Header>
            <Content className="layout-content io-content">
              <div className="interval-wrapper">
                <div className="interval-label">时间间隔设置（秒）</div>
                <Radio.Group name="radiogroup" value={interval} onChange={onIntervalChange}>
                  {
                    steps.map((item) => {
                      return (
                        <Radio key={item} value={item} className="interval-radio">{item}</Radio>
                      )
                    })
                  }
                </Radio.Group>
              </div>
              <IOContent info={info} rw={readWrite} op={operation} pb={parabuffer} />
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Spin>
  );
};

export default IO;
