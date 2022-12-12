const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter')
const frontendHost = process.env.FRONTEND_HOST
const redisHost = process.env.REDIS_HOST
console.log("FRONTEND_HOST: ", frontendHost)
console.log("REDIS_HOST: ", redisHost)
console.log("REDIS URI: ", `redis://${redisHost}`)
const io = new Server(server, { cors: { origin: `${frontendHost}`}});
const port = 3000
const client = createClient({ url: `redis://${redisHost}` });
var ROOM_NUMBER = 1
const subClient = client.duplicate();

Promise.all([client.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(client, subClient));
    io.on('connection', (socket) => {
        console.log('User connected');
        console.log("Session ID: " + socket.id)
        socket.join('room' + ROOM_NUMBER);

        retrieveUpdate(socket, ROOM_NUMBER);

        socket.on('canvas-clear', () => {
            client.del('canvas-update-room' + ROOM_NUMBER)
            retrieveUpdate(socket, ROOM_NUMBER)
        })
        socket.on('canvas-update', (data) => {
            io.to('room' + ROOM_NUMBER).emit('canvas-update', data);
            setUpdate(ROOM_NUMBER, data);
        })
    })
});

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
            io.to("room" + roomNumber).emit('canvas-update', result)
           // socket.emit('canvas-update', result)
        } else {
            io.to("room" + roomNumber).emit('canvas-update', null)
        }
    }
    )
    
}

server.listen(port, () => {
  console.log(`Whiteboard backend listening on port ${port}`)
})
