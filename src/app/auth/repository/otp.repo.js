import {OTP} from '../model/OTP.model';

export const createOTP = async (userData)=>{
    return await OTP.create(userData);
}