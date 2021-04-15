import Joi from 'joi';
import validator from "../../helpers/validator";
import filterHelpers from '../../helpers/filterHelpers';
import regexPattern from "../../helpers/regexPattern";
import {logSystemError} from "../../helpers/customLogger";

const DEFAULT_SCHEMA = {
    title: Joi.string()
        .min(10)
        .max(50)
        .required(),

    details: Joi.string()
        .allow(null),

    tag: Joi.number()
        .required(),

    usersId: Joi.number()
        .required(),

    date: Joi.date()
        .required(),
};

export const noteCreate = async (req, res, next) => {
    const schema = Joi.object().keys({
        ...DEFAULT_SCHEMA
    });
    const result = schema.validate(req.body);
    const error = validator.joi(result);
    if (error) res.json(error);
    next();
};

export const noteUpdateTag = async (req, res, next) => {
    const schema = Joi.object().keys({
        tag: Joi.number()
            .required()
    });
    const result = schema.validate(req.body);
    const error = validator.joi(result);
    if (error) res.json(error);
    next();
};

export const noteFilter = async (req, res, next) => {
    try {
        const {attributes, sort, filter, page, limit} = req.query;
        const data = {
            sort: filterHelpers.parseSort(sort, 'notes'),
            page: +page || 1,
            limit: +limit || 5,
            attributes: filterHelpers.atrributesHelper(attributes)
        };
        if (filter) {
            const {title, tag} = JSON.parse(filter);
            if (title || tag) {
                let param = {title, tag};
                const schema = Joi.object().keys({
                    title: Joi.string().regex(regexPattern.name),
                    tag: Joi.string().regex(regexPattern.number)
                });
                const result = schema.validate(param);
                const error = validator.joi(result);
                if (error) res.json(error);
                param = filterHelpers.filterPickKey(param);
                if (param.title) param = await filterHelpers.makeStringFilterRelatively(['title'], param, 'notes');
                data.filter = param;
            } else data.filter = {};
        } else data.filter = {};
        res.locals.param = data;
        next();
    } catch (e) {
        return logSystemError(res, e.message)
    }
}