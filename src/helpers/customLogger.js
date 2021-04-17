import winston from 'winston';
import { v4 } from 'uuid';
import responseMessages from "./responseMessages";
import HttpStatusCode from "../constants";

const customLevels = {
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        trace: 'white',
        debug: 'green',
        info: 'green',
        warn: 'yellow',
        error: 'red',
        fatal: 'red',
    },
};

const formatter = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.splat(),
    winston.format.printf((info) => {
        const { timestamp, level, message, ...meta } = info;

        return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
    }),
);

const prodTransport = new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
});
const transport = new winston.transports.Console({
    format: formatter,
});

function customLogger() {
    winston.addColors(customLevels.colors);
    return winston.createLogger({
        level: process.env.NODE_ENV === "development" ? 'trace' : 'error',
        levels: customLevels.levels,
        format: winston.format.json(),
        transports: [process.env.NODE_ENV === "development" ? transport : prodTransport],

    });
}


export const logger = customLogger();

export const logSystemError = (res, error, functionName) => {
    const errorObj = {};
    errorObj.id = `${Date.now()}-${v4()}`;
    errorObj.message = error.message;
    errorObj.functionName = functionName;
    logger.error(`Error in ${functionName}: ${JSON.stringify(errorObj)}`);
    res.json(responseMessages.responseError(HttpStatusCode.INTERNAL_SERVER, error, `SYSTEM_ERROR: ${errorObj.id}`));
}


if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logging initialized at debug level');
}