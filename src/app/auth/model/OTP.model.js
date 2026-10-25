import {model , Schema} from "mongoose";

const otpSchema = new Schema({
    code:{
        type: String,
        required: true,
        match: /^\d{6}$/,
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    purpose:{
        type: String,
        enum: ['verify', 'reset', 'enable-2fa', 'login-2fa'],
        default: 'verify',
    },
    expireAt:{
        type: Date,
        required: true,
        index:{expires: 0 }
    }
},
    {
        timestamps:{
            createdAt:true,
            updatedAt:true,
        }
    });

export const OTP = model('OTP',otpSchema);
