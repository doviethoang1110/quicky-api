import responseMessages from "../../helpers/responseMessages";
import {update, changePass, changeAvatar} from './user.service';
import i18n from 'i18n';
import {logSystemError} from "../../helpers/customLogger";

export const updateUser = async (req, res) => {
    try {
        if (!req.params.id) res.json(responseMessages.responseError({message: i18n.__("user.register.invalidParameter")}));
        const response = await update(req.params.id, req.body);
        res.json(response);
    } catch (e) {
        return logSystemError(res, e, 'update user controller');
    }
};

export const changePassword = async (req, res) => {
    try {
        if (!req.params.id) res.json(responseMessages.responseError({message: i18n.__("user.register.invalidParameter")}));
        const response = await changePass(req.params.id, req.body);
        res.json(response);
    } catch (e) {
        return logSystemError(res, e, 'update user controller');
    }
};

export const changeImage = async (req, res) => {
    try {
        if (!req.params.id) res.json(responseMessages.responseError({message: i18n.__("user.register.invalidParameter")}));
        const response = await changeAvatar(req.params.id, req.body);
        res.json(response);
    } catch (e) {
        return logSystemError(res, e, 'update user controller');
    }
};