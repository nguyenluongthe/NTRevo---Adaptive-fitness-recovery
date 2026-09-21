"""
NTRevo High-Performance In-Memory Cache Manager with TTL
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 4 - AI Lập trình (Code Generation & Completion)
Meets NFR-P02: Sub-2.0s Query Latency Guarantee
"""

import time
import threading
from typing import Any, Optional, Dict, Tuple

class MemoryCacheManager:
    """
    Thread-safe in-memory cache with configurable TTL (Time-To-Live) and prefix invalidation.
    """

    def __init__(self, default_ttl_seconds: int = 3600):
        self.default_ttl = default_ttl_seconds
        self._store: Dict[str, Tuple[Any, float]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> Optional[Any]:
        """
        Retrieves an item from cache if not expired. Returns None on cache miss or expiration.
        """
        with self._lock:
            if key not in self._store:
                return None
            value, expires_at = self._store[key]
            if time.time() > expires_at:
                del self._store[key]
                return None
            return value

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        """
        Stores an item in cache with expiration timestamp.
        """
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl
        expires_at = time.time() + ttl
        with self._lock:
            self._store[key] = (value, expires_at)

    def delete(self, key: str) -> bool:
        """
        Deletes a specific key. Returns True if deleted, False if not present.
        """
        with self._lock:
            if key in self._store:
                del self._store[key]
                return True
            return False

    def invalidate_user(self, user_id: str) -> int:
        """
        Invalidates all cached keys matching a specific user ID prefix.
        Returns the number of invalidated entries.
        """
        with self._lock:
            keys_to_del = [k for k in self._store.keys() if f"user:{user_id}" in k]
            for k in keys_to_del:
                del self._store[k]
            return len(keys_to_del)

    def stats(self) -> Dict[str, Any]:
        """
        Returns diagnostic statistics of cache health.
        """
        with self._lock:
            now = time.time()
            active_keys = [k for k, (_, exp) in self._store.items() if exp > now]
            return {
                "total_entries": len(self._store),
                "active_entries": len(active_keys),
                "expired_pending_cleanup": len(self._store) - len(active_keys),
                "default_ttl_seconds": self.default_ttl
            }

    def clear(self) -> None:
        with self._lock:
            self._store.clear()

# Global Singleton Instance for backend services
cache_manager = MemoryCacheManager(default_ttl_seconds=3600)
