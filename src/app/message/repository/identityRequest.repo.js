import { IdentityRequest } from '../model/identityRequest.model.js';

export const createIdentityRequest = async (requestData) => {
    return IdentityRequest.create(requestData);
};

export const findIdentityRequestByMessage = async (messageId) => {
    return IdentityRequest.findOne({ message: messageId });
};

export const findIdentityRequestsBySender = async (senderId) => {
    return IdentityRequest.find({ sender: senderId })
        .sort({ createdAt: -1 })
        .populate('message', 'content receiver')
        .populate('requester', 'name profilePic')
        .lean();
};

export const findIdentityRequestById = async (requestId) => {
    return IdentityRequest.findById(requestId)
        .populate('message', 'content receiver')
        .populate('sender', 'name profilePic')
        .populate('requester', 'name profilePic');
};

export const findIdentityRequestDocumentById = async (requestId) => {
    return IdentityRequest.findById(requestId);
};

export const findAcceptedRequestsByRequester = async (requesterId) => {
    return IdentityRequest.find({ requester: requesterId, status: 'accepted' })
        .populate('sender', 'name profilePic')
        .lean();
};

export const decideIdentityRequest = async (requestId, senderId, status) => {
    return IdentityRequest.findOneAndUpdate(
        {
            _id: requestId,
            sender: senderId,
            status: 'pending',
        },
        { status },
        { returnDocument: 'after' }
    );
};
