
import { cacheProvider } from "../cache/init.js";

export function idempotency(ttl = 3600) {
    return async function (req, res, next) {
        try {
            const idempotencyKey = req.headers["idempotency-key"];

            if (
                typeof idempotencyKey !== "string" ||
                !idempotencyKey.trim()
            ) {
                return res.status(400).json({
                    message: "Idempotency-Key header is required",
                });
            }

            const key = `${req.method}:${req.originalUrl}:${idempotencyKey}`;

            const cached = await cacheProvider.get(key);

            if (cached) {
                res.setHeader("X-Cache", "HIT");
                return res.json(JSON.parse(cached));
            }

            res.setHeader("X-Cache", "MISS");

            const originalJson = res.json.bind(res);

            res.json = function (body) {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    Promise.resolve(
                        cacheProvider.set(
                            key,
                            JSON.stringify(body),
                            ttl
                        )
                    ).catch((error) => {
                        console.error("Idempotency cache write failed:", error.message);
                    });
                }

                return originalJson(body);
            };

            next();
        } catch (error) {
            next(error);
        }
    };
}
