import socket from 'socket.io';
import {application} from './config';
import client from "./utils/redis";
import friendRequests from "../src/socket/friendRequests";
import conversation from "./socket/conversations";
import message from "./socket/messages";
import {user} from "./modules/user/user.resolver";
const i18n = require('i18n');
const path = require('path');

const users = {};

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
    io.on('connection', (socket) => {
        const req = socket.request;
        i18n.init(req);
        const locale = req.headers['accept-language'] || 'en';
        i18n.setLocale(locale);
        let key;
        socket.on("SET_USER_ID", async (id) => {
            if (id) users[`${id}`] = socket;
            key = id;
        });
        socket.on("CREATE_CONVERSATION", (data) => {
           socket.emit("SEND_NEW_CONVERSATION", data);
        });
        friendRequests(socket, users);
        conversation(socket, users);
        message(socket, io, users);
        socket.on('disconnect', async function () {
            console.log(req.__("socket.disconnect"));
            delete users[key];
        });
    });
}