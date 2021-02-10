"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router_1 = __importDefault(require("./router"));
const PORT = process.env.PORT || 5000;
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error)
            return callback(error);
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
        //dat vedem vsem ze prisel user
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
        socket.join(user.room);
        callback();
    });
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: message });
        callback();
    });
    socket.on('disconnect', () => {
        console.log('User had left!');
    });
});
app.use(router_1.default);
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
//# sourceMappingURL=server.js.map