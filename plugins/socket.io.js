import io from 'socket.io-client'
import apiConfig from '~/config/api.config'

const socket = io(apiConfig.SOCKET, {
  transports: ['websocket']
})

export default socket
