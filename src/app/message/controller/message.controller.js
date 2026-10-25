import * as messageService from '../service/message.service.js';
import { validateBody } from './../../../lib/validation/validation.js';
import { sendMessageDto } from '../dto/message.dto.js';


export const sendMessage = async (req, res, next) => {
    try {

        console.log({
            contentType: req.headers["content-type"],
            body: req.body,
        });

        const data = validateBody(sendMessageDto, req.body);
        const { content, receiver } = data;
        const sender = req.user?.id;
        const createdMessage = await messageService.sendMessage(content, receiver, sender);
        res.status(201).json({
            message: 'message created successfully',
            success: true,
            data: createdMessage
        });
    } catch (err) {
        next(err);
    }
};

export const getAllMessages = async (req , res , next) => {
    try {
        const messages = await messageService.getAllMessages(req.user.id);
        res.json({
            message: "ok",
            success: true,
            data: messages,
        });
    } catch (err) {
        next(err);
    }
};