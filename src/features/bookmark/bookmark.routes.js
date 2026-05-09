/**
 * src/features/bookmark/bookmark.routes.js
 * 
 * Bookmark routes - all require authentication.
 */

import express from 'express';
import BookmarkController from './bookmark.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/:postId', BookmarkController.addBookmark);

router.delete('/:postId', BookmarkController.removeBookmark);


router.get('/', BookmarkController.getBookmarks);

export default router;