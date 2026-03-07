## 2024-05-24 - Consolidate multiple array reducers into single-pass
**Learning:** Consolidate redundant array traversals (e.g., multiple `useMemo` reducers) into a single-pass loop within React components to optimize performance for large data visualizations.
**Action:** Always combine operations iterating over the same arrays or collections into a single loop or pass when the data is unchanged.