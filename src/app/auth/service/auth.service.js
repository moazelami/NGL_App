import *  as authRepo from '../repository/auth.repo.js';
import * as otpRepo from '../repository/otp.repo.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import {sendEmail} from "../../../common/email/nodemailer.js";

export const register = async (userData) => {
    const userExists = await authRepo.checkUserExistByEmail(userData.email);

    if (userExists) {
        throw new Error('User already exists');
    }

    userData.password = await bcrypt.hash(userData.password, 10);

    const createdUser = await authRepo.createUser(userData);

    const otp = crypto.randomInt(100000, 1000000).toString();

    await otpRepo.createOTP({
        code: otp,
        email: userData.email,
        expireAt: new Date(Date.now() + 1000 * 60 * 5 ),
    });

    await sendEmail(userData.email, 'verification code', `<h1>Your verification code is ${otp}</h1>`);

    return createdUser;

}