import { createApp } from './app.js';
import mongoose from 'mongoose';
import { env } from './lib/config/env.js';
import { logger } from './pkg/logger/logger.js';
import connectDB from './lib/db/mongoose.js';
import { cacheProvider } from './lib/cache/init.js';

const app = createApp();

const start = async () => {
    await connectDB();

    const server = app.listen(env.port, () => {
        const address = server.address();
        logger.info(`Listening on ${address.port} ...`);
    });

    server.on('error', (err) => {
        logger.error('HTTP server error', { error: err.message, stack: err.stack });
        process.exit(1);
    });

    let shuttingDown = false;

    const shutdown = async (signal) => {
        if (shuttingDown) return;
        shuttingDown = true;
        logger.info(`shutdown requested (${signal})`);

        const forceExit = setTimeout(() => {
            logger.error('shutdown timed out');
            process.exit(1);
        }, 10000);
        forceExit.unref();

        server.close(async () => {
            try {
                await mongoose.disconnect();
            } catch (err) {
                logger.error('MongoDB disconnect failed', { error: err.message });
            }

            try {
                await cacheProvider.disconnect();
            } catch (err) {
                logger.error('Redis disconnect failed', { error: err.message });
            }

            process.exit(0);
        });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start().catch((err) => {
    logger.error('startup failed', { error: err.message, stack: err.stack });
    process.exit(1);
});
