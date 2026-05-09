

import CommentModel from './comment.model.js';
import PostModel from '../post/post.model.js';
import CustomError from '../../errors/customError.js';

class CommentController {
  /**
   * Get all comments for a post (with pagination)
   * GET /api/comments/:id
   * @param {object} req - Express request (params.id = postId)
   * @param {object} res - Express response
   * @param {Function} next
   */
  static getCommentsByPost(req, res, next) {
    try {
      const postId = req.params.id;
      const { page = 1, limit = 10 } = req.query;
      
     
      const post = PostModel.getById(postId);
      if (!post) {
        throw new CustomError('Post not found', 404);
      }
      
      let comments = CommentModel.getByPostId(postId);
      
    
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      const paginatedComments = comments.slice(startIndex, endIndex);
      
      res.status(200).json({
        success: true,
        message: 'Comments fetched successfully',
        data: {
          comments: paginatedComments,
          pagination: {
            total: comments.length,
            page: pageNum,
            totalPages: Math.ceil(comments.length / limitNum),
            limit: limitNum
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add a comment to a post
   * POST /api/comments/:id  (where :id = postId)
   * @param {object} req - Express request (body: content)
   * @param {object} res - Express response
   * @param {Function} next
   */
  static addComment(req, res, next) {
    try {
      const postId = req.params.id;
      const userId = req.userId;
      const { content } = req.body;
      
      if (!content || content.trim() === '') {
        throw new CustomError('Comment content is required', 400);
      }
      
      
      const post = PostModel.getById(postId);
      if (!post) {
        throw new CustomError('Post not found', 404);
      }
      
      const newComment = CommentModel.create({
        userId,
        postId,
        content
      });
      
      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: newComment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a comment (owner only)
   * PUT /api/comments/:id (where :id = commentId)
   * @param {object} req - Express request (body: content)
   * @param {object} res - Express response
   * @param {Function} next
   */
  static updateComment(req, res, next) {
    try {
      const commentId = req.params.id;
      const userId = req.userId;
      const { content } = req.body;
      
      if (!content || content.trim() === '') {
        throw new CustomError('Comment content is required', 400);
      }
      
      const comment = CommentModel.getById(commentId);
      if (!comment) {
        throw new CustomError('Comment not found', 404);
      }
      

      if (comment.userId !== userId) {
        throw new CustomError('You are not authorized to update this comment', 403);
      }
      
      const updatedComment = CommentModel.update(commentId, content);
      
      res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: updatedComment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a comment (owner only)
   * DELETE /api/comments/:id (where :id = commentId)
   * @param {object} req - Express request
   * @param {object} res - Express response
   * @param {Function} next
   */
  static deleteComment(req, res, next) {
    try {
      const commentId = req.params.id;
      const userId = req.userId;
      
      const comment = CommentModel.getById(commentId);
      if (!comment) {
        throw new CustomError('Comment not found', 404);
      }
      
      if (comment.userId !== userId) {
        throw new CustomError('You are not authorized to delete this comment', 403);
      }
      
      const deletedComment = CommentModel.delete(commentId);
      
      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
        data: deletedComment
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentController;