import REPOSITORY from "../../repositories";
import {notes} from "../../models";
import responseMessages from "../../helpers/responseMessages";
import HttpStatusCode from "../../constants";
import {logger} from "../../helpers/customLogger";
import i18n from 'i18n';

export const get_list = async ({attributes, limit, page, filter, sort, usersId}) => {
    try {
        let whereFilter = {...filter, usersId};
        return await REPOSITORY.findAll(notes, {
            where: whereFilter,
            attributes,
            order: sort
        });
    } catch (e) {
        logger.error(`Error in get list notes ${e.message}`);
        throw e;
    }
}

export const store = async (data) => {
    try {
        const found = await REPOSITORY.findOne(notes, {
            where: {
                title: {$like: data.title},
                usersId: data.usersId
            },
            attributes: ['id']
        });
        if (found) return responseMessages.responseError(HttpStatusCode.RECORD_EXIST, {message: i18n.__("exist")});
        const note = await REPOSITORY.create(notes, data);
        return responseMessages.responseSuccess(HttpStatusCode.OK, note);
    } catch (err) {
        logger.error(`Error in store user auth service ${err.message}`);
        throw err;
    }
};

export const updateTagNote = async (id, data) => {
    try {
        const found = await REPOSITORY.findOne(notes, {
            where: {id},
            attributes: ['id', 'tag']
        });
        if (!found) return responseMessages.responseError(HttpStatusCode.RECORD_EXIST, {message: i18n.__("notfound")});
        await REPOSITORY.update(notes, data, {where: {id}});
        found.tag = data.tag;
        return responseMessages.responseSuccess(HttpStatusCode.OK, found);
    } catch (err) {
        logger.error(`Error in store user auth service ${err.message}`);
        throw err;
    }
};

export const removeNote = async (id) => {
    try {
        const found = await REPOSITORY.findOne(notes, {
            where: {id},
            attributes: ['id']
        });
        if (!found) return responseMessages.responseError(HttpStatusCode.RECORD_EXIST, {message: i18n.__("notfound")});
        await REPOSITORY.destroy(notes, {where: {id}});
        return responseMessages.responseSuccess(HttpStatusCode.OK, {message: i18n.__("success")});
    } catch (err) {
        logger.error(`Error in store user auth service ${err.message}`);
        throw err;
    }
}