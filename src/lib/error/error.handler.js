import { logger } from "../../pkg/logger/logger.js"


export const globalErrorHandler = (err , req ,res , next)=>{
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
}