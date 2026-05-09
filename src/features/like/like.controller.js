

import LikeModel from './like.model.js';
import PostModel from '../post/post.model.js';
import CustomError from '../../errors/customError.js';

class LikeController {
  /**
   * Get all likes for a specific post
   * GET /api/likes/:postId
   * @param {object} req - Express request (params.postId)
   * @param {object} res - Express response
   * @param {Function} next
   */
  static getLikesByPost(req, res, next) {
    try {
      const { postId } = req.params;
      

      const post = PostModel.getById(postId);
      if (!post) {
        throw new CustomError('Post not found', 404);
      }
      
      const likes = LikeModel.getByPostId(postId);
      
      res.status(200).json({
        success: true,
        message: 'Likes fetched successfully',
        data: {
          totalLikes: likes.length,
          likes: likes
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle like on a post (add or remove like for logged-in user)
   * GET /api/likes/toggle/:postId
   * @param {object} req - Express request (params.postId)
   * @param {object} res - Express response
   * @param {Function} next
   */
  static toggleLike(req, res, next) {
    try {
      const { postId } = req.params;
      const userId = req.userId;
      

      const post = PostModel.getById(postId);
      if (!post) {
        throw new CustomError('Post not found', 404);
      }
      
      const result = LikeModel.toggle(userId, postId);
      
      res.status(200).json({
        success: true,
        message: result.liked ? 'Post liked successfully' : 'Post unliked successfully',
        data: {
          liked: result.liked,
          postId: postId,
          userId: userId
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LikeController;