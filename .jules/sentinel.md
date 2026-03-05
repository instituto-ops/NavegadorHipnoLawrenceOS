## 2024-05-30 - [Fix Overly Permissive CORS Configuration]
**Vulnerability:** The FastAPI backend used `allow_origins=["*"]` in its `CORSMiddleware`, which is overly permissive and can expose the API to unauthorized cross-origin requests.
**Learning:** Using `["*"]` for `allow_origins` is a common but dangerous default, especially for production environments. It defeats the purpose of CORS protection.
**Prevention:** Configure CORS to use an environment variable (e.g., `ALLOWED_ORIGINS`) that can be set differently for development and production. Default to a secure local development URL like `http://localhost:3000` instead of a wildcard. Parse the string value into a list to support multiple allowed origins cleanly.
