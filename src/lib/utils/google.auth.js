import {OAuth2Client} from "google-auth-library";
import { env } from "../config/env.js";

const client = new OAuth2Client({clientId: env.google.webClientId });
export const verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await client.verifyIdToken({ idToken: idToken } );
        return ticket.getPayload();
    } catch (err) {
        throw new AppError('Invalid Google token', 403);
    }
};