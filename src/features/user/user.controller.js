

import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../middlewares/auth.middleware.js';
import CustomError from '../../errors/customError.js';

/**
 * UserController class with static methods for route handling
 */
class UserController {
  /**
   * Register a new user
   * POST /api/signup
   * @param {object} req - Express request object (body: name, email, password)
   * @param {object} res - Express response object
   * @param {Function} next - Express next function
   */
  static async signUp(req, res, next) {
    try {
      const { name, email, password } = req.body;
      

      if (!name || !email || !password) {
        throw new CustomError('Name, email, and password are required', 400);
      }
      

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        throw new CustomError('Invalid email format', 400);
      }
      

      if (password.length < 6) {
        throw new CustomError('Password must be at least 6 characters', 400);
      }
      

      const newUser = await UserModel.add({ name, email, password });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: newUser
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sign in a user and return JWT token
   * POST /api/signin
   * @param {object} req - Express request object (body: email, password)
   * @param {object} res - Express response object
   * @param {Function} next - Express next function
   */
  static async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      

      if (!email || !password) {
        throw new CustomError('Email and password are required', 400);
      }
      

      const user = await UserModel.validateCredentials(email, password);
      if (!user) {
        throw new CustomError('Invalid email or password', 401);
      }
      

      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(200).json({
        success: true,
        message: 'Signed in successfully',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;