import * as messageRepo from '../repository/message.repo.js';
import * as userRepo from '../../user/repository/user.repo.js';
import { userNotExist } from './../../user/error.js';

export const sendMessage = async (content, receiver, sender) => {
    
    const user = await userRepo.findUserById(receiver);
    if (!user)
        throw userNotExist;

    return await messageRepo.createMessage(content, receiver, sender);

};

export const getAllMessages = async (userId) => {
    const messages = messageRepo.getAllMessages(userId);
    if (messages.length === 0) throw new AppError('no message found', 404);
    return messages;
}