import express from 'express';
import {config} from 'dotenv';
config();
import authRouter from './app/auth/auth.route.js';
import userRouter from './app/user/user.route.js';
import messageRouter from './app/message/message.route.js';
import connectDB from "./common/db/mongoose.js";

const PORT = 3000;

const app = express();

connectDB();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);


app.listen(PORT , ()=>{
    console.log(`Listening on ${PORT} ...`);
});