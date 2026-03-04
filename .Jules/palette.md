# Palette's Journal

## 2024-05-14 - Redundant ARIA Labels
**Learning:** Adding `aria-label` to buttons that already contain descriptive, visible text (like "Sincronizar Dados") is an anti-pattern. It overrides the visible text for screen readers without adding new value.
**Action:** Reserve `aria-label` exclusively for icon-only buttons or ambiguous text. For buttons with visible text, focus on enhancing interaction states (disabled, loading) and hiding decorative icons with `aria-hidden="true"`.