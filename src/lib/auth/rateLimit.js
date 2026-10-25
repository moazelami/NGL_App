const buckets = new Map();

export const rateLimit = (max = 10, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const now = Date.now();
        const key = `${req.ip}:${req.method}:${req.baseUrl}${req.path}`;

        if (buckets.size > 5000) {
            for (const [bucketKey, bucket] of buckets) {
                if (bucket.resetAt <= now) buckets.delete(bucketKey);
            }
        }

        const bucket = buckets.get(key);

        if (!bucket || bucket.resetAt <= now) {
            buckets.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        if (bucket.count >= max) {
            res.setHeader('Retry-After', Math.ceil((bucket.resetAt - now) / 1000));
            return res.status(429).json({
                message: 'Too many requests, please try again later.',
                success: false,
            });
        }

        bucket.count += 1;
        next();
    };
};
