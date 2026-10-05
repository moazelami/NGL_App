import *  as authRepo from '../repository/auth.repo.js';
import * as otpRepo from '../repository/otp.repo.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import {sendEmail} from "../../../common/email/nodemailer.js";
import * as userRepo from "../../user/repository/user.repo.js";
import * as time from "../../../common/utils/time.js";
import {Error} from "mongoose";
import jwt from "jsonwebtoken";
import {
    invalidCode,
    invalidEmailOrPassword,
    pleaseVerifyYourAccount,
    userAlreadyVerified,
    userNotExist
} from "../error.js";


export const register = async (userData) => {
    const userExists = await authRepo.checkUserExistByEmail(userData.email);

    if (userExists) {
        throw userNotExist
    }

    userData.password = await bcrypt.hash(userData.password, 10);

    const createdUser = await authRepo.createUser(userData);

    const otp = crypto.randomInt(100000, 1000000).toString();

    await otpRepo.createOTP({
        code: otp,
        email: userData.email,
        expireAt: new Date(Date.now() + time.toMs(5,'minutes')),
    });

    await sendEmail(userData.email, 'verification code', `<h1>Your verification code is ${otp}</h1>`);

    const {password , ...userWithoutPassword} = createdUser.toObject();
    return userWithoutPassword;

}
export const verifyAccount = async (email , code)=>{
    const user = await authRepo.checkUserExistByEmail(email);
    if(!user) {
        throw userNotExist;
    }

    if(user.isVerified === true) {
        throw userAlreadyVerified;
    }

    const otp = await otpRepo.getOtpByEmail(email);
    if(!otp) throw new Error('OTP expired, please resend OTP');
    if(otp.code !== code) throw invalidCode;
    const updatedUser = await userRepo.updateUserByEmail(email, {isVerified: true});

    await otpRepo.deleteOtp(email)

    return updatedUser;
};

export const login = async (email , password)=>{
    const user = await authRepo.checkUserExistByEmail(email);
    if (!user) {
        throw invalidEmailOrPassword;
    }

    if(user.isDeleted === true) {
        throw invalidEmailOrPassword;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
         throw invalidEmailOrPassword;

    if(!user.isVerified) {
        throw pleaseVerifyYourAccount;
    }

    const token = jwt.sign({
        id: user.id,
        name: user.name,
        role: user.role,
    },
        process.env.JWT_SECRET,
        {expiresIn: '1d'}
        );

    return token;

};




















