/**
 * dp.js — 0/1 Knapsack using Dynamic Programming
 * Complexity: O(n × W)
 */
function solveDP(items, capacity) {
  const t0 = performance.now();
  const n = items.length;
  const W = capacity;
  const steps = [];

  // Build DP table: dp[i][w] = max value using items 0..i-1 with capacity w
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  steps.push(`Initialize DP table of size (${n + 1}) × (${W + 1}) with zeros.`);

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= W; w++) {
      if (item.weight <= w) {
        const include = item.value + dp[i - 1][w - item.weight];
        const exclude = dp[i - 1][w];
        if (include > exclude) {
          dp[i][w] = include;
        } else {
          dp[i][w] = exclude;
        }
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
    steps.push(`Row ${i} (${item.name}): for each capacity 0..${W}, decide include (v=${item.value}, w=${item.weight}) or exclude.`);
  }

  // Backtrack to find selected items
  const selectedItems = [];
  let w = W;
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push(items[i - 1]);
      w -= items[i - 1].weight;
      steps.push(`Backtrack: Include ${items[i - 1].name} (remaining capacity ${w}).`);
    } else {
      steps.push(`Backtrack: Exclude ${items[i - 1].name}.`);
    }
  }

  const t1 = performance.now();

  return {
    algorithm: 'Dynamic Programming',
    type: '0/1 Knapsack',
    totalValue: dp[n][W],
    selectedItems: selectedItems.reverse(),
    dpTable: dp,
    items,
    capacity: W,
    steps,
    time: t1 - t0,
    complexity: `O(n × W) = O(${n} × ${W})`
  };
}
