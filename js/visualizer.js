/**
 * visualizer.js — Renders algorithm results into the DOM
 */

/* ═══════════ GREEDY RESULT ═══════════ */
function renderGreedyResult(result) {
  const container = document.getElementById('results-container');
  const panel = document.createElement('div');
  panel.className = 'result-panel';
  panel.innerHTML = `
    <h3>🟢 Greedy Algorithm <span class="tag tag-greedy">Fractional Knapsack</span>
      <span class="complexity-badge">${result.complexity}</span></h3>
    <div class="summary-box">
      <div class="summary-stat"><div class="stat-val">${result.totalValue}</div><div class="stat-label">Max Value</div></div>
      <div class="summary-stat"><div class="stat-val">${result.selections.length}</div><div class="stat-label">Items Taken</div></div>
      <div class="summary-stat"><div class="stat-val">${result.time.toFixed(3)} ms</div><div class="stat-label">Time</div></div>
      <div class="summary-stat"><div class="stat-val">Approx</div><div class="stat-label">Type</div></div>
    </div>
    <table class="algo-table">
      <thead><tr><th>Item</th><th>Weight</th><th>Value</th><th>Ratio (V/W)</th><th>Selected Fraction</th></tr></thead>
      <tbody>${result.sortedItems.map(it => {
        const sel = result.selections.find(s => s.item.id === it.id);
        const frac = sel ? sel.fraction : 0;
        const cls = frac === 1 ? 'row-selected' : frac > 0 ? 'row-processing' : '';
        return `<tr class="${cls}">
          <td>${it.emoji} ${it.name}</td><td>${it.weight}</td><td>${it.value}</td>
          <td>${it.ratio.toFixed(2)}</td>
          <td>${frac > 0 ? (frac * 100).toFixed(1) + '%' : '—'}</td></tr>`;
      }).join('')}</tbody>
    </table>
    <div class="steps-panel"><h4>📝 Step-by-Step Explanation</h4>
      ${result.steps.map((s, i) => `<div class="step-line${s.includes('Take') ? ' step-include' : s.includes('Skip') ? ' step-exclude' : ''}">
        <span class="step-num">${i + 1}.</span><span>${s}</span></div>`).join('')}
      <div class="step-line" style="margin-top:.5rem;color:var(--yellow)">
        <span class="step-num">ℹ</span><span>Fractional selection is allowed because items are divisible (like liquids, grains). This is the key difference from 0/1 Knapsack.</span>
      </div>
    </div>`;
  container.prepend(panel);
}

/* ═══════════ DP RESULT ═══════════ */
function renderDPResult(result) {
  const container = document.getElementById('results-container');
  const panel = document.createElement('div');
  panel.className = 'result-panel';

  const { dpTable, items, capacity, selectedItems } = result;
  const selSet = new Set(selectedItems.map(i => i.id));

  // Build DP table HTML
  let headerRow = '<th>Item \\ Cap</th>';
  for (let w = 0; w <= capacity; w++) headerRow += `<th>${w}</th>`;

  let bodyRows = '';
  for (let i = 0; i <= items.length; i++) {
    const label = i === 0 ? '∅ (none)' : `${items[i - 1].emoji} ${items[i - 1].name}`;
    let cells = `<td class="dp-row-header">${label}</td>`;
    for (let w = 0; w <= capacity; w++) {
      const isSelected = i === items.length && w === capacity ? 'dp-selected' :
        (dpTable[i][w] !== (i > 0 ? dpTable[i - 1][w] : 0) && i > 0) ? 'dp-highlight' : '';
      cells += `<td class="${isSelected}">${dpTable[i][w]}</td>`;
    }
    bodyRows += `<tr>${cells}</tr>`;
  }

  panel.innerHTML = `
    <h3>🔵 Dynamic Programming <span class="tag tag-dp">0/1 Knapsack</span>
      <span class="complexity-badge">${result.complexity}</span></h3>
    <div class="summary-box">
      <div class="summary-stat"><div class="stat-val">${result.totalValue}</div><div class="stat-label">Max Value</div></div>
      <div class="summary-stat"><div class="stat-val">${selectedItems.length}</div><div class="stat-label">Items Selected</div></div>
      <div class="summary-stat"><div class="stat-val">${result.time.toFixed(3)} ms</div><div class="stat-label">Time</div></div>
      <div class="summary-stat"><div class="stat-val">Optimal</div><div class="stat-label">Type</div></div>
    </div>
    <h4 style="font-size:.88rem;margin-bottom:.3rem">DP Table</h4>
    <div class="dp-table-wrap">
      <table class="dp-table"><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>
    </div>
    <table class="algo-table" style="margin-top:1rem">
      <thead><tr><th>Item</th><th>Weight</th><th>Value</th><th>Selected?</th></tr></thead>
      <tbody>${items.map(it => {
        const isSel = selSet.has(it.id);
        return `<tr class="${isSel ? 'row-selected' : ''}">
          <td>${it.emoji} ${it.name}</td><td>${it.weight}</td><td>${it.value}</td>
          <td>${isSel ? '✓ Yes' : '✗ No'}</td></tr>`;
      }).join('')}</tbody>
    </table>
    <div class="steps-panel"><h4>📝 Step-by-Step Explanation</h4>
      ${result.steps.map((s, i) => {
        const cls = s.includes('Include') ? ' step-include' : s.includes('Exclude') ? ' step-exclude' : '';
        return `<div class="step-line${cls}"><span class="step-num">${i + 1}.</span><span>${s}</span></div>`;
      }).join('')}
      <div class="step-line" style="margin-top:.5rem;color:var(--yellow)">
        <span class="step-num">ℹ</span><span>Optimal substructure: dp[i][w] = max(exclude=dp[i-1][w], include=v_i + dp[i-1][w-w_i]). Each cell represents the best value achievable with the first i items and capacity w.</span>
      </div>
    </div>`;
  container.prepend(panel);
}

/* ═══════════ BRANCH & BOUND RESULT ═══════════ */
function renderBBResult(result) {
  const container = document.getElementById('results-container');
  const panel = document.createElement('div');
  panel.className = 'result-panel';

  // Build tree SVG
  const treeSvg = buildTreeSVG(result.treeNodes);

  // Node table
  const nodeTableRows = result.treeNodes.map(nd => {
    const cls = nd.status === 'solution' ? 'row-selected' :
      nd.status === 'pruned' ? 'row-pruned' :
      nd.status === 'dead' ? 'row-pruned' : '';
    const statusLabel = nd.status === 'solution' ? '✓ Solution' :
      nd.status === 'pruned' ? '✂ Pruned' :
      nd.status === 'dead' ? '💀 Dead' : '🔵 Live';
    return `<tr class="${cls}"><td>${nd.label}</td><td>${nd.profit}</td><td>${nd.weight}</td><td>${nd.bound}</td><td>${statusLabel}</td></tr>`;
  }).join('');

  panel.innerHTML = `
    <h3>🔴 Branch &amp; Bound <span class="tag tag-bb">0/1 Knapsack</span>
      <span class="complexity-badge">${result.complexity}</span></h3>
    <div class="summary-box">
      <div class="summary-stat"><div class="stat-val">${result.totalValue}</div><div class="stat-label">Max Value</div></div>
      <div class="summary-stat"><div class="stat-val">${result.selectedItems.length}</div><div class="stat-label">Items Selected</div></div>
      <div class="summary-stat"><div class="stat-val">${result.time.toFixed(3)} ms</div><div class="stat-label">Time</div></div>
      <div class="summary-stat"><div class="stat-val">${result.pruned}</div><div class="stat-label">Pruned Nodes</div></div>
    </div>
    <h4 style="font-size:.88rem;margin-bottom:.3rem">State Space Tree</h4>
    <div class="tree-container">${treeSvg}</div>
    <table class="algo-table" style="margin-top:1rem">
      <thead><tr><th>Node</th><th>Profit</th><th>Weight</th><th>Bound</th><th>Status</th></tr></thead>
      <tbody>${nodeTableRows}</tbody>
    </table>
    <div class="steps-panel"><h4>📝 Step-by-Step Explanation</h4>
      ${result.steps.map((s, i) => {
        const cls = s.includes('PRUNED') ? ' step-prune' : s.includes('Include') ? ' step-include' : s.includes('Exclude') ? ' step-exclude' : '';
        return `<div class="step-line${cls}"><span class="step-num">${i + 1}.</span><span>${s}</span></div>`;
      }).join('')}
      <div class="step-line" style="margin-top:.5rem;color:var(--yellow)">
        <span class="step-num">ℹ</span><span>Bounding: We compute an upper bound using fractional relaxation. If a node's bound ≤ current best, it cannot lead to a better solution, so we prune it.</span>
      </div>
    </div>`;
  container.prepend(panel);
}

/* ═══════════ TREE SVG BUILDER ═══════════ */
function buildTreeSVG(nodes) {
  if (!nodes.length) return '<p style="color:var(--text-dim)">No tree data.</p>';

  // Compute layout
  const levels = {};
  nodes.forEach(nd => {
    if (!levels[nd.level]) levels[nd.level] = [];
    levels[nd.level].push(nd);
  });

  const maxLevel = Math.max(...Object.keys(levels).map(Number));
  const nodeW = 90, nodeH = 52, gapX = 16, gapY = 70;
  const maxNodesInLevel = Math.max(...Object.values(levels).map(l => l.length));
  const svgW = Math.max(600, maxNodesInLevel * (nodeW + gapX));
  const svgH = (maxLevel + 1) * (nodeH + gapY) + 40;

  // Assign positions
  const posMap = {};
  for (let lv = 0; lv <= maxLevel; lv++) {
    const arr = levels[lv] || [];
    const totalW = arr.length * nodeW + (arr.length - 1) * gapX;
    const startX = (svgW - totalW) / 2;
    arr.forEach((nd, idx) => {
      posMap[nd.id] = {
        x: startX + idx * (nodeW + gapX) + nodeW / 2,
        y: 20 + lv * (nodeH + gapY) + nodeH / 2
      };
    });
  }

  // Draw edges
  let edgesHTML = '';
  nodes.forEach(nd => {
    if (nd.parentId >= 0 && posMap[nd.parentId] && posMap[nd.id]) {
      const p = posMap[nd.parentId];
      const c = posMap[nd.id];
      edgesHTML += `<line x1="${p.x}" y1="${p.y + nodeH / 2}" x2="${c.x}" y2="${c.y - nodeH / 2}" />`;
    }
  });

  // Draw nodes
  let nodesHTML = '';
  nodes.forEach(nd => {
    const pos = posMap[nd.id];
    if (!pos) return;
    const cls = nd.status === 'solution' ? 'node-solution' :
      nd.status === 'pruned' ? 'node-pruned' :
      nd.status === 'dead' ? 'node-dead' : 'node-live';
    nodesHTML += `<rect class="${cls}" x="${pos.x - nodeW / 2}" y="${pos.y - nodeH / 2}" width="${nodeW}" height="${nodeH}" rx="8" />`;
    nodesHTML += `<text x="${pos.x}" y="${pos.y - 8}" text-anchor="middle" font-weight="600" font-size="10">${nd.label}</text>`;
    nodesHTML += `<text x="${pos.x}" y="${pos.y + 6}" text-anchor="middle" font-size="9" fill="var(--text-dim)">P=${nd.profit} W=${nd.weight}</text>`;
    nodesHTML += `<text x="${pos.x}" y="${pos.y + 18}" text-anchor="middle" font-size="8" fill="var(--text-dim)">B=${nd.bound}</text>`;
  });

  return `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">${edgesHTML}${nodesHTML}</svg>`;
}

/* ═══════════ COMPARISON DASHBOARD ═══════════ */
function renderComparison(greedyR, dpR, bbR) {
  const container = document.getElementById('results-container');
  container.innerHTML = ''; // clear

  const panel = document.createElement('div');
  panel.className = 'result-panel';

  const maxVal = Math.max(greedyR.totalValue, dpR.totalValue, bbR.totalValue);
  const maxTime = Math.max(greedyR.time, dpR.time, bbR.time) || 1;

  const greedyItemsStr = greedyR.selections.map(s =>
    `${s.item.name}${s.fraction < 1 ? ` (${(s.fraction * 100).toFixed(0)}%)` : ''}`
  ).join(', ');
  const dpItemsStr = dpR.selectedItems.map(i => i.name).join(', ');
  const bbItemsStr = bbR.selectedItems.map(i => i.name).join(', ');

  panel.innerHTML = `
    <h3>📊 Comparison Dashboard <span class="tag tag-compare">All Algorithms</span></h3>
    <table class="algo-table">
      <thead><tr><th>Algorithm</th><th>Max Value</th><th>Time (ms)</th><th>Items Selected</th><th>Type</th><th>Optimality</th></tr></thead>
      <tbody>
        <tr class="row-selected"><td>🟢 Greedy</td><td>${greedyR.totalValue}</td><td>${greedyR.time.toFixed(3)}</td><td>${greedyItemsStr}</td><td>Fractional</td><td>Approximate</td></tr>
        <tr class="row-processing"><td>🔵 DP</td><td>${dpR.totalValue}</td><td>${dpR.time.toFixed(3)}</td><td>${dpItemsStr}</td><td>0/1 (Exact)</td><td>Optimal</td></tr>
        <tr><td>🔴 B&amp;B</td><td>${bbR.totalValue}</td><td>${bbR.time.toFixed(3)}</td><td>${bbItemsStr}</td><td>0/1 (Exact)</td><td>Optimized</td></tr>
      </tbody>
    </table>
    <h4 style="font-size:.88rem;margin:1rem 0 .3rem">📈 Value Comparison</h4>
    <div class="bar-chart">
      <div class="bar-row"><span class="bar-label">Greedy</span><div class="bar-track"><div class="bar-fill bar-greedy" style="width:${(greedyR.totalValue / maxVal * 100).toFixed(1)}%">${greedyR.totalValue}</div></div></div>
      <div class="bar-row"><span class="bar-label">DP</span><div class="bar-track"><div class="bar-fill bar-dp" style="width:${(dpR.totalValue / maxVal * 100).toFixed(1)}%">${dpR.totalValue}</div></div></div>
      <div class="bar-row"><span class="bar-label">B&amp;B</span><div class="bar-track"><div class="bar-fill bar-bb" style="width:${(bbR.totalValue / maxVal * 100).toFixed(1)}%">${bbR.totalValue}</div></div></div>
    </div>
    <h4 style="font-size:.88rem;margin:1rem 0 .3rem">⏱ Execution Time Comparison</h4>
    <div class="bar-chart">
      <div class="bar-row"><span class="bar-label">Greedy</span><div class="bar-track"><div class="bar-fill bar-greedy" style="width:${(greedyR.time / maxTime * 100).toFixed(1)}%">${greedyR.time.toFixed(3)} ms</div></div></div>
      <div class="bar-row"><span class="bar-label">DP</span><div class="bar-track"><div class="bar-fill bar-dp" style="width:${(dpR.time / maxTime * 100).toFixed(1)}%">${dpR.time.toFixed(3)} ms</div></div></div>
      <div class="bar-row"><span class="bar-label">B&amp;B</span><div class="bar-track"><div class="bar-fill bar-bb" style="width:${(bbR.time / maxTime * 100).toFixed(1)}%">${bbR.time.toFixed(3)} ms</div></div></div>
    </div>`;
  container.appendChild(panel);

  // Also render individual panels below
  renderGreedyResult(greedyR);
  renderDPResult(dpR);
  renderBBResult(bbR);
}
