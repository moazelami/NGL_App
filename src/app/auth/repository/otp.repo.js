import {OTP} from '../model/OTP.model.js';

export const createOTP = async (otpData)=>{
    return await OTP.create(otpData);
}