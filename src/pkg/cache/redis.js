import Redis from "ioredis";
import { logger } from "../logger/logger.js";


export class RedisCacheProvider{
    client;

    
    constructor(config) { 
        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            enableOfflineQueue: false,
            connectTimeout: 1000,
            commandTimeout: 1000,
            retryStrategy() {
                return null;
            },
        });
        this.client.on('error',(err)=>logger.error('Redis error', { error: err.message }));
        this.connecting = null;
    }

    async ensureConnected() {
        if (this.client.status === 'ready') return;

        if (!this.connecting) {
            this.connecting = this.client.connect().finally(() => {
                this.connecting = null;
            });
        }

        await this.connecting;
    }
    
    async set(key , value ,ttl) {
        await this.ensureConnected();
        return this.client.set(key, value, 'EX', ttl);
    }

    async get(key) {
        await this.ensureConnected();
        return this.client.get(key);
    }

    async del(key) {
        await this.ensureConnected();
        return this.client.del(key);
    }

    async disconnect() {
        if (this.client.status === 'ready') {
            await this.client.quit();
            return;
        }

        this.client.disconnect();
    }
}
