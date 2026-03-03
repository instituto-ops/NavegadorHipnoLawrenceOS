import json
import os
from typing import Dict, Any, Optional
from datetime import datetime, timezone

class STMDatabase:
    """Short-Term Memory Database for LangGraph orchestrator state storage."""

    def __init__(self, db_path: str = "./stm_db.json"):
        self.db_path = db_path
        self._memory: Dict[str, Dict[str, Any]] = self._load()

    def _load(self) -> Dict[str, Dict[str, Any]]:
        """Load state from local file."""
        if os.path.exists(self.db_path):
            try:
                with open(self.db_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading STM from {self.db_path}: {e}")
                return {}
        return {}

    def _save(self) -> None:
        """Save state to local file."""
        try:
            with open(self.db_path, "w", encoding="utf-8") as f:
                json.dump(self._memory, f, indent=2)
        except Exception as e:
            print(f"Error saving STM to {self.db_path}: {e}")

    def get_state(self, thread_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve state for a specific thread."""
        return self._memory.get(thread_id)

    def set_state(self, thread_id: str, state: Dict[str, Any]) -> None:
        """Store state for a specific thread."""
        state["_updated_at"] = datetime.now(timezone.utc).isoformat()
        self._memory[thread_id] = state
        self._save()

    def clear_state(self, thread_id: str) -> None:
        """Clear state for a specific thread."""
        if thread_id in self._memory:
            del self._memory[thread_id]
            self._save()

# Global instance
stm_db = STMDatabase()

if __name__ == "__main__":
    db = STMDatabase("./test_stm.json")
    db.set_state("thread_1", {"task": "test task", "status": "started"})
    state = db.get_state("thread_1")
    print(f"State retrieved: {state}")
    db.clear_state("thread_1")
