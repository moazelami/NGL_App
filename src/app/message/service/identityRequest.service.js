import * as identityRequestRepo from '../repository/identityRequest.repo.js';
import * as messageRepo from '../repository/message.repo.js';
import {
    cannotRequestOwnIdentity,
    identityRequestAlreadyExists,
    identityRequestNotExist,
    identityRequestNotPending,
    notIdentityRequestParticipant,
    notIdentityRequestSender,
    notMessageReceiver,
    senderNotAvailable,
    messageNotExist,
} from '../error.js';
import { assertObjectId, sameId } from '../utils/objectId.js';

const formatRequest = (request) => {
    return {
        _id: request._id,
        message: request.message,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
    };
};

export const createIdentityRequest = async (messageId, requesterId) => {
    assertObjectId(messageId, 'message id');

    const message = await messageRepo.findMessageById(messageId);
    if (!message) {
        throw messageNotExist;
    }

    if (!message.receiver.equals(requesterId)) {
        throw notMessageReceiver;
    }

    if (!message.sender) {
        throw senderNotAvailable;
    }

    if (sameId(message.sender, requesterId)) {
        throw cannotRequestOwnIdentity;
    }

    const existingRequest = await identityRequestRepo.findIdentityRequestByMessage(messageId);
    if (existingRequest) {
        throw identityRequestAlreadyExists;
    }

    try {
        const request = await identityRequestRepo.createIdentityRequest({
            message: message._id,
            sender: message.sender,
            requester: requesterId,
        });

        return formatRequest(request);
    } catch (err) {
        if (err.code === 11000) {
            throw identityRequestAlreadyExists;
        }

        throw err;
    }
};

export const getSenderRequests = async (senderId) => {
    const requests = await identityRequestRepo.findIdentityRequestsBySender(senderId);

    return requests.map((request) => {
        return {
            _id: request._id,
            message: request.message,
            requester: request.requester,
            status: request.status,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
        };
    });
};

export const getIdentityRequest = async (requestId, userId) => {
    assertObjectId(requestId, 'identity request id');

    const request = await identityRequestRepo.findIdentityRequestById(requestId);
    if (!request) {
        throw identityRequestNotExist;
    }

    const senderId = request.sender?._id || request.sender;
    const requesterId = request.requester?._id || request.requester;

    if (!sameId(senderId, userId) && !sameId(requesterId, userId)) {
        throw notIdentityRequestParticipant;
    }

    return {
        _id: request._id,
        message: request.message,
        requester: request.requester,
        sender: request.status === 'accepted' ? request.sender : null,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
    };
};

export const decideIdentityRequest = async (requestId, senderId, status) => {
    assertObjectId(requestId, 'identity request id');

    const request = await identityRequestRepo.findIdentityRequestDocumentById(requestId);
    if (!request) {
        throw identityRequestNotExist;
    }

    if (!sameId(request.sender, senderId)) {
        throw notIdentityRequestSender;
    }

    if (request.status !== 'pending') {
        throw identityRequestNotPending;
    }

    const updated = await identityRequestRepo.decideIdentityRequest(
        requestId,
        senderId,
        status
    );

    if (!updated) {
        const currentRequest = await identityRequestRepo.findIdentityRequestDocumentById(requestId);

        if (!currentRequest) {
            throw identityRequestNotExist;
        }

        if (!sameId(currentRequest.sender, senderId)) {
            throw notIdentityRequestSender;
        }

        throw identityRequestNotPending;
    }

    return getIdentityRequest(requestId, senderId);
};
