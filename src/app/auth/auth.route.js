import {Router} from 'express';
import * as authController from './controller/auth.controller.js';
import {rateLimit} from '../../lib/auth/rateLimit.js';
const authRouter = Router();

authRouter.post('/register', rateLimit(10), authController.register);
authRouter.post('/login', rateLimit(10), authController.login);
authRouter.post('/send-otp', rateLimit(5), authController.sendOtp);
authRouter.post('/reset-password', rateLimit(10), authController.resetPassword);
authRouter.patch('/verify-account' , rateLimit(10), authController.verifyAccount);
authRouter.post('/login-with-google', rateLimit(20), authController.loginWithGoogle);

export default authRouter;
