import * as messageController from './controller/message.controller.js';
import {Router} from 'express';
import { guard } from './../../lib/auth/guard.js';

const router = new Router();

router.post('/', messageController.sendMessage);
router.post('/public', guard, messageController.sendMessage);

router.get('/', guard, messageController.getAllMessages);

export default router;