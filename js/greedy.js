/**
 * greedy.js — Fractional Knapsack using Greedy Algorithm
 * Complexity: O(n log n)
 */
function solveGreedy(items, capacity) {
  const t0 = performance.now();
  const steps = [];

  // 1. Compute ratios and sort descending
  const sorted = items.map(it => ({
    ...it,
    ratio: it.value / it.weight
  })).sort((a, b) => b.ratio - a.ratio);

  steps.push('Compute value/weight ratio for each item and sort descending.');

  let remaining = capacity;
  let totalValue = 0;
  const selections = []; // { item, fraction, valueTaken }

  // 2. Greedy selection
  for (const item of sorted) {
    if (remaining <= 0) break;

    if (item.weight <= remaining) {
      // Take entire item
      selections.push({ item, fraction: 1, valueTaken: item.value });
      totalValue += item.value;
      remaining -= item.weight;
      steps.push(`Take 100% of ${item.name} (w=${item.weight}, v=${item.value}, ratio=${item.ratio.toFixed(2)}). Remaining capacity: ${remaining}`);
    } else {
      // Take fraction
      const frac = remaining / item.weight;
      const valTaken = item.value * frac;
      selections.push({ item, fraction: frac, valueTaken: valTaken });
      totalValue += valTaken;
      steps.push(`Take ${(frac * 100).toFixed(1)}% of ${item.name} (w=${item.weight}, v=${item.value}, ratio=${item.ratio.toFixed(2)}). Value taken: ${valTaken.toFixed(2)}. Bag is now full.`);
      remaining = 0;
    }
  }

  // Items not taken
  const selectedNames = new Set(selections.map(s => s.item.name));
  for (const item of sorted) {
    if (!selectedNames.has(item.name)) {
      steps.push(`Skip ${item.name} — no capacity left.`);
    }
  }

  const t1 = performance.now();

  return {
    algorithm: 'Greedy',
    type: 'Fractional Knapsack',
    totalValue: Math.round(totalValue * 100) / 100,
    selections,
    sortedItems: sorted,
    steps,
    time: t1 - t0,
    complexity: 'O(n log n)'
  };
}
