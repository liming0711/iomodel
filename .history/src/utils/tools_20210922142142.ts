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
  return (type === 'number')
};
