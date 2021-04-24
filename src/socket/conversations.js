import {logger} from "../helpers/customLogger";
import REPOSITORY from '../repositories';
import {conversations, sequelize, participants, users, messages} from '../models';

const conversation = (socket) => {
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
            socket.emit("GET_CONVERSATION_SUCCESS", result);
        } catch (error) {
            logger.error(`error in get conversation socket ${error.message}`);
            socket.emit("FAILURE", error.message);
        }
    });

}

export default conversation;