const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const { jwtAuthentication } = require('./jwt');

export const initialize = () => {
    passport.use('login-jwt', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, jwtAuthentication));
};

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));