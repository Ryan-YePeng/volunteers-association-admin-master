import {format} from "@/utils/format";

/**
 * @param value
 * @return {Boolean}
 * @description 判断是否为空
 * */
export const isEmpty = value => {
  return (
    value === undefined
    || value === null
    || (typeof value === "object" && Object.keys(value).length === 0)
    || (typeof value === "string" && value.trim().length === 0)
  );
};

/**
 * @param {Date} time
 * @return {String}
 * @description 格式化时间
 * */
export const formatDate = time => {
  if (!time) return '';
  return format(time, 'YYYY-MM-DD');
};

/**
 * @param {Date} time
 * @return {String}
 * @description 格式化时间
 * */
export const formatDateTime = time => {
  if (!time) return '';
  return format(time, 'YYYY-MM-DD HH:mm:ss');
};

/**
 * @param {Object} target
 * @param {Object} object
 * @description target从object中取值 target <= object
 * */
export const objectEvaluate = (target, object) => {
  for (let key in target) {
    if (object.hasOwnProperty(key)) {
      if (object[key] instanceof Array) {
        target[key] = [...object[key]]
      } else {
        target[key] = object[key]
      }
    }
  }
};

/**
 * @param {Object} target
 * @param {Object} object
 * @description target从object反向取值，删除原来的，获取新的
 * */
export const objectExchange = (target, object) => {
  for (let key in object) {
    if (!target.hasOwnProperty(key)) {
      if (object[key] instanceof Array) {
        target[key] = [...object[key]]
      } else {
        target[key] = object[key]
      }
    } else {
      delete target[key]
    }
  }
};

/**
 * @param {Object} current
 * @param {Object} original
 * @return {Object}
 * @description 从current,original中获取需要修改的对象
 * */
export const objectObtain = (current, original) => {
  let data = {};
  for (let key in current) {
    if (original.hasOwnProperty(key)) {
      if (current[key] instanceof Array) {
        if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
          data[key] = current[key]
        }
      } else {
        if (current[key] !== original[key]) {
          data[key] = current[key]
        }
      }
    } else {
      data[key] = current[key]
    }
  }
  return data
};

/**
 * @author xuanzai
 * @description json美化(配合pre标签使用)
 * @param {JSON | Object} json json字符串或对象
 * @param {Number} tab 空格的个数
 * @returns {JSON|Object} 返回美化好的JSON
 **/
export const jsonPretty = (json, tab = 2) => {
  try {
    if (typeof json == "object") {
      return JSON.stringify(json, null, tab)
    } else {
      return JSON.stringify(JSON.parse(json), null, tab)
    }
  } catch (e) {
    return json
  }
};
