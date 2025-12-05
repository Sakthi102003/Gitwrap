from pydantic import BaseModel
from typing import List, Optional, Dict


class RepoModel(BaseModel):
    name: str
    stars: int
    forks: int
    language: Optional[str]
    url: str
    description: Optional[str]


class LanguageModel(BaseModel):
    name: str
    count: int
    percentage: int


class HeatmapDay(BaseModel):
    date: str
    count: int


class AchievementModel(BaseModel):
    name: str
    icon: str


class ProductiveMonth(BaseModel):
    month: str
    count: int


class WrappedResponse(BaseModel):
    username: str
    name: str
    avatarUrl: str
    year: int
    totalCommits: int
    totalPRs: int
    totalIssues: int
    repoCount: int
    totalStars: int
    streak: int
    topRepos: List[RepoModel]
    topLanguages: List[LanguageModel]
    heatmapDays: List[HeatmapDay]
    totalContributions: int
    vibe_score: int
    title: str
    achievements: List[AchievementModel]
    intensity: float
    productiveMonth: Optional[ProductiveMonth]
    cached: bool = False


class ErrorResponse(BaseModel):
    error: str
    message: str
    details: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    cache: Dict
    github: Dict
