import *  as authRepo from '../repository/auth.repo.js';
import * as otpRepo from '../repository/otp.repo.js';
import {sendEmail} from "../../../lib/email/nodemailer.js";
import * as userRepo from "../../user/repository/user.repo.js";
import * as time from "../../../pkg/utils/time.js";
import {
    codeExpired,
    expiredOtp,
    invalidCode, invalidCodeOrEmail,
    invalidEmailOrPassword,
    pleaseVerifyYourAccount,
} from "../error.js";
import {userNotExist, userAlreadyVerified} from "../../user/error.js";
import {generateOtpCode} from "../../../lib/utils/otp.js";
import {logger} from "../../../pkg/logger/logger.js";
import {generateToken} from "../utils/token.js";
import {comparePassword, hashedPassword} from "../utils/hash.js";
import {verifyGoogleToken} from "../../../lib/utils/google.auth.js";



export const register = async (userData) => {
    const userExists = await authRepo.checkUserExistByEmail(userData.email);

    if (userExists) {
        throw userNotExist;
    }

    userData.password = await hashedPassword(userData.password);

    const createdUser = await authRepo.createUser(userData);

    const otp = generateOtpCode();

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
    if(!otp) throw expiredOtp;
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

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
         throw invalidEmailOrPassword;

    if(!user.isVerified) {
        throw pleaseVerifyYourAccount;
    }

    const token = generateToken({
        id: user.id,
        name: user.name,
        role: user.role,
    });

    return token;

};

export const sendOtp = async (email) => {
    const user = await authRepo.checkUserExistByEmail(email);
    if(!user){
        throw userNotExist;
    }

    await otpRepo.deleteOtp(email);
    if (user.isVerified) throw userAlreadyVerified;
    const otp = generateOtpCode();
    logger.info(otp)
    await otpRepo.createOTP({
        code: otp,
        email: email,
        expireAt: new Date(Date.now() + time.toMs(5,'minutes')),
    });

    await sendEmail(email, 'verification code', `<h1>Your verification code is ${otp}</h1>`);
}

export const resetPassword = async (email, code, newPassword) => {
    const user = await authRepo.checkUserExistByEmail(email);
    if (!user) {
        throw invalidCodeOrEmail;
    }

    const otp = await otpRepo.findOTP(email, code);
    if (!otp) {
        throw invalidCodeOrEmail;
    }

    if (otp.expireAt < new Date()) {
        throw codeExpired;
    }

    const hashedPassword = await hashedPassword(newPassword);
    await authRepo.updatePassword(email, hashedPassword);

    await otpRepo.deleteOtp(email);
};


export const loginWithGoogle = async (idToken) => {
    //1. verify idToken
    const payload = await verifyGoogleToken(idToken);
    //2. check if user exists
    const user =  await authRepo.checkUserExistByEmail(payload.email);
    //3. if exists >> generate token 
    if(user) {
        const token = generateToken({
            id: user._id,
            email: user.email,
        });
        return token;
    }
    //4. if not exists >> create user >> generate token
    const createdUser = await authRepo.createUser({
        name: payload.name,
        email: payload.email,
        provider: 'google',
        isVerified: true,
    });
    return generateToken({
        id: createdUser.id,
        email: createdUser.email,
    });
}
















