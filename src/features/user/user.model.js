

import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

/**
 * User class with static methods for data operations
 */
class UserModel {
 
  static users = [];

  /**
   * Get all users (for debugging, not exposed via API)
   * @returns {Array} List of all users
   */
  static getAll() {
    return this.users;
  }

  /**
   * Find user by email
   * @param {string} email - User's email address
   * @returns {object|undefined} User object or undefined
   */
  static findByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  /**
   * Find user by ID
   * @param {string} id - User's UUID
   * @returns {object|undefined} User object or undefined
   */
  static findById(id) {
    return this.users.find(user => user.id === id);
  }

  /**
   * Add a new user to storage
   * @param {object} userData - { name, email, password }
   * @returns {object} Newly created user (without password)
   */
  static async add(userData) {
    const { name, email, password } = userData;
    

    if (this.findByEmail(email)) {
      throw new Error('User already exists with this email');
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);
    

    const newUser = {
      id: uuid(),
      name: name,
      email: email,
      password: hashedPassword,
      bookmarks: [] 
    };
    
    this.users.push(newUser);
    
   
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * Validate user credentials for signin
   * @param {string} email - User's email
   * @param {string} password - Plain text password
   * @returns {object|null} User without password if valid, null otherwise
   */
  static async validateCredentials(email, password) {
    const user = this.findByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Bookmark a post for a user
   * @param {string} userId - User ID
   * @param {string} postId - Post ID to bookmark
   * @returns {object} Updated user (without password)
   */
  static addBookmark(userId, postId) {
    const user = this.findById(userId);
    if (!user) throw new Error('User not found');
    
    if (!user.bookmarks.includes(postId)) {
      user.bookmarks.push(postId);
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Remove a bookmark from a user
   * @param {string} userId - User ID
   * @param {string} postId - Post ID to remove from bookmarks
   * @returns {object} Updated user (without password)
   */
  static removeBookmark(userId, postId) {
    const user = this.findById(userId);
    if (!user) throw new Error('User not found');
    
    user.bookmarks = user.bookmarks.filter(id => id !== postId);
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get user's bookmarked posts (returns array of post IDs)
   * @param {string} userId - User ID
   * @returns {Array} Array of bookmarked post IDs
   */
  static getBookmarks(userId) {
    const user = this.findById(userId);
    if (!user) throw new Error('User not found');
    return user.bookmarks;
  }
}

export default UserModel;