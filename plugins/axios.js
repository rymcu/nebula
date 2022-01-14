import {Message} from 'element-ui'

const Cookie = process.client ? require('js-cookie') : undefined
export default function ({app, $axios, store, redirect}) {
  $axios.onRequest(config => {
    let fingerprint = store.state.fingerprint;
    if (fingerprint) {
      config.headers['fingerprint'] = fingerprint
    }
    let token = store.state.oauth?.accessToken;
    if (token) {
      // if (!(config.url.indexOf('console') > -1 || config.url.indexOf('comments') > -1)) {
      // }
      config.headers['Authorization'] = token
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
        if (response.data.code === 0) {
          Message.error(message ? message : '服务异常')
        } else if (response.data.code === 401) {
          Cookie.remove('auth');
          store.commit('setAuth', null);
          window.location.reload()
        } else if (response.data.code === 402) {
          Cookie.remove('auth');
          store.commit('setAuth', null);
          window.location.reload()
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
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400');
    } else {
      console.log(error.data);
    }
  })
}
