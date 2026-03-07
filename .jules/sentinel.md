# Sentinel Security Log

## 2024-05-15
- **Vulnerability:** Potential Javascript Injection in Playwright Evaluate.
- **Learning:** Using string interpolation (`f"..."`) to construct JavaScript code in `page.evaluate()` can allow an attacker to inject arbitrary JS if the injected string (e.g., `selector`) is user-controlled.
- **Prevention:** Always pass variables to `page.evaluate()` as arguments. Playwright serializes these arguments safely, preventing injection attacks. Example: `page.evaluate("(sel) => { return document.querySelector(sel); }", selector)`.
