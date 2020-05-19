import Vue from "vue";

const formatTime = require('silly-datetime');

/**
 * @description 过滤时间
 * @return YYYY-MM-DD
 **/
Vue.filter("formatDate", function (time) {
  if (!time) return '';
  return formatTime.format(time, 'YYYY-MM-DD');
});

/**
 * @description 过滤时间
 * @return YYYY-MM-DD hh:mm:ss
 **/
Vue.filter("formatDateTime", function (time) {
  if (!time) return '';
  return formatTime.format(time, 'YYYY-MM-DD HH:mm:ss');
});

/**
 * @description 过滤时间
 * @return YYYY-MM-DD hh:mm
 **/
Vue.filter("formatDateTime2", function (time) {
  if (!time) return '';
  return formatTime.format(time, 'YYYY-MM-DD HH:mm');
});
