/**
 * src/features/comment/comment.routes.js
 * 
 * Comment routes - all require authentication.
 */

import express from 'express';
import CommentController from './comment.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();


router.use(authMiddleware);


router.get('/:id', CommentController.getCommentsByPost);


router.post('/:id', CommentController.addComment);


router.put('/:id', CommentController.updateComment);

router.delete('/:id', CommentController.deleteComment);

export default router;