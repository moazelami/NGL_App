import * as userController from './controller/user.controller.js';
import {Router} from 'express';
import { User } from './model/user.model.js';
import { withCache } from '../../lib/cache/withCache.js';

const router = new Router();

router.get('/get-all-users', withCache(), async (req, res, next) => {
    const data = await User.find();
    res.json(users);
});
export default router;