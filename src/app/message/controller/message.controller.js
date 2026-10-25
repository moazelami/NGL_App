import * as messageService from '../service/message.service.js';
import * as identityRequestService from '../service/identityRequest.service.js';
import * as conversationService from '../service/conversation.service.js';
import { validateBody } from '../../../lib/validation/validation.js';
import {
    sendMessageDto,
    identityRequestDecisionDto,
    conversationMessageDto,
} from '../dto/message.dto.js';

export const sendMessage = async (req, res, next) => {
    try {
        const data = validateBody(sendMessageDto, req.body);
        const { content, receiver } = data;
        const sender = req.user.id;

        const createdMessage = await messageService.sendMessage(
            content,
            receiver,
            sender
        );

        res.status(201).json({
            message: 'message created successfully',
            success: true,
            data: createdMessage,
        });
    } catch (err) {
        next(err);
    }
};

export const getAllMessages = async (req, res, next) => {
    try {
        const messages = await messageService.getAllMessages(req.user.id);

        res.json({
            message: 'ok',
            success: true,
            data: messages,
        });
    } catch (err) {
        next(err);
    }
};

export const createIdentityRequest = async (req, res, next) => {
    try {
        const request = await identityRequestService.createIdentityRequest(
            req.params.messageId,
            req.user.id
        );

        res.status(201).json({
            message: 'identity request created successfully',
            success: true,
            data: request,
        });
    } catch (err) {
        next(err);
    }
};

export const getSenderRequests = async (req, res, next) => {
    try {
        const requests = await identityRequestService.getSenderRequests(req.user.id);

        res.json({
            message: 'ok',
            success: true,
            data: requests,
        });
    } catch (err) {
        next(err);
    }
};

export const getIdentityRequest = async (req, res, next) => {
    try {
        const request = await identityRequestService.getIdentityRequest(
            req.params.requestId,
            req.user.id
        );

        res.json({
            message: 'ok',
            success: true,
            data: request,
        });
    } catch (err) {
        next(err);
    }
};

export const decideIdentityRequest = async (req, res, next) => {
    try {
        const data = validateBody(identityRequestDecisionDto, req.body);

        const request = await identityRequestService.decideIdentityRequest(
            req.params.requestId,
            req.user.id,
            data.status
        );

        res.json({
            message: 'identity request updated successfully',
            success: true,
            data: request,
        });
    } catch (err) {
        next(err);
    }
};

export const createConversation = async (req, res, next) => {
    try {
        const conversation = await conversationService.createConversation(
            req.params.requestId,
            req.user.id
        );

        res.status(201).json({
            message: 'conversation created successfully',
            success: true,
            data: conversation,
        });
    } catch (err) {
        next(err);
    }
};

export const sendConversationMessage = async (req, res, next) => {
    try {
        const data = validateBody(conversationMessageDto, req.body);

        const message = await conversationService.sendConversationMessage(
            req.params.conversationId,
            req.user.id,
            data.content
        );

        res.status(201).json({
            message: 'conversation message created successfully',
            success: true,
            data: message,
        });
    } catch (err) {
        next(err);
    }
};

export const getConversationMessages = async (req, res, next) => {
    try {
        const messages = await conversationService.getConversationMessages(
            req.params.conversationId,
            req.user.id
        );

        res.json({
            message: 'ok',
            success: true,
            data: messages,
        });
    } catch (err) {
        next(err);
    }
};
