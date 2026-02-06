# Deployment Guide

## Production URLs

- **Frontend**: https://fintech-3c.vercel.app
- **Backend**: https://fintech-3c-b.onrender.com

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account connected to your GitHub repository
- Environment variables configured in Vercel dashboard

### Environment Variables
Set the following in Vercel dashboard:
```
VITE_API_BASE_URL=https://fintech-3c-b.onrender.com
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAO0HujaxWeMdB0SNv9knyj044NTliWufc
```

### Automatic Deployment
1. Push to main branch
2. Vercel automatically builds and deploys
3. Build command: `npm run build`
4. Output directory: `dist`

### Manual Deployment
```bash
cd frontend
npm install
npm run build
vercel --prod
```

## Backend Deployment (Render)

### Prerequisites
- Render account connected to your GitHub repository
- MongoDB Atlas database (cloud)

### Environment Variables
Set the following in Render dashboard:
```
MONGODB_URI=mongodb+srv://princeco10673_db_user:Princeco10673@cluster0.61e2qdq.mongodb.net/fintech_3c_db?retryWrites=true&w=majority
SECRET_KEY=your-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,https://fintech-3c.vercel.app
GEMINI_API_KEY=your-gemini-api-key
WHATSAPP_API_KEY=your-whatsapp-api-key
WHATSAPP_PHONE_ID=your-whatsapp-phone-id
```

### Deployment Settings
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Python Version: 3.11.0 (specified in `runtime.txt`)

### Automatic Deployment
1. Push to main branch
2. Render automatically deploys
3. Health check endpoint: `/health`

## Database (MongoDB Atlas)

Already configured for production:
- Cluster: Cluster0
- Database: fintech_3c_db
- Connection string in backend environment variables

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Runs on: http://localhost:8000

## Environment Detection

The application automatically detects production vs development:
- Frontend uses `import.meta.env.PROD` to detect environment
- In production: Uses Render backend URL
- In development: Uses localhost:8000

## CORS Configuration

Backend accepts requests from:
- http://localhost:3000
- http://127.0.0.1:3000
- http://localhost:5173
- http://127.0.0.1:5173
- https://fintech-3c.vercel.app

## Troubleshooting

### Frontend can't connect to backend
1. Check VITE_API_BASE_URL in Vercel environment variables
2. Verify backend is running on Render
3. Check browser console for CORS errors

### Backend CORS errors
1. Verify Vercel URL is in ALLOWED_ORIGINS
2. Check Render environment variables
3. Restart Render service after changes

### Database connection issues
1. Check MongoDB Atlas cluster is running
2. Verify IP whitelist includes 0.0.0.0/0 (all IPs)
3. Confirm connection string is correct

### Build failures
**Vercel:**
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Ensure environment variables are set

**Render:**
- Check build logs in Render dashboard
- Verify requirements.txt is up to date
- Ensure Python version matches runtime.txt

## Post-Deployment Checklist

- [ ] Frontend loads at https://fintech-3c.vercel.app
- [ ] Backend API responds at https://fintech-3c-b.onrender.com/health
- [ ] API documentation accessible at https://fintech-3c-b.onrender.com/docs
- [ ] Login functionality works
- [ ] All API calls from frontend work
- [ ] Google Maps loads correctly
- [ ] Marketplace redemption works
- [ ] Environment variables properly set in both platforms
- [ ] CORS configured for production URLs
