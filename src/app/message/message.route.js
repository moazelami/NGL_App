import * as messageController from './controller/message.controller.js';
import { Router } from 'express';
import { guard } from '../../lib/auth/guard.js';

const router = new Router();

router.post('/', guard, messageController.sendMessage);
router.post('/public', guard, messageController.sendMessage);

router.get('/', guard, messageController.getAllMessages);

router.post('/:messageId/identity-requests', guard, messageController.createIdentityRequest);

router.get('/identity-requests', guard, messageController.getSenderRequests);
router.get('/identity-requests/:requestId', guard, messageController.getIdentityRequest);
router.patch('/identity-requests/:requestId', guard, messageController.decideIdentityRequest);
router.post('/identity-requests/:requestId/conversation', guard, messageController.createConversation);

router.post('/conversations/:conversationId/messages', guard, messageController.sendConversationMessage);
router.get('/conversations/:conversationId/messages', guard, messageController.getConversationMessages);

export default router;
