const v4 = require('uuid').v4;
const crypto = require('crypto');
const fetch = require('node-fetch');
const AbortController = require('abort-controller');

exports.b16 = function b16(type) {
  const b16Data = Buffer.from(v4().replace(/-/g, ''), 'hex');
  if ('hex' === type) return b16Data.toString('hex');
  return b16Data;
};

exports.idToB16 = function idToB16(id) {
  if ('object' === id) return id;
  try {
    return Buffer.from(id, 'hex');
  } catch (err) {
    return null;
  }
};

exports.idToHex = function idToHex(id) {
  if (!id) {
    return id;
  }
  return 'string' === typeof id ? id : id.toString('hex');
};


exports.removeNullUndefinedProp = function (obj) {
  if (typeof obj !== 'object') {
    return obj;
  }

  Object.keys(obj).forEach((key) => {
    if (null === obj[key] || undefined === obj[key]) {
      delete obj[key];
    }
  });

  return obj;
};

exports.sleep = ms => (new Promise(resolve => setTimeout(resolve, ms)));

/**
 * @param {Array<Function> | Object} functionLists
 */
exports.mapSeries = (dataList, callback) => {
  // Prepare an array of function to run sequentially
  const tasks = Object.keys(dataList).map(key => async () => callback(dataList[key], key));

  // convert array of function to wrapping promise func.then(func.then(func)) to run sequentially
  return tasks.reduce((cur, func) => {
    const wrappingResult = cur.then(result => func().then(Array.prototype.concat.bind(result)));
    return wrappingResult;
  }, Promise.resolve([]));
};

exports.chunkArray = (array, chunkSize) => {
  array = [].concat(array);
  const results = [];
  while (array.length) {
    results.push(array.splice(0, chunkSize));
  }
  return results;
};

exports.generateHashToken = (value, secret) => crypto.createHash('sha256', secret).update(value).digest('hex');


exports.watchAsyncTask = (asyncTask, timeout) => {
  let timeoutId;
  const timeoutTracking = new Promise((resolve) => {
    timeoutId = setTimeout(() => resolve('TIMEOUT'), timeout);
  });

  return Promise.race([
    asyncTask,
    timeoutTracking,
  ]).then((result) => {
    if ('TIMEOUT' === result) {
      throw new Error(result);
    }

    clearTimeout(timeoutId);
    return result;
  });
};

// cancelable fetch
exports.fetch = (url, options = {}) => {
  const {timeout} = options;
  delete options.timeout;

  if (timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => {
        controller.abort();

        return true;
      },
      timeout,
    );

    return fetch(url, {...options, signal: controller.signal})
      .then((result) => {
        clearTimeout(timeoutId);

        return result;
      })
      .catch((err) => {
        if ('AbortError' === err.name) {
          throw new Error('FETCH_TIMEOUT');
        }

        clearTimeout(timeoutId);
        throw err;
      });
  } else {
    return fetch(url, options || {});
  }
};

exports.imageHost = function imageHost() {
  return `${process.env.IMG_HOST_URL}/`;
};

exports.b16FromImageUrl = function b16FromImageUrl(imageUrl) {
  if (imageUrl && imageUrl.length > 0) {
    /* eslint-disable no-useless-escape*/
    const imageId = imageUrl.match(/([^\/]+)(?=\.\w+$)/)[0];
    return imageId ? exports.idToB16(imageId) : null;
  }
  return null;
};

exports.splitFullName = function splitFullName(fullName) {
  const names = {};
  const split = fullName.trim().split(' ');

  if (split && split.length > 0) {
    names.firstName = split[0].trim();
    names.firstName = names.firstName.charAt(0).toUpperCase() + names.firstName.slice(1);
  }

  if (split && split.length > 1) {
    split.shift();
    names.lastName = split.join(' ').trim();
  }

  return names;
};

exports.isValidEmail = function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

exports.stringToSlug = function stringToSlug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'åàáäâèéëêìíïîòóöôùúüûñç·/-,:;';
  const to = 'aaaaaeeeeiiiioooouuuunc______';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 _]/g, '') // remove invalid chars
    .replace(/\s+/g, '_') // collapse whitespace and replace by -
    .replace(/_+/g, '_'); // collapse dashes

  return str;
};

exports.isGP = function isGP(ip) {
  const gpIps = [
    '::1',
    '212.85.65.61',
  ];
  for (let i = 0; i < gpIps.length; i++) {
    if (gpIps[i] === ip) {
      return true;
    }
  }
  return false;
};

exports.isInt = function isInt(value) {
  return !Number.isNaN(value)
    && Number.parseInt(Number(value), 10) === value
    && !Number.isNaN(Number.parseInt(value, 10));
};

exports.isISODate = function isISODate(value) {
  const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  return 'string' === typeof value && dateFormat.test(value);
};

exports.isHexId = function isHexId(value) {
  return null !== value && 'string' === typeof value && /^[\da-f]{32}$/i.test(value);
};

/**
 * Checks if a `value` (be it string or number) is numeric
 * This differs from @see isInt, because you can pass in strings as well,
 * or mathematical notation '1e1', or floats
 *
 * @param value
 * @return {boolean}
 */
exports.isNumeric = function isNumeric(value) {
  return !Number.isNaN(Number(value));
};

exports.isObject = function isObject(item) {
  return (item && 'object' === typeof item && !Array.isArray(item));
};

//https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
function mergeDeep2Objects(target, source) {
  const output = Object.assign({}, target);
  if (exports.isObject(target) && exports.isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (exports.isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, {[key]: source[key]});
        } else {
          output[key] = mergeDeep2Objects(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

exports.mergeDeep = function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  return mergeDeep(mergeDeep2Objects(target, source), ...sources);
};

exports.stringToOtherType = function stringToOtherType(value, dataType) {
  switch (dataType) {
    case 'boolean':
      value = 'true' === value;
      break;
    case 'number':
      // We don't want result like this `parseFloat('1x') = 1`. Therefore we use Number even Number('') = 0
      value = Number(value);
      break;
    case 'json':
      value = JSON.parse(value);
      break;
    case 'string':
    default:
      break;
  }

  return value;
};

// convert [{key: 'key1',value: 'value1'}, {key: 'key2',value: 'value2'}] to {key1: value1, key2: value2}
exports.keyValueToObject = function keyValueToObject(values) {
  return values && Array.isArray(values)
    ? values.reduce((accumulator, item) => {
      accumulator[item.key] = item.value;
      return accumulator;
    }, {})
    : values;
};

// convert [{key: 'key1',value: 'value1'}, {key: 'key2',value: 'value2'}] to {key1: value1, key2: value2}
exports.keyValueToArray = function keyValueToArray(values) {
  if (!values || Array.isArray(values)) {
    return values;
  }
  return Object.keys(values).map(key => ({key, value: values[key]}));
};

exports.flattenDictionary = function flattenDictionary(source, delimiter = '.', parentPath = '', target = {}) {
  const sourceCopy = '' === parentPath ? JSON.parse(JSON.stringify(source)) : source;
  Object.keys(sourceCopy).forEach((key) => {
    // Construct the necessary pieces of metadata
    const value = sourceCopy[key];
    const path = parentPath ? `${parentPath}${delimiter}${key}` : key;

    // Either append or dive another level
    if ('object' === typeof value && null !== value) {
      flattenDictionary(value, delimiter, path, target);
    } else {
      target[path] = sourceCopy[key];
    }
  });

  return target;
};

exports.truncate = (string, length, mark = '...') => {
  if (typeof mark !== 'string') {
    return string;
  }

  const markLength = mark.length;
  const minLength = 4;

  let str = string;

  if ('string' === typeof str) {
    str = str.trim();
  }

  const invalid = typeof str !== 'string'
      || str.length < minLength
      || typeof length !== 'number'
      || length <= minLength
      || length >= (str.length - markLength);

  if (invalid) return string;

  let start = str.substring(0, length - markLength);
  const end = str.substring(length - markLength);

  if (end && end.charAt(0) !== ' ') {
    const temp = start.split(' ');
    start = temp.slice(0, temp.length - 1).join(' ');
  }

  return `${start}${mark}`;
};
