import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

import apiConfig from '~/config/api.config'

export default {
  socket: null,
  stompClient: null,
  headers: null,
  successCallback() {
    let _ts = this;
    _ts.stompClient.subscribe(`/user/${_ts.headers.id}/message`, (msg) => {
      let message = JSON.parse(msg.body);
      console.log(message.dataType)
      switch (message.dataType) {
        case 0:
          console.log(message.content)
          break;
        case 1:
          console.log(message.to)
          break;
        default:
          console.log(message)
      }
    }, _ts.headers);
    _ts.stompClient.subscribe('/topic/greening', (msg) => {
      console.log('pub', JSON.parse(msg.body));
    }, _ts.headers);
  },
  initSocket: function (user) {
    let _ts = this;
    _ts.socket = new SockJS(apiConfig.SOCKET);
    _ts.stompClient = Stomp.over(_ts.socket);
    let headers = {
      id: user.account
    }
    _ts.headers = headers;
    _ts.stompClient.connect(_ts.headers, () => {
      _ts.successCallback();
    }, (err) => {
      console.log(err)
      _ts.reconnect(apiConfig.SOCKET, _ts.successCallback)
    })
  },
  // 断开重连使用定时器定时连接服务器
  reconnect(socketUrl, successCallback) {
    console.info('in reconnect function')
    let connected = false
    let _ts = this
    const reconInv = setInterval(() => {
      console.info('in interval' + Math.random())
      _ts.socket = new SockJS(socketUrl)
      _ts.stompClient = Stomp.over(this.socket)
      _ts.stompClient.connect({}, (frame) => {
        console.info('reconnected success')
        // 连接成功，清除定时器
        clearInterval(reconInv)
        connected = true
        successCallback()
      }, () => {
        console.info('reconnect failed')
        console.info('connected:' + connected)
        if (connected) {
          console.info('connect .... what?')
        }
      })
    }, 2000)
  },
  sendMessage: function (message) {
    this.stompClient.send('/app/message', {}, JSON.stringify(message))
  }
}
