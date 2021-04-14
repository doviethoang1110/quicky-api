import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

import {middleware} from '../config';

const registerLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    message: "Không được đăng ký 2 tài khoản trong 1p"
});

const apiLimiter = rateLimit({
    windowMs: middleware.limit_time,
    max: middleware.limit_request,
    message: "Too many requests from this IP, please try again after 15 minutes"
});

const speedLimiter = slowDown({
    windowMs: middleware.limit_time,
    delayAfter: middleware.delay_after,
    delayMs: middleware.delay_time
});

export default {
    speedLimiter,
    registerLimiter,
    apiLimiter
}