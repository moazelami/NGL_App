import { cacheProvider } from "./init.js";
import { logger } from "../../pkg/logger/logger.js";

export const withCache =  (ttl = 3600) => {
    return async (req, res, next) => {
        const key = `cache:v2:${req.method}:${req.originalUrl}`;

        try {
            const cached = await cacheProvider.get(key);
            if (cached) {
                try {
                    return res.json(JSON.parse(cached));
                } catch (err) {
                    logger.error('Cache parse failed', { key, error: err.message });
                }
            }
        } catch (err) {
            logger.error('Cache read failed', { key, error: err.message });
        }

        //interceptor
        //res.json(); >> send client response
        //res.json(); >> cache + send client response
        //get deep copy from implementation res.json before modify
        const originalJson = res.json.bind(res);

        res.json = async (body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    await cacheProvider.set(key, JSON.stringify(body), ttl);
                } catch (err) {
                    logger.error('Cache write failed', { key, error: err.message });
                }
            }

            return originalJson(body);
        };

        next();
    }
}
