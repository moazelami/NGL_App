import crypto from "node:crypto";

export const generateOtpCode =  ()=>{
    return crypto.randomInt(100000, 1000000).toString();
}