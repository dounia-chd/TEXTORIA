# 🚀 TEXTORIA Setup Guide

This guide will help you set up the complete TEXTORIA AI Content Generation Platform.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**
- **OpenAI API Key** (for AI generation)

## 🗄️ Database Setup

### 1. Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE textoria;

# Create user (optional)
CREATE USER textoria_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE textoria TO textoria_user;

# Exit
\q
```

## 🔧 Environment Configuration

### 1. Backend Environment
Create `server/.env` file:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/textoria"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Frontend Environment
Create `client/.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📦 Installation

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Database Migration
```bash
cd server

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

## 🚀 Running the Application

### Development Mode
```bash
# From root directory
npm run dev
```

This will start both servers:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

### Production Mode
```bash
# Build frontend
cd client
npm run build

# Start production servers
cd ../server
npm start
```

## 👤 Default Admin Account

After seeding the database, you can login with:
- **Email**: admin@textoria.com
- **Password**: admin123

## 🔐 OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Add the API key to your `server/.env` file
4. Ensure you have credits in your OpenAI account

## 📊 Features Overview

### User Features
- ✅ User registration and authentication
- ✅ Text generation (Blog posts, emails, social media, etc.)
- ✅ Image generation (Logos, illustrations, artwork, etc.)
- ✅ Subscription management
- ✅ Generation history and favorites
- ✅ Analytics dashboard

### Admin Features
- ✅ User management
- ✅ Content moderation
- ✅ Analytics and reporting
- ✅ System settings
- ✅ Subscription management
- ✅ Admin logs

### Technical Features
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling
- ✅ Responsive design
- ✅ Real-time updates

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/refresh` - Refresh token

### Content Generation
- `POST /api/generations/text` - Generate text content
- `POST /api/generations/image` - Generate images
- `GET /api/generations/my-generations` - Get user generations
- `POST /api/generations/:id/favorite` - Toggle favorite

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/favorites` - Get favorites
- `GET /api/users/analytics` - Get user analytics

### Admin (Admin only)
- `GET /api/admin/dashboard` - Dashboard overview
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/generations` - Get all generations
- `DELETE /api/admin/generations/:id` - Delete generation
- `GET /api/admin/analytics` - System analytics
- `GET /api/admin/settings` - Get system settings
- `PUT /api/admin/settings` - Update system settings

### Subscriptions
- `GET /api/subscriptions/plans` - Get available plans
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/upgrade` - Upgrade subscription
- `POST /api/subscriptions/cancel` - Cancel subscription
- `GET /api/subscriptions/usage` - Get usage statistics

## 🔧 Customization

### Adding New Content Types
1. Update the Prisma schema if needed
2. Add new routes in `server/routes/generations.js`
3. Update the frontend components
4. Add new categories to the seed file

### Modifying AI Models
1. Update the OpenAI configuration in generation routes
2. Modify the cost calculation function
3. Update the frontend model selection

### Styling
- Modify `client/tailwind.config.js` for theme changes
- Update `client/app/globals.css` for custom styles
- Use the component classes defined in the CSS

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connection string
psql -U username -d textoria -h localhost
```

**Port Already in Use**
```bash
# Find process using port
lsof -i :5000
lsof -i :3000

# Kill process
kill -9 <PID>
```

**OpenAI API Errors**
- Check API key is correct
- Ensure you have sufficient credits
- Verify the API key has the required permissions

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📈 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:port/db"
JWT_SECRET="very-long-secure-secret"
OPENAI_API_KEY="your-api-key"
CORS_ORIGIN="https://yourdomain.com"
```

### Docker Deployment
```dockerfile
# Example Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the console logs for errors
4. Verify all environment variables are set correctly

## 🎉 Success!

Your TEXTORIA platform is now ready! 

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:3000/admin
- **Health Check**: http://localhost:5000/health

Happy content creating! 🚀
