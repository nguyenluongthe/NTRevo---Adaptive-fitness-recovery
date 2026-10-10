"""
NTRevo Infrastructure: Cache Service Adapter (Clean Architecture - Layer 4)
Author: Dev1-BackendLead (dev1.backendlead@ntrevo.io)
Sprint: 3 - AI trong Thiết kế & Kiến trúc Phần mềm (Chương 5)
Implements ICacheService using the MemoryCacheManager engine.
"""

from typing import Any, Optional
try:
    from backend.use_cases.interfaces import ICacheService
    from backend.cache.cache_manager import cache_manager, MemoryCacheManager
except ImportError:
    from use_cases.interfaces import ICacheService
    from cache.cache_manager import cache_manager, MemoryCacheManager

class MemoryCacheServiceAdapter(ICacheService):
    """Adapter bridging the generic ICacheService port with MemoryCacheManager."""

    def __init__(self, manager: Optional[MemoryCacheManager] = None):
        self._manager = manager or cache_manager

    def get(self, key: str) -> Optional[Any]:
        return self._manager.get(key)

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        self._manager.set(key, value, ttl_seconds=ttl_seconds)

    def delete(self, key: str) -> bool:
        return self._manager.delete(key)
