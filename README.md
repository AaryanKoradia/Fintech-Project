# Financial Literacy & Empowerment Platform for Rural India

A voice-friendly, AI-ready financial empowerment platform for rural and first-time users in India, with a web app, a WhatsApp bot, and a mobile app (Expo/React Native).

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
- **Gemini API** integration for the AI advisor and voice-call assistant
- **UltraMsg** for the WhatsApp bot, **Exotel** for the voice-call line

### Mobile
- **React Native (Expo)** app in `mobile/`, talking to the same backend API

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
├── mobile/                  # Expo / React Native app
│   ├── src/
│   ├── App.js
│   └── package.json
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

Development: `http://localhost:5173`
Production: `https://fintech-3c.vercel.app`

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Development: `http://localhost:8000`
Production: `https://fintech-3c-b.onrender.com`

API Documentation: `http://localhost:8000/docs` (development)

### Creating the first admin account

There's no signup path for admins -- the only way to create one is:

```bash
cd backend
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-unique-password' python -m app.init_admin
```

Set `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` for real in your environment before running this in anything beyond local development.


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

- JWT token authentication (set a real `JWT_SECRET` in your environment -- the app generates a temporary one if it's missing, which invalidates all sessions on every restart)
- Password hashing with bcrypt
- Role is assigned server-side at signup and can't be set by the client; admin accounts are created only via `python -m app.init_admin` with `ADMIN_EMAIL`/`ADMIN_PASSWORD` set in the environment
- Input validation via Pydantic
- CORS restricted to `ALLOWED_ORIGINS`

### Known limitations

- The AI advisor and voice-call assistant depend on `GEMINI_API_KEY` being set; without it, responses fall back to an error message rather than failing the request.
- Voice-call speech input (`process-input`) currently uses a placeholder transcript instead of real speech-to-text -- see the comments in `backend/app/routes/voice_call.py` for where to wire in a real STT provider.
- The WhatsApp webhook and the Exotel voice webhooks accept an optional shared-secret query parameter (`WHATSAPP_AUTHORIZED_NUMBER` gate and `EXOTEL_WEBHOOK_SECRET` respectively) but neither is full request-signature verification -- treat both as best-effort until the respective provider's real signature scheme is implemented.

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

No LICENSE file is currently included in this repository, so no license is granted to third parties by default. Add one (MIT or otherwise) if you want to permit reuse.
