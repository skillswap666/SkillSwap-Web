# �� Skill Swap Club API Documentation

This document describes the REST API endpoints for the Skill Swap Club Web App. It covers functionality for users, workshops, credits, transactions, and profile management across all pages of the application.

## 🔑 Authentication

All user-related endpoints require a valid `userId` (UUID).

Supabase handles authentication internally; this API assumes you already have a valid session.

---

## 🏠 Home Page

### Get User Profile

**Endpoint:** `GET /api/user/:id`

**Response:**
```json
{
  "id": "uuid",
  "name": "Shunn Yee",
  "avatar": "https://cdn...",
  "credits": 42,
  "totalWorkshopsAttended": 12,
  "totalWorkshopsHosted": 5
}
```

### Get User's Upcoming Workshops

**Endpoint:** `GET /api/users/:id/workshops?status=upcoming`

**Response:**
```json
[
  {
    "id": 101,
    "title": "Intro to React",
    "date": "2025-10-01",
    "time": "18:00",
    "location": "Sydney, AU",
    "category": "Web Dev",
    "facilitator": {
      "name": "Alice Johnson",
      "avatar": "https://cdn...",
      "rating": 4.8
    }
  }
]
```

### Get Featured Workshops

**Endpoint:** `GET /api/workshops/featured`

**Response:**
```json
[
  {
    "id": 201,
    "title": "Mastering TypeScript",
    "image": "https://cdn...",
    "currentParticipants": 15,
    "maxParticipants": 25,
    "creditCost": 10,
    "facilitator": {
      "name": "Bob Smith",
      "rating": 4.8,
      "avatar": "https://cdn..."
    }
  }
]
```

---

## 🔎 Explore Page

### Get Upcoming Workshops (with optional filters)

**Endpoint:** `GET /api/workshops?status=upcoming`

**Optional Query Parameters:**
- `category=Web Development`
- `skillLevel=Beginner`
- `location=online`
- `search=react`

**Response:**
```json
[
  {
    "id": "101",
    "title": "Intro to React",
    "description": "Learn React basics with hands-on examples.",
    "date": "2025-10-12",
    "time": "18:00",
    "status": "upcoming",
    "category": "Web Development",
    "skillLevel": "Beginner",
    "isOnline": false,
    "location": "Sydney, AU",
    "image": "https://cdn.example.com/workshops/react.png",
    "creditCost": 10,
    "tags": ["React", "Frontend", "JavaScript"],
    "currentParticipants": 12,
    "maxParticipants": 20,
    "facilitator": {
      "name": "Alice Johnson",
      "avatar": "https://cdn.example.com/users/alice.png",
      "rating": 4.7
    },
    "participants": [
      { "id": "user-1" },
      { "id": "user-2" }
    ]
  }
]
```

---

## ✍️ Create Workshop Page

### Create a Workshop

**Endpoint:** `POST /api/workshops`

**Request:**
```json
{
  "title": "Advanced React Patterns & Performance",
  "description": "Learn about hooks, suspense, and optimizing large React apps.",
  "category": "Web Development",
  "skillLevel": "Advanced",
  "duration": 120,
  "maxParticipants": 25,
  "creditCost": 20,
  "creditReward": 35,
  "date": "2025-10-20",
  "time": "14:00",
  "location": "Virtual",
  "isOnline": true,
  "tags": ["React", "Performance", "Hooks"],
  "materials": ["Slides", "Code Sandbox link"],
  "requirements": ["Intermediate JavaScript", "Basic React knowledge"]
}
```

**Response:**
```json
{
  "id": "w_2001",
  "title": "Advanced React Patterns & Performance",
  "status": "upcoming",
  "facilitator": {
    "id": "u_123",
    "name": "Shunn Yee",
    "avatar": "https://cdn.example.com/users/shunn.png"
  },
  "created_at": "2025-09-24T12:34:56Z"
}
```

---

## 📊 Dashboard Page

### Get User Profile (Extended)

**Endpoint:** `GET /api/user/:id`

**Response:**
```json
{
  "id": "u_123",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "avatar": "https://cdn.example.com/users/alice.png",
  "bio": "Frontend dev and workshop host",
  "skills": ["React", "JavaScript", "UI/UX"],
  "rating": 4.8,
  "credits": 120,
  "totalWorkshopsAttended": 5,
  "totalWorkshopsHosted": 2
}
```

### Get Workshops Attending

**Endpoint:** `GET /api/user/:id/workshops/attending`

### Cancel Attendance

**Endpoint:** `DELETE /api/workshops/:id/attend`

### Get Workshops Hosting

**Endpoint:** `GET /api/user/:id/workshops/hosting`

### Edit Workshop (Full Update)

**Endpoint:** `PUT /api/workshops/:id`

### Edit Workshop (Partial Update)

**Endpoint:** `PATCH /api/workshops/:id`

---

## 👤 Edit Profile (Dashboard)

When the user clicks "Edit Profile", the following fields become editable:
- `name`
- `bio`
- `skills` (array)

The Save button appears once changes are made.

### Update Profile

**Endpoint:** `PATCH /api/user/:id`  
**Content-Type:** `application/json`

**Request Example:**
```json
{
  "name": "Alice Johnson",
  "bio": "Frontend developer & workshop host. Passionate about teaching React.",
  "skills": ["React", "JavaScript", "UI/UX", "TypeScript"]
}
```

**Response Example:**
```json
{
  "id": "u_123",
  "name": "Alice Johnson",
  "avatar": "https://cdn.example.com/users/alice.png",
  "bio": "Frontend developer & workshop host. Passionate about teaching React.",
  "skills": ["React", "JavaScript", "UI/UX", "TypeScript"],
  "rating": 4.8,
  "credits": 120,
  "updated_at": "2025-09-24T16:20:00Z"
}
```

---

## 💳 Credits & Transactions

### Get User Credits

**Endpoint:** `GET /api/users/:id/credits`

**Response:**
```json
{
  "userId": "u_123",
  "credits": 120,
  "level": "Gold"
}
```

### Get User Transactions

**Endpoint:** `GET /api/users/:id/transactions?limit=20`

**Response:**
```json
[
  {
    "id": "t_5001",
    "type": "earned",
    "amount": 25,
    "description": "Hosted: React Basics Workshop",
    "timestamp": "2025-09-15T10:30:00Z"
  },
  {
    "id": "t_5002",
    "type": "spent",
    "amount": 20,
    "description": "Attended: SQL Mastery Workshop",
    "timestamp": "2025-09-18T15:00:00Z"
  }
]
```

---

## 🔄 Authentication & Data Fetching Strategy

To balance performance and accuracy, follow this strategy for what to fetch and when:

### 1. Sign In / Sign Up

Backend returns:
- `userId` (always)
- Basic profile (name, avatar)

Frontend stores this in context and optionally in localStorage for persistence across reloads.

✅ **Only fetched once at login.**

### 2. Credits

Credits change frequently (attending workshops, hosting, transactions).
Must always reflect the backend's source of truth.

**Recommendation:**
- Fetch credits every time you load a page that shows them (Dashboard, Credits page, navbar)
- Re-fetch after any transaction (join/host workshop)

### 3. User Profile (bio, skills, etc.)

- Fetch once at login
- Update locally after edits (`PATCH /api/user/:id`)
- Context keeps it in memory for quick access
- Re-fetch only if user refreshes the page

### 4. Workshops

Dynamic content → always fetch fresh from backend when entering Explore or Dashboard.
Don't cache for long periods.

### 5. Frontend vs Backend Responsibilities

**Backend (source of truth):**
- Authentication & sessions
- Credit balance validation
- Profile & transaction history

**Frontend (UX speed):**
- Cache essentials in context/localStorage (userId, name, avatar)
- Trigger re-fetch when data may have changed

### Example Flow

1. User logs in → store `{ id, name, avatar }` in context
2. Go to Dashboard → fetch `/api/users/:id/credits` + `/api/user/:id/workshops/...`
3. Join workshop → after success, re-fetch credits + attending workshops
4. Edit profile → send PATCH → update context immediately (optimistic UI)

---

## 📌 Notes

- Filtering options for `category`, `skillLevel`, and `location` are customizable
- Refer to the shared Google Doc for detailed values: [Filter Options Doc]
- All timestamps follow ISO 8601 format

---

## 📋 Quick Reference

### Base URL
```
https://api.skillswapclub.com
```

### Common Headers
```
Content-Type: application/json
Authorization: Bearer <supabase_session_token>
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
