## 2024-03-05 - Consolidate Multiple `useMemo` Array Traversals

**Learning:** When aggregating multiple metrics (e.g., cost, clicks, conversions) from the same large array of data in React components, using a separate `useMemo` with `reduce` for each metric results in multiple O(n) passes over the array. This creates a hidden performance bottleneck O(m*n), where `m` is the number of metrics.

**Action:** Consolidate these multiple passes into a single `useMemo` that iterates over the data array exactly once using a simple `for...of` loop, and returns an object containing all the computed metrics. This transforms the operation from O(m*n) to a strict O(n).
