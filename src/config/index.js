import dotenv from 'dotenv';
dotenv.config();

export const application = {
    port: process.env.PORT || 5000,
    origin: process.env.ORIGIN_DEV || process.env.ORIGIN,
    methods: process.env.METHODS,
    headers: process.env.HEADERS
}

export const database = {
    port: process.env.DBPORT,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    dbname: process.env.DB_NAME
}

export const redis_config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
};

export const mailer = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    name: process.env.MAIL_NAME,
    password: process.env.MAIL_PASSWORD
};

export const secret = {
    jwt_key: process.env.JWTKEY,
    issuer: process.env.ISSUER,
    token_life: process.env.TOKEN_LIFE,
    refresh_token_key: process.env.REFRESHTOKEN_KEY,
    refresh_token_life: process.env.REFRESHTOKEN_LIFE
};

export const middleware = {
    limit_time: process.env.LIMIT_TIME,
    limit_request: process.env.LIMIT_REQUEST,
    delay_time: process.env.DELAY_TIME,
    delay_after: process.env.DELAY_AFTER
}