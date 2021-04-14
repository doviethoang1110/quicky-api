import socket from 'socket.io';
import {application} from './config';
import {checkToken} from "./socket/checkToken";
import client from "./utils/redis";
import friendRequests from "../src/socket/friendRequests";

export const initialize = server => {
    const io = socket(server, {
        cors: {
            origin: application.origin,
            methods: application.methods,
            allowedHeaders: application.headers,
        }
    });
    io.use(async (socket, next) => {
        try {
            await checkToken(socket);
            next();
        } catch (error) {
            next(error)
        }
    }).on('connection', (socket) => {
        socket.on("SET_USER_ID", async (id) => {
            await client.setAsync(`${id}`, `${socket.id}`);
        });
        friendRequests(socket);
        socket.on('disconnect', function () {
            console.log('disconnect')
        });
    });
}