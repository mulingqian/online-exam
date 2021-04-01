let isFunction = (val) => {
  return typeof val === 'function';
}

let isObject = (val) => {
  return val !== null && typeof val === 'object';
}

let isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}
export {
  isPromise
}
