import {NODE_ENV} from '../environment'

const apisMap = {
  development: {
    FE: 'http://localhost:3000',
    BASE: 'http://localhost:8099/forest',
    CDN: '',
    PROXY: '/proxy',
    SOCKET: 'http://localhost:3000/ws',
    GRAVATAR: '/proxy/static.rymcu.com/avatar'
  },
  production: {
    FE: 'https://rymcu.com',
    BASE: 'https://rymcu.com',
    CDN: 'https://static.rymcu.com',
    PROXY: 'https://static.rymcu.com/proxy',
    SOCKET: 'https://rymcu.com/ws',
    GRAVATAR: 'https://static.rymcu.com/avatar'
  }
}

export default apisMap[NODE_ENV]
