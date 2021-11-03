const capacity = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

export const isEmptyObject = (obj: any): boolean => {
  for (let _i in obj) {
    return false;
  }
  return true;
};

export const isNumberic = (value: any, isStrict?: boolean): boolean => {
  if (isStrict) {
    return !Number.isNaN(value) && Number.isFinite(value);
  }

  const type = typeof value;
  return (type === 'number' || type === 'string')
    && !Number.isNaN(value - parseFloat(value));
};

export const decimal = (num: number, d: number, type?: boolean): number => {
  let r: number;
  const t: string = num.toString();
  try {
    r = t.split('.')[1].length;
  } catch (e) {
    r = 0;
  }
};

export const convert = (b: any, k?: number, d?: number): string => {
  if (!isNumberic(b)) {
    return b;
  }
  const bytes = Number(b);
  const base = k ?? 1024;
  const i = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(base));
  return `${decimal(bytes / (base ** i), d ?? 2)}${capacity[i]}`
};
