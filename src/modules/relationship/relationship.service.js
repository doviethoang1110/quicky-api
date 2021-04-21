import REPOSITORY from "../../repositories";
import {relationships, users, sequelize} from "../../models";
import {logger} from "../../helpers/customLogger";
import _ from 'lodash';

export const findListFriendsService = async (where, limit, page) => {
    try {
        const whereFilter = _.pick(where, ['id']);
        const result = await sequelize.query('call findListFriends(:in_usersId)', {
            replacements: {
                in_usersId: whereFilter.id || 0
            }
        });
        if (result.length > 0) return result;
        else return [];
    } catch (error) {
        logger.error(`relationship service paginate ${error.message}`);
        throw error;
    }
}