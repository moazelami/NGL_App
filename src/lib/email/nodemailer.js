import nodemailer from 'nodemailer';
import {env} from '../config/env.js';

const testAccount = await nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: env.nodemailer.user,
        pass: env.nodemailer.password,
    },
});


export const sendEmail = async (to, subject, html) => {

    const info = await transporter.sendMail({
        from: '"NGL_APP" <no-reply@ngl.app>',
        to,
        subject,
        html,
    });

    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
};