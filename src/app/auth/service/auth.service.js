import *  as authRepo from '../repository/auth.repo';
import * as otpRepo from '../repository/otp.repo';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

export const register = async (userData) => {
    const userExists = await authRepo.checkUserExistByEmail(userData.email);

    if (userExists) {
        throw new Error('User already exists');
    }

    userData.password = await bcrypt.hash(userData.password, 10);

    const createdUser = await authRepo.createUser(userData);

    const otp = crypto.randomInt(1000000,999999).toString();

    await otpRepo.createOTP({
        code: otp,
        email: userData.email,
        expiresAt: new Date(date.now() + 1000 * 60 * 5 ),
    });
    //todo:send email verification OTP

    return createdUser;

}