import {OAuth2Client} from "google-auth-library";

const client = new OAuth2Client({clientId: process.env.GOOGLE_CLIENT_ID});
export const verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await client.verifyIdToken({ idToken: idToken } );
        return ticket.getPayload();
    } catch (err) {
        throw new AppError('Invalid Google token', 403);
    }
};