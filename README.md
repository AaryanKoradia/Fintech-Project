# Financial Literacy & Empowerment Platform for Rural India

A production-grade, voice-friendly, AI-ready financial empowerment platform designed specifically for rural and first-time users in India.

## 🎯 Mission

Help rural users understand savings, budgeting, government schemes, and small businesses while enabling local admins and mentors to guide their communities.

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS v3** for styling
- Light/Dark mode support
- Mobile-first, accessible UI
- Multilingual (English/Hindi)

### Backend
- **FastAPI** (Python)
- **MongoDB** database
- **JWT** authentication
- **Gemini API** integration (placeholder ready)

## 📁 Project Structure

```
Fintech_3C/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── dashboards/      # User & Admin dashboards
│   │   ├── lang/            # Language files (English/Hindi)
│   │   ├── services/        # API services
│   │   ├── context/         # React context (Auth, Theme, Language)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Frontend environment variables
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # MongoDB models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utilities (JWT, hashing)
│   │   └── main.py          # FastAPI app entry
│   ├── .env                 # Backend environment variables
│   └── requirements.txt
│
└── README.md
```

## 🚀 Quick Start

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs on: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## 🔐 Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/fintech_3c
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key-here
```

## 👥 User Roles

1. **USER** - Rural user/learner
   - View learning progress
   - Access financial lessons
   - View eligible government schemes
   - Ask AI financial questions
   - Earn coins and badges

2. **ADMIN** - Village-level admin/NGO/Mentor
   - Manage users in their village
   - Assign mentors
   - Upload learning content
   - Manage government schemes
   - View analytics

## ✨ Features

### Phase 1 Implementation
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Financial learning modules
- ✅ Government schemes browser
- ✅ AI financial advisor (Gemini placeholder)
- ✅ Gamification (coins & badges)
- ✅ Multilingual support (English/Hindi)
- ✅ Dark/Light mode
- ✅ Mobile-first responsive design

## 🗄️ Database Collections

- **users** - User profiles with progress tracking
- **admins** - Admin profiles linked to villages
- **mentors** - Mentor information
- **schemes** - Government schemes database
- **lessons** - Financial literacy lessons
- **activity_logs** - User activity tracking

## 🎨 Design Principles

- **Simple**: Large buttons, minimal text
- **Accessible**: High contrast, icon-driven
- **Fast**: Optimized for low bandwidth
- **Inclusive**: Designed for first-time users
- **Empowering**: Built with empathy and clarity

## 📱 Responsive & Accessible

- Mobile-first design
- Touch-friendly UI elements
- Screen reader compatible
- Keyboard navigation support
- High contrast mode

## 🌍 Multilingual Support

All UI text comes from language files:
- `src/lang/string_english.js`
- `src/lang/string_hindi.js`

Default language: **Hindi**

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- Role-based API protection
- Input validation
- Secure CORS configuration

## 📦 Deployment

Both frontend and backend deploy independently:

### Frontend
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend
```bash
# Deploy to any Python hosting service
# Ensure MongoDB URI and secrets are set via environment variables
```

## 🤝 Contributing

Built with ❤️ for rural India. Designed to empower communities through financial literacy.

## 📄 License

MIT License - See LICENSE file for details
