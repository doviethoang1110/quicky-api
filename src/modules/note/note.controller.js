import {logSystemError} from "../../helpers/customLogger";
import {removeNote, store, updateNote, updateTagNote, get_list} from "./note.service";
import responseMessages from "../../helpers/responseMessages";
import i18n from 'i18n';

export const getList = async (req, res) => {
    try {
        const {attributes, limit, page, filter, sort} = res.locals.param;
        const param = {attributes, limit, page, filter, sort, usersId: req.app.locals.usersId};
        const result = await get_list(param);
        res.json(result);
    } catch (error) {
        logSystemError(res, error, 'noteController - get list');
    }
}

export const create = async (req, res) => {
    try {
        const {
            title,
            details = null,
            tag,
            date,
            usersId
        } = req.body;
        const param = {title, details, tag, date, usersId}
        const result = await store(param);
        res.json(result);
    } catch (error) {
        return logSystemError(res, error, 'noteController - create');
    }
}

export const updateTag = async (req, res) => {
    try {
        if (!req.params.id) res.json(responseMessages.responseError({message: i18n.__("user.register.invalidParameter")}));
        const {tag} = req.body;
        const param = {tag};
        const result = await updateTagNote(req.params.id, param);
        res.json(result);
    } catch (error) {
        return logSystemError(res, error, 'noteController - update tag');
    }
}

export const deleteNote = async (req, res) => {
    try {
        if (!req.params.id) res.json(responseMessages.responseError({message: i18n.__("user.register.invalidParameter")}));
        const result = await removeNote(req.params.id);
        res.json(result);
    } catch (error) {
        return logSystemError(res, error, 'noteController - delete tag');
    }
}