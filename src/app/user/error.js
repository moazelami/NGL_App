import {AppError} from "../../lib/error/error.js";


export const userNotExist = new AppError('User Not Exists.');
export const userAlreadyVerified = new AppError('User Already Verified.');