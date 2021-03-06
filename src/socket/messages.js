import {logger} from "../helpers/customLogger";
import REPOSITORY from '../repositories';
import {conversations, sequelize, participants, users, messages} from '../models';
import client from "../utils/redis";
import _ from 'lodash';
import {where} from "sequelize";

const message = (socket, io, usersInSystem) => {
    socket.on("NEW_CHAT", async ({id, name, type = 'single', image, participants: array}) => {
        try {
            const result = await REPOSITORY.findOne(conversations, {
                where: {type},
                attributes: ['id', 'name', 'type', 'image'],
                include: [
                    {
                        model: participants,
                        as: 'participants',
                        attributes: ['usersId'],
                        where: {usersId: {$in: array}},
                        include: [
                            {
                                model: users,
                                as: 'users',
                                attributes: ['name', 'avatar']
                            }
                        ]
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
            if (result && result.participants.length === 2) socket.emit("SEND_NEW_CONVERSATION", result);
            else {
                const request = {id, name, type, avatar: image, participants: array};
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
        if (data.conversationsId) {
            await Promise.all([
                io.to(`conversation${data.conversationsId}`).emit("RECEIVE_MESSAGE", data),
                io.to(`conversation${data.conversationsId}`).emit("RECEIVE_MESSAGE_ASIDE", data)
            ]);
            const found = JSON.parse(await client.getAsync(`messages_conversation${data.conversationsId}`));
            await client.setAsync(`messages_conversation${data.conversationsId}`, JSON.stringify(
                found ? [...found, data] : [data]
            ));
        } else {
            const conversation = await REPOSITORY.create(conversations, {creatorId: data.usersId});
            const [mess] = await Promise.all([
                REPOSITORY.create(messages, {
                    conversationsId: conversation.id,
                    usersId: data.usersId,
                    message: data.message
                }),
                REPOSITORY.bulkCreate(participants, data.participants.map(p => {
                    const found = usersInSystem[`${p}`];
                    if (found) {
                        const room = [...found.rooms].find(r => `conversation${conversation.id}` === r);
                        if (!room) found.join(`conversation${conversation.id}`);
                    }
                    return {
                        conversationsId: conversation.id,
                        usersId: p
                    }
                }))
            ]);
            const [newVar] = await Promise.all([
                REPOSITORY.findOne(conversations, {
                    where: {id: conversation.id}, attributes: ['id', 'type'], include: [
                        {
                            model: participants,
                            as: 'participants',
                            attributes: ['usersId'],
                            include: [
                                {
                                    model: users,
                                    as: 'users',
                                    attributes: ['name', 'avatar']
                                }
                            ]
                        }
                    ]
                }),
                REPOSITORY.update(conversations, {lastMessageId: mess.id}, {where: {id: conversation.id}})
            ]);
            const response = {
                ...data,
                conversationsId: conversation.id,
                type: conversation.type,
                participants: newVar.participants
            };
            io.to(`conversation${conversation.id}`).emit("RECEIVE_MESSAGE", response);
            io.to(`conversation${conversation.id}`).emit("RECEIVE_MESSAGE_ASIDE", response);
        }
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
    });

    socket.on("INSERT_MESSAGES", async data => {
        const array = JSON.parse(await client.getAsync(`messages_conversation${data}`));
        if (array && array.length > 0) {
            await REPOSITORY.bulkCreate(messages, array.map(a => (_.omit(a, ['name', 'type']))));
            const found = await REPOSITORY.findOne(messages, {
                where: {
                    conversationsId: data
                },
                order: [['createdAt', 'DESC']]
            });
            await Promise.all([
                client.delAsync(`messages_conversation${data}`),
                REPOSITORY.update(conversations, {lastMessageId: found.id}, {where: {id: data}})
            ])
        }
    })
}

export default message;