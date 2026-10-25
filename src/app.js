import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './lib/error/error.handler.js';
import { router } from "./route.js";
import { correlationId } from './lib/correlation/correlationid.js';
import cookieParser from 'cookie-parser';

export const createApp = () => {

const app = express();
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

    app.use(express.json());

    app.use(cookieParser());
    
    app.use(correlationId);

    app.use('/api', router);

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        success: false,
    });
});

app.use(globalErrorHandler);


    
    return app;
}