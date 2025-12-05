from typing import Dict, List


def calculate_vibe_score(data: Dict) -> int:
    """Calculate vibe score (0-100) based on various metrics."""
    total_commits = data.get("totalCommits", 0)
    total_prs = data.get("totalPRs", 0)
    repo_count = data.get("repoCount", 0)
    streak = data.get("streak", 0)
    total_stars = data.get("totalStars", 0)
    top_languages = data.get("topLanguages", [])
    
    # Weighted scoring system
    weights = {
        "commits": 0.25,
        "prs": 0.20,
        "repos": 0.15,
        "streak": 0.15,
        "stars": 0.15,
        "languages": 0.10
    }
    
    # Normalize each metric (scale to 0-100)
    normalized_commits = min((total_commits / 500) * 100, 100)
    normalized_prs = min((total_prs / 100) * 100, 100)
    normalized_repos = min((repo_count / 20) * 100, 100)
    normalized_streak = min((streak / 365) * 100, 100)
    normalized_stars = min((total_stars / 100) * 100, 100)
    normalized_languages = min((len(top_languages) / 10) * 100, 100)
    
    # Calculate weighted score
    vibe_score = round(
        normalized_commits * weights["commits"] +
        normalized_prs * weights["prs"] +
        normalized_repos * weights["repos"] +
        normalized_streak * weights["streak"] +
        normalized_stars * weights["stars"] +
        normalized_languages * weights["languages"]
    )
    
    return min(vibe_score, 100)


def calculate_developer_title(data: Dict) -> str:
    """Determine developer title based on stats."""
    total_commits = data.get("totalCommits", 0)
    total_prs = data.get("totalPRs", 0)
    repo_count = data.get("repoCount", 0)
    streak = data.get("streak", 0)
    total_stars = data.get("totalStars", 0)
    top_languages = data.get("topLanguages", [])
    
    # Priority-based title assignment
    
    # GitHub Legend - exceptional all-rounder
    if total_commits > 1000 and total_prs > 100 and total_stars > 500 and streak > 200:
        return "GitHub Legend"
    
    # Commit Machine - massive commit count
    if total_commits > 800:
        return "Commit Machine"
    
    # PR Prodigy - lots of pull requests
    if total_prs > 150:
        return "PR Prodigy"
    
    # Project Factory - many repositories
    if repo_count > 25:
        return "Project Factory"
    
    # The Polyglot Dev - diverse languages
    if len(top_languages) >= 7:
        return "The Polyglot Dev"
    
    # Streak Master - long contribution streak
    if streak > 180:
        return "Streak Master"
    
    # Star Collector - popular repos
    if total_stars > 300:
        return "Star Collector"
    
    # Code Warrior - strong commits
    if total_commits > 400:
        return "Code Warrior"
    
    # Open Source Hero - good PRs and commits
    if total_prs > 50 and total_commits > 200:
        return "Open Source Hero"
    
    # Repository Builder - decent repo count
    if repo_count > 15:
        return "Repository Builder"
    
    # The Consistent Dev - good streak
    if streak > 90:
        return "The Consistent Dev"
    
    # Rising Star - good overall stats
    if total_commits > 100 and total_prs > 20:
        return "Rising Star"
    
    # Weekend Warrior - lower activity
    if total_commits > 50:
        return "Weekend Warrior"
    
    # The Chill Dev - minimal activity
    return "The Chill Dev"


def calculate_achievements(data: Dict) -> List[Dict]:
    """Get achievement badges based on stats."""
    achievements = []
    total_commits = data.get("totalCommits", 0)
    total_prs = data.get("totalPRs", 0)
    total_issues = data.get("totalIssues", 0)
    repo_count = data.get("repoCount", 0)
    streak = data.get("streak", 0)
    total_stars = data.get("totalStars", 0)
    top_languages = data.get("topLanguages", [])
    
    if total_commits > 500:
        achievements.append({"name": "Commit Champion", "icon": "🏆"})
    if total_prs > 100:
        achievements.append({"name": "PR Master", "icon": "🎯"})
    if streak > 100:
        achievements.append({"name": "Consistency King", "icon": "🔥"})
    if total_stars > 100:
        achievements.append({"name": "Star Gazer", "icon": "⭐"})
    if repo_count > 20:
        achievements.append({"name": "Project Pro", "icon": "📦"})
    if len(top_languages) >= 5:
        achievements.append({"name": "Polyglot", "icon": "🌐"})
    if total_issues > 50:
        achievements.append({"name": "Issue Hunter", "icon": "🐛"})
    
    return achievements


def calculate_activity_intensity(data: Dict) -> float:
    """Calculate activity intensity (commits per active day)."""
    heatmap_days = data.get("heatmapDays", [])
    total_commits = data.get("totalCommits", 0)
    
    active_days = len([day for day in heatmap_days if day.get("count", 0) > 0])
    
    if active_days == 0:
        return 0.0
    
    intensity = total_commits / active_days
    return round(intensity * 10) / 10  # Round to 1 decimal


def get_most_productive_month(heatmap_days: List[Dict]) -> Dict:
    """Get most productive month."""
    month_counts = {}
    
    for day in heatmap_days:
        date = day.get("date", "")
        count = day.get("count", 0)
        month = date[:7]  # YYYY-MM
        month_counts[month] = month_counts.get(month, 0) + count
    
    if not month_counts:
        return None
    
    most_productive = max(month_counts.items(), key=lambda x: x[1])
    month_key, count = most_productive
    
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    month_index = int(month_key.split("-")[1]) - 1
    
    return {
        "month": month_names[month_index],
        "count": count
    }


def enrich_wrapped_data(data: Dict) -> Dict:
    """Calculate all scores and metadata."""
    vibe_score = calculate_vibe_score(data)
    title = calculate_developer_title(data)
    achievements = calculate_achievements(data)
    intensity = calculate_activity_intensity(data)
    productive_month = get_most_productive_month(data.get("heatmapDays", []))
    
    return {
        **data,
        "vibe_score": vibe_score,
        "title": title,
        "achievements": achievements,
        "intensity": intensity,
        "productiveMonth": productive_month
    }
