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