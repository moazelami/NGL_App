
export class AppError extends Error {
    statusCode ;
    isOperational;

    constructor(message,statusCode , isOperational = true) {
        super();
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this , this.constructor);
    }
}

