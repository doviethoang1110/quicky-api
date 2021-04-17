import bcrypt from "bcrypt";
import REPOSITORY from '../repositories';
import jwt from 'jsonwebtoken';
import {secret} from '../config';
import client from '../utils/redis';
import {logger} from "./customLogger";
import {users} from '../models';
import i18n from 'i18n';

export const jwtAuthentication = (email, password, done) => {
    REPOSITORY.findOne(users, {where: {email}}).then(user => {
        if (!user) return done(null, false, {message: i18n.__("user.login.invalidParameter")});
        if (bcrypt.compareSync(password, user.password)) return done(null, user, null);
        else return done(null, false, {message: i18n.__("user.login.invalidParameter")});
    }).catch(error => done(error));
}

const jwtGenerate = async (user, refreshTokenFlag = false) => {
    return jwt.sign({user},
        refreshTokenFlag
            ? secret.refresh_token_key
            : secret.jwt_key
        , {
            expiresIn: refreshTokenFlag
                ? secret.refresh_token_life
                : secret.token_life,
            issuer: secret.issuer,
            algorithm: "HS256"
        })
}

export const signJwt = async (user) => {
    try {
        const [refreshToken, accessToken] = await Promise.all([
            jwtGenerate(user, true),
            jwtGenerate(user)
        ]);
        await client.set(`${user._id}`, `${refreshToken}`);
        return {accessToken, refreshToken};
    } catch (e) {
        logger.error(`Generate jwt ${e.message}`)
        throw e;
    }
}