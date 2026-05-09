

import UserModel from '../user/user.model.js';
import PostModel from '../post/post.model.js';
import CustomError from '../../errors/customError.js';

class BookmarkController {
  /**
   * Bookmark a post
   * POST /api/bookmarks/:postId
   * @param {object} req - Express request (params.postId)
   * @param {object} res - Express response
   * @param {Function} next
   */
  static addBookmark(req, res, next) {
    try {
      const { postId } = req.params;
      const userId = req.userId;
      

      const post = PostModel.getById(postId);
      if (!post) {
        throw new CustomError('Post not found', 404);
      }
      
      const updatedUser = UserModel.addBookmark(userId, postId);
      
      res.status(200).json({
        success: true,
        message: 'Post bookmarked successfully',
        data: {
          bookmarks: updatedUser.bookmarks
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove a bookmark
   * DELETE /api/bookmarks/:postId
   * @param {object} req - Express request (params.postId)
   * @param {object} res - Express response
   * @param {Function} next
   */
  static removeBookmark(req, res, next) {
    try {
      const { postId } = req.params;
      const userId = req.userId;
      
      const updatedUser = UserModel.removeBookmark(userId, postId);
      
      res.status(200).json({
        success: true,
        message: 'Bookmark removed successfully',
        data: {
          bookmarks: updatedUser.bookmarks
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all bookmarked posts for logged-in user
   * GET /api/bookmarks/
   * @param {object} req - 
   * @param {object} res - 
   * @param {Function} next
   */
  static getBookmarks(req, res, next) {
    try {
      const userId = req.userId;
      const bookmarkIds = UserModel.getBookmarks(userId);
      

      const bookmarkedPosts = bookmarkIds
        .map(id => PostModel.getById(id))
        .filter(post => post !== undefined); 
      res.status(200).json({
        success: true,
        message: 'Bookmarks fetched successfully',
        data: {
          bookmarks: bookmarkedPosts
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default BookmarkController;