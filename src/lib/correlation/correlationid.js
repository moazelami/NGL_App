import crypto from 'node:crypto';
export const correlationId = async (req, res , next) =>
{
    const id = crypto.randomUUID();
    req.collerationId = id;
    res.setHeader('X-correlation-Id',id);
    next();
};