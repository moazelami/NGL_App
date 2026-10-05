import {OTP} from '../model/OTP.model.js';

export const createOTP = async (otpData)=>{
    return await OTP.create(otpData);
};

export const getOtpByEmail = async (email)=>{
    return await OTP.findOne({email:email});
};

export const deleteOtp = async (email)=>{
    return await OTP.deleteMany({email:email});
};