

import express from 'express';
import PostController from './post.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/upload.middleware.js';

const router = express.Router();

router.use(authMiddleware);


router.get('/all', PostController.getAllPosts);


router.get('/:id', PostController.getPostById);


router.get('/', PostController.getUserPosts);


router.post('/', upload.single('image'), PostController.createPost);


router.put('/:id', upload.single('image'), PostController.updatePost);


router.delete('/:id', PostController.deletePost);

export default router;