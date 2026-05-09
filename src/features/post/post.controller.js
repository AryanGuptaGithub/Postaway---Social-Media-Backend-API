

import PostModel from './post.model.js';
import UserModel from '../user/user.model.js';
import CustomError from '../../errors/customError.js';

class PostController {
  /**
   * Get all posts with optional filters, sorting, pagination
   * GET /api/posts/all?caption=keyword&sort=engagement&page=1&limit=10
   * @param {object} req - Express request
   * @param {object} res - Express response
   * @param {Function} next
   */
  static getAllPosts(req, res, next) {
    try {
      const { caption, sort, page, limit } = req.query;
      
      const options = {
        captionKeyword: caption,
        sortBy: sort === 'engagement' ? 'engagement' : (sort === 'date' ? 'date' : null),
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
      };
      
      const result = PostModel.getAll(options);
      
      res.status(200).json({
        success: true,
        message: 'Posts fetched successfully',
        data: {
          posts: result.posts,
          pagination: {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            limit: options.limit
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single post by ID
   * GET /api/posts/:id
   * @param {object} req - Express request
   * @param {object} res - Express response
   * @param {Function} next
   */
  static getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const post = PostModel.getById(id);
      
      if (!post) {
        throw new CustomError('Post not found', 404);
      }
      
      res.status(200).json({
        success: true,
        message: 'Post fetched successfully',
        data: post
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all posts by logged-in user (from JWT)
   * GET /api/posts/
   * @param {object} req - Express request (req.userId set by auth)
   * @param {object} res - Express response
   * @param {Function} next
   */
  static getUserPosts(req, res, next) {
    try {
      const userId = req.userId;
      const posts = PostModel.getByUserId(userId);
      
      res.status(200).json({
        success: true,
        message: 'Your posts fetched successfully',
        data: posts
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new post (supports image upload)
   * POST /api/posts/
   * @param {object} req - Express request (body: caption, status; file: image)
   * @param {object} res - Express response
   * @param {Function} next
   */
  static createPost(req, res, next) {
    try {
      const userId = req.userId;
      const { caption, status } = req.body;
      
  
      let imageUrl = null;
      if (req.file) {
       
        imageUrl = `/uploads/${req.file.filename}`;
      }
      
      const newPost = PostModel.create({
        userId,
        caption: caption || '',
        imageUrl,
        status: status || 'published'
      });
      
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: newPost
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a post by ID (owner only)
   * PUT /api/posts/:id
   * @param {object} req - Express request (body, file)
   * @param {object} res - Express response
   * @param {Function} next
   */
  static updatePost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      const { caption, status } = req.body;
      

      const existingPost = PostModel.getById(id);
      if (!existingPost) {
        throw new CustomError('Post not found', 404);
      }
      

      if (existingPost.userId !== userId) {
        throw new CustomError('You are not authorized to update this post', 403);
      }
      
        
      const updates = {};
      if (caption !== undefined) updates.caption = caption;
      if (status !== undefined) updates.status = status;
      if (req.file) {
        updates.imageUrl = `/uploads/${req.file.filename}`;
      }
      
      const updatedPost = PostModel.update(id, updates);
      
      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        data: updatedPost
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a post by ID (owner only)
   * DELETE /api/posts/:id
   * @param {object} req - Express request
   * @param {object} res - Express response
   * @param {Function} next
   */
  static deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;
      
      const existingPost = PostModel.getById(id);
      if (!existingPost) {
        throw new CustomError('Post not found', 404);
      }
      
      if (existingPost.userId !== userId) {
        throw new CustomError('You are not authorized to delete this post', 403);
      }
      
      const deletedPost = PostModel.delete(id);
      
      res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
        data: deletedPost
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PostController;