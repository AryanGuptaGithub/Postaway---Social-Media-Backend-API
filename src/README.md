# Postaway - Social Media Backend API

Postaway is a complete REST API for a social media platform built with Node.js, Express.js, and in-memory data storage. It supports user registration, JWT authentication, posts with image uploads, comments, likes, bookmarks, filtering, sorting, and pagination.

## Dependencies & Purpose

| Package | Purpose |
|---------|---------|
| express | Web framework for routing and middleware |
| jsonwebtoken | Generate and verify JWT tokens for authentication |
| bcryptjs | Hash user passwords before storing |
| multer | Handle multipart/form-data for image uploads |
| uuid | Generate unique IDs for resources |
| nodemon (dev) | Auto-restart server during development |

## Installation & Running

1. Clone the repository and navigate to `postaway/`
2. Install dependencies:
   ```bash
   npm install