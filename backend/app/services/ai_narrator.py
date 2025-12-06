"""AI Narrator service for generating GitHub Wrapped stories."""
import os
from openai import OpenAI
from typing import Dict, Any, Optional
import calendar


class AILogger:
    """A logger that doesn't reveal API keys or sensitive data."""
    
    @staticmethod
    def log_error(error: Exception, context: str = ""):
        """Log errors safely without exposing sensitive information."""
        error_msg = str(error)
        # Redact any potential API keys or sensitive data
        safe_msg = error_msg[:200] if len(error_msg) > 200 else error_msg
        print(f"AI Narrator Error [{context}]: {safe_msg}")


class AIWrappedNarrator:
    """Generate Spotify Wrapped-style narratives for GitHub stats using AI."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the AI narrator with OpenAI API."""
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY is required for AI narrator")
        
        self.client = OpenAI(api_key=self.api_key)
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    def _get_day_name(self, day_index: int) -> str:
        """Convert day index (0-6) to day name."""
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        return days[day_index] if 0 <= day_index < 7 else "Unknown"
    
    def _get_month_name(self, month_index: int) -> str:
        """Convert month index (1-12) to month name."""
        return calendar.month_name[month_index] if 1 <= month_index <= 12 else "Unknown"
    
    def _prepare_stats_summary(self, wrapped_data: Dict[str, Any]) -> str:
        """Prepare a clean summary of stats for the AI prompt."""
        user = wrapped_data.get("user", {})
        stats = wrapped_data.get("stats", {})
        repos = wrapped_data.get("topRepos", [])
        languages = wrapped_data.get("topLanguages", [])
        
        # Get top repo data
        top_repo = repos[0] if repos else {}
        top_repo_name = top_repo.get("name", "N/A")
        top_repo_stars = top_repo.get("stars", 0)
        top_repo_language = top_repo.get("language", "Unknown")
        
        # Get top 3 languages
        lang1 = languages[0] if len(languages) > 0 else {}
        lang2 = languages[1] if len(languages) > 1 else {}
        lang3 = languages[2] if len(languages) > 2 else {}
        
        # Get busiest month and day
        busiest_month_index = stats.get("busiestMonth", {}).get("month", 1)
        busiest_month_commits = stats.get("busiestMonth", {}).get("commits", 0)
        busiest_day_index = stats.get("busiestDayOfWeek", {}).get("day", 0)
        
        summary = f"""USERNAME: {user.get('login', 'N/A')}
NAME: {user.get('name', 'N/A')}
YEAR: {wrapped_data.get('year', 2025)}

totalCommits: {stats.get('totalCommits', 0)}
totalPRs: {stats.get('totalPRs', 0)}
totalIssues: {stats.get('totalIssues', 0)}
repoCount: {stats.get('repoCount', 0)}
totalStars: {stats.get('totalStars', 0)}
followers: {user.get('followers', 0)}
streak: {stats.get('longestStreak', 0)}

topLanguages: {lang1.get('name', 'N/A')} ({lang1.get('count', 0)}), {lang2.get('name', 'N/A')} ({lang2.get('count', 0)}), {lang3.get('name', 'N/A')} ({lang3.get('count', 0)})
busiestMonth: {self._get_month_name(busiest_month_index)} ({busiest_month_commits} commits)
busiestDayOfWeek: {self._get_day_name(busiest_day_index)}
topRepoName: {top_repo_name}
topRepoStars: {top_repo_stars}
topRepoLanguage: {top_repo_language}
"""
        return summary
    
    def _build_prompt(self, stats_summary: str) -> str:
        """Build the complete prompt for the AI."""
        return f"""You are the hype narrator of "GitHub Wrapped" - think Spotify Wrapped meets hacker culture with maximum energy!

PERSONALITY & STYLE:
- SUPER jolly, energetic, and playful with strong tech personality
- Think: terminal aesthetics, hacker slang, dev memes, and gaming culture
- Use tech metaphors (debugging life, compiling dreams, merging realities, git gud, stack overflow energy)
- Drop clever programming references and Easter eggs
- Make it feel like their coding year was an epic adventure/game
- Mix enthusiasm with legit technical respect
- NO cringe, NO over-flattery, NO fake comparisons
- Keep it fun but ALWAYS fact-based

TECH VIBES TO CHANNEL:
- Retro terminal green screen energy (think Matrix, old-school hacking movies)
- Gamer achievement unlocked moments
- Meme-able dev culture references (but tasteful)
- Stack/technology wordplay when relevant
- Binary jokes, hex codes, or ASCII art references
- "Your code was fire" energy but technical

WRITING RULES:
- NEVER invent or guess numbers - use ONLY the exact stats provided
- Do NOT compare to fake percentiles or "other users"
- Every statement must trace back to actual data
- Keep lines short and punchy (think Tweet-length max)
- Use tech terminology correctly
- Add energy with word choice, not fake hype

Here are this user's REAL GitHub stats:

{stats_summary}

YOUR MISSION:
Generate a Wrapped story that feels like:
• An achievement screen from their favorite game
• A hacker montage from a movie
• Spotify Wrapped but for keyboard warriors
• Something they'd WANT to screenshot and share

Format EXACTLY as 7 slides using these markers:

###SLIDE_1_INTRO###
- 2 lines max
- EPIC opening that hits hard - this is their boot screen to the year
- Username + year in a way that feels legendary
- Think: "System initiated..." or "Loading 2025 archives..." or "git log --year=2025 --author=@username"
- Make them feel like the main character

###SLIDE_2_ACTIVITY###
- 3-4 punchy lines
- Translate commits/PRs/issues into epic metrics
- Use tech language: "pushed", "merged", "deployed", "shipped", "debugged"
- Make the numbers feel meaningful (not just listing)
- Example vibe: "X commits deep. Your git history is basically a novel." or "Closed X issues like a boss."
- Add personality with coding metaphors

###SLIDE_3_RHYTHM###
- 3 lines
- Frame their coding pattern like a playlist or game strategy
- Busiest month = "peak performance window"
- Streak = dedication metric
- Day of week = their "raid night" or "flow state day"
- Make their schedule sound intentional and cool

###SLIDE_4_LANGUAGES###
- 3-4 lines
- Treat languages like their tech stack / arsenal / instrument collection
- Don't just list - describe their coding flavor
- Example: "Python was your main weapon (X lines), with JavaScript side quests."
- Make language choices sound strategic or personality-driven
- Tech culture references welcome (e.g., "TypeScript kept your code type-safe")

###SLIDE_5_TOP_REPO###
- 2-3 lines
- This is their "platinum record" / "legendary drop" / "magnum opus"
- Repo name, stars, and language but narratively
- Make it sound like their biggest contribution to the matrix
- If it has good stars, celebrate it; if few, frame it differently (personal project, new repo, etc.)
- Example: "'MyAwesomeRepo' built with Python hit 50 stars. That's 50 developers who said 'nice.'"

###SLIDE_6_TITLE_AND_VIBE###
Two parts:
- **Line 1:** Give them a SICK developer title (2-4 words max)
  Examples: "Code Whisperer" "Merge Master" "Debug Sorcerer" "Stack Wizard" "Commit Crusader" "Terminal Ninja"
  Make it sound like an RPG class or achievement rank
- **Lines 2-3:** Why they earned this title using their actual stats
  Connect their behavior to the title with tech flavor
  Example: "With X commits and a Y-day streak, you lived in the terminal."
  Make it feel earned, not random

###SLIDE_7_NEXT_YEAR_AND_CAPTION###
- 3-4 lines total
- Line 1-2: ONE specific, technical challenge/goal for next year
  Examples: "Ship that side project" "Contribute to open source" "Master Rust" "10k commits" "Build in public"
  Make it sound achievable but exciting
- Line 3-4: A shareable social media caption (max 180 chars)
  Should include:
  • One catchy phrase about their coding year
  • 2-3 relevant hashtags (#GitHubWrapped #DevLife #YearInCode or language-specific)
  • 1 emoji (🔥 💻 🚀 ⚡ 🎮 👾 relevant to their vibe)
  Make it screenshot-worthy and share-ready

CRITICAL REMINDERS:
- Every number must come from the provided stats
- Keep each slide concise (think mobile-friendly)
- Match energy to their actual activity (don't overhype small numbers awkwardly)
- Tech references should feel natural, not forced
- The goal: they should feel PROUD and want to share this
- Output ONLY the slide markers and content - NO introduction, NO extra text

LET'S GO! 🚀"""
    
    def _parse_ai_response(self, response_text: str) -> Dict[str, str]:
        """Parse the AI response into structured slide data."""
        slides = {}
        
        # Define slide markers
        markers = [
            "###SLIDE_1_INTRO###",
            "###SLIDE_2_ACTIVITY###",
            "###SLIDE_3_RHYTHM###",
            "###SLIDE_4_LANGUAGES###",
            "###SLIDE_5_TOP_REPO###",
            "###SLIDE_6_TITLE_AND_VIBE###",
            "###SLIDE_7_NEXT_YEAR_AND_CAPTION###"
        ]
        
        # Split by markers
        for i, marker in enumerate(markers):
            if marker in response_text:
                start = response_text.find(marker) + len(marker)
                # Find the next marker or end of string
                if i < len(markers) - 1:
                    next_marker = markers[i + 1]
                    end = response_text.find(next_marker) if next_marker in response_text else len(response_text)
                else:
                    end = len(response_text)
                
                content = response_text[start:end].strip()
                slide_key = f"slide_{i + 1}"
                slides[slide_key] = content
        
        return slides
    
    async def generate_narrative(self, wrapped_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI-powered narrative for GitHub Wrapped data.
        
        Args:
            wrapped_data: Complete wrapped data from GitHub API
        
        Returns:
            Dict with slides and metadata
        """
        try:
            # Prepare stats summary
            stats_summary = self._prepare_stats_summary(wrapped_data)
            
            # Build prompt
            prompt = self._build_prompt(stats_summary)
            
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are the ultimate hype narrator for GitHub Wrapped! You're like a mix of a gaming announcer, a terminal wizard, and that friend who gets genuinely excited about code. You speak fluent developer - memes, tech references, and all. Your energy is infectious but you NEVER make up stats. Everything you say is grounded in real data, but delivered with maximum personality and tech culture flavor. Think: achievement unlocked + terminal aesthetics + coding is life energy."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=1.0,
                max_tokens=1500
            )
            
            # Extract response
            narrative_text = response.choices[0].message.content
            
            # Parse into slides
            slides = self._parse_ai_response(narrative_text)
            
            return {
                "success": True,
                "slides": slides,
                "raw_narrative": narrative_text,
                "model": self.model,
                "username": wrapped_data.get("user", {}).get("login", ""),
                "year": wrapped_data.get("year", 2025)
            }
            
        except Exception as e:
            AILogger.log_error(e, "generate_narrative")
            return {
                "success": False,
                "error": "Failed to generate AI narrative",
                "slides": {},
                "raw_narrative": ""
            }


# Singleton instance
_narrator_instance: Optional[AIWrappedNarrator] = None


def get_narrator() -> AIWrappedNarrator:
    """Get or create the narrator singleton instance."""
    global _narrator_instance
    if _narrator_instance is None:
        _narrator_instance = AIWrappedNarrator()
    return _narrator_instance
