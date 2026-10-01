import {model , Schema} from "mongoose";

const otpSchema = new Schema({
    code:{
        type: String,
        required: true,
        length: 6,
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
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

otpSchema.index({createdAt:1} , {expireAfterSeconds:300});

export const User = model('OTP',otpSchema);