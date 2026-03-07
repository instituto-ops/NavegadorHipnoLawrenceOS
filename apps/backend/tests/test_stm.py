import json
import tempfile
from apps.backend.database.stm import STMDatabase

def test_stm_database_get_state() -> None:
    """Test get_state method of STMDatabase."""
    # Create a temporary file with some initial state
    initial_state = {
        "thread_1": {"task": "test task 1", "status": "started"},
        "thread_2": {"task": "test task 2", "status": "completed"}
    }

    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".json") as f:
        json.dump(initial_state, f)
        temp_db_path = f.name

    try:
        # Initialize database with the temporary file
        db = STMDatabase(db_path=temp_db_path)

        # Test getting an existing state
        state1 = db.get_state("thread_1")
        assert state1 is not None
        assert state1["task"] == "test task 1"
        assert state1["status"] == "started"

        state2 = db.get_state("thread_2")
        assert state2 is not None
        assert state2["task"] == "test task 2"
        assert state2["status"] == "completed"

        # Test getting a non-existing state
        state_none = db.get_state("thread_unknown")
        assert state_none is None

    finally:
        # Clean up temporary file
        import os
        if os.path.exists(temp_db_path):
            os.remove(temp_db_path)

def test_stm_database_get_state_empty_db() -> None:
    """Test get_state with an empty or non-existent database file."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as f:
        temp_db_path = f.name

    try:
        # File exists but is empty, which causes json.load to fail and return {}
        db = STMDatabase(db_path=temp_db_path)

        state = db.get_state("thread_1")
        assert state is None

    finally:
        import os
        if os.path.exists(temp_db_path):
            os.remove(temp_db_path)

    # Test with non-existent file
    db = STMDatabase(db_path="non_existent_file.json")
    state = db.get_state("thread_1")
    assert state is None
