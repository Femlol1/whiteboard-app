const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { cors: { origin: "http://localhost:5173"}});
const port = 3000

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('canvas-update', (data) => {
      socket.broadcast.emit('canvas-update', data);
    })
})

server.listen(port, () => {
  console.log(`Whiteboard backend listening on port ${port}`)
})
