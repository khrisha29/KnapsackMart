/**
 * app.js — Main application controller (multi-page SPA)
 */
(function () {
  'use strict';

  // ═══════════ DOM REFS ═══════════
  const grid          = document.getElementById('products-grid');
  const mapContainer  = document.getElementById('interactive-map-container');
  const cartList      = document.getElementById('cart-items-list');
  const cartTotals    = document.getElementById('cart-totals');
  const cartBadge     = document.getElementById('cart-badge');
  const resultsBox    = document.getElementById('results-container');
  const customForm    = document.getElementById('custom-item-form');
  const heroCta       = document.getElementById('hero-cta');
  const btnGreedy     = document.getElementById('btn-greedy');
  const btnDP         = document.getElementById('btn-dp');
  const btnBB         = document.getElementById('btn-bb');
  const btnCompare    = document.getElementById('btn-compare');

  let activeCategory = 'produce';

  // ═══════════ NAVIGATION ═══════════
  function goToPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
    const page = document.getElementById('page-' + name);
    if (page) { page.classList.add('active'); window.scrollTo({ top:0, behavior:'smooth' }); }
    const link = document.querySelector(`.nav-link[data-page="${name}"]`);
    if (link) link.classList.add('active');
    if (name === 'cart') renderCart();
  }

  document.querySelector('.nav-links').addEventListener('click', e => {
    const btn = e.target.closest('.nav-link');
    if (btn) goToPage(btn.dataset.page);
  });

  // Goto links within pages
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-goto]');
    if (btn) goToPage(btn.dataset.goto);
  });

  // Logo goes home
  document.getElementById('nav-logo').addEventListener('click', () => goToPage('shop'));
  heroCta.addEventListener('click', () => {
    document.querySelector('.shop-section').scrollIntoView({ behavior:'smooth' });
  });

  function getItemUnit(item) {
    if (item.category === 'beverages') return 'L';
    if (item.category === 'stationery') return '';
    if (item.category === 'dairy' && (item.name.toLowerCase().includes('milk') || item.name.toLowerCase().includes('yogurt'))) return 'L';
    if (['bakery', 'snacks', 'packaged', 'household'].includes(item.category)) return 'qty';
    return 'kg';
  }

  // ═══════════ PRODUCT GRID ═══════════
  function renderGrid() {
    const items = activeCategory === 'all'
      ? groceryItems
      : groceryItems.filter(i => i.category === activeCategory);

    grid.innerHTML = items.map(item => `
      <div class="product-card${selectedIds.has(item.id) ? ' in-cart' : ''}" data-id="${item.id}">
        <div class="pc-emoji">${item.emoji}</div>
        <div class="pc-name">${item.name}</div>
        <div class="pc-stats">
          <span class="pc-stat">⚖ ${item.weight} ${getItemUnit(item)}</span>
          <span class="pc-stat">★ ${item.value} val</span>
        </div>
        <div class="pc-ratio">Ratio: ${(item.value / item.weight).toFixed(1)}</div>
      </div>
    `).join('');

    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        if (selectedIds.has(id)) selectedIds.delete(id);
        else selectedIds.add(id);
        renderGrid();
        updateBadge();
        updateButtons();
      });
    });
  }

  // ═══════════ INTERACTIVE MAP NAVIGATION ═══════════
  const mapHotspots = document.querySelectorAll('.map-hotspot');
  if (mapContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;

    const panoMap = {
      fruits: '4.75%', vegetables: '13.75%', dairy: '22.75%', bakery: '31.75%',
      snacks: '40.75%', grains: '49.75%', packaged: '58.75%', spices: '67.75%',
      beverages: '76.75%', household: '85.75%', stationery: '95%'
    };

    const shopViewport = document.getElementById('shop-viewport');
    const interactiveMap = document.getElementById('interactive-map');
    const aisleNameDisplay = document.getElementById('active-aisle-name');
    const btnBackToMap = document.getElementById('btn-back-to-map');

    mapContainer.addEventListener('mousemove', (e) => {
      if (shopViewport.classList.contains('in-aisle')) return;
      
      const rect = mapContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const xPerc = x / rect.width; // 0 to 1
      
      const scrollMax = interactiveMap.offsetWidth - rect.width;
      if (scrollMax > 0) {
        const tx = -(scrollMax * xPerc);
        interactiveMap.style.transform = `translateX(${tx}px)`;
      }
    });

    mapContainer.addEventListener('mouseleave', () => {
      // Optional: reset or keep position? Let's keep it.
    });

    mapHotspots.forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        
        // Enter Aisle View
        shopViewport.classList.add('in-aisle');
        aisleNameDisplay.textContent = activeCategory;
        
        // Zoom Map
        if (interactiveMap && panoMap[activeCategory]) {
          interactiveMap.style.transformOrigin = `${panoMap[activeCategory]} 50%`;
          interactiveMap.style.transform = 'scale(3.5)'; 
        }

        renderGrid();
      });
    });

    if (btnBackToMap) {
      btnBackToMap.addEventListener('click', () => {
        shopViewport.classList.remove('in-aisle');
        if (interactiveMap) {
          interactiveMap.style.transform = 'scale(1)';
          interactiveMap.style.transformOrigin = '0 0';
        }
      });
    }
  }

  // ═══════════ CART ═══════════
  function renderCart() {
    const items = getSelectedItems();
    if (items.length === 0) {
      cartList.innerHTML = '<div class="empty-state">Your basket is empty.<br/><button class="link-btn" data-goto="shop">Browse the shop →</button></div>';
      cartTotals.innerHTML = '';
      return;
    }
    cartList.innerHTML = items.map(it => `
      <div class="cart-item">
        <span class="ci-emoji">${it.emoji}</span>
        <div class="ci-info">
          <div class="ci-name">${it.name}</div>
          <div class="ci-meta">${it.weight}${getItemUnit(it)} · Value: ${it.value} · Ratio: ${(it.value/it.weight).toFixed(1)}</div>
        </div>
        <button class="ci-remove" data-id="${it.id}" title="Remove">×</button>
      </div>
    `).join('');

    cartList.querySelectorAll('.ci-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedIds.delete(parseInt(btn.dataset.id));
        renderCart();
        renderGrid();
        updateBadge();
        updateButtons();
      });
    });

    const totalW = items.reduce((s,i) => s + i.weight, 0);
    const totalV = items.reduce((s,i) => s + i.value, 0);
    cartTotals.innerHTML = `Total Weight: <strong>${totalW} kg</strong> &nbsp;|&nbsp; Total Value: <strong>${totalV}</strong> &nbsp;|&nbsp; Capacity: <strong>${getCapacity()} kg</strong>`;
  }

  function updateBadge() {
    cartBadge.textContent = selectedIds.size;
  }

  function updateButtons() {
    const ok = selectedIds.size >= 2;
    btnGreedy.disabled = !ok;
    btnDP.disabled     = !ok;
    btnBB.disabled     = !ok;
    btnCompare.disabled= !ok;
  }

  // ═══════════ ALGORITHM EXECUTION ═══════════
  function runAndShow(fn) {
    const items = getSelectedItems();
    const cap = getCapacity();
    resultsBox.innerHTML = '';
    fn(items, cap);
    goToPage('results');
  }

  btnGreedy.addEventListener('click', () => runAndShow((items, cap) => {
    renderGreedyResult(solveGreedy(items, cap));
  }));
  btnDP.addEventListener('click', () => runAndShow((items, cap) => {
    renderDPResult(solveDP(items, cap));
  }));
  btnBB.addEventListener('click', () => runAndShow((items, cap) => {
    renderBBResult(solveBranchBound(items, cap));
  }));
  btnCompare.addEventListener('click', () => runAndShow((items, cap) => {
    renderComparison(solveGreedy(items, cap), solveDP(items, cap), solveBranchBound(items, cap));
  }));

  // ═══════════ CUSTOM ITEM ═══════════
  customForm.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('ci-name').value.trim();
    const cat   = document.getElementById('ci-category').value;
    const w     = parseInt(document.getElementById('ci-weight').value);
    const v     = parseInt(document.getElementById('ci-value').value);
    const emoji = document.getElementById('ci-emoji').value.trim() || '📦';
    if (!name || !w || !v) return;
    groceryItems.push({ id: nextId++, name, weight:w, value:v, category:cat, emoji });
    customForm.reset();
    document.getElementById('ci-emoji').value = '📦';
    renderGrid();
  });

  // ═══════════ GLOBAL CURSOR-TRACKING PARALLAX ═══════════
  const heroFloats = document.querySelectorAll('.float-item');

  document.addEventListener('mousemove', e => {
    // Find active page background (either hero market or a page-bg)
    const activePage = document.querySelector('.page.active');
    const bgContainer = activePage.id === 'page-shop' 
      ? document.getElementById('hero-market') 
      : activePage.querySelector('.page-bg');

    if (bgContainer) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Normalized -1 to 1 based on screen
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;

      const isHero = activePage.id === 'page-shop' && bgContainer.id === 'hero-market';
      const isCart = activePage.id === 'page-cart' && bgContainer.id === 'cart-market';
      
      if (isHero || isCart) {
        // Very subtle Pan for Hero/Cart (little move)
        const panX = nx * -15;
        const panY = ny * -8;
        bgContainer.style.transform = `translate(${panX}px, ${panY}px)`;
        
        const img = bgContainer.querySelector('img');
        if (img) img.style.transform = '';
      } else {
        // Subtle Pan for other pages
        const panX = nx * -30;
        const panY = ny * -15;
        bgContainer.style.transform = `translate(${panX}px, ${panY}px)`;
      }

      // If on shop page, also move floats
      if (activePage.id === 'page-shop') {
        heroFloats.forEach(item => {
          const speed = parseFloat(item.style.getPropertyValue('--speed')) || 0.03;
          const dx = nx * speed * 800;
          const dy = ny * speed * 400;
          item.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      }
    }
  });

  document.addEventListener('mouseleave', () => {
    document.querySelectorAll('.hero-market, .page-bg, .float-item').forEach(el => {
      el.style.transform = 'translate(0, 0)';
    });
    const heroImg = document.querySelector('#hero-market img');
    if (heroImg) heroImg.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });

  // ═══════════ INIT ═══════════
  renderGrid();
  updateBadge();
  updateButtons();
  renderTheorySection();

})();
