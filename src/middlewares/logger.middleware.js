

/**
 * Logger middleware - logs HTTP requests
 * Excludes user authentication routes (/api/signup, /api/signin)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next function
 */
const loggerMiddleware = (req, res, next) => {

  const isUserRoute = req.path === '/api/signup' || req.path === '/api/signin';
  
  if (!isUserRoute) {
    console.log(`[LOGGER] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
 
      const safeBody = { ...req.body };
      if (safeBody.password) safeBody.password = '[REDACTED]';
      console.log(`[LOGGER] Body:`, safeBody);
    }
  }
  
  next();
};

export default loggerMiddleware;