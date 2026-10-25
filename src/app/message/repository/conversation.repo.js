import { Conversation } from '../model/conversation.model.js';

export const createConversation = async (conversationData) => {
    return Conversation.create(conversationData);
};

export const findConversationByRequest = async (requestId) => {
    return Conversation.findOne({ request: requestId });
};

export const findConversationById = async (conversationId) => {
    return Conversation.findById(conversationId);
};
