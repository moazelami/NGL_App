import { AppError } from '../error/error.js';

export const validateBody = (dto, body) => {
    const result = dto.safeParse(body);

    if (!result.success) {
        const errMessage = result.error.issues
            .map(issue => `${issue.path[0]?? 'error'}: ${issue.message}`)
            .join(', ');

        throw new AppError(errMessage, 400);
    }

    return result.data;
};
