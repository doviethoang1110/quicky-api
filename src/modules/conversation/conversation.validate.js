import Joi from 'joi';
import validator from "../../helpers/validator";
import regexPattern from "../../helpers/regexPattern";

const DEFAULT_SCHEMA = {
    name: Joi.string()
        .min(5)
        .max(30)
        .regex(regexPattern.name)
        .required(),

    creatorId: Joi.string()
        .regex(regexPattern.number)
        .required(),

    lastMessageId: Joi.string()
        .regex(regexPattern.number)
        .allow(null),

    image: Joi.string()
        .required(),

    type: Joi.string().required(),

    participants: Joi.array().items(Joi.string().regex(regexPattern.number)).min(2  ).unique().required()
}

export const conversationCreate = async (req, res, next) => {
    const {body} = req;
    const schema = Joi.object({
        ...DEFAULT_SCHEMA,
    });
    const result = schema.validate(body);
    const error = validator.joi(result);
    if (error) res.json(error);
    next();
};

export const conversationChangeImage = async (req, res, next) => {
    const schema = Joi.object().keys({
        image: Joi.string().required()
    });
    const result = schema.validate(req.body);
    const error = validator.joi(result);
    if (error) res.json(error);
    next();
};