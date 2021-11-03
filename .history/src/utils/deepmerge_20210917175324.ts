const isFunction = (fn: any): boolean => {
  return !!fn
    && typeof fn !== 'string'
    && !fn.nodeName
    && fn.constructor !== Array
    && /^[\s[]?function/.test(`${fn}`)
};

const isPlainObject = (obj: any): boolean => {
  const { toString } = Object.prototype;
  const getProto = Object.getPrototypeOf;
  const hasOwn = Object.prototype.hasOwnProperty;
  const fnToString = hasOwn.toString;
  const objectFunctionString = fnToString.call(obj);

  if (!obj && toString.call(obj) !== '[object Object]') {
    return false;
  }
};