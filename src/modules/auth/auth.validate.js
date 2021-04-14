import Joi from 'joi';
import i18n from 'i18n';
import responseMessages from "../../helpers/responseMessages";
import validator from "../../helpers/validator";
import HttpStatusCode from '../../constants';

// import validateJoiErrors from "../helpers/validateJoiErrors";

const DEFAULT_SCHEMA = {
    name: Joi.string()
        .min(5)
        .max(30)
        .required(),

    email: Joi.string()
        .min(5)
        .max(30)
        .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
        .required(),

    birthday: Joi.date().allow(null),

    phone: Joi.string()
        .min(10)
        .max(12)
        .regex(/(09|01[2|6|8|9])+([0-9]{8})\b/)
        .allow(null, ""),
}

export const authCreate = async (req, res, next) => {
    const {body} = req;
    const schema = Joi.object({
        ...DEFAULT_SCHEMA,
        password: Joi.string().min(6).max(20).required(),
    });
    const result = schema.validate(body);
    const error = validator.joi(result);
    if (Object.keys(error).length > 0) {
        res.json(responseMessages.responseError(
            HttpStatusCode.INVALID_PARAMETER,
            error,
            i18n.__("user.register.invalidParameter")
        ));
        return;
    }
    next();
};

export const authLogin = async (req, res, next) => {
    const {body} = req;
    const schema = Joi.object({
        email: Joi.string()
            .min(5)
            .max(30)
            .regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
            .required(),
        password: Joi.string().min(6).max(20).required()
    });
    const result = schema.validate(body);
    const error = validator.joi(result);
    if (Object.keys(error).length > 0) {
        res.json(responseMessages.responseError(
            HttpStatusCode.INVALID_PARAMETER,
            error,
            i18n.__("user.login.invalidParameter")
        ));
        return;
    }
    next();
}