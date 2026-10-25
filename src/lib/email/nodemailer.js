import nodemailer from 'nodemailer';
import {env} from '../config/env.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.nodemailer.user,
        pass: env.nodemailer.password,
    },
});


export const sendEmail = async (to, subject, html) => {

    await transporter.sendMail({
        from: `"NGL_APP" <${env.nodemailer.user}>`,
        to,
        subject,
        html,
    });
};
