## 2024-03-05 - Initial Palette Setup
**Learning:** Accessibility attributes like aria-label are missing on many icon buttons and inputs.
**Action:** Will add aria-labels to improve accessibility.

## 2024-03-05 - Terminal/CLI Input Accessibility
**Learning:** For custom CLI-like or terminal inputs in the UI, complete removal of focus indicators makes them inaccessible. A `focus-within:ring-1` on the parent container (which wraps the decorative `>_` and the hidden/transparent input) is required to show a focus state without breaking the design.
**Action:** Apply `focus-within:ring-1` to the parent container wrapping the input and ensure the hidden input has an appropriate `aria-label` for screen readers. Add `aria-hidden="true"` to decorative symbols.