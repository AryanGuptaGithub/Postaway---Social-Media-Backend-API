

import { v4 as uuid } from 'uuid';

class LikeModel {

  static likes = [];

  /**
   * Get all likes for a specific post
   * @param {string} postId - Post UUID
   * @returns {Array} Array of like objects for the post
   */
  static getByPostId(postId) {
    return this.likes.filter(like => like.postId === postId);
  }

  /**
   * Get a single like by user and post (for toggle logic)
   * @param {string} userId - User UUID
   * @param {string} postId - Post UUID
   * @returns {object|undefined} Like object or undefined
   */
  static getByUserAndPost(userId, postId) {
    return this.likes.find(like => like.userId === userId && like.postId === postId);
  }

  /**
   * Add a like to a post
   * @param {string} userId - User UUID
   * @param {string} postId - Post UUID
   * @returns {object} Newly created like object
   */
  static addLike(userId, postId) {
    const existingLike = this.getByUserAndPost(userId, postId);
    if (existingLike) {
      return null;
    }
    
    const newLike = {
      id: uuid(),
      userId,
      postId
    };
    
    this.likes.push(newLike);
    return newLike;
  }

  /**
   * Remove a like from a post
   * @param {string} userId - User UUID
   * @param {string} postId - Post UUID
   * @returns {object|null} Removed like or null if not found
   */
  static removeLike(userId, postId) {
    const likeIndex = this.likes.findIndex(like => like.userId === userId && like.postId === postId);
    if (likeIndex === -1) return null;
    
    const removedLike = this.likes[likeIndex];
    this.likes.splice(likeIndex, 1);
    return removedLike;
  }

  /**
   * Toggle like on a post (add if not exists, remove if exists)
   * @param {string} userId - User UUID
   * @param {string} postId - Post UUID
   * @returns {object} { liked: boolean, like: object|null }
   * liked = true means like was added, false means like was removed
   */
  static toggle(userId, postId) {
    const existingLike = this.getByUserAndPost(userId, postId);
    
    if (existingLike) {

      this.removeLike(userId, postId);
      return { liked: false, like: null };
    } else {

      const newLike = this.addLike(userId, postId);
      return { liked: true, like: newLike };
    }
  }

    /**
   * Delete all likes for a specific post (used when post is deleted)
   * @param {string} postId - Post UUID
   * @returns {number} Number of likes deleted
   */
  static deleteByPostId(postId) {
    const likesToDelete = this.likes.filter(like => like.postId === postId);
    this.likes = this.likes.filter(like => like.postId !== postId);
    return likesToDelete.length;
  }

}

export default LikeModel;