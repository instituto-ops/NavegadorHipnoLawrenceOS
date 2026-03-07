
## 2025-02-12
* **Vulnerability:** Permissive CORS Policy (`allow_origins=["*"]`) in FastAPI `main.py`
* **Learning:** Allowing all origins (`*`) with `allow_credentials=True` exposes the application to Cross-Origin Resource Sharing (CORS) attacks. Malicious sites could make authenticated requests to the backend. Broad `ruff check --fix` can easily break fallback imports (`except ImportError: pass`), so automated fixes should be tightly scoped.
* **Prevention:** Always restrict CORS `allow_origins` to explicitly trusted domains, ideally driven by environment variables (e.g., `ALLOWED_ORIGINS`). Ensure `allow_credentials=True` is never combined with `allow_origins=["*"]`. Keep automated linting fixes restricted to the modified file.
