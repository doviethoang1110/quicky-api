import AuthService, {store, verifyEmail, storeFacebook} from './auth.service';
import passport from 'passport';
import {signJwt} from '../../helpers/jwt';
import HttpStatusCode from "../../constants";
import responseMessages from "../../helpers/responseMessages";
import {logger, logSystemError} from "../../helpers/customLogger";
import i18n from 'i18n';

export const verify = async (req, res, next) => {
    try {
        const token = req.query.token;
        if (!token) res.send(`<span>Có lỗi sảy ra</span>`);
        const result = await verifyEmail(req.query.token);
        console.log('đến', result)
        res.send(`<h2>${result} mời bạn 
                  <a href="http://localhost:3000/sign-in">đăng nhập</a></h2>`);
    } catch (error) {
        logger.error(`auth controller verify email${error.message}`)
        res.send(`<span>${error.message}</span>`);
    }
};

export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            birthday = null
        } = req.body;
        const param = {name, email, phone, password, birthday};
        const result = await store(param);
        res.json(result);
    } catch (error) {
        return logSystemError(res, error, 'authController - register');
    }
}

export const login = async (req, res, next) => {
    passport.authenticate('login-jwt', (error, user, info) => {
        if (error) res.json(responseMessages.responseError(HttpStatusCode.INTERNAL_SERVER, error, "Server not response"));
        if (!user) res.json(responseMessages.responseError(HttpStatusCode.UNAUTHORIZED, {message: info.message}, i18n.__("user.login.failure")));
        req.logIn(user, {session: false}, err => {
            if (err) res.json(responseMessages.responseError(HttpStatusCode.INTERNAL_SERVER, err));
            else {
                delete user.password;
                signJwt(user).then(data => {
                    res.json(responseMessages.responseSuccess(HttpStatusCode.OK, data));
                }).catch(error => logger.error(`auth login ${error.message}`));
            }
        })
    })(req, res, next);
}

export const forgetPassword = async (req, res, next) => {
    try {
        const {email} = req.body;
        await AuthService.forgetPassword(email);
        res.api(200, 'Kiểm tra email');
    } catch (error) {
        console.log(error);
        next(error.message);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email) throw new Error("Email không tồn tại");
        await AuthService.handleResetPassword({email, password});
        res.api(200, 'Đổi mật khẩu thành công');
    } catch (error) {
        console.log(error);
        next(error.message);
    }
};

export const authFacebook = async (req, res) => {
    try {
        const {id, accessToken, email, name, picture} = req.body;
        const param = {
            socialProvider: {id, name, accessToken},
            password: accessToken, email, name, avatar: picture.data.url
        };
        const result = await storeFacebook(param);
        res.json(result);
    } catch (error) {
        return logSystemError(res, error, 'authController - facebook');
    }
};