# Palette Journal

## 2026-03-05 - Semantic Form Wrappers for Search Inputs
**Learning:** Using `<div>` wrappers with custom `onClick` button handlers for search/analysis inputs forces users to use the mouse and breaks native "Enter" key submission, which is poor for keyboard accessibility and power users.
**Action:** Always wrap search/action inputs and their corresponding submission buttons in a `<form onSubmit={...}>` tag. Ensure the button is `type="submit"`. This provides native, zero-configuration support for Enter-key submission and improves semantic HTML accessibility. Add `aria-label` to the input field if a visible label is not present.
