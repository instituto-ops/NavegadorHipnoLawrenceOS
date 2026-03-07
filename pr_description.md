🧹 [code health improvement description]

🎯 **What:** The code health issue addressed
Removed unused imports `from langgraph.graph import END, START, StateGraph` and the try/except block importing `ads_agent_node`, `copy_agent_node`, and `seo_agent_node` from `apps/backend/lam/agency/coordinator.py`.

💡 **Why:** How this improves maintainability
These imports were not being used anywhere in `coordinator.py`. Removing them cleans up the namespace, reduces confusion, and marginally improves module load times, resulting in a cleaner and more maintainable file.

✅ **Verification:** How you confirmed the change is safe
- Verified with `cat` that the imports were successfully removed.
- Ran `ruff check apps/backend/` and `mypy --explicit-package-bases apps/backend/` to ensure no new formatting/linting or type errors were introduced by this removal.
- The imports were completely unused in the file, making it safe.

✨ **Result:** The improvement achieved
A cleaner `coordinator.py` with dead code removed.
