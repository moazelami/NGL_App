import express from 'express';
import {config} from 'dotenv';
config();
import authRouter from './app/auth/auth.route.js';
import userRouter from './app/user/user.route.js';
import messageRouter from './app/message/message.route.js';
import connectDB from "./lib/db/mongoose.js";
import {logger} from "./lib/logger/logger.js";


const PORT = 3000;

const app = express();

connectDB();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);

app.use((err , req ,res , next)=>{
    logger.error(err.message,err);
    if(err.isOperational === true) {
       return res.status(err.statusCode).json({
            message: err.message,
            success: false,
        });
    }
    return res.status(500).json({
        error:'something went wrong',
        success: false,
    });
});

app.listen(PORT , ()=>{
    logger.info(`Listening on ${PORT} ...`);
});