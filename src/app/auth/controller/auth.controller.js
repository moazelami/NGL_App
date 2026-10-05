import * as authService from '../service/auth.service.js';

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
        res.json({
            message: 'Login successful',
            success: true,
            data: {token}
        });
    }catch(err){
        next(err);
    }
};







