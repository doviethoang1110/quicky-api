import {sequelize} from "../../models";
import {logger} from "../../helpers/customLogger";

export const findListFriendsService = async (where, page, limit) => {
    try {
        if (page) {
            const temp = (page - 1) * limit
            page = temp > 0 ? temp : 0;
        }
        let result = await sequelize.query('call findListFriends(:in_usersId, :in_username, :in_offset, :in_limit, @out_totalCount);select @out_totalCount;', {
            replacements: {
                in_usersId: where.id || 0,
                in_username: where.name || null,
                in_offset: page || 0,
                in_limit: limit || 999
            },
            type: sequelize.QueryTypes.SELECT
        });
        const response = {
            totalPage: Math.ceil(result[2][0]['@out_totalCount'] / limit),
            currentPage: page + 1
        };
        result = Object.values(result[0]).map(r => ({...r}));
        if (result.length > 0) return {users: result, ...response};
        else return {users: null, ...response};
    } catch (error) {
        logger.error(`relationship service paginate ${error.message}`);
        throw error;
    }
}