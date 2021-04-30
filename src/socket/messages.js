import {logger} from "../helpers/customLogger";
import REPOSITORY from '../repositories';
import {conversations, sequelize, participants, users, messages} from '../models';
import client from "../utils/redis";

const message = (socket, io) => {
    socket.on("NEW_CHAT", async ({id, name, type = 'single', image, creatorId, participants: array}) => {
        try {
            const result = await REPOSITORY.findOne(conversations, {
                where: {type},
                attributes: ['id', 'name', 'type', 'image'],
                include: [
                    {
                        model: participants,
                        as: 'participants',
                        attributes: [],
                        where: {usersId: {$in: array}}
                    },
                    {
                        model: messages,
                        as: 'lastMessage',
                        attributes: ['message', 'type'],
                        include: [
                            {
                                model: users,
                                as: 'users',
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            });
            if (result) socket.emit("SEND_NEW_CONVERSATION", result);
            else {
                const request = {id, name, type, image, creatorId, participants: array};
                // console.log(request)
                socket.emit("SEND_NEW_CONVERSATION", request);
            }
        } catch (error) {
            logger.error(`error in get conversation socket ${error.message}`);
            socket.emit("FAILURE", error.message);
        }
    });

    socket.on("GET_NEW_CHAT", async (data) => {
        socket.emit("GET_CONVERSATION_SUCCESS", data);
    });

    socket.on("SEND_MESSAGE", async data => {
        io.to(`conversation${data.conversationsId}`).emit("RECEIVE_MESSAGE", data);
        // const found = JSON.parse(await client.getAsync(`messages_conversation${data.conversationsId}`));
        // if (found) await client.setAsync(`messages_conversation${data.conversationsId}`, JSON.stringify([...found, data]))
        // else await client.setAsync(`messages_conversation${data.conversationsId}`, JSON.stringify([data]));
    });

    socket.on("TYPING", async (data) => {
        socket.broadcast.to(`conversation${data.conversationsId}`).emit("TYPING_MESSAGE", {
            conversationsId: data.conversationsId,
            name: data.name,
            avatar: data.avatar,
            type: data.type
        });
    });

    socket.on("CLEAR_TYPING", async (data) => {
        socket.broadcast.to(`conversation${data.conversationsId}`).emit("RECEIVE_CLEAR_TYPING", data);
    })
}

export default message;