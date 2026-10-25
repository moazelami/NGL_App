import { Types } from 'mongoose';
import { AppError } from '../../../lib/error/error.js';

export const assertObjectId = (id, label = 'id') => {
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError(`Invalid ${label}.`, 400);
    }

    return id;
};

export const sameId = (firstId, secondId) => {
    return String(firstId) === String(secondId);
};
