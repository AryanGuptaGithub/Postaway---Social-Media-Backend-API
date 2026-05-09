

import { v4 as uuid } from 'uuid';

class CommentModel {

  static comments = [];

  /**
   * Get all comments for a specific post
   * @param {string} postId - Post UUID
   * @returns {Array} Array of comments for the post
   */
  static getByPostId(postId) {
    return this.comments.filter(comment => comment.postId === postId);
  }

  /**
   * Get a single comment by ID
   * @param {string} id - Comment UUID
   * @returns {object|undefined} Comment object or undefined
   */
  static getById(id) {
    return this.comments.find(comment => comment.id === id);
  }

  /**
   * Create a new comment
   * @param {object} commentData - { userId, postId, content }
   * @returns {object} Newly created comment
   */
  static create(commentData) {
    const { userId, postId, content } = commentData;
    
    const newComment = {
      id: uuid(),
      userId,
      postId,
      content,
      createdAt: new Date()
    };
    
    this.comments.push(newComment);
    return newComment;
  }

  /**
   * Update an existing comment
   * @param {string} id - Comment UUID
   * @param {string} content - Updated content
   * @returns {object|null} Updated comment or null if not found
   */
  static update(id, content) {
    const commentIndex = this.comments.findIndex(comment => comment.id === id);
    if (commentIndex === -1) return null;
    
    this.comments[commentIndex].content = content;
    return this.comments[commentIndex];
  }

  /**
   * Delete a comment
   * @param {string} id - Comment UUID
   * @returns {object|null} Deleted comment or null if not found
   */
  static delete(id) {
    const commentIndex = this.comments.findIndex(comment => comment.id === id);
    if (commentIndex === -1) return null;
    
    const deletedComment = this.comments[commentIndex];
    this.comments.splice(commentIndex, 1);
    return deletedComment;
  }

   /**
   * Delete all comments for a specific post (used when post is deleted)
   * @param {string} postId - Post UUID
   * @returns {number} Number of comments deleted
   */
  static deleteByPostId(postId) {
    const commentsToDelete = this.comments.filter(comment => comment.postId === postId);
    this.comments = this.comments.filter(comment => comment.postId !== postId);
    return commentsToDelete.length;
  }
}

export default CommentModel;