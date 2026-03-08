
## 2025-05-24 - Accessible Custom CLI Inputs
**Learning:** When building custom CLI or terminal-like text inputs without standard input borders, simply styling the focus state of the `<input>` itself can leave the overall visual component (like the prepended `>_` or shell prompt symbol) looking disconnected. Furthermore, screen readers will announce the input based on its context, so providing a clear `aria-label` and hiding decorative prompt symbols (`aria-hidden="true"`) is essential for a clean audio and visual experience.
**Action:** Apply `focus-within:ring` to the parent container that wraps both the prompt symbol and the input field to create a cohesive focus indicator, add descriptive `aria-label`s to the input, and use `aria-hidden="true"` on purely decorative prompt icons.
