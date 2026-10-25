import { cacheProvider } from "./init.js";

export const withCache =  (ttl = 3600) => {
    return async (req, res, next) => {
        let key = `${req.method}:${req.originalUrl}`;
        const cached = await cacheProvider.get(key);
        if (cached) {
            return res.json(JSON.parse(cached));
        }
        //interceptor
        //res.json(); >> send client response
        //res.json(); >> cache + send client response
        //get deep copy from implementation res.json before modify
        const originalJson = res.json.bind(res);



        res.json = ( async(body) => {
            //1. cache body
            await cacheProvider.set(key, JSON.stringify(body), ttl);
            //2. send response
            return originalJson(body);
        });

        next();
    }
}