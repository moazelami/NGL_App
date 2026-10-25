import Redis from "ioredis";


export class RedisCacheProvider{
    client;

    
    constructor(config) { 
        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
            maxLoadRetryTime: 3,
        });
        this.client.on('error',(err)=>console.log('Redis error', err.message));
        this.client.connect().catch(err => console.log('fail to connect to redis', err.message));
    }
    
    set(key , value ,ttl) {
        return this.client.set(key, value, 'EX', ttl);
    }

    get(key) { 
        return this.client.get(key);
    }

    del(key) { 
        return this.client.del(key);
    }
}

    

