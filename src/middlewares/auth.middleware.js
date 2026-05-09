

import jwt from 'jsonwebtoken';
import CustomError from '../errors/customError.js';


const JWT_SECRET = 'postaway_super_secret_key_change_this_in_production';

/**
 * Authentication middleware
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next function
 * @throws {CustomError} 401 if no token or invalid token
 */
const authMiddleware = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('No token provided. Please authenticate.', 401);
    }
    
  
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new CustomError('Invalid token format. Use Bearer <token>', 401);
    }
    
    
    const decoded = jwt.verify(token, JWT_SECRET);
    

    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new CustomError('Invalid or expired token', 401));
    } else if (error instanceof CustomError) {
      next(error);
    } else {
      next(new CustomError('Authentication failed', 401));
    }
  }
};

export default authMiddleware;
export { JWT_SECRET };