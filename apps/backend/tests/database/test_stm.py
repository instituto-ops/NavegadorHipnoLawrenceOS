import json
import os
from pathlib import Path
from typing import Dict, Any

from apps.backend.database.stm import STMDatabase

def test_set_state(tmp_path: Path) -> None:
    # 1. Setup - Create database pointing to a temporary file
    db_file = tmp_path / "test_stm_db.json"
    db = STMDatabase(db_path=str(db_file))

    # Ensure memory is initially empty for the test
    db._memory = {}

    # 2. Action - Write a state using set_state
    thread_id = "test_thread_1"
    initial_state = {"user": "test_user", "data": "some_data"}
    db.set_state(thread_id, initial_state)

    # 3. Verification

    # Verify the state was correctly written to the file
    assert db_file.exists()

    with open(db_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    assert thread_id in data
    assert data[thread_id]["user"] == "test_user"
    assert data[thread_id]["data"] == "some_data"
