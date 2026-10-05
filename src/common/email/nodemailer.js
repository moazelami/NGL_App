import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html) => {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const info = await transporter.sendMail({
        from: '"NGL_APP" <no-reply@ngl.app>',
        to,
        subject,
        html,
    });

    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
};