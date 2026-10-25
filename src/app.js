import express from 'express';
import connectDB from "./lib/db/mongoose.js";
import cors from 'cors';
import { globalErrorHandler } from './lib/error/error.handler.js';
import { router } from "./route.js";


export const createApp = () => {

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
connectDB();

app.use(express.json());

    app.use('/api', router);

app.use(globalErrorHandler);


    
    return app;
}