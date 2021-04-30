import {logger} from "../helpers/customLogger";
import REPOSITORY from '../repositories';
import {conversations, sequelize, participants, users, messages} from '../models';
import client from "../utils/redis";

const conversation = (socket, usersInSystem) => {
    socket.on("GET_CONVERSATION", async (id) => {
        try {
            const result = await REPOSITORY.findOne(conversations, {
                where: {
                    id,
                },
                attributes: ['id', 'name', 'image', 'type'],
                include: [
                    {
                        model: participants,
                        as: 'participants',
                        attributes: ['usersId'],
                        include: [
                            {
                                model: users,
                                as: 'users',
                                attributes: ['name', 'avatar', 'email', 'phone']
                            }
                        ]
                    },
                    {
                        model: messages,
                        as: 'messages',
                        required: true,
                        attributes: ['id', 'type', 'message', 'createdAt'],
                        order: [
                            ['createdAt', 'DESC']
                        ],
                        limit: 10,
                        offset: 0,
                        include: [
                            {
                                model: users,
                                as: 'users',
                                attributes: ['id', 'name', 'avatar']
                            }
                        ]
                    }
                ]
            });
            if (result.participants && result.participants.length > 0) {
                let foundConversation = await client.getAsync(`conversation${result.id}`);
                foundConversation = foundConversation && typeof foundConversation === 'string' && JSON.parse(foundConversation);
                if (!foundConversation || (result.participants.length !== foundConversation.length)) {
                    const array = result.participants.map(p => p.usersId);
                    await client.setAsync(`conversation${result.id}`, JSON.stringify(array));
                }
                result.participants.map(p => {
                    const found = usersInSystem[`${p.usersId}`];
                    if (found) {
                        const room = [...found.rooms].find(r => `conversation${result.id}` === r);
                        if (!room) found.join(`conversation${result.id}`);
                    }
                })
            }
            socket.emit("GET_CONVERSATION_SUCCESS", result);
        } catch (error) {
            logger.error(`error in get conversation socket ${error.message}`);
            socket.emit("FAILURE", error.message);
        }
    });

}

export default conversation;