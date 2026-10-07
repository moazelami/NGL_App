import {AppError} from "../../lib/error/error.js";


export const invalidCode = new AppError('Invalid code.');
export const invalidEmailOrPassword = new AppError('Invalid email or password');
export const pleaseVerifyYourAccount = new AppError('Please verify your account');
export const expiredOtp = new AppError('OTP expired, please resend OTP');
export const invalidCodeOrEmail = new AppError('Invalid code or email');
export const codeExpired = new AppError('Code expired');
