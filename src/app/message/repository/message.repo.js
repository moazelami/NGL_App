import { Message } from '../model/message.model.js';

export const createMessage = async (content, receiver, sender) => {
    return Message.create({
        content: content,
        sender: sender,
        receiver: receiver,
    });
};

export const findMessageById = async (messageId) => {
    return Message.findOne({ _id: messageId, isDeleted: false });
};

export const getAllMessages = async (userId) => {
    return Message.find({
        receiver: userId,
        isDeleted: false,
    })
        .sort({ createdAt: -1 })
        .lean();
};