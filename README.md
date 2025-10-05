# Dushan Portfolio Backend API

A comprehensive backend API for Dushan's portfolio website built with Node.js, Express.js, and MongoDB. This backend serves as a centralized data source that can be used by multiple portfolio frontends, allowing easy updates through an admin dashboard.

## 🚀 Features

-  **Personal Details Management** - Store and manage personal information, contact details, and social links
-  **Project Portfolio** - Complete project management with categories, technologies, and media
-  **Skills Showcase** - Organized skills with proficiency levels and categories
-  **Education Records** - Academic and professional qualifications tracking
-  **Contact System** - Handle contact form submissions with admin reply functionality
-  **Admin Dashboard API** - Secure admin authentication and management endpoints
-  **File Upload Support** - Image and document upload capabilities
-  **Rate Limiting** - Built-in protection against abuse
-  **CORS Configuration** - Secure cross-origin resource sharing
-  **Input Validation** - Comprehensive request validation
-  **Error Handling** - Robust error handling and logging

## 🛠️ Tech Stack

-  **Runtime**: Node.js
-  **Framework**: Express.js
-  **Database**: MongoDB with Mongoose ODM
-  **Authentication**: JWT (JSON Web Tokens)
-  **File Upload**: Multer
-  **Validation**: Express Validator
-  **Security**: Helmet, CORS, Rate Limiting
-  **Environment**: dotenv

## 📋 Prerequisites

-  Node.js (v14 or higher)
-  MongoDB (local or MongoDB Atlas)
-  npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Dushan-456/Dushan-portfolio-Backend.git
cd dushan-portfolio-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` file with your configuration:

```env
# Database Configuration
MONGODB_URI= Your mongodb url
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dushan-portfolio

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Admin Credentials (change these in production)
ADMIN_EMAIL=adminemail
ADMIN_PASSWORD=adminpassword

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 4. Initialize Database

Run the initialization script to create the admin user and sample data:

```bash
npm run init
```

### 5. Start the Server

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All admin routes require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Personal Details

-  `GET /api/personal-details` - Get personal details (public)
-  `PUT /api/personal-details` - Update personal details (admin)
-  `POST /api/personal-details/upload-image` - Upload profile image (admin)
-  `POST /api/personal-details/upload-cv` - Upload CV (admin)

#### Projects

-  `GET /api/projects` - Get all active projects (public)
-  `GET /api/projects/:id` - Get single project (public)
-  `POST /api/projects` - Create new project (admin)
-  `PUT /api/projects/:id` - Update project (admin)
-  `DELETE /api/projects/:id` - Delete project (admin)
-  `POST /api/projects/:id/upload-images` - Upload project images (admin)
-  `GET /api/projects/admin/all` - Get all projects including inactive (admin)

#### Skills

-  `GET /api/skills` - Get all active skills (public)
-  `GET /api/skills/categories` - Get skill categories (public)
-  `POST /api/skills` - Create new skill (admin)
-  `PUT /api/skills/:id` - Update skill (admin)
-  `DELETE /api/skills/:id` - Delete skill (admin)
-  `PUT /api/skills/reorder` - Reorder skills (admin)
-  `GET /api/skills/admin/all` - Get all skills including inactive (admin)

#### Education

-  `GET /api/education` - Get all active education records (public)
-  `POST /api/education` - Create new education record (admin)
-  `PUT /api/education/:id` - Update education record (admin)
-  `DELETE /api/education/:id` - Delete education record (admin)
-  `POST /api/education/:id/upload-logo` - Upload institution logo (admin)
-  `POST /api/education/:id/upload-certificate` - Upload certificate (admin)
-  `PUT /api/education/reorder` - Reorder education records (admin)
-  `GET /api/education/admin/all` - Get all education records including inactive (admin)

#### Contact

-  `POST /api/contact` - Send contact message (public)
-  `GET /api/contact/admin/messages` - Get all contact messages (admin)
-  `GET /api/contact/admin/messages/:id` - Get single contact message (admin)
-  `PUT /api/contact/admin/messages/:id/reply` - Reply to contact message (admin)
-  `PUT /api/contact/admin/messages/:id/read` - Mark message as read/unread (admin)
-  `DELETE /api/contact/admin/messages/:id` - Delete contact message (admin)
-  `GET /api/contact/admin/stats` - Get contact statistics (admin)

#### Authentication

-  `POST /api/auth/login` - Admin login
-  `GET /api/auth/me` - Get current admin info
-  `PUT /api/auth/profile` - Update admin profile
-  `PUT /api/auth/change-password` - Change admin password
-  `POST /api/auth/logout` - Admin logout
-  `POST /api/auth/verify-token` - Verify JWT token

### Query Parameters

#### Projects

-  `category` - Filter by project category
-  `featured` - Filter featured projects (true/false)
-  `limit` - Number of results per page (default: 20)
-  `page` - Page number (default: 1)

#### Skills

-  `category` - Filter by skill category

#### Education

-  `type` - Filter by education type (Degree, Certificate, Course, Training)

#### Contact Messages (Admin)

-  `read` - Filter by read status (true/false)
-  `page` - Page number (default: 1)
-  `limit` - Number of results per page (default: 20)

## 🔐 Admin Dashboard

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@dushanportfolio.com",
  "password": "admin123"
}
```

### Response

```json
{
   "success": true,
   "message": "Login successful",
   "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "admin": {
         "id": "64f1a2b3c4d5e6f7g8h9i0j1",
         "name": "Admin User",
         "email": "admin@dushanportfolio.com",
         "role": "admin",
         "lastLogin": "2024-01-15T10:30:00.000Z"
      }
   }
}
```

## 📁 Project Structure

```
dushan-portfolio-backend/
├── config/
│   └── database.mjs        # Database connection configuration
├── controllers/
│   ├── authController.mjs  # Authentication controller
│   ├── personalDetailsController.mjs  # Personal details controller
│   ├── projectsController.mjs         # Projects controller
│   ├── skillsController.mjs           # Skills controller
│   ├── educationController.mjs        # Education controller
│   └── contactController.mjs          # Contact controller
├── middleware/
│   ├── auth.mjs           # Authentication middleware
│   ├── validation.mjs     # Input validation middleware
│   └── upload.mjs         # File upload middleware
├── models/
│   ├── Admin.mjs          # Admin user model
│   ├── PersonalDetails.mjs # Personal details model
│   ├── Project.mjs        # Project model
│   ├── Skill.mjs          # Skill model
│   ├── Education.mjs      # Education model
│   └── Contact.mjs        # Contact message model
├── routes/
│   ├── auth.mjs           # Authentication routes
│   ├── personalDetails.mjs # Personal details routes
│   ├── projects.mjs       # Project routes
│   ├── skills.mjs         # Skill routes
│   ├── education.mjs      # Education routes
│   └── contact.mjs        # Contact routes
├── scripts/
│   └── initData.mjs       # Database initialization script
├── uploads/               # File upload directory
├── .env                   # Environment variables
├── env.example           # Environment variables example
├── server.mjs            # Main server file
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

| Variable         | Description               | Default                                      |
| ---------------- | ------------------------- | -------------------------------------------- |
| `MONGODB_URI`    | MongoDB connection string | `mongodb://localhost:27017/dushan-portfolio` |
| `PORT`           | Server port               | `5000`                                       |
| `NODE_ENV`       | Environment mode          | `development`                                |
| `JWT_SECRET`     | JWT signing secret        | Required                                     |
| `JWT_EXPIRE`     | JWT expiration time       | `7d`                                         |
| `ADMIN_EMAIL`    | Default admin email       | `admin@dushanportfolio.com`                  |
| `ADMIN_PASSWORD` | Default admin password    | `admin123`                                   |
| `FRONTEND_URL`   | Frontend URL for CORS     | `http://localhost:3000`                      |
| `MAX_FILE_SIZE`  | Maximum file upload size  | `5242880` (5MB)                              |
| `UPLOAD_PATH`    | File upload directory     | `./uploads`                                  |

### CORS Configuration

The API is configured to allow requests from:

-  `http://localhost:3000` (development)
-  `https://dushanportfolio.textaworld.com` (production)
-  `https://dushanportfolio.netlify.app` (Netlify deployment)
-  `https://dushanportfolio.vercel.app` (Vercel deployment)

## 🚀 Deployment

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get the connection string
6. Update `MONGODB_URI` in your environment variables

### Heroku Deployment

1. Create a Heroku app
2. Add MongoDB Atlas addon
3. Set environment variables
4. Deploy the code

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push

## 🔒 Security Features

-  **JWT Authentication** - Secure token-based authentication
-  **Password Hashing** - Bcrypt password hashing
-  **Rate Limiting** - Protection against brute force attacks
-  **CORS Protection** - Controlled cross-origin access
-  **Input Validation** - Comprehensive request validation
-  **Helmet Security** - Security headers
-  **Account Lockout** - Temporary account lockout after failed attempts

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Optional validation errors
}
```

## 🧪 Testing

### Health Check

```bash
curl http://localhost:5000/health
```

### Test Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dushanportfolio.com","password":"admin123"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Navodya Dushan Kodikara**

-  Email: navodyadushan123@gmail.com
-  Website: [https://dushanportfolio.textaworld.com](https://dushanportfolio.textaworld.com)
-  GitHub: [@dushan456](https://github.com/dushan456)

## 🙏 Acknowledgments

-  Express.js team for the amazing framework
-  MongoDB team for the database
-  All open-source contributors

## 📞 Support

If you have any questions or need help, please:

1. Check the documentation
2. Search existing issues
3. Create a new issue
4. Contact: navodyadushan123@gmail.com

---

**Happy Coding! 🚀**
