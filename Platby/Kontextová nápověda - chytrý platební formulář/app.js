/* ============================================================
   STATE
   ============================================================ */
const state = {
  recipient: '',
  amount: '',
  message: '',
  vs: '',
  description: '',
  ks: '',
  ss: '',
  when: 'now'
};

const SCREENS = ['home','payment-1','payment-2','summary','auth','success'];
const PAGE_NAMES = {
  'home': 'home',
  'payment-1': 'payment_step_1',
  'payment-2': 'payment_step_2',
  'summary': 'summary',
  'auth': 'authorization',
  'success': 'success'
};
const PAGE_TITLES = {
  'home': 'Přehled účtů',
  'payment-1': 'Nová platba – krok 1',
  'payment-2': 'Nová platba – krok 2',
  'summary': 'Souhrn platby',
  'auth': 'Autorizace platby',
  'success': 'Platba odeslána'
};

/* ============================================================
   KONTEXTOVÁ NÁPOVĚDA – pole Komu
   ============================================================ */
function showKomuTooltip() {
  const el = document.getElementById('ctx-tooltip-komu');
  if (!el) return;
  el.classList.add('show');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
}

function dismissKomuTooltip() {
  const el = document.getElementById('ctx-tooltip-komu');
  if (!el) return;
  el.classList.remove('visible');
  setTimeout(() => el.classList.remove('show'), 280);
}

function hideKomuTooltipImmediate() {
  const el = document.getElementById('ctx-tooltip-komu');
  if (!el) return;
  el.classList.remove('visible', 'show');
}

document.addEventListener('click', (e) => {
  const el = document.getElementById('ctx-tooltip-komu');
  if (!el || !el.classList.contains('show')) return;
  if (!el.contains(e.target)) dismissKomuTooltip();
});

/* ============================================================
   ANALYTICS - GA4 + CLARITY
   ============================================================ */
function trackPage(screenId) {
  const pageName = PAGE_NAMES[screenId] || screenId;
  const pageTitle = PAGE_TITLES[screenId] || screenId;
  const pagePath = '/' + pageName;

  // GA4 page_view
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: window.location.origin + window.location.pathname + '#' + screenId,
      page_path: pagePath,
      prototype: 'prevod_test'
    });
  }

  // Clarity custom tags
  if (typeof clarity === 'function') {
    clarity('set', 'screen', pageName);
    clarity('set', 'prototype', 'prevod_test');
    clarity('event', 'page_view_' + pageName);
  }

  // Update document title
  document.title = pageTitle + ' · Prototyp';
}

function trackEvent(name, params) {
  if (typeof gtag === 'function') {
    gtag('event', name, Object.assign({ prototype: 'prevod_test' }, params || {}));
  }
  if (typeof clarity === 'function') {
    clarity('event', name);
  }
}

/* ============================================================
   ROUTING – hash + history.pushState
   ============================================================ */
function showScreen(screenId, opts) {
  opts = opts || {};
  if (!SCREENS.includes(screenId)) screenId = 'home';

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + screenId);
  if (el) el.classList.add('active');

  // scroll na začátek
  const sc = el && el.querySelector('.scroll, .form-wrap');
  if (sc) sc.scrollTop = 0;

  // history
  const newHash = '#' + screenId;
  if (!opts.fromPop && window.location.hash !== newHash) {
    history.pushState({ screen: screenId }, '', newHash);
  }

  trackPage(screenId);

  // hooky pro speciální obrazovky
  if (screenId === 'summary') fillSummary();
  if (screenId === 'auth') startBiometrics();
  if (screenId === 'success') trackEvent('payment_completed', { amount: state.amount });
  if (screenId === 'payment-1') { setTimeout(showKomuTooltip, 400); } else { hideKomuTooltipImmediate(); }
}

window.addEventListener('popstate', (e) => {
  const screen = (e.state && e.state.screen) || (window.location.hash.replace('#','')) || 'home';
  showScreen(screen, { fromPop: true });
});

/* ============================================================
   SOUHRN
   ============================================================ */
function fillSummary() {
  document.getElementById('sum-recipient').textContent = state.recipient || '—';
  document.getElementById('sum-amount').textContent = (state.amount ? state.amount + ' Kč' : '—');
  const today = new Date();
  const dateStr = today.getDate() + '. ' + (today.getMonth()+1) + '. ' + today.getFullYear();
  document.getElementById('sum-date').textContent = state.when === 'now' ? dateStr : 'Bude naplánováno';
}

/* ============================================================
   BIOMETRIE - simulace Face ID
   ============================================================ */
let bioTimer = null;
function startBiometrics() {
  const circle = document.getElementById('bio-circle');
  const title = document.getElementById('bio-title');
  const text = document.getElementById('bio-text');
  const face = document.getElementById('bio-face');
  const check = document.getElementById('bio-check');

  // reset
  circle.classList.remove('success');
  title.textContent = 'Potvrďte platbu';
  text.innerHTML = 'Podívejte se na telefon a&nbsp;potvrďte odeslání platby pomocí Face ID.';
  face.style.display = 'block';
  check.style.display = 'none';

  if (bioTimer) clearTimeout(bioTimer);
  bioTimer = setTimeout(() => {
    circle.classList.add('success');
    title.textContent = 'Ověřeno';
    text.textContent = 'Platbu odesíláme.';
    face.style.display = 'none';
    check.style.display = 'block';

    bioTimer = setTimeout(() => {
      // jen pokud je obrazovka stále aktivní
      if (document.getElementById('screen-auth').classList.contains('active')) {
        showScreen('success');
      }
    }, 900);
  }, 1600);
}

/* ============================================================
   FORMULÁŘ – validace tlačítka
   ============================================================ */
function validateStep1() {
  const r = document.getElementById('recipient').value.trim();
  const a = document.getElementById('amount').value.trim();
  const btn = document.getElementById('payment-1-continue');
  const ok = r.length > 3 && parseFloat(a.replace(',','.')) > 0;
  btn.disabled = !ok;
}

document.getElementById('recipient').addEventListener('input', e => {
  state.recipient = e.target.value;
  validateStep1();
});
document.getElementById('amount').addEventListener('input', e => {
  state.amount = e.target.value;
  validateStep1();
});
document.getElementById('message').addEventListener('input', e => state.message = e.target.value);
document.getElementById('vs').addEventListener('input', e => state.vs = e.target.value);
document.getElementById('description').addEventListener('input', e => state.description = e.target.value);
document.getElementById('ks').addEventListener('input', e => state.ks = e.target.value);
document.getElementById('ss').addEventListener('input', e => state.ss = e.target.value);

/* segment control */
document.querySelectorAll('#when-segment .seg').forEach(seg => {
  seg.addEventListener('click', () => {
    document.querySelectorAll('#when-segment .seg').forEach(s => s.classList.remove('active'));
    seg.classList.add('active');
    state.when = seg.dataset.when;
    trackEvent('payment_when_changed', { when: state.when });
  });
});

/* tabs - jen vizuálně */
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    trackEvent('home_tab_click', { tab: t.dataset.tab });
  });
});

/* ============================================================
   ROUTER NA AKCE
   ============================================================ */
const ACTIONS = {
  'new-payment': () => { trackEvent('home_cta_click', { cta: 'new_payment' }); showScreen('payment-1'); },
  'qr-payment': () => { trackEvent('home_cta_click', { cta: 'qr_payment' }); alert('QR platba — mimo rozsah tohoto prototypu.'); },
  'pay-me': () => { trackEvent('home_cta_click', { cta: 'pay_me' }); alert('Zaplať mi — mimo rozsah tohoto prototypu.'); },
  'account-detail': () => { trackEvent('home_account_click', { account: 'main' }); alert('Detail účtu — mimo rozsah tohoto prototypu.'); },
  'account-detail-2': () => { trackEvent('home_account_click', { account: 'second' }); alert('Detail druhého účtu — mimo rozsah.'); },
  'contact-payment': () => { trackEvent('payment_contact_click'); alert('Platba na kontakt — mimo rozsah tohoto prototypu.'); },
  'close-payment': () => { trackEvent('payment_close'); history.back(); },
  'back': () => { history.back(); },
  'home': () => { trackEvent('go_home'); showScreen('home'); },
  'payment-step-2': () => {
    if (document.getElementById('payment-1-continue').disabled) return;
    trackEvent('payment_step_1_complete', { recipient_filled: !!state.recipient, amount: state.amount });
    showScreen('payment-2');
  },
  'summary': () => {
    trackEvent('payment_step_2_complete');
    showScreen('summary');
  },
  'authorize': () => {
    trackEvent('payment_authorize_start');
    showScreen('auth');
  },
  'another-payment': () => {
    trackEvent('payment_repeat');
    // resetuj stav
    Object.keys(state).forEach(k => state[k] = (k === 'when' ? 'now' : ''));
    document.querySelectorAll('input, textarea').forEach(i => i.value = '');
    validateStep1();
    showScreen('payment-1');
  },
  'save-template': () => { trackEvent('save_template_click'); alert('Šablona uložena (demo).'); },
  'key': () => { trackEvent('home_key_click'); },
  'notif': () => { trackEvent('home_notification_click'); }
};

document.body.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  const fn = ACTIONS[action];
  if (fn) {
    e.preventDefault();
    fn();
  }
});

/* ============================================================
   INIT
   ============================================================ */
const initial = (window.location.hash.replace('#','')) || 'home';
showScreen(SCREENS.includes(initial) ? initial : 'home', { fromPop: true });
validateStep1();
// nastav výchozí stav historie
history.replaceState({ screen: SCREENS.includes(initial) ? initial : 'home' }, '', '#' + (SCREENS.includes(initial) ? initial : 'home'));

/* uložené příklady pro rychlý test */
window.__demo = function() {
  document.getElementById('recipient').value = '123456789/0100';
  document.getElementById('amount').value = '1500';
  state.recipient = '123456789/0100';
  state.amount = '1500';
  validateStep1();
};
