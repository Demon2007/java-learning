# JavaQuest — Gamified Java Learning Platform

A full-stack gamified Java learning platform built with React + Vite (frontend) and Django + DRF (backend).

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at: http://localhost:8000
Admin panel: http://localhost:8000/admin/

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## Features

- JWT Authentication (register, login, refresh, logout)
- Gamified progression: XP, levels, coins, streaks
- 11 Java lessons with quizzes across 3 categories
- In-browser Monaco Code Editor (Java)
- Shop system: buy titles and frames with coins
- Achievements system with XP/coin rewards
- Leaderboard (top 100 by XP)
- Avatar upload, profile customization
- Inventory: manage titles and frames
- Admin panel for content management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Styling | TailwindCSS + Framer Motion |
| State | Zustand + React Query |
| Backend | Django 4.2 + DRF |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | SQLite |
| Editor | Monaco Editor |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register/ | Register user |
| POST | /api/auth/login/ | Login |
| POST | /api/auth/refresh/ | Refresh token |
| GET | /api/users/profile/ | Own profile |
| POST | /api/users/daily-login/ | Daily XP reward |
| GET | /api/lessons/categories/ | All categories |
| GET | /api/lessons/{slug}/ | Lesson detail |
| POST | /api/lessons/{id}/complete/ | Mark complete |
| POST | /api/lessons/quiz/{id}/submit/ | Submit quiz |
| GET | /api/gamification/leaderboard/ | Top 100 |
| GET | /api/gamification/achievements/ | All achievements |
| POST | /api/shop/{id}/purchase/ | Buy item |
