import Vue from 'vue'
import VueSSE from 'vue-sse';

// using defaults
Vue.use(VueSSE);

// OR specify custom defaults (described below)
Vue.use(VueSSE, {
  format: 'json',                 //数据格式
  url: '/',       //路径
  withCredentials: true,          //标识为open？ // withCredentials should be set after "open" for Safari and Chrome (< 19 ?)
  forcePolyfill:false,            //强制使用原生SSE，使用另一个库event-source-polyfill
  polyfill: true,                 //支持旧版浏览器
  polyfillOptions:null,           //配置参数
});
