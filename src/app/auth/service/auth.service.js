import *  as authRepo from '../repository/auth.repo.js';
import * as otpRepo from '../repository/otp.repo.js';
import {sendEmail} from "../../../lib/email/nodemailer.js";
import * as userRepo from "../../user/repository/user.repo.js";
import * as time from "../../../pkg/utils/time.js";
import {
    codeExpired,
    expiredOtp,
    googleEmailNotVerified,
    invalidCode, invalidCodeOrEmail,
    invalidEmailOrPassword,
    pleaseVerifyYourAccount,
} from "../error.js";
import {userNotExist, userAlreadyVerified, userAlreadyExists} from "../../user/error.js";
import {generateOtpCode} from "../../../lib/utils/otp.js";
import {logger} from "../../../pkg/logger/logger.js";
import {generateToken} from "../utils/token.js";
import {comparePassword, hashedPassword} from "../utils/hash.js";
import {verifyGoogleToken} from "../../../lib/utils/google.auth.js";



export const register = async (userData) => {
    const userExists = await authRepo.checkUserExistByEmail(userData.email);

    if (userExists) {
        throw userAlreadyExists;
    }

    userData.password = await hashedPassword(userData.password);

    const createdUser = await authRepo.createUser(userData);

    const otp = generateOtpCode();

    try {
        await otpRepo.createOTP({
            code: otp,
            email: userData.email,
            purpose: 'verify',
            expireAt: new Date(Date.now() + time.toMs(5,'minutes')),
        });

        await sendEmail(userData.email, 'verification code', `<h1>Your verification code is ${otp}</h1>`);
    } catch (err) {
        try {
            await otpRepo.deleteOtp(userData.email, 'verify');
        } catch (cleanupErr) {
            logger.error('Failed to remove OTP after registration failure', { error: cleanupErr.message });
        }

        try {
            await userRepo.deleteUserById(createdUser._id);
        } catch (cleanupErr) {
            logger.error('Failed to remove user after registration failure', { error: cleanupErr.message });
        }

        throw err;
    }

    const {password , ...userWithoutPassword} = createdUser.toObject();
    return userWithoutPassword;

}
export const verifyAccount = async (email , code)=>{
    const user = await authRepo.checkUserExistByEmail(email);
    if(!user || user.isDeleted === true) {
        throw userNotExist;
    }

    if(user.isVerified === true) {
        throw userAlreadyVerified;
    }

    const otp = await otpRepo.getOtpByEmail(email, 'verify');
    if(!otp) throw expiredOtp;
    if(otp.expireAt.getTime() <= Date.now()) {
        await otpRepo.deleteOtp(email, 'verify');
        throw expiredOtp;
    }
    if(otp.code !== code) throw invalidCode;
    const updatedUser = await userRepo.updateUserByEmail(email, {isVerified: true});
    if (!updatedUser) throw userNotExist;

    await otpRepo.deleteOtp(email, 'verify')

    const {password, ...userWithoutPassword} = updatedUser.toObject();
    return userWithoutPassword;
};

export const login = async (email , password)=>{
    const user = await authRepo.checkUserExistByEmail(email);
    if (!user) {
        throw invalidEmailOrPassword;
    }

    if(user.isDeleted === true) {
        throw invalidEmailOrPassword;
    }

    if (!user.password) {
        throw invalidEmailOrPassword;
    }

    let isMatch = false;
    try {
        isMatch = await comparePassword(password, user.password);
    } catch {
        throw invalidEmailOrPassword;
    }

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
    if(!user || user.isDeleted === true){
        throw userNotExist;
    }

    const purpose = user.isVerified ? 'reset' : 'verify';
    await otpRepo.deleteOtp(email, purpose);

    const otp = generateOtpCode();
    await otpRepo.createOTP({
        code: otp,
        email: email,
        purpose,
        expireAt: new Date(Date.now() + time.toMs(5,'minutes')),
    });

    try {
        const subject = purpose === 'reset' ? 'password reset code' : 'verification code';
        await sendEmail(email, subject, `<h1>Your ${subject} is ${otp}</h1>`);
    } catch (err) {
        try {
            await otpRepo.deleteOtp(email, purpose);
        } catch (cleanupErr) {
            logger.error('Failed to remove OTP after email failure', { error: cleanupErr.message });
        }
        throw err;
    }
}

export const resetPassword = async (email, code, newPassword) => {
    const user = await authRepo.checkUserExistByEmail(email);
    if (!user || user.isDeleted === true) {
        throw invalidCodeOrEmail;
    }

    if (!user.isVerified) {
        throw pleaseVerifyYourAccount;
    }

    const otp = await otpRepo.findOTP(email, code, 'reset');
    if (!otp) {
        throw invalidCodeOrEmail;
    }

    if (otp.expireAt.getTime() <= Date.now()) {
        await otpRepo.deleteOtp(email, 'reset');
        throw codeExpired;
    }

    const newHash = await hashedPassword(newPassword);
    await authRepo.updatePassword(email, newHash);

    await otpRepo.deleteOtp(email, 'reset');
};


export const loginWithGoogle = async (idToken) => {
    //1. verify idToken
    const payload = await verifyGoogleToken(idToken);
    if (!payload?.email || payload.email_verified !== true) {
        throw googleEmailNotVerified;
    }

    const email = payload.email.toLowerCase();
    //2. check if user exists
    const user =  await authRepo.checkUserExistByEmail(email);
    //3. if exists >> generate token 
    if(user) {
        if (user.isDeleted === true) {
            throw invalidEmailOrPassword;
        }

        const token = generateToken({
            id: user._id,
            email: user.email,
        });
        return token;
    }
    //4. if not exists >> create user >> generate token
    const fallbackName = email.split('@')[0];
    const candidateName = payload.name?.trim() || fallbackName;
    const name = candidateName.length >= 3 ? candidateName.slice(0, 20) : 'Google User';
    const createdUser = await authRepo.createUser({
        name,
        email,
        provider: 'google',
        isVerified: true,
    });
    return generateToken({
        id: createdUser.id,
        email: createdUser.email,
    });
}
















