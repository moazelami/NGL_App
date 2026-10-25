import { AppError } from "../../lib/error/error.js";

export const messageNotExist = new AppError('Message not found.', 404);
export const cannotMessageSelf = new AppError('You cannot send a message to yourself.', 400);
export const notMessageReceiver = new AppError('Only the message receiver can request the sender identity.', 403);
export const cannotRequestOwnIdentity = new AppError('You cannot request your own identity.', 400);
export const senderNotAvailable = new AppError('This message has no sender.', 400);
export const identityRequestAlreadyExists = new AppError('An identity request already exists for this message.', 409);
export const identityRequestNotExist = new AppError('Identity request not found.', 404);
export const notIdentityRequestParticipant = new AppError('You are not a participant in this identity request.', 403);
export const notIdentityRequestSender = new AppError('Only the original sender can decide this request.', 403);
export const identityRequestNotPending = new AppError('This identity request has already been decided.', 409);
export const identityRequestNotAccepted = new AppError('The identity request must be accepted before creating a conversation.', 400);
export const conversationAlreadyExists = new AppError('A conversation already exists for this request.', 409);
export const conversationNotExist = new AppError('Conversation not found.', 404);
export const notConversationParticipant = new AppError('You are not a participant in this conversation.', 403);
