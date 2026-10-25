import { Message } from '../model/message.model.js';

export const createMessage = async (content, receiver, sender) => {
    return Message.create({
        content: content,
        sender: sender,
        receiver: receiver,
    });
};

export const getAllMessages = async (userId) => {
    return Message.find({
        receiver: userId
    },
        {},
        {populate: {path:"sender", select:"-password"}}
    )
}