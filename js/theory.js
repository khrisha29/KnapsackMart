/**
 * theory.js — Renders the Theory & Report section
 */
function renderTheorySection() {
  const el = document.getElementById('theory-content');
  el.innerHTML = `
  <div class="theory-carousel-wrapper">
    <button class="carousel-btn prev" id="theory-prev" aria-label="Previous">←</button>
    
    <div class="theory-carousel">
      <div class="theory-track" id="theory-track">
        
        <!-- Problem Definition -->
        <div class="theory-card carousel-item">
          <h2>1. Problem Definition</h2>
          <p>The <strong>Knapsack Problem</strong> is a classical optimization problem in computer science and combinatorics. Given a set of items, each with a weight and a value, the objective is to determine the most valuable subset of items that fits within a weight capacity constraint.</p>
          <div class="math">
            Maximize: Z = Σ P<sub>i</sub>X<sub>i</sub><br>
            Subject to: Σ W<sub>i</sub>X<sub>i</sub> ≤ Capacity
          </div>
          <p>Where P<sub>i</sub> is the profit (value) of item i, W<sub>i</sub> is the weight, and X<sub>i</sub> is the decision variable (0 or 1 for 0/1 knapsack, 0 ≤ X<sub>i</sub> ≤ 1 for fractional).</p>
          <h3>Variants</h3>
          <ul>
            <li><strong>Fractional Knapsack:</strong> Items can be partially included (X<sub>i</sub> ∈ [0,1])</li>
            <li><strong>0/1 Knapsack:</strong> Items are either fully included or excluded (X<sub>i</sub> ∈ {0,1})</li>
          </ul>
        </div>

        <!-- Greedy Algorithm -->
        <div class="theory-card carousel-item">
          <h2>2. Greedy Algorithm — Fractional Knapsack</h2>
          <h3>Concept</h3>
          <p>The greedy approach makes locally optimal choices at each step. By sorting items by their value-to-weight ratio and greedily selecting the best ratio items first, we can obtain the optimal solution for the <em>fractional</em> variant.</p>
          <h3>Steps</h3>
          <ol>
            <li>Calculate value/weight ratio for each item</li>
            <li>Sort items in decreasing order of ratio</li>
            <li>For each item (in sorted order):
              <ul>
                <li>If the item fits entirely, include it</li>
                <li>If not, include the fractional part that fits</li>
              </ul>
            </li>
          </ol>
          <h3>Pseudocode</h3>
          <pre>FRACTIONAL-KNAPSACK(items, capacity):
    for each item in items:
        item.ratio = item.value / item.weight
    sort items by ratio descending
    totalValue = 0
    remaining = capacity
    for each item in sorted items:
        if item.weight ≤ remaining:
            take entire item
            remaining -= item.weight
            totalValue += item.value
        else:
            fraction = remaining / item.weight
            totalValue += item.value × fraction
            remaining = 0
            break
    return totalValue</pre>
          <h3>Example</h3>
          <p>Items: Milk(w=2,v=40), Bread(w=3,v=50), Eggs(w=5,v=100), Fruits(w=4,v=60). Capacity=6.</p>
          <p>Ratios: Eggs=20, Milk=20, Bread=16.67, Fruits=15. After sorting: Eggs(20), Milk(20), Bread(16.67), Fruits(15).</p>
          <p>Take Eggs (w=5, remaining=1). Take 50% of Milk (w=2×0.5=1, v=20). Total = 100+20 = <strong>120</strong>.</p>
          <h3>Complexity</h3>
          <p><code>O(n log n)</code> — dominated by the sorting step.</p>
        </div>

        <!-- Dynamic Programming -->
        <div class="theory-card carousel-item">
          <h2>3. Dynamic Programming — 0/1 Knapsack</h2>
          <h3>Concept</h3>
          <p>DP builds optimal solutions to sub-problems bottom-up. For the 0/1 knapsack, we create a 2D table where <code>dp[i][w]</code> represents the maximum value achievable using the first i items with capacity w.</p>
          <h3>Optimal Substructure</h3>
          <div class="math">
            dp[i][w] = max(dp[i-1][w], v<sub>i</sub> + dp[i-1][w - w<sub>i</sub>])
          </div>
          <p>At each cell, we decide: exclude item i (take the value from the row above) or include it (add its value to the best solution with reduced capacity).</p>
          <h3>Steps</h3>
          <ol>
            <li>Create a table of size (n+1) × (W+1), initialized to 0</li>
            <li>For each item i from 1 to n:
              <ul>
                <li>For each capacity w from 0 to W:</li>
                <li>If w<sub>i</sub> ≤ w: dp[i][w] = max(dp[i-1][w], v<sub>i</sub> + dp[i-1][w - w<sub>i</sub>])</li>
                <li>Else: dp[i][w] = dp[i-1][w]</li>
              </ul>
            </li>
            <li>Backtrack from dp[n][W] to find selected items</li>
          </ol>
          <h3>Pseudocode</h3>
          <pre>DP-KNAPSACK(items, W):
    n = length(items)
    dp[0..n][0..W] = 0
    for i = 1 to n:
        for w = 0 to W:
            if items[i].weight ≤ w:
                dp[i][w] = max(dp[i-1][w],
                    items[i].value + dp[i-1][w - items[i].weight])
            else:
                dp[i][w] = dp[i-1][w]
    // Backtrack
    selected = []
    w = W
    for i = n downto 1:
        if dp[i][w] ≠ dp[i-1][w]:
            selected.add(items[i])
            w -= items[i].weight
    return dp[n][W], selected</pre>
          <h3>Example</h3>
          <p>Items: Milk(2,40), Bread(3,50), Eggs(5,100), Fruits(4,60). Capacity=6.</p>
          <p>The DP table is filled row by row. The optimal value dp[4][6] = <strong>100</strong> (Eggs + Cheese or best combination).</p>
          <h3>Complexity</h3>
          <p><code>O(n × W)</code> — pseudo-polynomial. Space: O(n × W).</p>
        </div>

        <!-- Branch and Bound -->
        <div class="theory-card carousel-item">
          <h2>4. Branch &amp; Bound — 0/1 Knapsack</h2>
          <h3>Concept</h3>
          <p>Branch and Bound explores a state-space tree of all possible item inclusion/exclusion decisions. It uses a <strong>bounding function</strong> to prune branches that cannot yield better solutions than the current best, dramatically reducing the search space.</p>
          <h3>Bounding Function</h3>
          <p>The upper bound at any node is computed using the <em>fractional knapsack relaxation</em>: greedily fill remaining capacity using fractional items (sorted by ratio). If this bound ≤ current best profit, the branch is pruned.</p>
          <h3>Steps</h3>
          <ol>
            <li>Sort items by value/weight ratio descending</li>
            <li>Initialize best profit = 0, create root node</li>
            <li>Use a priority queue (max-bound first):
              <ul>
                <li>For each node, generate two children: include/exclude next item</li>
                <li>Compute bound for each child</li>
                <li>If bound > best profit, add to queue (explore later)</li>
                <li>If bound ≤ best profit, prune the node</li>
                <li>Update best profit when a feasible solution is found</li>
              </ul>
            </li>
          </ol>
          <h3>Pseudocode</h3>
          <pre>BRANCH-AND-BOUND(items, W):
    sort items by value/weight ratio desc
    bestProfit = 0
    queue = [root(level=0, profit=0, weight=0)]
    while queue not empty:
        node = queue.dequeue(max bound)
        if node.level == n: continue
        item = items[node.level]
        // Include child
        child1 = (profit + item.value, weight + item.weight)
        if child1.weight ≤ W:
            bestProfit = max(bestProfit, child1.profit)
            if bound(child1) > bestProfit:
                queue.enqueue(child1)
        // Exclude child
        child2 = (profit, weight)
        if bound(child2) > bestProfit:
            queue.enqueue(child2)
    return bestProfit</pre>
          <h3>Node States</h3>
          <ul>
            <li><strong style="color:var(--blue)">Live nodes:</strong> Still in the queue, may be explored</li>
            <li><strong style="color:var(--green)">Solution nodes:</strong> Part of the optimal path</li>
            <li><strong style="color:var(--red)">Pruned nodes:</strong> Bound ≤ best, eliminated</li>
            <li><strong style="color:var(--text-dim)">Dead nodes:</strong> Fully explored, no children added</li>
          </ul>
          <h3>Complexity</h3>
          <p>Worst case: <code>O(2<sup>n</sup>)</code>. Practical performance is significantly better due to pruning. The tighter the bound function, the more nodes are pruned.</p>
        </div>

        <!-- Complexity Analysis -->
        <div class="theory-card carousel-item">
          <h2>5. Complexity Analysis</h2>
          <table class="diff-table">
            <thead><tr><th>Algorithm</th><th>Time Complexity</th><th>Space Complexity</th><th>Guarantee</th></tr></thead>
            <tbody>
              <tr><td>Greedy (Fractional)</td><td>O(n log n)</td><td>O(n)</td><td>Optimal for fractional</td></tr>
              <tr><td>Dynamic Programming (0/1)</td><td>O(n × W)</td><td>O(n × W)</td><td>Optimal (pseudo-polynomial)</td></tr>
              <tr><td>Branch &amp; Bound (0/1)</td><td>O(2<sup>n</sup>) worst</td><td>O(2<sup>n</sup>) worst</td><td>Optimal with pruning</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Key Differences -->
        <div class="theory-card carousel-item">
          <h2>6. Key Differences</h2>
          <table class="diff-table">
            <thead><tr><th>Aspect</th><th>Greedy</th><th>Dynamic Programming</th><th>Branch &amp; Bound</th></tr></thead>
            <tbody>
              <tr><td>Problem Type</td><td>Fractional Knapsack</td><td>0/1 Knapsack</td><td>0/1 Knapsack</td></tr>
              <tr><td>Selection</td><td>Partial items allowed</td><td>Whole items only</td><td>Whole items only</td></tr>
              <tr><td>Optimality</td><td>Optimal (fractional)</td><td>Optimal (0/1)</td><td>Optimal (0/1)</td></tr>
              <tr><td>Approach</td><td>Greedy choice</td><td>Bottom-up tabulation</td><td>Tree search + pruning</td></tr>
              <tr><td>Speed</td><td>Fastest</td><td>Moderate</td><td>Variable (depends on pruning)</td></tr>
              <tr><td>When to Use</td><td>Items are divisible</td><td>Small n and W</td><td>Large W, moderate n</td></tr>
              <tr><td>Greedy works for 0/1?</td><td colspan="3">No — greedy does NOT guarantee optimal for 0/1 knapsack. It may miss better combinations.</td></tr>
            </tbody>
          </table>
          <h3>Fractional vs 0/1</h3>
          <p>In the fractional variant, items can be "cut" — like pouring half a bottle of milk. The greedy approach (highest ratio first) is provably optimal here. In 0/1, items must be taken whole — greedy can fail because a high-ratio item might waste capacity that could be better used by a combination of other items.</p>
          <h3>Speed vs Accuracy Trade-off</h3>
          <p>Greedy is the fastest but solves a different (easier) problem. DP guarantees optimality for 0/1 but uses O(nW) space/time. B&amp;B also guarantees optimality for 0/1 and can be faster than DP when pruning is effective (large W), but has exponential worst case.</p>
        </div>

      </div>
    </div>
    
    <button class="carousel-btn next" id="theory-next" aria-label="Next">→</button>
    <div class="carousel-indicators" id="theory-indicators"></div>
  </div>`;
  
  // Initialize carousel logic after rendering
  if (typeof initTheoryCarousel === 'function') {
    setTimeout(initTheoryCarousel, 0);
  }
}

function initTheoryCarousel() {
  const track = document.getElementById('theory-track');
  if (!track) return;
  const items = Array.from(track.querySelectorAll('.carousel-item'));
  const btnPrev = document.getElementById('theory-prev');
  const btnNext = document.getElementById('theory-next');
  const indicatorsContainer = document.getElementById('theory-indicators');
  
  if (!items.length) return;

  let currentIndex = 0;

  // Create indicators
  indicatorsContainer.innerHTML = '';
  items.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
    indicatorsContainer.appendChild(dot);
  });
  const dots = Array.from(indicatorsContainer.querySelectorAll('.carousel-dot'));

  function updateCarousel() {
    items.forEach((item, index) => {
      item.className = 'theory-card carousel-item'; // Reset classes
      if (index === currentIndex) {
        item.classList.add('active');
      } else if (index === currentIndex - 1) {
        item.classList.add('prev');
      } else if (index === currentIndex + 1) {
        item.classList.add('next');
      } else if (index < currentIndex - 1) {
        item.classList.add('hidden-left');
      } else if (index > currentIndex + 1) {
        item.classList.add('hidden-right');
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  btnNext.addEventListener('click', () => {
    if (currentIndex < items.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Handle clicking on side items to navigate
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (item.classList.contains('prev') || item.classList.contains('next')) {
        currentIndex = index;
        updateCarousel();
      }
    });
  });

  // Handle keyboard navigation when theory page is active
  document.addEventListener('keydown', (e) => {
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page-theory') {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      } else if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
        currentIndex++;
        updateCarousel();
      }
    }
  });

  // Initial update
  updateCarousel();
}
