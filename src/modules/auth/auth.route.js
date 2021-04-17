import {
    verify,
    register,
    authFacebook,
    forgetPassword,
    login,
    resetPassword
} from './auth.controller';
import middleware from '../../middlewares';
import {authCreate, authLogin} from './auth.validate';

export const authRoutes = (router) => {
    router.get('/verify-email', verify)
        .post('/sign-in', authLogin, login)
        .post('/sign-up', middleware.blockSpam.registerLimiter, authCreate, register)
        .post('/forget-password', forgetPassword)
        .post('/facebook', authFacebook)
        .patch('/reset-password', resetPassword);
    return router;
}