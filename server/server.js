const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
const redis = require("redis")
const server = http.createServer(app)
const { Server } = require('socket.io')
const { createClient } = require('./node_modules/redis/dist/index.js');
const { RedisAdapter } = require('./node_modules/socket.io-redis/dist/index')
const { createAdapter } = require('./node_modules/socket.io-redis/dist/index.js')
const io = new Server(server, { cors: { origin: "http://localhost:5173"}});
const port = 3000
const redisURI = "redis://127.0.0.1:6379"
const client = createClient(redisURI);
var ROOM_NUMBER = 1




const subClient = client.duplicate();



async function setUpdate(roomNumber,uriData) {
    try {
        await client.set("canvas-update-room" + roomNumber, uriData);

    } catch (e) {
        console.log(e);
    }
    

}

async function retrieveUpdate(socket, roomNumber) {
    let uriData = await client.get('canvas-update-room' + roomNumber).then(function (result) {
        if (result != null) {
            //console.log("Recieved drawing url: ")
            io.to("room" + roomNumber).emit('canvas-update', null)
           // socket.emit('canvas-update', result)
        } else {
            io.to("room" + roomNumber).emit('canvas-update', null)
        }
    }
    )
    
}




Promise.all([client.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(client, subClient));

    io.on('connection', (socket) => {
        console.log('User connected');
        console.log("Session ID: " + socket.id)
        socket.join('room' + ROOM_NUMBER);
        // socket.join('room1');
       // console.log(io.sockets.adapter.rooms);
        // storeData(change);

        retrieveUpdate(socket, ROOM_NUMBER);

        socket.on('canvas-clear', () => {
          //  console.log("Cleared")
            client.del('canvas-update-room' + ROOM_NUMBER)
            retrieveUpdate(socket, ROOM_NUMBER)
           // io.to('room' + ROOM_NUMBER).brodcast('canvas-clear')
        })
        socket.on('canvas-update', (data) => {
          //  console.log('Client drew');
            
            io.to('room' + ROOM_NUMBER).emit('canvas-update', data);
            setUpdate(ROOM_NUMBER, data);
            
        })
    })



});




server.listen(port, () => {
  console.log(`Whiteboard backend listening on port ${port}`)
})
