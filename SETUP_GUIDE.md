# FinLit - Financial Literacy Platform
# Complete Setup and Deployment Guide

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MongoDB (local or cloud)
- Git

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Fintech_3C
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (already exists)
# Make sure VITE_API_BASE_URL is set correctly

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3000`

### 3. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (already exists)
# Make sure MongoDB URI and JWT_SECRET are set

# Start backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run on: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

---

## 🗄️ Database Setup

### Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# The application will automatically create the database and collections
```

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fintech_3c?retryWrites=true&w=majority
```

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/fintech_3c
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
```

**Important**: Change `JWT_SECRET` in production!

---

## 🧪 Testing the Application

### 1. Create Test Accounts

**User Account:**
- Go to http://localhost:3000/signup
- Role: User (Learner)
- Fill in details and signup

**Admin Account:**
- Go to http://localhost:3000/signup
- Role: Admin (Mentor/NGO)
- Fill in details and signup

### 2. Test Features

**User Features:**
- ✅ Login and view dashboard
- ✅ Browse financial lessons
- ✅ View government schemes
- ✅ Ask AI questions
- ✅ Update profile
- ✅ Switch language (English/Hindi)
- ✅ Toggle dark mode

**Admin Features:**
- ✅ View admin dashboard
- ✅ See user statistics
- ✅ Manage users
- ✅ Manage schemes
- ✅ View analytics

---

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

#### Vercel
```bash
cd frontend
npm install -g vercel
vercel
```

#### Netlify
```bash
cd frontend
npm run build
# Upload dist/ folder to Netlify
```

**Important**: Set environment variable on hosting platform:
- `VITE_API_BASE_URL=https://your-backend-url.com`

### Backend Deployment (Render/Railway/Heroku)

#### Render
1. Create new Web Service
2. Connect repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`

#### Railway
1. Create new project
2. Connect repository
3. Add MongoDB plugin or use external MongoDB
4. Set environment variables
5. Deploy

---

## 🔧 Production Checklist

### Security
- ✅ Change JWT_SECRET to a strong random string
- ✅ Use HTTPS for both frontend and backend
- ✅ Enable MongoDB authentication
- ✅ Set up CORS properly (only allow your frontend domain)
- ✅ Use environment variables for all secrets

### Performance
- ✅ Enable MongoDB indexes
- ✅ Implement caching where needed
- ✅ Optimize images and assets
- ✅ Enable compression

### Monitoring
- ✅ Set up error tracking (Sentry)
- ✅ Monitor API performance
- ✅ Set up database backups
- ✅ Enable logging

---

## 📱 Mobile Optimization

The platform is mobile-first and works perfectly on:
- ✅ Android phones
- ✅ iOS phones
- ✅ Tablets
- ✅ Desktop browsers

---

## 🌍 Multi-Language Support

Languages supported:
- ✅ English
- ✅ Hindi (Default)

To add more languages:
1. Create new file: `src/lang/string_{language}.js`
2. Copy structure from `string_english.js`
3. Translate all strings
4. Update `LanguageContext.jsx`

---

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    light: '#10B981',  // Your brand color
    dark: '#34D399',
  },
  // ... more colors
}
```

### Branding
- Replace logo in `frontend/public/`
- Update app name in language files
- Customize theme in Tailwind config

---

## 🐛 Troubleshooting

### Frontend Issues

**Issue**: `npm install` fails
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: API calls fail
- Check if backend is running
- Verify `VITE_API_BASE_URL` is correct
- Check browser console for CORS errors

### Backend Issues

**Issue**: MongoDB connection fails
```bash
# Check if MongoDB is running
mongosh
# Or check MongoDB Atlas connection string
```

**Issue**: Module not found
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Issue**: JWT errors
- Ensure JWT_SECRET is set in .env
- Check token expiration time

---

## 📚 API Documentation

Once backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check MongoDB connection
4. Verify environment variables

---

## 📄 License

MIT License - Free to use and modify

---

## 🎯 Next Steps

1. ✅ Set up development environment
2. ✅ Test all features locally
3. ✅ Deploy backend to cloud
4. ✅ Deploy frontend to cloud
5. ✅ Set up domain name
6. ✅ Configure SSL certificates
7. ✅ Add real data (lessons, schemes)
8. ✅ Enable Gemini AI integration
9. ✅ Monitor and optimize

---

## 💡 Tips for Rural Deployment

1. **Low Bandwidth**: Images are optimized, app is lightweight
2. **Multiple Languages**: Easy to add regional languages
3. **Offline Support**: Can be enhanced with PWA
4. **Simple UI**: Large buttons, minimal text, icon-driven
5. **Voice Support**: Can be added using Web Speech API

---

**Built with ❤️ for Rural India**
**Empowering communities through financial literacy**
