import { logger } from "../../pkg/logger/logger.js"


export const globalErrorHandler = (err , req ,res , next)=>{
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message;
    let knownError = err.isOperational === true;

    if (err.code === 11000) {
        statusCode = 409;
        message = 'Email already exists';
        knownError = true;
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        statusCode = 400;
        message = err.message;
        knownError = true;
    } else if (err.type === 'entity.parse.failed') {
        statusCode = 400;
        message = 'Invalid JSON body';
        knownError = true;
    } else if (err.type === 'entity.too.large') {
        statusCode = 413;
        message = 'Request body too large';
        knownError = true;
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Invalid or expired token';
        knownError = true;
    }

    if (!Number.isInteger(statusCode) || statusCode < 400 || statusCode > 599) {
        statusCode = 500;
    }

    logger.error(err.message || 'Unhandled error', {
        name: err.name,
        stack: err.stack,
        code: err.code,
    });

    if (knownError) {
       return res.status(statusCode).json({
            message: message,
            success: false,
        });
    }

    return res.status(500).json({
        error:'something went wrong',
        success: false,
    });
}
