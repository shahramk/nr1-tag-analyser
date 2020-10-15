const deepCopy = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;

  let ret = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    const val = obj[key];
    ret[key] = deepCopy(val);
  }

  return ret;
};

const utils = { deepCopy };

export default utils;
