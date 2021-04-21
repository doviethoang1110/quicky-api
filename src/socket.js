import socket from 'socket.io';
import {application} from './config';
import {checkToken} from "./socket/checkToken";
import client from "./utils/redis";
import friendRequests from "../src/socket/friendRequests";
const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['en', 'vi'],
    defaultLocale: 'vi',
    fallbacks: {vi: 'en'},
    directory: path.join(__dirname, './locales')
})

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
        const req = socket.request;
        i18n.init(req);
        const locale = req.headers['accept-language'] || 'en';
        i18n.setLocale(locale);
        socket.on("SET_USER_ID", async (id) => {
            await client.setAsync(`${id}`, `${socket.id}`);
        });
        friendRequests(socket);
        socket.on('disconnect', function () {
            console.log(req.__("socket.disconnect"))
        });
    });
}