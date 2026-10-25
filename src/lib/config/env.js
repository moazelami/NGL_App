import { z } from 'zod';
import { config } from 'dotenv';
config();


const schema = z.object({
    PORT: z.string().default('3000'),

    MONGODB_URL: z.string(),

    MAIL_PASS: z.string(),
    MAIL_U: z.string().trim().toLowerCase(),

    JWT_SECRET: z.string(),

    GOOGLE_CLIENT_ID: z.string(),

    REDIS_HOST: z.string(),
    REDIS_PORT: z.string().default('6379'),
    REDIS_PASSWORD: z.string(),
});

const parsed = schema.parse(process.env);

export const env = {
    port: Number(parsed.PORT),
    db: {
        url: parsed.MONGODB_URL,
    },
    google: {
        webClientId: parsed.GOOGLE_CLIENT_ID,
        iosClientId: parsed.GOOGLE_CLIENT_ID,
    },
    redis: {
        host: parsed.REDIS_HOST,
        port: Number(parsed.REDIS_PORT),
        password: parsed.REDIS_PASSWORD,
    },
    nodemailer: {
        user: parsed.MAIL_U,
        password: parsed.MAIL_PASS,
    },
    jwt: {
        secret: parsed.JWT_SECRET,
    },
    payments: {},
    aws:{},

}