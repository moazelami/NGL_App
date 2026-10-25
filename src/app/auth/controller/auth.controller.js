import * as authService from '../service/auth.service.js';
import { toMs } from "../../../pkg/utils/time.js";
import { validateBody } from '../../../lib/validation/validation.js';
import { registerDTO, verifyAccountDTO, loginDTO, senddtoDTO, resetPasswordDTO, googleLoginDTO } from '../dto/auth.dto.js';

export const register = async (req, res , next) => {
    try {
        const data = validateBody(registerDTO, req.body);
        const createdUser = await authService.register(data);
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
    try {
        const data = validateBody(verifyAccountDTO, req.body);
        const { email, code } = data;
        const updatedUser = await authService.verifyAccount(email, code);
        res.json({
            message: 'Account verified successfully',
            success: true,
            data: updatedUser
        })
    }catch(err){
        next(err);
    }
};

export const login = async (req, res , next) => {
    try {
        const data = validateBody(loginDTO, req.body);
        const {email , password} = data;
        const token = await authService.login(email, password);
        res.cookie('access-token',token,{httpOnly:true , sameSite:'lax', maxAge:toMs(5,'hours')});
        res.json({
            message: 'Login successful',
            success: true,
        });
    }catch(err){
        next(err);
    }
};

export const sendOtp = async (req, res , next) => {
    try {
        const data = validateBody(senddtoDTO, req.body);
        const {email} = data;
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
    const data = validateBody(resetPasswordDTO, req.body);
    const {email, code, newPassword} = data;
    await authService.resetPassword(email, code, newPassword);
    res.json({
        message: 'Reset password successful',
        success: true,
    });
    }catch(err){
        next(err);
    }
};

export const loginWithGoogle = async (req, res, next) => {
    try {
        const data = validateBody(googleLoginDTO, req.body);
        const token = await authService.loginWithGoogle(data.idToken);
        res.cookie('access-token', token, { httpOnly: true, sameSite: 'lax', maxAge: toMs(5, 'hours') });
        res.json({
            message: 'user login successful',
            success: true,
        });
    } catch (err) {
        next(err);
    }
};





