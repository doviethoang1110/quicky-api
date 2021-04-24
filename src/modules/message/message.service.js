import {logger} from "../../helpers/customLogger";
import REPOSITORY from '../../repositories';
import {messages, users} from '../../models';

export const findListMessages = async (where, attributes, page, limit) => {
    try {
        let totalPage;
        let currentPage = page;
        if (page) {
            const temp = (page - 1) * limit
            page = temp > 0 ? temp : 0;
        }
        let result = await REPOSITORY.findAndCountAll(messages, {
            where,
            attributes,
            limit,
            offset: page,
            order: [
                ['createdAt', 'DESC']
            ],
            include: [
                {
                    model: users,
                    as: 'users',
                    attributes: ['id', 'name', 'avatar']
                }
            ]
        });
        if (result.rows.length > 0) totalPage = Math.ceil(result.count / limit);
        else totalPage = 0;
        return {totalPage, currentPage, messages: result.rows.reverse() || []};
    } catch (e) {
        logger.error(`error in find list message ${e.message}`);
        throw e;
    }
}