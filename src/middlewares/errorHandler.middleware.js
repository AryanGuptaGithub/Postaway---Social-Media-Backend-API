/**
 * src/middlewares/errorHandler.middleware.js
 * 
 * Global error handling middleware for Express.
 * Catches all errors thrown in routes or other middlewares.
 * Sends consistent JSON response based on error type.
 */

import CustomError from '../errors/customError.js';

/**
 * Global error handler
 * @param {Error} err - Error object (may be CustomError or standard Error)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandlerMiddleware = (err, req, res, next) => {

  let statusCode = 500;
  let message = 'Internal Server Error';


  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.message) {

    message = err.message;
  }


  console.error(`[ERROR] ${statusCode} - ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }


  res.status(statusCode).json({
    success: false,
    message: message
  });
};

export default errorHandlerMiddleware;