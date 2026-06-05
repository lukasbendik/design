(function () {
  var LS_KEY = 'prototype__sepa_instant_limits';
  var state = {
    mode: 'daily',
    dailyLimit: 20000,
    singleLimit: 10000,
    notifyAt: 80
  };

  function loadState() {
    try {
      var saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      if (saved && typeof saved === 'object') {
        state.mode = saved.mode === 'single' ? 'single' : 'daily';
        state.dailyLimit = normalizeNumber(saved.dailyLimit, 20000);
        state.singleLimit = normalizeNumber(saved.singleLimit, 10000);
        state.notifyAt = [70, 80, 100].indexOf(Number(saved.notifyAt)) >= 0 ? Number(saved.notifyAt) : 80;
      }
    } catch (e) {}
  }

  function saveState() {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  function normalizeNumber(value, fallback) {
    var num = Number(String(value || '').replace(/\D/g, ''));
    if (!Number.isFinite(num) || num <= 0) return fallback;
    return num;
  }

  function formatCzk(value) {
    return Number(value || 0).toLocaleString('cs-CZ') + ' Kč';
  }

  function modeLabel(mode) {
    return mode === 'single' ? 'Limit na transakci' : 'Denní limit';
  }

  function currentLimit() {
    return state.mode === 'single' ? state.singleLimit : state.dailyLimit;
  }

  function notifyLabel(value) {
    if (value === 100) return 'Při dosažení limitu';
    return 'Při ' + value + ' % limitu';
  }

  function showScreen(screenId, options) {
    var opts = options || {};
    var screens = document.querySelectorAll('.screen');
    var target = document.getElementById(screenId);
    if (!target) return;

    screens.forEach(function (el) { el.classList.remove('active'); });
    target.classList.add('active');

    var hash = target.dataset.hash || '';
    if (!opts.skipHistory) {
      history.pushState({ screen: screenId }, '', hash ? ('#' + hash) : location.pathname);
    }

    trackScreen(target);
  }

  function trackScreen(screenEl) {
    var screenName = screenEl.dataset.screenName || 'Prototyp';
    document.title = screenName + ' | Nastavení limitů SEPA instant';

    if (typeof gtag === 'function') {
      gtag('event', 'screen_view', {
        app_name: 'UX Prototype',
        screen_name: screenName
      });
    }

    if (typeof window.clarity === 'function') {
      window.clarity('set', 'prototype_screen', screenName);
    }
  }

  function syncUi() {
    document.getElementById('active-mode-label').textContent = modeLabel(state.mode);
    document.getElementById('active-limit-value').textContent = formatCzk(currentLimit());
    document.getElementById('notify-value').textContent = state.notifyAt + ' %';

    var daily = document.getElementById('mode-daily');
    var single = document.getElementById('mode-single');
    daily.classList.toggle('active', state.mode === 'daily');
    single.classList.toggle('active', state.mode === 'single');

    document.getElementById('limit-label').textContent = state.mode === 'single' ? 'Limit na jednu platbu' : 'Limit za den';
    document.getElementById('limit-hint').textContent = state.mode === 'single'
      ? 'Limit se kontroluje pro každou SEPA Instant platbu samostatně.'
      : 'Součet všech SEPA Instant plateb za 24 hodin.';

    document.getElementById('limit-input').value = String(currentLimit());

    document.querySelectorAll('input[name="notify"]').forEach(function (input) {
      input.checked = Number(input.value) === state.notifyAt;
    });

    document.getElementById('review-mode').textContent = modeLabel(state.mode);
    document.getElementById('review-limit').textContent = formatCzk(currentLimit());
    document.getElementById('review-notify').textContent = notifyLabel(state.notifyAt);

    document.getElementById('success-limit').textContent = formatCzk(currentLimit());
    document.getElementById('success-mode').textContent = state.mode === 'single' ? 'na transakci' : 'denní';
  }

  function applyInputValue() {
    var raw = document.getElementById('limit-input').value || '';
    var value = Number(raw.replace(/\D/g, ''));
    if (!Number.isFinite(value)) value = 0;

    if (state.mode === 'single') {
      state.singleLimit = value;
    } else {
      state.dailyLimit = value;
    }

    saveState();
    syncUi();
  }

  function validateLimit() {
    var min = 1000;
    var value = currentLimit();
    var isValid = Number(value) >= min;
    document.getElementById('validation-text').hidden = isValid;
    return isValid;
  }

  function goByHash() {
    var hash = window.location.hash.replace('#', '');
    if (!hash) {
      showScreen('screen-overview', { skipHistory: true });
      history.replaceState({ screen: 'screen-overview' }, '', '#overview');
      return;
    }

    var target = document.querySelector('.screen[data-hash="' + hash + '"]');
    if (target) {
      showScreen(target.id, { skipHistory: true });
      history.replaceState({ screen: target.id }, '', '#' + hash);
    }
  }

  function bindEvents() {
    document.getElementById('open-edit').addEventListener('click', function () { showScreen('screen-edit'); });
    document.getElementById('overview-close').addEventListener('click', function () { showScreen('screen-overview'); });
    document.getElementById('overview-back').addEventListener('click', function () { showScreen('screen-overview'); });

    document.getElementById('edit-back').addEventListener('click', function () { showScreen('screen-overview'); });
    document.getElementById('edit-close').addEventListener('click', function () { showScreen('screen-overview'); });

    document.getElementById('review-back').addEventListener('click', function () { showScreen('screen-edit'); });
    document.getElementById('review-close').addEventListener('click', function () { showScreen('screen-overview'); });

    document.getElementById('success-back').addEventListener('click', function () { showScreen('screen-overview'); });
    document.getElementById('success-close').addEventListener('click', function () { showScreen('screen-overview'); });
    document.getElementById('back-overview').addEventListener('click', function () { showScreen('screen-overview'); });

    document.getElementById('mode-daily').addEventListener('click', function () {
      state.mode = 'daily';
      saveState();
      syncUi();
    });

    document.getElementById('mode-single').addEventListener('click', function () {
      state.mode = 'single';
      saveState();
      syncUi();
    });

    document.getElementById('limit-input').addEventListener('input', function (e) {
      e.target.value = (e.target.value || '').replace(/\D/g, '').slice(0, 9);
      applyInputValue();
    });

    document.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var add = Number(chip.dataset.add || 0);
        if (state.mode === 'single') {
          state.singleLimit = Math.max(0, state.singleLimit + add);
        } else {
          state.dailyLimit = Math.max(0, state.dailyLimit + add);
        }
        saveState();
        syncUi();
      });
    });

    document.querySelectorAll('input[name="notify"]').forEach(function (input) {
      input.addEventListener('change', function () {
        state.notifyAt = Number(input.value);
        saveState();
        syncUi();
      });
    });

    document.getElementById('continue-review').addEventListener('click', function () {
      applyInputValue();
      if (!validateLimit()) return;
      showScreen('screen-review');
    });

    document.getElementById('confirm-change').addEventListener('click', function () {
      saveState();
      syncUi();
      showScreen('screen-success');
    });

    window.addEventListener('popstate', function () {
      goByHash();
    });

    // Obnova obrazovky z URL hash pri refreshi
    (function() {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const screen = document.querySelector('.screen[data-hash="' + hash + '"]');
        if (screen) {
          showScreen(screen.id, { skipHistory: true });
          history.replaceState({ screen: screen.id }, '', window.location.hash);
        }
      }
    })();

    window.addEventListener('hashchange', function () {
      goByHash();
    });
  }

  loadState();
  bindEvents();
  syncUi();

  if (!window.location.hash) {
    history.replaceState({ screen: 'screen-overview' }, '', '#overview');
  }
  goByHash();
})();
