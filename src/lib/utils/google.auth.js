import {OAuth2Client} from "google-auth-library";
import { env } from "../config/env.js";
import {AppError} from "../error/error.js";

const client = new OAuth2Client({clientId: env.google.webClientId });
export const verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: env.google.webClientId,
        } );
        return ticket.getPayload();
    } catch (err) {
        throw new AppError('Invalid Google token', 401);
    }
};
