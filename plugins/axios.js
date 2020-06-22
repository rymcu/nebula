import apiConfig from '~/config/api.config'

export default function ({ app: { $axios, $cookies } }) {
  $axios.defaults.baseURL = apiConfig.BASE
  $axios.defaults.timeout = 30000
  $axios.interceptors.request.use(config => {
    config.headers['X-Token'] = $cookies.get('token') || ''
    config.headers['X-Device-Id'] = $cookies.get('clientId') || ''
    config.headers['X-Uid'] = $cookies.get('userId') || ''
    return config
  })
  $axios.interceptors.response.use(response => {
    if (/^[4|5]/.test(response.status)) {
      return Promise.reject(response.statusText)
    }
    let message;
    if (typeof(response.data.data) !== 'undefined') {
      message = response.data.data.message
    } else if (typeof(response.data) !== 'undefined') {
      message = response.data.message
    }
    console.log(message);
    if (response.data.success) {
      return response.data.data
    }
    return response.data
  })
}
