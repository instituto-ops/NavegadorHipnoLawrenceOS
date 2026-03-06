## 2024-05-15 - [Overly Permissive CORS Configuration]
**Vulnerability:** FastAPI CORS middleware is configured with `allow_origins=["*"]`, allowing any domain to interact with the API, which could lead to Cross-Site Request Forgery (CSRF) or unauthorized data access.
**Learning:** In a production application handling sensitive AI data and automation (e.g., social media, N8N webhooks), strict CORS policies are crucial to restrict API access strictly to trusted origins like the dedicated frontend application.
**Prevention:** Always configure `allow_origins` securely via environment variables (e.g., `ALLOWED_ORIGINS` with a default of the local dev domain `http://localhost:3000`) instead of hardcoding `*`.
