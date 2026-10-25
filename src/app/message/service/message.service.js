import * as messageRepo from '../repository/message.repo.js';
import * as identityRequestRepo from '../repository/identityRequest.repo.js';
import * as userRepo from '../../user/repository/user.repo.js';
import { userNotExist } from '../../user/error.js';
import { cannotMessageSelf } from '../error.js';
import { sameId } from '../utils/objectId.js';

const formatMessage = (message) => {
    return {
        _id: message._id,
        content: message.content,
        receiver: message.receiver,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
    };
};

export const sendMessage = async (content, receiver, sender) => {
    if (sameId(receiver, sender)) {
        throw cannotMessageSelf;
    }

    const user = await userRepo.findUserById(receiver);
    if (!user) {
        throw userNotExist;
    }

    const createdMessage = await messageRepo.createMessage(content, receiver, sender);
    return formatMessage(createdMessage);
};

export const getAllMessages = async (userId) => {
    const messages = await messageRepo.getAllMessages(userId);
    const acceptedRequests = await identityRequestRepo.findAcceptedRequestsByRequester(userId);

    const revealedSenders = new Map(
        acceptedRequests
            .filter((request) => request.sender)
            .map((request) => [String(request.message), request.sender])
    );

    return messages.map((message) => {
        const sender = revealedSenders.get(String(message._id)) || null;

        return {
            _id: message._id,
            content: message.content,
            receiver: message.receiver,
            sender,
            senderRevealed: Boolean(sender),
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        };
    });
};
