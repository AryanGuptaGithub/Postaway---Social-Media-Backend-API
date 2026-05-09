

import { v4 as uuid } from 'uuid';
import CommentModel from '../comment/comment.model.js';
import LikeModel from '../like/like.model.js';

class PostModel {

  static posts = [];

  /**
   * Get all posts (optionally filtered and sorted)
   * @param {object} options - { captionKeyword, sortBy, page, limit }
   * @returns {object} { posts, total, page, totalPages }
   */
  static getAll(options = {}) {
    let { captionKeyword, sortBy, page = 1, limit = 10 } = options;
    
    let filteredPosts = [...this.posts];
    

    if (captionKeyword) {
      const keyword = captionKeyword.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.caption.toLowerCase().includes(keyword)
      );
    }
    
   
    if (sortBy === 'engagement') {

      filteredPosts.sort((a, b) => {
        const aLikes = LikeModel.getByPostId(a.id).length;
        const bLikes = LikeModel.getByPostId(b.id).length;
        const aComments = CommentModel.getByPostId(a.id).length;
        const bComments = CommentModel.getByPostId(b.id).length;
        const aEngagement = aLikes + aComments;
        const bEngagement = bLikes + bComments;
        return bEngagement - aEngagement;
      });
    } else if (sortBy === 'date') {
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
 
      filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    

    const total = filteredPosts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts: paginatedPosts,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Get a single post by ID
   * @param {string} id - Post UUID
   * @returns {object|undefined} Post object or undefined
   */
  static getById(id) {
    return this.posts.find(post => post.id === id);
  }

  /**
   * Get all posts by a specific user
   * @param {string} userId - User UUID
   * @returns {Array} Array of user's posts
   */
  static getByUserId(userId) {
    return this.posts.filter(post => post.userId === userId);
  }

  /**
   * Create a new post
   * @param {object} postData - { userId, caption, imageUrl, status }
   * @returns {object} Newly created post
   */
  static create(postData) {
    const { userId, caption, imageUrl, status = 'published' } = postData;
    
    const newPost = {
      id: uuid(),
      userId,
      caption: caption || '',
      imageUrl: imageUrl || null,
      status: ['published', 'draft', 'archived'].includes(status) ? status : 'published',
      createdAt: new Date()
    };
    
    this.posts.push(newPost);
    return newPost;
  }

  /**
   * Update an existing post
   * @param {string} id - Post UUID
   * @param {object} updates - Fields to update { caption, imageUrl, status }
   * @returns {object|null} Updated post or null if not found
   */
  static update(id, updates) {
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) return null;
    
    const post = this.posts[postIndex];
    

    if (updates.caption !== undefined) post.caption = updates.caption;
    if (updates.imageUrl !== undefined) post.imageUrl = updates.imageUrl;
    if (updates.status !== undefined && ['published', 'draft', 'archived'].includes(updates.status)) {
      post.status = updates.status;
    }
    
    this.posts[postIndex] = post;
    return post;
  }

  /**
   * Delete a post
   * @param {string} id - Post UUID
   * @returns {object|null} Deleted post or null if not found
   */
static delete(id) {
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) return null;
    
    const deletedPost = this.posts[postIndex];
    this.posts.splice(postIndex, 1);
    

    CommentModel.deleteByPostId(id);
    LikeModel.deleteByPostId(id);
    
    return deletedPost;
  }
}

export default PostModel;