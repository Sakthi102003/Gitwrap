import httpx
from datetime import datetime
from typing import Dict, List, Optional


class GitHubClient:
    """GitHub API client for fetching user statistics."""
    
    def __init__(self, token: str):
        self.token = token
        self.rest_headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "GitHub-Wrapped-App"
        }
        self.graphql_headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "GitHub-Wrapped-App"
        }
    
    async def get_user_profile(self, username: str) -> Dict:
        """Fetch user profile information."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.github.com/users/{username}",
                headers=self.rest_headers,
                timeout=30.0
            )
            
            if response.status_code == 404:
                raise ValueError("USER_NOT_FOUND")
            
            response.raise_for_status()
            data = response.json()
            
            return {
                "username": data["login"],
                "name": data.get("name") or data["login"],
                "avatarUrl": data["avatar_url"],
                "publicRepos": data["public_repos"]
            }
    
    async def get_user_repositories(self, username: str) -> List[Dict]:
        """Fetch all repositories for a user."""
        repos = []
        page = 1
        per_page = 100
        
        async with httpx.AsyncClient() as client:
            while True:
                response = await client.get(
                    f"https://api.github.com/users/{username}/repos",
                    headers=self.rest_headers,
                    params={
                        "per_page": per_page,
                        "page": page,
                        "sort": "updated",
                        "type": "owner"
                    },
                    timeout=30.0
                )
                
                if response.status_code != 200:
                    break
                
                data = response.json()
                if not data:
                    break
                
                repos.extend([{
                    "name": repo["name"],
                    "fullName": repo["full_name"],
                    "stars": repo["stargazers_count"],
                    "forks": repo["forks_count"],
                    "language": repo.get("language"),
                    "pushedAt": repo["pushed_at"],
                    "createdAt": repo["created_at"],
                    "url": repo["html_url"],
                    "description": repo.get("description")
                } for repo in data])
                
                if len(data) < per_page:
                    break
                
                page += 1
        
        return repos
    
    async def get_contribution_data(self, username: str, year: int) -> Dict:
        """Fetch contribution data using GraphQL."""
        from_date = f"{year}-01-01T00:00:00Z"
        to_date = f"{year}-12-31T23:59:59Z"
        
        query = """
        query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
                contributionsCollection(from: $from, to: $to) {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                date
                                contributionCount
                            }
                        }
                    }
                    totalCommitContributions
                    totalPullRequestContributions
                    totalIssueContributions
                    totalRepositoryContributions
                }
            }
        }
        """
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.github.com/graphql",
                headers=self.graphql_headers,
                json={
                    "query": query,
                    "variables": {
                        "username": username,
                        "from": from_date,
                        "to": to_date
                    }
                },
                timeout=30.0
            )
            
            response.raise_for_status()
            result = response.json()
            
            if "errors" in result:
                if "Could not resolve to a User" in str(result["errors"]):
                    raise ValueError("USER_NOT_FOUND")
                raise Exception(result["errors"][0]["message"])
            
            data = result["data"]["user"]["contributionsCollection"]
            
            # Flatten heatmap data
            heatmap_days = []
            for week in data["contributionCalendar"]["weeks"]:
                for day in week["contributionDays"]:
                    heatmap_days.append({
                        "date": day["date"],
                        "count": day["contributionCount"]
                    })
            
            return {
                "totalCommits": data["totalCommitContributions"],
                "totalPRs": data["totalPullRequestContributions"],
                "totalIssues": data["totalIssueContributions"],
                "totalContributions": data["contributionCalendar"]["totalContributions"],
                "heatmapDays": heatmap_days
            }
    
    def calculate_language_breakdown(self, repos: List[Dict]) -> List[Dict]:
        """Calculate language breakdown from repositories."""
        language_counts = {}
        total_repos = 0
        
        for repo in repos:
            if repo.get("language"):
                lang = repo["language"]
                language_counts[lang] = language_counts.get(lang, 0) + 1
                total_repos += 1
        
        languages = [
            {
                "name": name,
                "count": count,
                "percentage": round((count / total_repos) * 100) if total_repos > 0 else 0
            }
            for name, count in language_counts.items()
        ]
        
        return sorted(languages, key=lambda x: x["count"], reverse=True)
    
    def calculate_streak(self, heatmap_days: List[Dict]) -> int:
        """Calculate max consecutive active days."""
        max_streak = 0
        current_streak = 0
        
        for day in heatmap_days:
            if day["count"] > 0:
                current_streak += 1
                max_streak = max(max_streak, current_streak)
            else:
                current_streak = 0
        
        return max_streak
    
    def filter_repos_by_year(self, repos: List[Dict], year: int) -> List[Dict]:
        """Filter repositories by year."""
        filtered = []
        for repo in repos:
            pushed_year = datetime.fromisoformat(repo["pushedAt"].replace("Z", "+00:00")).year
            if pushed_year == year:
                filtered.append(repo)
        return filtered
    
    def get_top_repositories(self, repos: List[Dict], limit: int = 5) -> List[Dict]:
        """Get top repositories by stars."""
        sorted_repos = sorted(repos, key=lambda x: x["stars"], reverse=True)
        return [
            {
                "name": repo["name"],
                "stars": repo["stars"],
                "forks": repo["forks"],
                "language": repo["language"],
                "url": repo["url"],
                "description": repo["description"]
            }
            for repo in sorted_repos[:limit]
        ]
    
    async def get_wrapped_data(self, username: str, year: int) -> Dict:
        """Main method to fetch all wrapped data."""
        # Fetch all data in parallel
        profile, repos, contributions = await asyncio.gather(
            self.get_user_profile(username),
            self.get_user_repositories(username),
            self.get_contribution_data(username, year)
        )
        
        # Filter repos by year
        year_repos = self.filter_repos_by_year(repos, year)
        
        # Calculate total stars
        total_stars = sum(repo["stars"] for repo in repos)
        
        # Get language breakdown
        top_languages = self.calculate_language_breakdown(repos)
        
        # Calculate streak
        streak = self.calculate_streak(contributions["heatmapDays"])
        
        # Get top repositories
        top_repos = self.get_top_repositories(repos, 5)
        
        return {
            "username": profile["username"],
            "name": profile["name"],
            "avatarUrl": profile["avatarUrl"],
            "year": year,
            "totalCommits": contributions["totalCommits"],
            "totalPRs": contributions["totalPRs"],
            "totalIssues": contributions["totalIssues"],
            "repoCount": len(year_repos),
            "totalStars": total_stars,
            "streak": streak,
            "topRepos": top_repos,
            "topLanguages": top_languages[:5],
            "heatmapDays": contributions["heatmapDays"],
            "totalContributions": contributions["totalContributions"]
        }


import asyncio
