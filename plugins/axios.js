// const Cookie = require('js-cookie')
export default function ({app, $axios, store, redirect}) {
  $axios.onRequest(config => {
    let token = store.state.oauth?.accessToken;
    if (token) {
      if (!(config.url.indexOf('console') > -1)) {
        config.headers['Authorization'] = store.state.oauth?.accessToken
      }
    }
  })
  $axios.onResponse(response => {
    return new Promise((resolve, reject) => {
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
        if (response.data.code === '0') {
          app.$message(message);
        } else if (response.data.code === '401') {
          // Cookie.remove('auth')
          store.commit('setAuth', null);
        } else if (response.data.code === '402') {
          // Cookie.remove('auth')
          store.commit('setAuth', null);
        } else if (response.data.code === '404') {
          app.$message('操作失败，请稍后再试......')
        } else if (response.data.code === '500') {
          app.$message('服务器正在开小差，请稍后再试......')
        }
      }
      reject(response);
    })
  });
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400');
    } else {
      console.log(error, error.data);
    }
  })
}
