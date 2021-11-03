import axios from 'axios';
import { isEmptyObject, isNumberic } from '@/utils/tools';
import { ReactText } from 'react';

export type OperationDataOption = [string, number[]][];

export interface OperationOptions {
  op_data: OperationDataOption;
  times: string[];
  topn_file_ops_data: OperationDataOption;
}

export interface ProjectInfoOptions {
  end_time: string;
  hosts: string[];
  items: string[];
  pattern: string;
  project: string;
  start_time: string;
  steps: number[];
  version: string,
  work_path: string;
}

export interface AnalyseDataOption {
  [key: string]: number;
}

export interface FileOperationItem {
  atomic_open?: AnalyseDataOption,
  lookup?: AnalyseDataOption,
  open?: AnalyseDataOption,
  read?: AnalyseDataOption,
  release?: AnalyseDataOption,
  seek?: AnalyseDataOption,
  total: AnalyseDataOption
}

export interface ReadWriteOperationOptions {
  bandwith: number;
  distribution: {
    [key: string]: {
      R: AnalyseDataOption;
      S: AnalyseDataOption;
      hosts: string[];
      size: number;
    }
  };
  iops: number;
}

interface ReadWriteItem {
  read: ReadWriteOperationOptions;
  write: ReadWriteOperationOptions;
  start_time: string;
  end_time: string;
}
export interface ReadWriteOptions {
  [key: string]: ReadWriteItem;
}

export interface FileOperationOptions {
  [key: string]: FileOperationItem;
}

export const getSource = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    axios.get('/getAllDataSources.action')
      .then((res) => {
        console.log('--- source data ---', res.data);
        if (Array.isArray(res.data)) {
          resolve(res.data);
        }
        reject(new Error('获取到的数据为空'));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getSteps = (source: string): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    axios.get(`/getStepsByDataSource.action?source=${source}`)
      .then((res) => {
        console.log('--- steps data ---', res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const result: number[] = [];
          res.data.forEach((item) => {
            if (isNumberic(item)) {
              result.push(Number(item));
            }
          })
          resolve(result);
        }
        reject(new Error('获取时间间隔错误'));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getReadWriteData = (
  source: string,
  step: string | number
): Promise<{[key: string]: ReadWriteOptions}> => {
  return new Promise((resolve, reject) => {
    axios.get(`/getReadWriteData.action?step=${step}&source=${source}`)
      .then((res) => {
        console.log('--- read write data ---', res.data);
        if (isEmptyObject(res.data)) {
          console.warn('读写数据为空');
        }
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getOperationData = (
  source: string,
  step: string | number
): Promise<OperationOptions> => {
  return new Promise((resolve, reject) => {
    axios.get(`/getFileOpsData.action?step=${step}&source=${source}`)
      .then((res) => {
        console.log('--- operation data ---', res.data);
        if (isEmptyObject(res.data)) {
          console.warn('操作数据为空');
        }
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getAllProjects = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    axios.get('/getAllProjects.action')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          resolve(res.data);
        } else {
          reject(new Error('项目数据为空'));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getRange = (project: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    axios.get(`/getTimeRangesByProject.action?project=${project}`)
      .then((res) => {
        if (res.data) {
          if (Array.isArray(res.data) && res.data.length > 0) {
            resolve(res.data);
          } else {
            reject(new Error('项目的时间区间数据为空'));
          }
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getInfo = (project: string, range: string): Promise<ProjectInfoOptions> => {
  return new Promise((resolve, reject) => {
    axios.get(`/getAnalyseInfos.action?project=${project}&time_range=${range}`)
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getAnalysedData = (
  project: string,
  item: string,
  step: ReactText,
  time_range: string,
  host?: string
): Promise<FileOperationOptions | ReadWriteOptions> => {
  let url = `/getAnalysedDatas.action?project=${project}&time_range=${time_range}&step=${step}&item=${item}`;
  if (host !== '全部') {
    url += `host=${host}`;
  }
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
