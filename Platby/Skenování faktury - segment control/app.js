function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsRemove(k){try{localStorage.removeItem(k);}catch(e){}}
  // ===== Contextual tooltip logic =====
  const TOOLTIP_KEY = 'tooltip_qr_noqr_dismissed';

  // Sleduje, zda byl tooltip zobrazen na platební obrazovce v této session
  var tooltipSeenOnPayment = false;

  function showTooltip() {
    if (lsGet(TOOLTIP_KEY)) return;
    const el = document.getElementById('ctx-tooltip-qr');
    if (!el) return;
    tooltipSeenOnPayment = true;
    el.classList.add('show');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
  }

  function dismissTooltip() {
    const el = document.getElementById('ctx-tooltip-qr');
    if (!el) return;
    el.classList.remove('visible');
    lsSet(TOOLTIP_KEY, '1');
    setTimeout(() => el.classList.remove('show'), 280);
  }

  function hideTooltipImmediate() {
    const el = document.getElementById('ctx-tooltip-qr');
    if (!el) return;
    el.classList.remove('visible', 'show');
  }

  // Tooltip pro obrazovku skenování (zobrazí se jen pokud nebyl tooltip na platební obrazovce)
  function showScanTooltip() {
    if (lsGet(TOOLTIP_KEY)) return;
    if (tooltipSeenOnPayment) return;
    const el = document.getElementById('ctx-tooltip-scan');
    if (!el) return;
    el.classList.add('show');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
  }

  function dismissScanTooltip() {
    const el = document.getElementById('ctx-tooltip-scan');
    if (!el) return;
    el.classList.remove('visible');
    lsSet(TOOLTIP_KEY, '1');
    setTimeout(() => el.classList.remove('show'), 280);
  }

  function hideScanTooltipImmediate() {
    const el = document.getElementById('ctx-tooltip-scan');
    if (!el) return;
    el.classList.remove('visible', 'show');
  }

  // Vykreslí obrazovku — bez zásahu do historie
  function _renderScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (!target) return;
    target.classList.add('active');
    // reset scan UI on re-entry
    if (id === 'screen-scan') {
      hideLoader();
      closeSheet();
      setTimeout(showScanTooltip, 400);
    } else {
      hideScanTooltipImmediate();
    }
    if (id === 'screen-ocr-verify' && typeof resetPhoto === 'function') {
      resetPhoto();
    }
    if (id === 'screen-newpayment') {
      setTimeout(showTooltip, 400);
    } else {
      hideTooltipImmediate();
    }
  }

  // Některé prostředí (sandboxované iframy, např. náhled v Claude) blokují history API.
  // Pokusíme se ho použít, jinak pojedeme přes interní zásobník.
  let historySupported = true;
  function safePushState(state, url) {
    if (!historySupported) return;
    try { history.pushState(state, '', url); }
    catch (err) { historySupported = false; }
  }
  function safeReplaceState(state, url) {
    if (!historySupported) return;
    try { history.replaceState(state, '', url); }
    catch (err) { historySupported = false; }
  }

  // Interní zásobník navštívených obrazovek — slouží jako fallback i jako podklad pro popstate
  const screenStack = [];

  // Veřejná navigace
  function go(id) {
    _renderScreen(id);
    if (screenStack[screenStack.length - 1] === id) return;
    screenStack.push(id);
    safePushState({ screen: id, idx: screenStack.length - 1 }, '#' + id);
  }

  // Zpět v prohlížeči/mobilu → vrať se na předchozí obrazovku v rámci prototypu
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.screen) {
      // Sesynchronizuj zásobník s nově aktuálním indexem
      const idx = typeof e.state.idx === 'number' ? e.state.idx : screenStack.length - 2;
      screenStack.length = Math.max(0, idx + 1);
      _renderScreen(e.state.screen);
    } else {
      _renderScreen('screen-dashboard');
    }
  });

  // Při načtení nastav počáteční stav (podle URL hash, jinak dashboard)
  (function initHistory() {
    let hash = '';
    try { hash = (location.hash || '').replace('#', ''); } catch (_) {}
    const startId = (hash && document.getElementById(hash)) ? hash : 'screen-dashboard';
    _renderScreen(startId);
    screenStack.push(startId);
    safeReplaceState({ screen: startId, idx: 0 }, '#' + startId);
  })();

  let mode = 'auto';
  function setMode(m) {
    mode = m;
    document.querySelectorAll('.mode-switch button').forEach(b => b.classList.remove('active'));
    document.getElementById('mode-' + m).classList.add('active');
    const hint = document.getElementById('hint');
    const simQR = document.getElementById('sim-qr');
    const simPlain = document.getElementById('sim-plain');
    if (m === 'qr') {
      hint.textContent = 'Namiř kameru na QR kód';
      simQR.classList.add('show'); simPlain.classList.remove('show');
    } else if (m === 'inv') {
      hint.textContent = 'Vyfoť celou fakturu — rozpoznám údaje';
      simQR.classList.remove('show'); simPlain.classList.add('show');
    } else {
      hint.textContent = 'Namiř kameru na QR kód nebo celou fakturu';
      simQR.classList.add('show'); simPlain.classList.remove('show');
    }
  }

  function showLoader(text) {
    document.getElementById('loader-text').textContent = text;
    document.getElementById('loader').classList.add('show');
  }
  function hideLoader() {
    document.getElementById('loader').classList.remove('show');
  }

  function capture() {
    if (mode === 'qr' || mode === 'auto') {
      showLoader('Rozpoznávám QR kód…');
      setTimeout(() => { hideLoader(); go('screen-review-qr'); }, 900);
    } else {
      showLoader('Čtu údaje z faktury…');
      setTimeout(() => { hideLoader(); go('screen-ocr-verify'); }, 1600);
    }
  }

  // Simulates Auto mode detecting "no QR found" and offering OCR fallback
  function simulateNoQR() {
    showLoader('Nenašel jsem QR kód — přepínám na rozpoznání faktury…');
    setTimeout(() => { hideLoader(); go('screen-ocr-verify'); }, 1500);
  }

  function openSheet() { document.getElementById('sheet').classList.add('show'); }
  function closeSheet() { document.getElementById('sheet').classList.remove('show'); }

  // --- OCR verification photo: zoom + drag pan + double-tap ---
  let zoom = 1, panX = 0, panY = 0;
  let dragging = false, startX = 0, startY = 0;
  let lastTap = 0;

  function applyTransform() {
    const el = document.getElementById('photoInner');
    if (!el) return;
    el.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom})`;
  }
  function zoomPhoto(delta) {
    zoom = Math.max(1, Math.min(3, zoom + delta));
    if (zoom === 1) { panX = 0; panY = 0; }
    applyTransform();
  }
  function resetPhoto() {
    zoom = 1; panX = 0; panY = 0; applyTransform();
  }

  (function initPhotoInteractions() {
    const area = document.getElementById('photoArea');
    if (!area) return;

    const getPoint = (e) => {
      if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    };

    const down = (e) => {
      if (zoom === 1) return;
      dragging = true;
      const p = getPoint(e);
      startX = p.x - panX;
      startY = p.y - panY;
      area.style.cursor = 'grabbing';
    };
    const move = (e) => {
      if (!dragging) return;
      e.preventDefault();
      const p = getPoint(e);
      panX = p.x - startX;
      panY = p.y - startY;
      applyTransform();
    };
    const up = () => { dragging = false; area.style.cursor = ''; };

    area.addEventListener('mousedown', down);
    area.addEventListener('mousemove', move);
    area.addEventListener('mouseup', up);
    area.addEventListener('mouseleave', up);
    area.addEventListener('touchstart', down, { passive: true });
    area.addEventListener('touchmove', move, { passive: false });
    area.addEventListener('touchend', up);

    // Double-click / double-tap to zoom
    area.addEventListener('dblclick', () => {
      if (zoom < 2) { zoom = 2; } else { resetPhoto(); return; }
      applyTransform();
    });
    area.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        if (zoom < 2) { zoom = 2; } else { resetPhoto(); return; }
        applyTransform();
      }
      lastTap = now;
    });
  })();

  // (reset fotky je nyní řešen uvnitř _renderScreen)

  function showToast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(function() { el.classList.remove('show'); }, 2200);
  }

  function resetTooltips() {
    lsRemove(TOOLTIP_KEY);
    tooltipSeenOnPayment = false;
    hideTooltipImmediate();
    hideScanTooltipImmediate();
    go('screen-dashboard');
    showToast('Nápověda byla resetována');
  }

  // Trojklik na prázdnou plochu headeru → reset nápovědy
  (function() {
    var tapCount = 0, tapTimer = null;
    document.querySelectorAll('.topbar').forEach(function(bar) {
      bar.addEventListener('click', function(e) {
        if (e.target.closest('button')) return;
        tapCount++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(function() { tapCount = 0; }, 800);
        if (tapCount >= 3) {
          tapCount = 0;
          clearTimeout(tapTimer);
          resetTooltips();
        }
      });
    });
  })();

  // Kliknutí mimo tooltip → zavřít
  document.getElementById('stage').addEventListener('click', function(e) {
    const tooltip = document.getElementById('ctx-tooltip-qr');
    if (tooltip && tooltip.classList.contains('show') && !tooltip.contains(e.target)) {
      dismissTooltip();
    }
    const scanTooltip = document.getElementById('ctx-tooltip-scan');
    if (scanTooltip && scanTooltip.classList.contains('show') && !scanTooltip.contains(e.target)) {
      dismissScanTooltip();
    }
  });
