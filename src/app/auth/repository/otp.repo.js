import {OTP} from '../model/OTP.model.js';

export const createOTP = async (otpData)=>{
    return await OTP.create(otpData);
};

export const getOtpByEmail = async (email, purpose)=>{
    const query = {email};
    if (purpose) query.purpose = purpose;
    return await OTP.findOne(query).sort({createdAt: -1});
};

export const deleteOtp = async (email, purpose)=>{
    const query = {email};
    if (purpose) query.purpose = purpose;
    return await OTP.deleteMany(query);
};


export const findOTP = async (email, code, purpose) => {
    const query = { email, code};
    if (purpose) query.purpose = purpose;
    return await OTP.findOne(query).sort({createdAt: -1});
};
