import http from 'http'
import socketIO from 'socket.io'

export default function () {
  this.nuxt.hook('render:before', (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app)
    const io = socketIO(server)

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => new Promise(resolve => server.listen(port || 3000, host || 'localhost', resolve))
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close))

    // Add socket.io events
    const messages = []
    io.on('connection', (socket) => {
      socket.on('last-messages', function (fn) {
        console.log('messages-client', messages);
        fn(messages.slice(-50))
      })
      socket.on('all', function (message) {
        console.log('message-client', message);
        messages.push(message)
        socket.broadcast.emit('new-message', message)
      })
    })
  })
}
