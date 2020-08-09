const { Nuxt, Builder } = require('nuxt')

const http = require('http')
const app = require('express')()
const socketio = require('socket.io')
const isProd = (process.env.NODE_ENV === 'production')
const port = process.env.PORT || 3000

// 用指定的配置对象实例化 Nuxt.js
const config = require('./nuxt.config.js')
config.dev = !isProd
const nuxt = new Nuxt(config)
const server = new http.Server(app)
const io = socketio(server, { transports: ['websocket'] })

// 用 Nuxt.js 渲染每个路由
app.use(nuxt.render)
app.set("port", port)

// 在开发模式下启用编译构建和热加载
if (config.dev) {
  new Builder(nuxt).build()
    .then(listen)
} else {
  listen()
}

function listen () {
  // 服务端监听
  app.listen(port, '0.0.0.0')
  console.log('Server listening on `localhost:' + port + '`.')
}

// Socket.io
const messages = []
io.on('connection', (socket) => {
  socket.on('last-messages', function (fn) {
    console.log('messages-server', messages);
    fn(messages.slice(-50))
  });

  socket.on('all', function (message) {
    console.log('message-server', message);
    messages.push(message)
    socket.broadcast.emit('new-message', message)
  });

})
