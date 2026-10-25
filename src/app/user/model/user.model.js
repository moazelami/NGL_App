import { model, Schema } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: function (){
                return this.provider === 'local';
            },
            minlength: 8,
        },

        provider: {
            type: String,
            enum: ['local', 'google', 'facebook'],
            default: 'local',
        },

        profilePic: {
            type: String,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
        dob:Date,
        gender:{
            type: String,
            enum: ['male', 'female'],
            default: 'male',
        },
        failedAttempts: {
            type: Number,
            default: 0,
        },
        bannedUntil: {
            type: Date,
            default: null,
        },
        isTwoFactorEnabled: {
            type: Boolean,
            default: false,
        },
    },
    
    {
        timestamps:{
            createdAt: true,
            updatedAt: true,
        },
    }
);

export const User = model('User', userSchema);