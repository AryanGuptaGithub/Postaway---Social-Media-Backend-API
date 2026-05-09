/**
 * src/errors/customError.js
 * 
 * Custom error class that extends native Error.
 * Allows throwing errors with a specific HTTP status code.
 * Used throughout the application for consistent error handling.
 */

export default class CustomError extends Error {
  /**
   * Create a new custom error
   * @param {string} message - Error message to display
   * @param {number} statusCode - HTTP status code (e.g., 400, 401, 403, 404, 500)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'CustomError';
  }
}