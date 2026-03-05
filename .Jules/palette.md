## 2026-03-05 - Custom CLI/Terminal Input Accessibility
**Learning:** Custom CLI-like or terminal inputs in the UI often lose their default focus indicators due to styling choices (like removing default borders and outlines). This significantly harms keyboard navigation accessibility.
**Action:** Always apply `focus-within:ring-1` (or similar focus indicators) to the parent container wrapping the input to clearly show when the terminal is active, and ensure the hidden/styled input has an appropriate `aria-label` for screen readers.
