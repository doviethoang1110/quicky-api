import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {initialize} from './helpers/passport';
import {userRoutes} from './modules/user/user.route';
import {authRoutes} from "./modules/auth/auth.route";
import {ApolloServer} from 'apollo-server-express';
import cors from 'cors';
import {application} from './config';
import {join} from 'path';
import {importSchema} from 'graphql-import'
import resolvers from './graphql/resolvers';

const typeDefs = importSchema(join(__dirname, 'graphql/schema/root.graphql'));
const path = require('path');

// i18n
import i18n from './middlewares/i18n';

// import middleware
import middleware from './middlewares';

// Cors
const corsOptions = {
    origin: application.origin,
    methods: application.methods,
    allowedHeaders: application.headers
};

// database connected
require('./utils/database');
// require('./utils/redis');

// import routers
const usersRouter = userRoutes(express.Router());
const authRouter = authRoutes(express.Router());


const app = express();

// graphql
const server = new ApolloServer({typeDefs, resolvers, context: middleware.authGraphql});
server.applyMiddleware({app});

// passport
initialize();

// use middlewares
app.use(helmet());
app.use(i18n);
app.use(middleware.blockSpam.apiLimiter);
app.use(middleware.blockSpam.speedLimiter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({projectName: 'Quicky-messenger-api', version: '0.1'})
});

// use cors with router api
app.use('/api/v1', cors(corsOptions));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/', middleware.auth);
app.use('/api/v1/users', usersRouter);

module.exports = app;
