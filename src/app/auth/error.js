import {AppError} from "../../lib/error/error.js";


export const invalidCode = new AppError('Invalid code.', 400);
export const invalidEmailOrPassword = new AppError('Invalid email or password', 401);
export const pleaseVerifyYourAccount = new AppError('Please verify your account', 403);
export const expiredOtp = new AppError('OTP expired, please resend OTP', 400);
export const invalidCodeOrEmail = new AppError('Invalid code or email', 400);
export const codeExpired = new AppError('Code expired', 400);
export const googleEmailNotVerified = new AppError('Google email not verified', 403);
