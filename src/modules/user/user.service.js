import REPOSITORY from '../../repositories';
import {sequelize, Op} from '../../models';
import {users, relationships} from '../../models';
import {logger} from "../../helpers/customLogger";
import responseMessages from "../../helpers/responseMessages";
import HttpStatusCode from "../../constants";
import i18n from 'i18n';
import bcrypt from "bcrypt";

export const update = async (id, entity) => {
    try {
        const found = await REPOSITORY.findOne(users, {
            where: {email: {$like: entity.email}, id: {$ne: id}},
            attributes: ['id']
        });
        if (found) return responseMessages.responseError(HttpStatusCode.RECORD_EXIST, {message: i18n.__("user.exist")});
        await REPOSITORY.update(users, entity, {where: {id}});
        const finalResult = await REPOSITORY.findOne(users, {
            where: {id},
            attributes: ['id', 'name', 'email', 'phone', 'birthday']
        });
        return responseMessages.responseSuccess(HttpStatusCode.OK, finalResult);
    } catch (e) {
        logger.error(`user service ${e.message}`);
        throw e;
    }
};

export const findUsersById = async (usersId, id) => {
    try {
        const found = await REPOSITORY.findOne(relationships, {
            attributes: ['status', 'userActionId'],
            where: {
                $or: [
                    {
                        senderId: usersId,
                        receiverId: id
                    },
                    {
                        receiverId: usersId,
                        senderId: id
                    }
                ]
            },
            include: [
                {
                    model: users,
                    as: 'senders',
                    required: true,
                    attributes: ['id', 'name', 'email', 'avatar', 'birthday']
                },
                {
                    model: users,
                    as: 'receivers',
                    required: true,
                    attributes: ['id', 'name', 'email', 'avatar', 'birthday']
                },
            ]
        });
        if (found?.senders || found?.receivers) {
            const newArray = [found.senders.dataValues, found.receivers.dataValues];
            const result = newArray.reduce((a, b) => {
                if (+b.id === +id) return {...a, ...b, status: found.status, userActionId: found.userActionId};
                else return a;
            }, {});
            if (!found || !result) throw new Error('NOT FOUND');
            return result;
        } else {
            const temp = await REPOSITORY.findOne(users, {
                where: {
                    id
                },
                attributes: ['id', 'name', 'email', 'avatar', 'birthday']
            });
            return {...temp.dataValues, status: null, userActionId: null};
        }
    } catch (e) {
        logger.error(`user service ${e.message}`);
        throw e;
    }
}

export const paginate = async (where, limit, page) => {
    try {
        if (page) {
            const temp = (page - 1) * limit
            page = temp > 0 ? temp : 0;
        }
        const result = await REPOSITORY.findAndCountAll(users, {
            where,
            attributes: ['id', 'name', 'avatar'],
            limit,
            offset: page * limit
        });
        const response = {
            totalPage: Math.ceil(result.count / limit),
            currentPage: page
        };
        if (result.rows) return {users: result.rows, ...response}
        else return response;
    } catch (error) {
        logger.error(`user service paginate ${error.message}`);
        throw error;
    }
};

export const changePass = async (id, {password, newPassword}) => {
    try {
        const found = await REPOSITORY.findOne(users, {
            where: {id},
            attributes: ['id', 'password']
        });
        if (!found) return responseMessages.responseError(HttpStatusCode.NOT_FOUND, {message: i18n.__("notfound")});
        if (!bcrypt.compareSync(password, found.password)) return responseMessages.responseError(HttpStatusCode.INVALID_PARAMETER, {message: "password not match"});
        newPassword = await bcrypt.hash(newPassword, 10);
        await REPOSITORY.update(users, {password: newPassword}, {where: {id}});
        return responseMessages.responseSuccess(HttpStatusCode.OK, {message: i18n.__('success')});
    } catch (e) {
        logger.error(`user service ${e.message}`);
        throw e;
    }
};

export const changeAvatar = async (id, entity) => {
    try {
        const found = await REPOSITORY.findOne(users, {
            where: {id},
            attributes: ['id']
        });
        if (!found) return responseMessages.responseError(HttpStatusCode.NOT_FOUND, {message: i18n.__("notfound")});
        await REPOSITORY.update(users, entity, {where: {id}});
        const finalResult = await REPOSITORY.findOne(users, {
            where: {id},
            attributes: ['id', 'name', 'email', 'phone', 'birthday', 'avatar']
        });
        return responseMessages.responseSuccess(HttpStatusCode.OK, finalResult);
    } catch (e) {
        logger.error(`user service ${e.message}`);
        throw e;
    }
};