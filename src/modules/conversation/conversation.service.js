import REPOSITORY from "../../repositories";
import {conversations, users, messages, participants} from "../../models";
import responseMessages from "../../helpers/responseMessages";
import HttpStatusCode from "../../constants";
import {logger} from "../../helpers/customLogger";
import _ from 'lodash';

export const store = async (param) => {
    try {
        const paramConversation = _.omit(param, ['participants']);
        let paramParticipants = _.pick(param, ['participants']);
        const conversation = await REPOSITORY.create(conversations, paramConversation);
        if (paramParticipants.participants) {
            paramParticipants = paramParticipants.participants.map(p => (
                {
                    usersId: p,
                    conversationsId: conversation.id
                }
            ));
        }
        if (paramParticipants && paramParticipants.length >= 2)
            await REPOSITORY.bulkCreate(participants, paramParticipants)
        return responseMessages.responseSuccess(HttpStatusCode.OK, conversation);
    } catch (err) {
        logger.error(`Error in store conversation service ${err.message}`);
        throw err;
    }
}

export const findListConversation = async (filter, attributes, page, limit) => {
    try {
        if (page) {
            const temp = (page - 1) * limit
            page = temp > 0 ? temp : 0;
        }
        let result = await REPOSITORY.findAndCountAll(participants, {
            where: {
                usersId: filter.usersId
            },
            limit,
            offset: page,
            attributes: ['conversationsId'],
            include: [
                {
                    model: conversations,
                    as: 'conversations',
                    attributes,
                    include: [
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
                }
            ]
        });
        let totalPage;
        let currentPage;
        if (result.rows.length > 0) {
            totalPage = Math.ceil(result.count / limit);
            result = result.rows.reduce((a, b) => {
                a.push(
                    {
                        id: b.conversations.id,
                        name: b.conversations.name,
                        type: b.conversations.type,
                        image: b.conversations.image,
                        lastMessage: {
                            message: b.conversations?.lastMessage?.message || "",
                            type: b.conversations?.lastMessage?.type || "",
                            user: {
                                name: b.conversations?.lastMessage?.users?.name || ""
                            }
                        },
                    }
                )
                return a;
            }, []);
        } else {
            result = [];
            totalPage = 0;
        }
        currentPage = page + 1;
        return {totalPage, currentPage, conversations: result};
    } catch (error) {
        logger.error(`conversation service paginate ${error.message}`);
        throw error;
    }
}