import * as conversationRepo from '../repository/conversation.repo.js';
import * as conversationMessageRepo from '../repository/conversationMessage.repo.js';
import * as identityRequestRepo from '../repository/identityRequest.repo.js';
import {
    conversationAlreadyExists,
    conversationNotExist,
    identityRequestNotAccepted,
    identityRequestNotExist,
    notConversationParticipant,
    notIdentityRequestParticipant,
} from '../error.js';
import { assertObjectId } from '../utils/objectId.js';

const isParticipant = (conversation, userId) => {
    return conversation.participants.some((participantId) => {
        return String(participantId) === String(userId);
    });
};

export const createConversation = async (requestId, userId) => {
    assertObjectId(requestId, 'identity request id');

    const request = await identityRequestRepo.findIdentityRequestDocumentById(requestId);
    if (!request) {
        throw identityRequestNotExist;
    }

    if (
        String(request.sender) !== String(userId) &&
        String(request.requester) !== String(userId)
    ) {
        throw notIdentityRequestParticipant;
    }

    if (request.status !== 'accepted') {
        throw identityRequestNotAccepted;
    }

    const existingConversation = await conversationRepo.findConversationByRequest(requestId);
    if (existingConversation) {
        throw conversationAlreadyExists;
    }

    try {
        const conversation = await conversationRepo.createConversation({
            request: request._id,
            message: request.message,
            participants: [request.sender, request.requester],
        });

        return {
            _id: conversation._id,
            request: conversation.request,
            message: conversation.message,
            participants: conversation.participants,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
        };
    } catch (err) {
        if (err.code === 11000) {
            throw conversationAlreadyExists;
        }

        throw err;
    }
};

export const sendConversationMessage = async (conversationId, userId, content) => {
    assertObjectId(conversationId, 'conversation id');

    const conversation = await conversationRepo.findConversationById(conversationId);
    if (!conversation) {
        throw conversationNotExist;
    }

    if (!isParticipant(conversation, userId)) {
        throw notConversationParticipant;
    }

    const createdMessage = await conversationMessageRepo.createConversationMessage({
        conversation: conversation._id,
        sender: userId,
        content,
    });

    return {
        _id: createdMessage._id,
        conversation: createdMessage.conversation,
        sender: createdMessage.sender,
        content: createdMessage.content,
        createdAt: createdMessage.createdAt,
        updatedAt: createdMessage.updatedAt,
    };
};

export const getConversationMessages = async (conversationId, userId) => {
    assertObjectId(conversationId, 'conversation id');

    const conversation = await conversationRepo.findConversationById(conversationId);
    if (!conversation) {
        throw conversationNotExist;
    }

    if (!isParticipant(conversation, userId)) {
        throw notConversationParticipant;
    }

    const messages = await conversationMessageRepo.findConversationMessages(conversationId);

    return messages.map((message) => {
        return {
            _id: message._id,
            conversation: message.conversation,
            sender: message.sender,
            content: message.content,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        };
    });
};
