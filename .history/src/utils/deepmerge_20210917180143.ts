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

const extend = function (isDeep: boolean, _target: any, _source: any, ...rest: any[]) {
  let options;
  let name;
  let src;
  let copy;
  let copyIsArray;
  let clone;
  let target = arguments[0] || {};
  let i = 1;
  const { length } = arguments;
  let deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[i] || {};
    i++
  }

  if (typeof target !== 'object' && !isFunction(target)) {
    target = {};
  }

  if (i === length) {
    return target;
  }

  for (; i < length; i++) {
    if ((options = arguments[i]) !== null) {
      for (name in options) {
        src = target[name];
      }
    }
  }
};

export default extend;