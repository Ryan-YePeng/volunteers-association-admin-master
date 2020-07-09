import Vue from "vue";
// 路由
import router from "./router";
// vuex
import store from "./store";
// 样式初始化
import "./styles/init.css";
// 全局样式
import "./styles/global.css";
// element-ui
import './utils/EUI';
// 右键菜单
import EVueContextmenu from 'e-vue-contextmenu';
// 滚动条
import vuescroll from 'vuescroll/dist/vuescroll-native';
// 自定义指令
import './utils/directive';
// 过滤
import './utils/filter';
// 树状选择器
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
// svg
import './assets/icons';
// App
import App from "./App.vue";

Vue.use(EVueContextmenu);
Vue.component('vue-scroll', vuescroll);
Vue.prototype.$fileSaver = require('file-saver');

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
