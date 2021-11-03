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

export const convert = (b: any, k?: number, d?: number) => {
  if (!isNumberic(b)) {
    return b;
  }
  const bytes = Number(b);
  const base = k ?? 1024;
  const i = bytes === 0 ? 0 : Math.floor()
};
