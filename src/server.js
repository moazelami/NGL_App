import http from 'node:http';
import { createApp } from './app.js';
import mongoose from 'mongoose';
import { env } from './lib/config/env.js';
import { logger } from './pkg/logger/logger.js';

const app = createApp();
const server = http.createServer(app);
app.listen(env.port, ()=>{
    logger.info(`Listening on 3000 ...`);
});

const shutdown = async () => {
    logger.info("shutdown requested");

    server.close(async () => {
        try{
            await mongoose.disconnect();
        } catch (err) {}
        process.exit(0);
    });
}

server.on('SIGINT',shutdown);
server.on('SIGTERM', shutdown);