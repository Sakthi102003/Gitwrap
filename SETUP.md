# GitHub Wrapped 2025 - Quick Setup Guide

## 🚀 Getting Started

### Backend Setup (FastAPI)

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
```

3. **Activate virtual environment:**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Configure environment:**
```bash
cp .env.example .env
```

6. **Add GitHub token to `.env` file:**
```env
GITHUB_TOKEN=ghp_your_token_here
PORT=8000
```

7. **Run the backend:**
```bash
python main.py
# or
uvicorn main:app --reload
```

Backend will run on: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

---

### Frontend Setup (React + Vite)

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
The `.env` file is already configured to connect to `http://localhost:8000`

4. **Run the frontend:**
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🔑 GitHub Token Setup

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name it: "GitHub Wrapped API"
4. Select scopes:
   - ✅ `public_repo`
   - ✅ `read:user`
5. Click **"Generate token"**
6. Copy and paste into `backend/.env`

---

## 📡 API Endpoints

### Get Wrapped Data
```
GET http://localhost:8000/api/wrapped/{username}?year=2025
```

Example:
```bash
curl http://localhost:8000/api/wrapped/octocat?year=2025
```

### Health Check
```
GET http://localhost:8000/health
```

---

## 🎯 Testing the Application

1. Start backend: `cd backend && python main.py`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: `http://localhost:5173`
4. Enter any GitHub username (e.g., "octocat")
5. Click "FETCH_DATA"
6. View your GitHub Wrapped! 🎉

---

## 🐛 Troubleshooting

### Backend Issues

**"GITHUB_TOKEN not found"**
- Make sure `.env` file exists in `backend/` directory
- Check token is properly set without quotes

**"ModuleNotFoundError"**
- Activate virtual environment: `venv\Scripts\activate`
- Reinstall dependencies: `pip install -r requirements.txt`

**"Rate limit exceeded"**
- Check your GitHub token is valid
- Wait a few minutes and try again

### Frontend Issues

**"Failed to fetch data"**
- Make sure backend is running on port 8000
- Check `.env` has correct API URL: `VITE_API_URL=http://localhost:8000`

**"Module not found"**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**CORS errors**
- Backend allows all origins in development (`CORS_ORIGIN=*`)
- No additional configuration needed

---

## 📦 Project Structure

```
Git Wrap/
├── backend/              # FastAPI backend (Port 8000)
│   ├── app/
│   │   ├── services/    # GitHub API client & cache
│   │   ├── utils/       # Scoring logic
│   │   └── models/      # Pydantic models
│   ├── main.py          # FastAPI app
│   └── .env             # Environment variables
│
└── frontend/            # React + Vite (Port 5173)
    ├── src/
    │   ├── components/  # React components
    │   ├── services/    # API service layer
    │   └── App.jsx      # Main app
    └── .env             # Frontend config
```

---

## 🚢 Deployment

### Backend (Railway/Render)
- Set `GITHUB_TOKEN` environment variable
- Auto-detects Python and runs `uvicorn main:app`

### Frontend (Vercel/Netlify)
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to your backend URL

---

## ✨ Features

- ✅ Real-time GitHub data fetching
- ✅ No authentication required (just username)
- ✅ Contribution heatmap visualization
- ✅ Developer title assignment
- ✅ Vibe score calculation (0-100)
- ✅ Top languages & repositories
- ✅ Shareable card generation
- ✅ Retro terminal UI theme
- ✅ 10-minute caching

---

Built with ❤️ for GitHub Wrapped 2025
