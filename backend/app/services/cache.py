from datetime import datetime, timedelta
from typing import Dict, Optional


class Cache:
    """In-memory cache with TTL support."""
    
    def __init__(self, default_ttl: int = 600):
        """Initialize cache with default TTL in seconds."""
        self.cache: Dict[str, Dict] = {}
        self.default_ttl = default_ttl
    
    def _generate_key(self, username: str, year: int) -> str:
        """Generate cache key."""
        return f"wrapped:{username}:{year}"
    
    def set(self, username: str, year: int, data: Dict, ttl: Optional[int] = None) -> None:
        """Set cache entry with TTL."""
        key = self._generate_key(username, year)
        expires_at = datetime.now() + timedelta(seconds=ttl or self.default_ttl)
        
        self.cache[key] = {
            "data": data,
            "expires_at": expires_at
        }
    
    def get(self, username: str, year: int) -> Optional[Dict]:
        """Get cache entry if not expired."""
        key = self._generate_key(username, year)
        entry = self.cache.get(key)
        
        if not entry:
            return None
        
        # Check if expired
        if datetime.now() > entry["expires_at"]:
            del self.cache[key]
            return None
        
        return entry["data"]
    
    def has(self, username: str, year: int) -> bool:
        """Check if cache has valid entry."""
        return self.get(username, year) is not None
    
    def delete(self, username: str, year: int) -> bool:
        """Delete specific cache entry."""
        key = self._generate_key(username, year)
        if key in self.cache:
            del self.cache[key]
            return True
        return False
    
    def clear(self) -> None:
        """Clear all cache."""
        self.cache.clear()
    
    def cleanup(self) -> None:
        """Remove expired entries."""
        now = datetime.now()
        expired_keys = [
            key for key, entry in self.cache.items()
            if now > entry["expires_at"]
        ]
        for key in expired_keys:
            del self.cache[key]
    
    def get_stats(self) -> Dict:
        """Get cache statistics."""
        now = datetime.now()
        active = 0
        expired = 0
        
        for entry in self.cache.values():
            if now > entry["expires_at"]:
                expired += 1
            else:
                active += 1
        
        return {
            "total": len(self.cache),
            "active": active,
            "expired": expired
        }


# Global cache instance
cache = Cache(default_ttl=600)  # 10 minutes
