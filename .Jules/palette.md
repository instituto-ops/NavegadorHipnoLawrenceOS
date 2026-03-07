## 2026-03-07 - CLI-like input focus indicators and labels
**Learning:** Custom CLI or terminal inputs must have `focus-within` styles on their wrapping container to provide keyboard focus feedback, and hidden/styled inputs still require an explicit `aria-label` for screen reader accessibility.
**Action:** Apply `focus-within:ring-1` (with appropriate theme colors) to the parent `div` or `form` wrapping custom inputs, and add `aria-label` attribute to the `<input>` element directly.
