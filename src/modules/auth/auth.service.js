import REPOSITORY from '../../repositories';
import {sendMails} from '../../helpers/sendMails';
import i18n from 'i18n';
const bcrypt = require('bcrypt');
const {v4: uuid} = require('uuid');
import redis from "../../utils/redis";
import {users, userTokens, socialProviders} from '../../models';
import {logger} from "../../helpers/customLogger";
import responseMessages from "../../helpers/responseMessages";
import HttpStatusCode from "../../constants";
import {signJwt} from "../../helpers/jwt";

export const find = async (where, attributes, limit) => {
    return REPOSITORY.findAll(where, attributes, limit);
};

export const findOne = async (where, fields) => {
    return REPOSITORY.findOne(where, fields);
};

export const store = async (data) => {
    try {
        const found = await REPOSITORY.findOne(users, {
            where: {
                email: {$like: data.email}
            }
        });
        if (found) return responseMessages.responseError(HttpStatusCode.RECORD_EXIST, {message: i18n.__("user.exist")});
        const [newPass, token] = await Promise.all([
            bcrypt.hash(data.password, 10),
            bcrypt.hash(uuid(), 10)
        ]);
        data.password = newPass;
        const user = await REPOSITORY.create(users, data);
        const expiredAt = new Date(new Date())
        expiredAt.setDate(expiredAt.getDate() + 1)
        const verify = {token, usersId: user.id, expiredAt}
        const html = mailVerify(verify.token)
        await Promise.all([
            REPOSITORY.create(userTokens, verify),
            sendMails({to: data.email, html})
        ]);
        return responseMessages.responseSuccess(HttpStatusCode.OK, user);
    } catch (err) {
        logger.error(`Error in store user auth service ${err.message}`);
        throw err;
    }
};

export const storeFacebook = async (data) => {
    try {
        const {name, email, password, avatar, socialProvider} = data;
        const found = await REPOSITORY.findOne(users, {
            attributes: ['id', 'name', 'email', 'birthday', 'phone', 'avatar'],
            include: [
                {
                    model: socialProviders,
                    as: 'socialProviders',
                    attributes: ['name'],
                    where: {
                        socialId: socialProvider.id
                    }
                }
            ]
        });
        let result;
        if (found) {
            result = await signJwt(found);
        } else {
            const usersBody = {name, email, password, avatar};
            usersBody.password = await bcrypt.hash(usersBody.password, 10);
            const user = await REPOSITORY.create(users, {...usersBody, isActive: true});
            const [, jwt] = await Promise.all([
                REPOSITORY.create(socialProviders, {
                    name: socialProvider.name,
                    socialId: socialProvider.id,
                    usersId: user.id,
                    accessToken: socialProvider.accessToken
                }),
                signJwt(user)
            ]);
            result = jwt;
        }
        return responseMessages.responseSuccess(HttpStatusCode.OK, result);
    } catch (err) {
        logger.error(`auth service ${err.message}`);
        throw err
    }
};

export const verifyEmail = async (token) => {
    try {
        let {expiredAt, usersId} = await REPOSITORY
            .findOne(userTokens, {
                where: {token, type: 'active_user'},
                attributes: ['expiredAt', 'usersId']
            });
        if (!expiredAt) throw new Error(i18n.__("user.active.key.invalid"));
        if (new Date() > new Date(expiredAt)) throw new Error(i18n.__("user.active.key.timeout"));
        await REPOSITORY.update(users, {isActive: true}, {where: {id: usersId}});
        return 'Xác thực thành công';
    } catch (error) {
        logger.error(`auth service ${error.message}`);
        throw error;
    }
};

function mailVerify(param) {
    return "<h3>Vui lòng bấm vào đây để xác thực email</h3><br>" +
        "<a href='http://localhost:4200/api/v1/auth/verify-email?token=" + param + "' style='background-color: #008CBA;\n" +
        "border: none;\n" +
        "  color: white;\n" +
        "  padding: 20px 100px;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  display: inline-block;\n" +
        "  font-size: 16px;\n" +
        "  margin: 4px 2px;\n" +
        "  cursor: pointer;'>Verify your email</a>"
};

function resetPassword(param) {
    return "<h3>Vui lòng bấm vào đây để lấy lại mật khẩu</h3><br>" +
        "<a href='HttpStatusCode://localhost:8080/reset-password/" + param + "' style='background-color: #008CBA;\n" +
        "border: none;\n" +
        "  color: white;\n" +
        "  padding: 20px 100px;\n" +
        "  text-align: center;\n" +
        "  text-decoration: none;\n" +
        "  display: inline-block;\n" +
        "  font-size: 16px;\n" +
        "  margin: 4px 2px;\n" +
        "  cursor: pointer;'>Reset password</a>"
};

export const findUserByEmail = async (email) => {
    return REPOSITORY.findOne({email, is_actived: true}, 'name email avatar phone birthday password facebook.name');
};

export const forgetPassword = async (email) => {
    const user = await this.findUserByEmail(email);
    if (!user) throw new Error("Không tồn tại user");
    await redis.setAsync(`${email}`, 60, `${user._id}`);
    await sendMails({to: email, html: this.resetPassword(email)})
};

export const handleResetPassword = async ({email, password}) => {
    let id;
    redis.get(`${email}`, async (err, reply) => {
        id = reply;
        if (!id) throw new Error("Đã hết hạn vui lòng gửi lại email");
        const pwd = await bcrypt.hash(password, 10);
        await REPOSITORY.update(id, {password: pwd});
    });
};