export const isEmptyObject = (obj: any): boolean => {
  for (let _i in obj) {
    return false;
  }
  return true;
};

export const isNumberic = (): boolean => {};
