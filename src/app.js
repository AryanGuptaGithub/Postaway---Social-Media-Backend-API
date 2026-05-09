/**
 * src/app.js
 * 
 * Express application setup for Postaway API.
 * Configures middleware, routes, static file serving, and error handling.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './features/user/user.routes.js';
import postRoutes from './features/post/post.routes.js';
import commentRoutes from './features/comment/comment.routes.js';
import likeRoutes from './features/like/like.routes.js';
import bookmarkRoutes from './features/bookmark/bookmark.routes.js';
import loggerMiddleware from './middlewares/logger.middleware.js';
import errorHandlerMiddleware from './middlewares/errorHandler.middleware.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use(loggerMiddleware);


app.use('/api', userRoutes);             
app.use('/api/posts', postRoutes);        
app.use('/api/comments', commentRoutes);  
app.use('/api/likes', likeRoutes);       
app.use('/api/bookmarks', bookmarkRoutes); 


app.use(errorHandlerMiddleware);


const PORT = process.env.PORT || 3000;



if (process.env.NODE_ENV !== 'test' && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  app.listen(PORT, () => {   
    console.log(`✅ Postaway server running on port ${PORT}`);
    console.log(`📁 Uploads directory: ${path.join(__dirname, '../uploads')}`); 
  });
}

export default app;