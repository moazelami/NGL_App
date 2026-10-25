import jwt from 'jsonwebtoken';
import { env } from '../../../lib/config/env.js';

export const generateToken = (payload)=>{
    return jwt.sign(
        payload,
        env.jwt.secret,
        {expiresIn: '1d'}
    );
}