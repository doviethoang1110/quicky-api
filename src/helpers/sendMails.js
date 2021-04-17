const nodemailer = require('nodemailer');
const {mailer} = require('../config');

const transporter =  nodemailer.createTransport({
    host: mailer.host,
    port: mailer.port,
    secure: true,
    auth: {
        user: mailer.name,
        pass: mailer.password
    },
    tls: {
        rejectUnauthorized: false
    }
});

const mainOptions = {
    from: 'Socimo social network',
    to: '',
    subject: 'Verify your email',
    text: 'Xác thực email',
    html: ''
}


export const sendMails = async (options) => {
    const customOptions = {...mainOptions,...options};
    transporter.sendMail(customOptions, (err, info) => {
        if (err) console.log(err);
        else console.log('Message sent: ' +  info.response);
    });
}