import {NODE_ENV} from '../environment'

const apisMap = {
  development: {
    FE: 'http://localhost:3000',
    BASE: 'https://rymcu.com/vertical-console',
    CDN: '',
    PROXY: '/proxy',
    SOCKET: 'http://localhost:3000',
    GRAVATAR: '/proxy/static.rymcu.com/avatar'
  },
  production: {
    FE: 'https://rymcu.com',
    BASE: 'https://api.rymcu.com',
    CDN: 'https://cdn.rymcu.com',
    PROXY: 'https://cdn.rymcu.com/proxy',
    SOCKET: 'https://rymcu.com',
    GRAVATAR: 'https://static.rymcu.com/avatar'
  }
}

export default apisMap[NODE_ENV]
