import Joi from 'joi';
import validator from "../../helpers/validator";
import regexPattern from "../../helpers/regexPattern";

const DEFAULT_SCHEMA = {
    name: Joi.string()
        .min(5)
        .max(30)
        .regex(regexPattern.name)
        .required(),

    email: Joi.string()
        .min(5)
        .max(30)
        .regex(regexPattern.email)
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
    if (error) res.json(error);
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
    if (error) res.json(error);
    next();
}