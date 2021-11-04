import React, { useState, useEffect } from 'react';
import { Spin, Layout, Radio, RadioChangeEvent, message } from 'antd';
import MenuBar from '@/components/menu';
import IOContent from './content/content';
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
  const [unaligned, setUnaligned] = useState<any>();
  const [overlapRead, setOverlapRead] = useState<any>();
  const [menuData, setMenuData] = useState<MenuOption[]>([]);

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
      console.log('--- Read, Write ---', read, write);
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

  const handleSelectedPath = (menus: MenuOption[]): string[] => {
    const pathArray: string[] = [];
    const _handleSelectedPath = (menu: MenuOption) => {
      pathArray.push(menu.key);
      if (Array.isArray(menu.children) && menu.children.length > 0) {
        _handleSelectedPath(menu.children[0]);
      }
    };
    _handleSelectedPath(menus[0]);
    return pathArray;
  };

  useEffect(() => {
    if (selected && selected.length >= 2) {
      console.log(selected);
      setLoading(true);
      getInfo(selected[2], selected[1])
        .then((res) => {
          console.log('--- Info ---', res);
          const { steps = [] } = res;
          setSteps(steps);
          setInterval(steps[0]);
          setInfo([res]);
          if (steps.length < 1) {
            message.error('获取时间间隔失败');
          }
          const analysedRequest = [
            getAnalysedData(selected[2], 'file_op_count', steps[0], selected[1], selected[0]),
            getAnalysedData(selected[2], 'read_write', steps[0], selected[1], selected[0]),
            getAnalysedData(selected[2], 'parabuffer', steps[0], selected[1], selected[0]),
            getAnalysedData(selected[2], 'unaligned_ops', steps[0], selected[1], selected[0]),
            getAnalysedData(selected[2], 'overlap_read', steps[0], selected[1], selected[0]),
          ];

          axios.all(analysedRequest)
            .then(([f, rw, p, ua, or]) => {
              console.log('--- file_op_count data ---', f, rw, p, ua, or);
              setOperation(handleFileData(f as FileOperationOptions));
              // setReadWrite(handleReadWriteData(rw as ReadWriteOptions));
              setParabuffer(p);
              setUnaligned(ua);
              const aa = {
                '2020-11-02_12:12:12': {
                  'read': {
                    'file_name_1':[
                      [[0, 1024], 20],
                      [[2048, 1024], 100]
                    ],
                    'file_name_2':[
                      [[128, 1024], 77]
                    ]
                  }
                },
                '2020-11-03_12:12:12': {
                  'read': {
                    'file_name_3':[
                      [[256, 10240], 30],
                      [[2048, 1024], 110]
                    ]
                  }
                }
              };
              setOverlapRead(aa);
            })
            .catch((err) => {
              console.log('--- file_op_count fail ---', res);
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
                  key: i,
                  title: i,
                  children: []
                });
                requests2.push(getInfo(_menus[index].title, i));
              })
            });
            axios.all<any>(requests2)
              .then((infos) => {
                console.log('--- infos ---', infos);
                const _infos = infos.concat();
                _menus.forEach((i) => {
                  i.children!.forEach((c) => {
                    c.children = [{
                      key: 'all',
                      title: '全部'
                    }].concat(_infos[0].hosts.map((h: string) => ({
                      key: h,
                      title: h
                    })));
                    _infos.shift();
                  });
                });
                console.log('--- ranges ---', ranges, _menus, requests2, handleSelectedPath(_menus));
                setMenuData(_menus);
                setSelected(handleSelectedPath(_menus).reverse());
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
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
          <MenuBar data={menuData} onSelectedChange={onSelectedChange} />
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
              <IOContent info={info} rw={readWrite} op={operation} pb={parabuffer} ua={unaligned} or={overlapRead} />
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Spin>
  );
};

export default IO;
