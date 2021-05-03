import REPOSITORY from "../../repositories";
import {conversations, users, messages, participants} from "../../models";
import responseMessages from "../../helpers/responseMessages";
import HttpStatusCode from "../../constants";
import {logger} from "../../helpers/customLogger";
import _ from 'lodash';
import filterHelpers from "../../helpers/filterHelpers";

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
        let whereFilterName = _.pick(filter, ['name', 'type']);
        let whereFilter = _.omit(filter, ['name', 'type']);
        if (Object.keys(whereFilterName).length > 0) {
            if (whereFilterName.type === 'all') delete whereFilterName.type;
            whereFilterName = await filterHelpers.makeStringFilterRelatively(['name'], whereFilterName, 'conversations');
        }
        let result = await REPOSITORY.findAndCountAll(conversations, {
            where: Object.keys(whereFilterName).length > 0 ? whereFilterName : {},
            limit,
            offset: page,
            order: [
                ['updatedAt', 'DESC']
            ],
            attributes: [...attributes, 'updatedAt'],
            include: [
                {
                    model: participants,
                    as: 'participants',
                    attributes: ['usersId'],
                    where: whereFilter
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
        let totalPage;
        let currentPage;
        if (result.rows.length > 0) {
            const peoples = await REPOSITORY.findAll(conversations, {
                where: {
                    id: {$in: result.rows.map(r => r.id)}
                },
                attributes: ['id'],
                include: [
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
            });
            totalPage = Math.ceil(result.count / limit);
            result = result.rows.reduce((a, b) => {
                return [...a, {
                    id: b.id,
                    name: b.name,
                    type: b.type,
                    image: b.image,
                    updatedAt: b.updatedAt,
                    lastMessage: {
                        message: b?.lastMessage?.message || "",
                        type: b?.lastMessage?.type || "",
                        users: {
                            name: b?.lastMessage?.users?.name || ""
                        }
                    },
                    participants: peoples.find(p => p.id === b.id).participants.map(p => ({
                        id: p.usersId,
                        name: p.users.name,
                        avatar: p.users.avatar
                    }))
                }];
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