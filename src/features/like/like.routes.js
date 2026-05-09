

import express from 'express';
import LikeController from './like.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);


router.get('/:postId', LikeController.getLikesByPost);


router.get('/toggle/:postId', LikeController.toggleLike);

export default router;