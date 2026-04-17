/**
 * branchbound.js — 0/1 Knapsack using Branch and Bound
 * Worst case: O(2^n), practical improvement via pruning
 */
function solveBranchBound(items, capacity) {
  const t0 = performance.now();
  const steps = [];
  const n = items.length;

  // Sort items by value/weight ratio descending for tighter bounds
  const sorted = items.map((it, idx) => ({ ...it, origIdx: idx, ratio: it.value / it.weight }))
    .sort((a, b) => b.ratio - a.ratio);

  steps.push('Sort items by value/weight ratio descending for tighter bounds.');

  // Compute upper bound using fractional knapsack relaxation
  function computeBound(level, profit, weight) {
    if (weight > capacity) return 0;
    let bound = profit;
    let rem = capacity - weight;
    for (let j = level; j < n; j++) {
      if (sorted[j].weight <= rem) {
        bound += sorted[j].value;
        rem -= sorted[j].weight;
      } else {
        bound += sorted[j].ratio * rem;
        break;
      }
    }
    return bound;
  }

  // Node structure for tree visualization
  let nodeId = 0;
  const treeNodes = [];

  // BFS with priority queue (max-bound first)
  let maxProfit = 0;
  let bestSelection = [];

  // Queue entries: { level, profit, weight, bound, selection, id, parentId }
  const root = {
    level: 0, profit: 0, weight: 0,
    bound: computeBound(0, 0, 0),
    selection: [], id: nodeId++, parentId: -1
  };

  treeNodes.push({
    id: root.id, parentId: -1, level: 0,
    label: 'Root', profit: 0, weight: 0,
    bound: root.bound.toFixed(1), status: 'live'
  });

  steps.push(`Root node: profit=0, weight=0, bound=${root.bound.toFixed(1)}.`);

  const queue = [root];
  let explored = 0;
  let pruned = 0;

  while (queue.length > 0) {
    // Pick node with highest bound
    queue.sort((a, b) => b.bound - a.bound);
    const node = queue.shift();

    if (node.level >= n) continue;

    const item = sorted[node.level];
    explored++;

    // Include child
    const inclWeight = node.weight + item.weight;
    const inclProfit = node.profit + item.value;
    const inclId = nodeId++;
    const inclSel = [...node.selection, item.name];

    if (inclWeight <= capacity) {
      const inclBound = computeBound(node.level + 1, inclProfit, inclWeight);

      if (inclProfit > maxProfit) {
        maxProfit = inclProfit;
        bestSelection = inclSel;
      }

      let inclStatus = 'live';
      if (inclBound > maxProfit) {
        queue.push({
          level: node.level + 1, profit: inclProfit, weight: inclWeight,
          bound: inclBound, selection: inclSel, id: inclId, parentId: node.id
        });
        steps.push(`Include ${item.name}: profit=${inclProfit}, weight=${inclWeight}, bound=${inclBound.toFixed(1)} → explore.`);
      } else {
        inclStatus = 'dead';
        steps.push(`Include ${item.name}: profit=${inclProfit}, weight=${inclWeight}, bound=${inclBound.toFixed(1)} → no better, dead.`);
      }

      treeNodes.push({
        id: inclId, parentId: node.id, level: node.level + 1,
        label: `+${item.name}`, profit: inclProfit, weight: inclWeight,
        bound: inclBound.toFixed(1), status: inclProfit === maxProfit && inclStatus !== 'dead' ? 'solution' : inclStatus
      });
    } else {
      // Over capacity — pruned
      pruned++;
      treeNodes.push({
        id: inclId, parentId: node.id, level: node.level + 1,
        label: `+${item.name}`, profit: inclProfit, weight: inclWeight,
        bound: '—', status: 'pruned'
      });
      steps.push(`Include ${item.name}: weight ${inclWeight} > capacity ${capacity} → PRUNED.`);
    }

    // Exclude child
    const exclId = nodeId++;
    const exclBound = computeBound(node.level + 1, node.profit, node.weight);
    let exclStatus = 'live';

    if (exclBound > maxProfit) {
      queue.push({
        level: node.level + 1, profit: node.profit, weight: node.weight,
        bound: exclBound, selection: [...node.selection], id: exclId, parentId: node.id
      });
      steps.push(`Exclude ${item.name}: profit=${node.profit}, bound=${exclBound.toFixed(1)} → explore.`);
    } else {
      exclStatus = 'pruned';
      pruned++;
      steps.push(`Exclude ${item.name}: bound=${exclBound.toFixed(1)} ≤ maxProfit=${maxProfit} → PRUNED.`);
    }

    treeNodes.push({
      id: exclId, parentId: node.id, level: node.level + 1,
      label: `−${item.name}`, profit: node.profit, weight: node.weight,
      bound: exclBound.toFixed(1), status: exclStatus
    });
  }

  // Mark best solution path
  const bestNames = new Set(bestSelection);
  const selectedItems = sorted.filter(it => bestNames.has(it.name));

  // Mark solution nodes
  treeNodes.forEach(nd => {
    if (nd.profit === maxProfit && nd.status === 'live' && nd.weight <= capacity) {
      nd.status = 'solution';
    }
  });

  const t1 = performance.now();

  return {
    algorithm: 'Branch & Bound',
    type: '0/1 Knapsack',
    totalValue: maxProfit,
    selectedItems,
    treeNodes,
    steps,
    explored,
    pruned,
    time: t1 - t0,
    complexity: 'O(2ⁿ) worst case'
  };
}
