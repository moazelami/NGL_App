import * as authService from '../service/auth.service.js';
import {toMs} from "../../../lib/utils/time.js";

export const register = async (req, res , next) => {
    try{
        const createdUser = await authService.register(req.body);
        res.status(201).send({
            message: 'Registered successfully',
            success: true,
            data: createdUser
        });
    }catch(err){
        next(err);
    }
};

export const verifyAccount = async (req, res , next) => {
    try{
        const {email , code} = req.body;
        const updatedUser = await authService.verifyAccount(email , code);
        res.json({
            message: 'user already Verified',
            success: true,
            data: updatedUser
        })
    }catch(err){
        next(err);
    }
};

export const login = async (req, res , next) => {
    try{
        const {email , password} = req.body;
        const token = await authService.login(email, password);
        res.cookie('access-token',token,{httpOnly:true , maxAge:toMs(5,'hours')});
        res.json({
            message: 'Login successful',
            success: true,
        });
    }catch(err){
        next(err);
    }
};

export const sendOtp = async (req, res , next) => {
    try{
        const {email} = req.body;
        await authService.sendOtp(email);
        res.json({
            message: 'new OTP sent, check your email',
            success: true,
        });
    }catch(err){
        next(err);
    }
};

export const resetPassword = async (req, res , next) => {
    try{
    const {email, code, newPassword} = req.body;
    await authService.resetPassword(email, code, newPassword);
    res.json({
        message: 'Reset password successful',
        success: true,
    });
    }catch(err){
        next(err);
    }
};







