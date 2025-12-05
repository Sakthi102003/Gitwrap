# GitHub Wrapped Backend API (FastAPI)

A production-ready FastAPI backend that fetches and analyzes GitHub user statistics for the GitHub Wrapped 2025 application.

## 🚀 Features

- **No Authentication Required**: Users only need to provide their GitHub username
- **Comprehensive Stats**: Fetches commits, PRs, issues, repos, stars, and more
- **Smart Caching**: In-memory cache with 10-minute TTL to optimize API usage
- **Developer Titles**: Automatic title assignment based on activity patterns
- **Vibe Score**: 0-100 score calculated from weighted metrics
- **Production Ready**: CORS, error handling, automatic API docs
- **Fast & Async**: Built with FastAPI and httpx for high performance

## 📋 Prerequisites

- Python 3.9+
- GitHub Personal Access Token

## 🔧 Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your GitHub token:

```env
GITHUB_TOKEN=ghp_your_token_here
PORT=8000
ENVIRONMENT=development
CORS_ORIGIN=*
```

### 4. Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "GitHub Wrapped API")
4. Select scopes:
   - `public_repo` (for repository data)
   - `read:user` (for user profile)
5. Click "Generate token"
6. Copy the token to your `.env` file

## 🏃 Running Locally

### Development Mode (with auto-reload)

```bash
uvicorn main:app --reload --port 8000
```

Or use the main script:

```bash
python main.py
```

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📡 API Endpoints

### Get Wrapped Data

```
GET /api/wrapped/{username}?year=YYYY
```

**Parameters:**
- `username` (path): GitHub username
- `year` (query, optional): Year to analyze (default: current year, range: 2008-2025)

**Example:**
```bash
curl http://localhost:8000/api/wrapped/octocat?year=2025
```

**Response:**
```json
{
  "username": "octocat",
  "name": "The Octocat",
  "avatarUrl": "https://avatars.githubusercontent.com/u/583231",
  "year": 2025,
  "totalCommits": 847,
  "totalPRs": 123,
  "totalIssues": 45,
  "repoCount": 18,
  "totalStars": 234,
  "streak": 156,
  "topRepos": [
    {
      "name": "awesome-project",
      "stars": 120,
      "forks": 45,
      "language": "JavaScript",
      "url": "https://github.com/octocat/awesome-project",
      "description": "An awesome project"
    }
  ],
  "topLanguages": [
    {
      "name": "JavaScript",
      "count": 12,
      "percentage": 67
    }
  ],
  "heatmapDays": [
    {
      "date": "2025-01-01",
      "count": 5
    }
  ],
  "vibe_score": 87,
  "title": "Code Warrior",
  "achievements": [
    {
      "name": "Commit Champion",
      "icon": "🏆"
    }
  ],
  "intensity": 5.4,
  "productiveMonth": {
    "month": "Jun",
    "count": 145
  },
  "cached": false
}
```

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-05T10:30:00.000000",
  "cache": {
    "total": 5,
    "active": 4,
    "expired": 1
  },
  "github": {
    "configured": true
  }
}
```

### Root Endpoint

```
GET /
```

Returns API information and available endpoints.

## 🚢 Deployment Platforms

### Railway

1. Create new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add environment variable: `GITHUB_TOKEN`
5. Railway will auto-detect Python and deploy

### Render

1. Create new Web Service on [Render](https://render.com)
2. Connect repository
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `GITHUB_TOKEN`

### Heroku

```bash
# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

heroku create your-app-name
heroku config:set GITHUB_TOKEN=your_token_here
git push heroku main
```

### Docker (Optional)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t github-wrapped-backend .
docker run -p 8000:8000 -e GITHUB_TOKEN=your_token github-wrapped-backend
```

## 🔒 Security

- GitHub token is stored server-side only
- Never exposed in API responses
- CORS configured for frontend domains
- Input validation on all endpoints
- Pydantic models for type safety

## 📊 Caching

- In-memory cache with 10-minute TTL
- Automatic cleanup of expired entries
- Cache statistics available via health endpoint
- Reduces GitHub API calls significantly

## 🎯 Developer Titles

The API assigns titles based on activity:

- **GitHub Legend**: 1000+ commits, 100+ PRs, 500+ stars, 200+ day streak
- **Commit Machine**: 800+ commits
- **PR Prodigy**: 150+ pull requests
- **Project Factory**: 25+ repositories
- **The Polyglot Dev**: 7+ languages
- **Streak Master**: 180+ day streak
- **Star Collector**: 300+ total stars
- **Code Warrior**: 400+ commits
- **Open Source Hero**: 50+ PRs and 200+ commits
- **Repository Builder**: 15+ repos
- **The Consistent Dev**: 90+ day streak
- **Rising Star**: 100+ commits and 20+ PRs
- **Weekend Warrior**: 50+ commits
- **The Chill Dev**: Minimal activity

## 📈 Vibe Score Calculation

Weighted scoring system (0-100):

- Commits: 25%
- Pull Requests: 20%
- Repositories: 15%
- Streak: 15%
- Stars: 15%
- Languages: 10%

## 🛠️ Project Structure

```
backend/
├── main.py                      # FastAPI application
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── app/
│   ├── services/
│   │   ├── github_client.py    # GitHub API client
│   │   └── cache.py            # In-memory cache
│   ├── utils/
│   │   └── scoring.py          # Scoring and title logic
│   └── models/
│       └── wrapped_response.py # Pydantic models
```

## 📝 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITHUB_TOKEN` | Yes | - | GitHub Personal Access Token |
| `PORT` | No | 8000 | Server port |
| `ENVIRONMENT` | No | development | Environment mode |
| `CORS_ORIGIN` | No | * | Allowed CORS origins (comma-separated) |

## 🐛 Troubleshooting

### "USER_NOT_FOUND" Error
- Verify the GitHub username is correct
- User might have changed username

### Rate Limit Errors
- Check your GitHub token is valid
- Authenticated requests get 5000/hour limit
- Consider increasing cache TTL

### CORS Errors
- Set `CORS_ORIGIN` to your frontend URL in production
- Use `*` for development only

### Import Errors
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt`

## 📚 API Documentation

FastAPI provides automatic interactive documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🧪 Testing

```bash
# Install dev dependencies
pip install pytest pytest-asyncio httpx

# Run tests (if you create them)
pytest
```

## 📄 License

MIT

## 🤝 Contributing

Pull requests welcome! Please ensure your code follows PEP 8 style guidelines.

---

Built with ❤️ for GitHub Wrapped 2025
