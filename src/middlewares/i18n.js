const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['en', 'vi'],
    defaultLocale: 'vi',
    fallbacks: {vi: 'en'},
    directory: path.join(__dirname, '../locales')
});

module.exports = function (req, res, next) {
    i18n.init(req, res);
    const locale = req.headers['accept-language'] || 'en';
    i18n.setLocale(locale);
    return next();
};