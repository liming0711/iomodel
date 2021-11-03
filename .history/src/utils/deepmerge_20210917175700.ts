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

  const proto = getProto(obj);

  if (!proto) {
    return true;
  }

  const ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
  return typeof ctor === 'function' && fnToString.call(ctor) === objectFunctionString;
};

const extend = (isDeep: boolean, _target: any, _source: any, ...rest: any[]) => {};

export default extend;