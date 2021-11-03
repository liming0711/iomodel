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
};