import {NODE_ENV} from '../environment'

const apisMap = {
  development: {
    FE: 'http://localhost:3000',
    BASE: 'http://localhost:8099/vertical',
    CDN: '',
    PROXY: '/proxy',
    SOCKET: 'http://localhost:3000',
    GRAVATAR: '/proxy/static.rymcu.com/avatar'
  },
  production: {
    FE: 'http://120.26.175.127',
    BASE: 'http://120.26.175.127',
    CDN: 'https://cdn.rymcu.com',
    PROXY: 'https://cdn.rymcu.com/proxy',
    SOCKET: 'http://120.26.175.127',
    GRAVATAR: 'https://static.rymcu.com/avatar'
  }
}

export default apisMap[NODE_ENV]
