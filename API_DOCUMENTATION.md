# API Documentation

## Base URL
- Development: `http://localhost:8000/api`
- Production: `https://your-domain.com/api`

---

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Authentication

#### POST /auth/signup
Create new user account

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "village": "Mumbai",
  "role": "USER"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1...",
  "token_type": "bearer",
  "user": {
    "id": "123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "village": "Mumbai",
    "role": "USER",
    "progress": 0,
    "coins": 0,
    "badges": []
  }
}
```

#### POST /auth/login
Login existing user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as signup

#### GET /auth/me
Get current user profile (Protected)

**Response:**
```json
{
  "id": "123",
  "fullName": "John Doe",
  "email": "john@example.com",
  "village": "Mumbai",
  "role": "USER",
  "progress": 25,
  "coins": 50,
  "badges": ["first-lesson"],
  "isActive": true
}
```

---

### Users

#### GET /users/stats
Get user statistics (Protected)

**Response:**
```json
{
  "lessonsCompleted": 3,
  "totalLessons": 10,
  "coinsEarned": 50,
  "badges": ["first-lesson", "saver"],
  "progress": 30
}
```

#### PUT /users/profile
Update user profile (Protected)

**Request Body:**
```json
{
  "fullName": "John Updated",
  "village": "Delhi"
}
```

---

### Lessons

#### GET /lessons?category={category}
Get all lessons or filter by category

**Query Parameters:**
- `category` (optional): savings, budgeting, business, banking, insurance, investments

**Response:**
```json
[
  {
    "id": "1",
    "title": "Understanding Savings",
    "description": "Learn the basics of saving money",
    "category": "savings",
    "content": "...",
    "icon": "💰",
    "coins": 10,
    "duration": 15,
    "progress": 0
  }
]
```

#### GET /lessons/{lesson_id}
Get specific lesson

#### POST /lessons/{lesson_id}/complete
Mark lesson as complete (Protected)

**Response:**
```json
{
  "message": "Lesson completed!",
  "coinsEarned": 10
}
```

---

### Schemes

#### GET /schemes
Get all government schemes (Protected)

**Response:**
```json
[
  {
    "id": "1",
    "name": "PM Jan Dhan Yojana",
    "description": "Financial inclusion program",
    "category": "banking",
    "benefits": "Zero balance account, insurance",
    "eligibility": "Any Indian citizen",
    "howToApply": "Visit bank with ID proof"
  }
]
```

#### GET /schemes/{scheme_id}
Get specific scheme (Protected)

#### POST /schemes
Create new scheme (Admin only)

#### DELETE /schemes/{scheme_id}
Delete scheme (Admin only)

---

### Admin

#### GET /admin/stats
Get admin dashboard statistics (Admin only)

**Response:**
```json
{
  "totalUsers": 150,
  "activeUsers": 120,
  "averageProgress": 35,
  "totalSchemes": 10
}
```

#### GET /admin/users
Get all users (Admin only)

#### GET /admin/users/recent
Get recently registered users (Admin only)

#### GET /admin/analytics
Get detailed analytics (Admin only)

**Response:**
```json
{
  "totalUsers": 150,
  "activeUsers": 120,
  "averageProgress": 35,
  "totalLessonsCompleted": 450,
  "totalCoinsEarned": 4500,
  "popularLessons": [...],
  "villageStats": [...]
}
```

---

### AI Advisor

#### POST /ai/ask
Ask AI financial question (Protected)

**Request Body:**
```json
{
  "question": "How can I save money every month?"
}
```

**Response:**
```json
{
  "question": "How can I save money every month?",
  "answer": "Here are some simple ways to save money:\n\n1. Set a Goal...\n2. Track Expenses..."
}
```

#### GET /ai/suggestions
Get AI-generated suggestions (Protected)

**Response:**
```json
{
  "suggestions": [
    "Try to save 10% of your income every month",
    "Create a monthly budget..."
  ]
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Admin access required"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

- No rate limiting in development
- Production: 100 requests per minute per IP

---

## Interactive Documentation

Visit these URLs when backend is running:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
