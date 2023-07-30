
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const cors = require('cors')
export const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

var bodyParser = require('body-parser')

// parse application/json
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))

const users = {};

const socketToRoom = {};


import { Socket } from "socket.io";
import apiRoutes from './routes/api';
import { socketsMeeting } from './sockets/meeting';

app.use(apiRoutes)




io.on('connection', (socket: Socket) => {
    // Starter sockets
    socketsMeeting(socket)

    socket.on("join room", roomID => {
        if (users[roomID]) {
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
        socket.broadcast.emit('user left', socket.id)
    });

    socket.on('leave_meeting_room', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
        socket.broadcast.emit('user left', socket.id)
    });

    socket.on('change', (payload) => {
        socket.broadcast.emit('change', payload)
    });


});


server.listen(8000, () => console.log('server is running...'));

