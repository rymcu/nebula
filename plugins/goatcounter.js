// plugins/goatcounter.js

export default ({ app }) => {
  // 检查 window 是否已经定义，因为插件在服务端渲染时也会执行
  if (process.client) {
    // 创建 script 标签
    let script = document.createElement('script');
    script.async = true;
    script.dataset.goatcounter = "https://statis.atduck.com/count";
    script.src = "//statis.atduck.com/count.js";

    // 将 script 标签插入到页面中
    document.head.appendChild(script);
  }
};
