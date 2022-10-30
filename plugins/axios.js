import {Message} from 'element-ui'

export default function ({app, $axios, store, redirect}) {

  function generateReqKey(config) {
    const { method, url, params, data } = config;
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
  }

  const pendingRequest = new Map();
  function addPendingRequest(config) {
    const requestKey = generateReqKey(config);
    config.cancelToken = config.cancelToken || new $axios.CancelToken((cancel) => {
      if (!pendingRequest.has(requestKey)) {
        pendingRequest.set(requestKey, cancel);
      }
    });
  }

  function removePendingRequest(config) {
    const requestKey = generateReqKey(config);
    if (pendingRequest.has(requestKey)) {
      const cancelToken = pendingRequest.get(requestKey);
      cancelToken(requestKey);
      pendingRequest.delete(requestKey);
    }
  }

  $axios.onRequest(config => {
    let fingerprint = store.state.fingerprint;
    if (fingerprint) {
      config.headers['fingerprint'] = fingerprint
    }
  })

  $axios.interceptors.request.use(
    function (config) {
      // 检查是否存在重复请求，若存在则取消已发的请求
      removePendingRequest(config);
      // 把当前请求信息添加到pendingRequest对象中
      addPendingRequest(config);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  $axios.onResponse(response => {
    return new Promise((resolve, reject) => {
      removePendingRequest(response.config);
      //返回数据逻辑处理 比如：error_code错误处理
      let message;
      if (typeof (response.data.data) !== 'undefined') {
        message = response.data.data.message
      } else if (typeof (response.data) !== 'undefined') {
        message = response.data.message
      }
      if (response.data.success) {
        resolve(response.data);
      } else {
        if (response.data.code === 0) {
          Message.error(message ? message : '服务异常')
        } else if (response.data.code === 401) {
          app.$auth.logout()
        } else if (response.data.code === 404) {
          Message.error('操作失败，请稍后再试......')
        } else if (response.data.code === 500) {
          Message.error('服务器正在开小差，请稍后再试......')
        } else {
          Message.error(response.data.message);
        }
      }
      reject(response);
    })
  });

  $axios.onError(error => {
    removePendingRequest(error.config || {}); // 从pendingRequest对象中移除请求
    if ($axios.isCancel(error)) {
      // console.log("已取消的重复请求：" + error.message);
    } else {
      // 添加异常处理
      const code = parseInt(error.response && error.response.status)
      if (code === 400) {
        redirect('/400');
      } else {
        console.log(error.data);
      }
    }

  })
}
