import {verify} from 'jsonwebtoken';
import {secret} from '../config';
import {AuthenticationError} from 'apollo-server-express';
import {logger} from "../helpers/customLogger";
import HttpStatusCode from '../constants';
import i18n from 'i18n';
import responseMessages from "../helpers/responseMessages";

export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.replace("Bearer ", "");
        if (!token) throw new Error(i18n.__("user.unauthenticated"));
        const {user: {id}} = await verify(token, secret.jwt_key);
        req.app.locals.usersId = id;
        next()
    } catch (error) {
        logger.error(`Authentication ${error.message}`);
        if (error.expiredAt) {
            delete error.expiredAt;
            error.message = i18n.__("token.timeout");
        }
        res.json(responseMessages.responseError(HttpStatusCode.UNAUTHORIZED, {message: error.message}));
    }
};

export const authGraphql = async ({req}) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.replace("Bearer ", "");
        if (!token) throw new AuthenticationError("Bạn chưa đăng nhập");
        await verify(token, secret.jwt_key);
        return {loggedIn: true};
    } catch (error) {
        return {loggedIn: false};
    }
}