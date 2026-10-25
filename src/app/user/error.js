import {AppError} from "../../lib/error/error.js";


export const userNotExist = new AppError('User Not Exists.', 404);
export const userAlreadyVerified = new AppError('User Already Verified.', 409);
export const userAlreadyExists = new AppError('User already exists.', 409);
