import { ConversationMessage } from '../model/conversationMessage.model.js';

export const createConversationMessage = async (messageData) => {
    return ConversationMessage.create(messageData);
};

export const findConversationMessages = async (conversationId) => {
    return ConversationMessage.find({
        conversation: conversationId,
        isDeleted: false,
    })
        .sort({ createdAt: 1 })
        .populate('sender', 'name profilePic')
        .lean();
};
