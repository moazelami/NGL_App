import {Router} from 'express';
import * as authController from './controller/auth.controller.js';
import { rateLimit } from '../../lib/auth/rateLimit.js';
import { guard } from '../../lib/auth/guard.js';
const authRouter = Router();

authRouter.post('/register', rateLimit(10), authController.register);
authRouter.post('/login', rateLimit(10), authController.login);
authRouter.post('/send-otp', rateLimit(5), authController.sendOtp);
authRouter.post('/reset-password', rateLimit(10), authController.resetPassword);
authRouter.patch('/verify-account' , rateLimit(10), authController.verifyAccount);
authRouter.post('/login-with-google', rateLimit(20), authController.loginWithGoogle);
authRouter.post('/2fa/enable', rateLimit(5), guard, authController.requestTwoFactorEnable);
authRouter.post('/2fa/enable/confirm', rateLimit(5), guard, authController.confirmTwoFactorEnable);
authRouter.post('/login/2fa/confirm',rateLimit(5),authController.confirmTwoFactorLogin);

export default authRouter;
