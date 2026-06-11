// ════════════════════════════════════════════════════════════
//  VOP + SEPA instant – sdílené jádro (multipage verze)
//  Každá obrazovka je samostatný HTML soubor s vlastní URL.
//  Tento soubor je linkován do všech stránek; per-stránka logiku
//  spouští dispatcher INIT[] podle <body data-page="sXX">.
// ════════════════════════════════════════════════════════════

// ── Mapa obrazovka → soubor (zachovává stávající onclick="goTo('sXX')") ──
const ROUTES = {
  s00:  'souhlas.html',
  s00b: 'index.html',
  s01:  'telefon.html',
  s02:  'splash.html',
  s03:  'prihlaseni.html',
  s04:  'prehled.html',
  s05:  'platba-1.html',
  s06:  'platba-2.html',
  s08:  'souhrn.html',
  s10:  'hotovo.html',
  s11:  'ucet-bezny.html',
  s12:  'ucet-sporici.html',
  s13:  'vsechny-platby.html',
  s14:  'qr-platba.html',
  s15:  'zaplat-mi.html',
  s16:  'konec.html'
};

function PAGE_ID() { return (document.body && document.body.dataset.page) || ''; }
function $(id) { return document.getElementById(id); }

// ── GA + Clarity Event tracking ──
function track(action, params) {
  params = params || {};
  if (typeof gtag !== 'undefined') {
    gtag('event', action, params);
  }
  if (typeof window.clarity === 'function') {
    try {
      window.clarity('event', action);
      Object.keys(params).forEach(function(k) {
        try { window.clarity('set', action + '_' + k, String(params[k])); } catch(e) {}
      });
    } catch(e) {}
  }
}

// Virtuální page_view (pro sheety – ty nemají vlastní HTML soubor).
function trackPageView(title) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: '/' + title,
      page_title: title
    });
  }
  if (typeof window.clarity === 'function') {
    try { window.clarity('set', 'screen', title); } catch(e) {}
  }
}
function setClarityScreen(id) {
  if (typeof window.clarity === 'function') {
    try { window.clarity('set', 'screen', id); } catch(e) {}
  }
}

// ── Persistence (localStorage / sessionStorage, sandbox-safe) ──
const LS_PREFIX = 'vopsepa__';
function lsSet(k, v) { try { localStorage.setItem(LS_PREFIX + k, JSON.stringify(v)); } catch (e) {} }
function lsGet(k, def) { try { const r = localStorage.getItem(LS_PREFIX + k); return r == null ? def : JSON.parse(r); } catch (e) { return def; } }
function lsRemove(k) { try { localStorage.removeItem(LS_PREFIX + k); } catch (e) {} }
function ssSet(k, v) { try { sessionStorage.setItem(LS_PREFIX + k, v); } catch (e) {} }
function ssGet(k, def) { try { const r = sessionStorage.getItem(LS_PREFIX + k); return r == null ? def : r; } catch (e) { return def; } }

// ── State ──
let loginPin = '';
let authPin = '';
let accountBalanceCZK = 125063.38;
let userPayments = [];
let userSeq = 0;
const paymentData = { iban:'', amount:'', currency:'CZK', name:'', nameVerified:false, verifyLabel:'', verifyError:false, date:'' };

function persistState() {
  lsSet('userPayments', userPayments.map(t => ({ ...t, date: t.date.toISOString() })));
  lsSet('balance', accountBalanceCZK);
  lsSet('paymentData', paymentData);
}
function restoreState() {
  const up = lsGet('userPayments', null);
  if (Array.isArray(up)) {
    userPayments = up.map(t => ({ ...t, date: new Date(t.date) }));
    userSeq = userPayments.reduce((m, t) => Math.max(m, t._seq || 0), 0);
  }
  const bal = lsGet('balance', null);
  if (typeof bal === 'number') accountBalanceCZK = bal;
  const pd = lsGet('paymentData', null);
  if (pd && typeof pd === 'object') Object.assign(paymentData, pd);
}

// ── Navigace mezi stránkami (cross-document View Transition obstará CSS) ──
function navigateTo(href) {
  lsSet('paymentData', paymentData); // přenes rozpracovanou platbu na další stránku
  window.location.href = href;
}
function goTo(id) {
  const href = ROUTES[id];
  if (!href) return;
  navigateTo(href);
}

// ── Origin tracking (návrat z platby / QR / Zaplať mi) ──
function openNewPayment(origin) {
  ssSet('payOrigin', origin || PAGE_ID() || 's04');
  track('new_payment_open', { source: origin === 's11' ? 'account_detail' : 'homescreen' });
  goTo('s05');
}
function closeNewPayment() { goTo(ssGet('payOrigin', 's04')); }
function openQR()    { ssSet('qrOrigin', PAGE_ID() || 's04'); goTo('s14'); }
function closeQR()   { goTo(ssGet('qrOrigin', 's04')); }
function openPayMe() { ssSet('pmOrigin', PAGE_ID() || 's04'); goTo('s15'); }
function closePayMe(){ goTo(ssGet('pmOrigin', 's04')); }

// ── Sheety (zůstávají v rodičovské stránce, hash '#name') ──
const SHEET_DISPLAY = {
  currency:'flex', accountmgmt:'flex', mgmtbezny:'flex',
  partial:'block', nomatch:'block', unverifiable:'block', verify:'block'
};
function pageSheets() { return window.PAGE_SHEETS || []; }

function showSheetDOM(name) {
  if (name === 'verify') {
    const m = $('vs-icon-match'); if (m) m.innerHTML = ICONS.match;
    const p = $('vs-icon-partial'); if (p) p.innerHTML = ICONS.partial;
    const n = $('vs-icon-nomatch'); if (n) n.innerHTML = ICONS.nomatch;
    const u = $('vs-icon-unverifiable'); if (u) u.innerHTML = ICONS.unverifiable;
  }
  if (name === 'currency') renderCurrencyList();
  const overlay = $(name + '-overlay');
  const sheet = $(name + '-sheet');
  if (overlay) overlay.style.display = 'block';
  if (sheet) {
    sheet.style.display = SHEET_DISPLAY[name] || 'block';
    sheet.style.animation = 'slideUpSheet 0.3s cubic-bezier(0.25,0.46,0.45,0.94)';
  }
}
function hideSheetDOM(name) {
  const overlay = $(name + '-overlay');
  const sheet = $(name + '-sheet');
  if (overlay) overlay.style.display = 'none';
  if (sheet) sheet.style.display = 'none';
}
function hideAllSheets() { pageSheets().forEach(hideSheetDOM); }
function isAnySheetOpen() {
  return pageSheets().some(n => {
    const el = $(n + '-sheet');
    return el && el.style.display && el.style.display !== 'none';
  });
}
function openSheet(name) {
  showSheetDOM(name);
  const hash = '#' + name;
  if (window.location.hash !== hash) history.pushState({ sheet: name }, '', hash);
  trackPageView(PAGE_ID() + '/' + name);
}
function closeSheet(name, opts) {
  opts = opts || {};
  hideSheetDOM(name);
  if (window.location.hash) {
    history.replaceState({}, '', window.location.pathname + window.location.search);
  }
  if (!opts.skipTrack) trackPageView(PAGE_ID());
}
function showSheet(type) { openSheet(type); }

// ── Splash auto-advance ──
function startSplash() {
  setTimeout(() => goTo('s03'), 1800);
}

// ── PIN logic ──
function pinPress(mode, num) {
  if (mode === 'login') {
    if (loginPin.length >= 4) return;
    loginPin += num;
    updatePinDots('login');
    if (loginPin.length === 4) {
      track('pin_login_complete');
      setTimeout(() => { loginPin = ''; updatePinDots('login'); goTo('s04'); }, 300);
    }
  } else if (mode === 'auth') {
    if (authPin.length >= 4) return;
    authPin += num;
    updatePinDots('auth');
    if (authPin.length === 4) {
      track('pin_auth_complete');
      setTimeout(() => {
        authPin = '';
        hideAuth();
        const amt = parseFloat(paymentData.amount) || 0;
        const rate = EXCHANGE_RATES_ALL[paymentData.currency] || 1;
        const amtCZK = amt * rate;
        accountBalanceCZK = Math.max(0, accountBalanceCZK - amtCZK);
        updateDashboardBalance();
        userPayments.push({
          type: 'out',
          name: paymentData.name || 'Příjemce',
          note: 'Odchozí platba',
          amount: -amtCZK,
          date: new Date(),
          _user: true,
          _seq: ++userSeq
        });
        renderTransactions('tx-list-bezny', 12345);
        persistState();
        goTo('s10');
      }, 400);
    }
  }
}
function pinDelete(mode) {
  if (mode === 'login') { loginPin = loginPin.slice(0,-1); updatePinDots('login'); }
  else { authPin = authPin.slice(0,-1); updatePinDots('auth'); }
}
function updatePinDots(mode) {
  const prefix = mode === 'login' ? 'd' : 'ap';
  for (let i = 0; i < 4; i++) {
    const d = $(prefix + i);
    if (d) d.classList.toggle('filled', i < (mode === 'login' ? loginPin.length : authPin.length));
  }
}

// ── S05 (platba krok 1) logic ──
const EXCHANGE_RATES_ALL = { CZK:1, EUR:24.79, USD:22.89, AUD:14.95, BGN:12.68, CAD:16.74, DKK:3.32, GBP:28.90, HUF:0.062, JPY:0.152, NOK:2.11, PLN:5.76, RON:4.98, SEK:2.17 };
const CURRENCY_SYMBOLS = { CZK: 'Kč', EUR: 'EUR', USD: 'USD', GBP: 'GBP' };
const CURRENCIES = [
  { code: 'CZK', label: 'Kč, česká koruna',     flag: '🇨🇿' },
  { code: 'EUR', label: 'EUR, euro',              flag: '🇪🇺' },
  { code: 'USD', label: 'USD, americký dolar',    flag: '🇺🇸' },
  { code: 'AUD', label: 'AUD, australský dolar',  flag: '🇦🇺' },
  { code: 'BGN', label: 'BGN, bulharský lev',     flag: '🇧🇬' },
  { code: 'CAD', label: 'CAD, kanadský dolar',    flag: '🇨🇦' },
  { code: 'DKK', label: 'DKK, dánská koruna',     flag: '🇩🇰' },
  { code: 'GBP', label: 'GBP, anglická libra',    flag: '🇬🇧' },
  { code: 'HUF', label: 'HUF, maďarský forint',   flag: '🇭🇺' },
  { code: 'JPY', label: 'JPY, japonský jen',       flag: '🇯🇵' },
  { code: 'NOK', label: 'NOK, norská koruna',      flag: '🇳🇴' },
  { code: 'PLN', label: 'PLN, polský zlotý',       flag: '🇵🇱' },
  { code: 'RON', label: 'RON, rumunský lei',       flag: '🇷🇴' },
  { code: 'SEK', label: 'SEK, švédská korona',     flag: '🇸🇪' },
];

function formatAmount(val, currency) {
  const formatted = val.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return currency === 'CZK' ? formatted + ' Kč' : formatted + ' ' + currency;
}

function validateIBAN() {
  const el = $('iban-input'); if (!el) return;
  const val = el.value.trim();
  paymentData.iban = val;
  if (val) {
    const wrap = $('iban-wrap'); if (wrap) wrap.classList.remove('error-border');
    const err = $('iban-error'); if (err) err.style.display = 'none';
  }
  checkS05();
}

function isValidAccountNumber(raw) {
  const val = raw.replace(/\s+/g, '');
  if (!val) return false;
  if (/^[A-Za-z]{2}\d{2}[A-Za-z0-9]+$/.test(val)) {
    if (val.length < 15 || val.length > 34) return false;
    const rearranged = val.slice(4) + val.slice(0, 4);
    let remainder = 0;
    for (const ch of rearranged.toUpperCase()) {
      const code = ch >= 'A' && ch <= 'Z' ? (ch.charCodeAt(0) - 55).toString() : ch;
      for (const d of code) remainder = (remainder * 10 + (+d)) % 97;
    }
    return remainder === 1;
  }
  return /^(\d{1,6}-)?\d{2,10}\/\d{4}$/.test(val);
}

function updateBalanceHint() {
  const amountEl = $('amount-input');
  const hint = $('balance-hint');
  if (!amountEl || !hint) return;
  const currency = paymentData.currency || 'CZK';
  const rate = EXCHANGE_RATES_ALL[currency] || 1;
  const balanceInCurrency = accountBalanceCZK / rate;
  const entered = parseFloat(amountEl.value) || 0;
  const remaining = balanceInCurrency - entered;
  if (entered > 0) {
    if (remaining < 0) {
      hint.textContent = 'Nedostatečný zůstatek.';
      hint.style.color = 'var(--kb-red)';
    } else if (currency === 'CZK') {
      hint.textContent = 'Na účtu vám zůstane ' + formatAmount(remaining, currency);
      hint.style.color = '';
    } else {
      hint.textContent = 'V měně máte ' + formatAmount(remaining, currency);
      hint.style.color = '';
    }
  } else {
    if (currency === 'CZK') {
      hint.textContent = 'Na účtu vám zůstane ' + formatAmount(accountBalanceCZK, 'CZK');
    } else {
      hint.textContent = 'V měně máte ' + formatAmount(balanceInCurrency, currency);
    }
    hint.style.color = '';
  }
}

function updateAmount() {
  const el = $('amount-input'); if (!el) return;
  const val = el.value;
  paymentData.amount = val;
  if (val && parseFloat(val) > 0) {
    const w = $('amount-wrap'); if (w) w.classList.remove('error-border');
    const e = $('amount-error'); if (e) e.style.display = 'none';
    const h = $('balance-hint'); if (h) h.style.display = 'block';
  }
  updateSepaBanner();
  updateBalanceHint();
  checkS05();
}

function updateSepaBanner() {
  const inputEl = $('amount-input');
  const val = inputEl ? (parseFloat(inputEl.value) || 0) : (parseFloat(paymentData.amount) || 0);
  const currency = paymentData.currency || 'CZK';
  const rate = EXCHANGE_RATES_ALL[currency] || 1;
  const czk = val * rate;
  const margin = czk * 0.015;
  const fmt = n => n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč';
  const czkEl = $('sepa-czk'); if (czkEl) czkEl.textContent = val > 0 ? fmt(czk) : '–';
  const mEl = $('sepa-margin'); if (mEl) mEl.textContent = val > 0 ? fmt(margin) : '–';
}

function renderCurrencyList() {
  const list = $('currency-list'); if (!list) return;
  list.innerHTML = CURRENCIES.map(c => `
    <div class="currency-item${paymentData.currency === c.code ? ' selected' : ''}" onclick="selectCurrency('${c.code}','${c.flag}')">
      <span class="currency-item-flag">${c.flag}</span>
      <span class="currency-item-label">${c.label}</span>
      ${paymentData.currency === c.code ? '<span class="currency-item-check">✓</span>' : '<span style="color:var(--text-hint);">›</span>'}
    </div>`).join('');
}
function openCurrencySheet() { openSheet('currency'); }
function closeCurrencySheet() { closeSheet('currency'); }
function selectCurrency(code, flag) {
  paymentData.currency = code;
  const f = $('currency-flag'); if (f) f.textContent = flag;
  const c = $('currency-code'); if (c) c.textContent = code === 'CZK' ? 'Kč' : code;
  track('currency_selected', { currency: code });
  closeSheet('currency', { skipTrack: true });
  updateBalanceHint();
  updateSepaBanner();
}
function updateCurrency() {}
function checkS05() { /* prototype – always enabled */ }

function goToS06() {
  const ibanEl = $('iban-input'), amountEl = $('amount-input');
  const iban = ibanEl ? ibanEl.value.trim() : '';
  const amount = amountEl ? amountEl.value : '';
  let valid = true;

  const ibanErr = $('iban-error');
  if (!iban) {
    if (ibanErr) { ibanErr.textContent = 'Číslo protiúčtu je povinný údaj.'; ibanErr.style.display = 'block'; }
    const w = $('iban-wrap'); if (w) w.classList.add('error-border');
    valid = false;
  } else if (!isValidAccountNumber(iban)) {
    if (ibanErr) { ibanErr.textContent = 'Zadejte platné číslo účtu nebo IBAN.'; ibanErr.style.display = 'block'; }
    const w = $('iban-wrap'); if (w) w.classList.add('error-border');
    valid = false;
  } else {
    const w = $('iban-wrap'); if (w) w.classList.remove('error-border');
    if (ibanErr) ibanErr.style.display = 'none';
  }

  if (!amount || parseFloat(amount) <= 0) {
    const w = $('amount-wrap'); if (w) w.classList.add('error-border');
    const e = $('amount-error'); if (e) e.style.display = 'block';
    const h = $('balance-hint'); if (h) h.style.display = 'none';
    valid = false;
  } else {
    const w = $('amount-wrap'); if (w) w.classList.remove('error-border');
    const e = $('amount-error'); if (e) e.style.display = 'none';
    const h = $('balance-hint'); if (h) h.style.display = 'block';
  }

  if (!valid) return;

  paymentData.iban = iban;
  paymentData.amount = amount;
  track('payment_step1_continue', { iban: paymentData.iban, amount: paymentData.amount, currency: paymentData.currency });
  goTo('s06');
}

function initS05() {
  unverifiableUsed = false;
  const a = $('amount-input'); if (a) a.value = '';
  const f = $('currency-flag'); if (f) f.textContent = '🇨🇿';
  const c = $('currency-code'); if (c) c.textContent = 'Kč';
  paymentData.amount = '';
  paymentData.currency = 'CZK';
  updateBalanceHint();
}

// ── S06 (SEPA platba krok 2) logic ──
const ICONS = {
  info:        `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" stroke="#E2001A" stroke-width="1.8"/><text x="11" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="#E2001A" font-family="serif">i</text></svg>`,
  match:       `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" stroke="#2E7D32" stroke-width="1.8"/><polyline points="6,11 9.5,14.5 16,8" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  partial:     `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 2L21 20H1L11 2Z" stroke="#FF9500" stroke-width="1.8" stroke-linejoin="round"/><text x="11" y="17" text-anchor="middle" font-size="11" font-weight="800" fill="#FF9500" font-family="sans-serif">!</text></svg>`,
  nomatch:     `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" stroke="#E2001A" stroke-width="1.8"/><line x1="7" y1="7" x2="15" y2="15" stroke="#E2001A" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="7" x2="7" y2="15" stroke="#E2001A" stroke-width="2" stroke-linecap="round"/></svg>`,
  unverifiable:`<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" stroke="#888" stroke-width="1.8"/><text x="11" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="#888" font-family="sans-serif">?</text></svg>`,
};
const CORRECT_NAME = 'Alpenpanorama Gasstehaus';
const UNVERIFIABLE_ENABLED = false;
let unverifiableUsed = false;
let checkTimer = null;
let currentNameState = 'empty';
let pendingContinue = false;

function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({length: m+1}, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function setNameState(state, hint) {
  const wrap = $('name-wrap');
  const hintEl = $('name-hint');
  const icon = $('name-status-icon');
  const suggestion = $('name-suggestion');
  if (!wrap || !hintEl || !icon || !suggestion) return;

  wrap.classList.remove('verified', 'error-border', 'warning-border');
  hintEl.className = 'input-hint';
  suggestion.style.display = 'none';
  currentNameState = state;

  if (state === 'empty') {
    icon.innerHTML = ICONS.info; icon.className = 'info-icon'; icon.style.color = '';
    hintEl.textContent = '';
  } else if (state === 'match') {
    icon.innerHTML = ICONS.match; icon.className = 'verified-icon'; icon.style.color = '';
    hintEl.textContent = 'Název odpovídá číslu účtu.';
    hintEl.className = 'input-hint';
    paymentData.nameVerified = true;
  } else if (state === 'partial') {
    icon.innerHTML = ICONS.partial; icon.className = 'info-icon'; icon.style.color = '';
    hintEl.textContent = 'Název částečně odpovídá číslu účtu.';
    hintEl.className = 'input-hint';
    suggestion.style.display = 'flex';
    paymentData.nameVerified = false;
  } else if (state === 'nomatch') {
    wrap.classList.add('error-border');
    icon.innerHTML = ICONS.nomatch; icon.className = 'info-icon'; icon.style.color = '';
    hintEl.textContent = 'Název neodpovídá číslu účtu.';
    hintEl.className = 'input-hint error';
    paymentData.nameVerified = false;
  } else if (state === 'unverifiable') {
    icon.innerHTML = ICONS.unverifiable; icon.className = 'info-icon'; icon.style.color = '';
    hintEl.textContent = 'Název nelze ověřit.';
    hintEl.className = 'input-hint';
    paymentData.nameVerified = false;
  } else if (state === 'required') {
    wrap.classList.add('error-border');
    icon.innerHTML = ICONS.info; icon.className = 'info-icon'; icon.style.color = '';
    hintEl.textContent = 'Zadejte přesný název příjemce.';
    hintEl.className = 'input-hint error';
    paymentData.nameVerified = false;
  }
  if (state !== 'unverifiable') { icon.style.color = ''; hintEl.style.color = ''; }
}

function validateRecipient() {
  const el = $('recipient-name'); if (!el) return;
  const name = el.value;
  paymentData.name = name;
  if (!name.trim()) {
    setNameState('empty');
  } else {
    currentNameState = 'pending';
    const wrap = $('name-wrap'); if (wrap) wrap.classList.remove('verified', 'error-border', 'warning-border');
    const icon = $('name-status-icon'); if (icon) { icon.innerHTML = ICONS.info; icon.className = 'info-icon'; }
    const hintEl = $('name-hint'); if (hintEl) hintEl.textContent = '';
    const sug = $('name-suggestion'); if (sug) sug.style.display = 'none';
    paymentData.nameVerified = false;
  }
}
function scheduleCheckRecipient() {
  clearTimeout(checkTimer);
  checkTimer = setTimeout(checkRecipient, 0);
}
function checkRecipient() {
  const el = $('recipient-name'); if (!el) return;
  const name = el.value.trim();
  if (!name) { setNameState('empty'); return; }

  if (UNVERIFIABLE_ENABLED && !unverifiableUsed && Math.random() < 0.3) {
    unverifiableUsed = true;
    setTimeout(() => {
      const l = $('verify-loader'); if (l) l.style.display = 'none';
      setNameState('unverifiable');
      if (pendingContinue) { pendingContinue = false; goToS08(); }
    }, 1000);
    return;
  }

  const input = removeDiacritics(name);
  const correct = removeDiacritics(CORRECT_NAME);
  const dist = levenshtein(input, correct);

  setTimeout(() => {
    const l = $('verify-loader'); if (l) l.style.display = 'none';
    if (dist === 0) setNameState('match');
    else if (dist <= 3) setNameState('partial');
    else setNameState('nomatch');
    if (pendingContinue) { pendingContinue = false; goToS08(); }
  }, 1000);
}

function acceptSuggestion() {
  track('recipient_name_suggestion_accepted', { suggestion: CORRECT_NAME });
  const el = $('recipient-name'); if (el) el.value = CORRECT_NAME;
  paymentData.name = CORRECT_NAME;
  setNameState('match');
}

function selectSegment(idx) {
  document.querySelectorAll('#timing-seg .segment-btn').forEach((b,i) => b.classList.toggle('active', i===idx));
  track('timing_selected', { timing: idx === 0 ? 'co_nejdrive' : 'pozdeji' });
  const dateWrap = $('date-wrap');
  const instantRow = $('instant-row');
  if (idx === 1) {
    if (dateWrap) dateWrap.style.display = 'block';
    if (instantRow) instantRow.style.display = 'none';
    const t = new Date();
    const d = $('payment-date'); if (d) d.value = t.getDate() + '. ' + (t.getMonth()+1) + '. ' + t.getFullYear();
  } else {
    if (dateWrap) dateWrap.style.display = 'none';
    const d = $('payment-date'); if (d) d.value = '';
    if (instantRow) instantRow.style.display = '';
  }
}
function toggleInstant() {
  const toggle = $('instant-toggle');
  const hint = $('instant-hint');
  if (!toggle) return;
  toggle.classList.toggle('on');
  const isOn = toggle.classList.contains('on');
  if (hint) hint.style.display = isOn ? 'block' : 'none';
  track('instant_payment_toggled', { value: isOn ? 'on' : 'off' });
}
function toggleSwitch(id) { const el = $(id); if (el) el.classList.toggle('on'); }

function fillSummaryAndGoS08(verifyLabel, isError) {
  paymentData.verifyLabel = verifyLabel;
  paymentData.verifyError = !!isError;
  const t = new Date();
  paymentData.date = t.getDate() + '. ' + (t.getMonth()+1) + '. ' + t.getFullYear();
  lsSet('paymentData', paymentData);
  track('payment_step2_continue', { name: paymentData.name, name_verified: paymentData.nameVerified });
  goTo('s08');
}

function goToS08() {
  const el = $('recipient-name'); if (!el) return;
  const name = el.value.trim();
  if (!name) { setNameState('required'); return; }
  if (currentNameState === 'empty' || currentNameState === 'pending') {
    clearTimeout(checkTimer);
    pendingContinue = true;
    const loaderEl = $('verify-loader'); if (loaderEl) loaderEl.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => checkRecipient()));
    return;
  }
  paymentData.name = name;

  if (currentNameState === 'match') {
    fillSummaryAndGoS08('Název odpovídá číslu účtu.');
  } else if (currentNameState === 'partial') {
    const sn = $('partial-suggested-name'); if (sn) sn.textContent = CORRECT_NAME;
    const un = $('partial-user-name'); if (un) un.textContent = name;
    track('sheet_select_recipient_name_shown');
    showSheet('partial');
  } else if (currentNameState === 'nomatch') {
    track('sheet_confirm_continue_shown', { reason: 'nomatch' });
    showSheet('nomatch');
  } else if (currentNameState === 'unverifiable') {
    track('sheet_confirm_continue_shown', { reason: 'unverifiable' });
    showSheet('unverifiable');
  } else {
    fillSummaryAndGoS08('Neověřeno.');
  }
}

function closePartialSheet() { closeSheet('partial'); }
function closeNomatchSheet() { closeSheet('nomatch'); }
function closeUnverifiableSheet() { closeSheet('unverifiable'); }
function openVerifySheet() { track('recipient_name_info_tapped'); openSheet('verify'); }
function closeVerifySheet() { closeSheet('verify'); }

function choosePartialSuggested() {
  closeSheet('partial', { skipTrack: true });
  paymentData.name = CORRECT_NAME;
  const el = $('recipient-name'); if (el) el.value = CORRECT_NAME;
  paymentData.nameVerified = true;
  fillSummaryAndGoS08('Název odpovídá číslu účtu.');
}
function choosePartialUser() {
  closeSheet('partial', { skipTrack: true });
  paymentData.nameVerified = false;
  fillSummaryAndGoS08('Název částečně odpovídá číslu účtu.');
}
function confirmNomatch() {
  closeSheet('nomatch', { skipTrack: true });
  fillSummaryAndGoS08('Název neodpovídá číslu účtu.', true);
}
function confirmUnverifiable() {
  closeSheet('unverifiable', { skipTrack: true });
  fillSummaryAndGoS08('Název nelze ověřit.', true);
}

// ── S08 souhrn – render z paymentData ──
function initSummary() {
  const set = (id, val) => { const e = $(id); if (e) e.textContent = val; };
  set('sum-iban', paymentData.iban || '–');
  const amt = parseFloat(paymentData.amount) || 0;
  set('sum-amount', amt.toFixed(2).replace('.', ',') + ' ' + (paymentData.currency || 'CZK'));
  set('sum-name', paymentData.name || '–');
  const vEl = $('sum-verify');
  if (vEl) { vEl.textContent = paymentData.verifyLabel || 'Neověřeno.'; vEl.classList.toggle('error', !!paymentData.verifyError); }
  let date = paymentData.date;
  if (!date) { const t = new Date(); date = t.getDate() + '. ' + (t.getMonth()+1) + '. ' + t.getFullYear(); }
  set('sum-date', date);
}

// ── Auth (overlay na souhrnu) ──
function showAuth() {
  track('payment_confirm_tapped');
  const el = $('s09'); if (el) el.style.display = 'flex';
}
function hideAuth() {
  const el = $('s09'); if (el) el.style.display = 'none';
  authPin = '';
  updatePinDots('auth');
}

// ── Konec testu ──
function finishTask() {
  track('task_finished');
  try {
    Object.keys(localStorage)
      .filter(k => k.indexOf(LS_PREFIX) === 0)
      .forEach(k => localStorage.removeItem(k));
  } catch (e) {}
  userPayments = [];
  userSeq = 0;
  goTo('s16');
}

// ── Reset (nepoužívané v hlavním flow, ponecháno) ──
function resetAndGoHome() {
  loginPin = ''; authPin = '';
  const i = $('iban-input'); if (i) i.value = '';
  const r = $('recipient-name'); if (r) r.value = '';
  const w = $('name-wrap'); if (w) w.classList.remove('verified','error-border');
  const h = $('name-hint'); if (h) h.textContent = '';
  initS05();
  goTo('s04');
}
function resetAndGoNew() {
  const i = $('iban-input'); if (i) i.value = '';
  const r = $('recipient-name'); if (r) r.value = '';
  const w = $('name-wrap'); if (w) w.classList.remove('verified','error-border');
  const h = $('name-hint'); if (h) h.textContent = '';
  initS05();
  goTo('s05');
}

// ── Transakce v detailu účtu ──
const TX_OUT = [
  ['Tesco', 'Vršovická 3827/11, Praha'], ['Albert', 'Nákup potravin'],
  ['Lidl', 'Platba kartou'], ['Kaufland', 'Nákup'], ['Alza.cz', 'Online objednávka'],
  ['Rohlik.cz', 'Nákup potravin'], ['Notino', 'Online objednávka'],
  ['Spotify', 'Předplatné'], ['Netflix', 'Předplatné'], ['O2 Czech Republic', 'Vyúčtování'],
  ['ČEZ Prodej', 'Záloha elektřina'], ['Pražská plynárenská', 'Záloha plyn'],
  ['Shell', 'Tankování'], ['Benzina', 'Tankování'], ['IKEA', 'Nákup'],
  ['Dr. Max', 'Lékárna'], ['Starbucks', 'Platba kartou'], ['Booking.com', 'Rezervace'],
  ['Josef Pokorný', 'Nájem'], ['DPP', 'Jízdné'], ['Apple', 'App Store'],
  ['Datart', 'Elektronika'], ['CCC', 'Obuv'], ['Restaurace U Tří lvů', 'Oběd']
];
const TX_IN = [
  ['Karel Kropáček', 'Příspěvek na chatu'], ['Jana Nováková', 'Vrácení peněz'],
  ['Mzda – Acme s.r.o.', 'Výplata'], ['Petr Svoboda', 'Dárek'],
  ['Eva Dvořáková', 'Půjčka'], ['Finanční úřad', 'Přeplatek daně'],
  ['Tomáš Marek', 'Splátka'], ['Lucie Horáková', 'Společný výlet']
];
function fmtCZK(n) { return n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč'; }

function genTransactions(seed) {
  let s = seed;
  const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const r = (min, max) => rng() * (max - min) + min;
  const p = arr => arr[Math.floor(rng() * arr.length)];
  const count = Math.floor(r(30, 51));
  const txs = [];
  for (let i = 0; i < count; i++) {
    const roll = rng();
    let type, src, amount;
    if (roll < 0.62) { type = 'out'; src = p(TX_OUT); amount = -r(80, 6000); }
    else if (roll < 0.90) { type = 'in'; src = p(TX_IN); amount = (src[1] === 'Výplata') ? r(79000, 81000) : r(200, 25000); }
    else { type = 'fail'; src = p(TX_OUT); amount = -r(500, 14000); }
    const daysAgo = Math.floor(r(0, 60) * r(0, 1));
    const d = new Date(); d.setDate(d.getDate() - daysAgo);
    txs.push({ type, name: src[0], note: type === 'fail' ? 'Platba neodešla' : src[1], amount, date: d });
  }
  txs.sort((a, b) => b.date - a.date);
  return txs;
}
function dayLabel(d) {
  const t = new Date(); const y = new Date(); y.setDate(y.getDate() - 1);
  const same = (a, b) => a.toDateString() === b.toDateString();
  if (same(d, t)) return 'Dnes';
  if (same(d, y)) return 'Včera';
  return d.getDate() + '. ' + (d.getMonth() + 1) + '. ' + d.getFullYear();
}
const BADGE = {
  out:  '<span class="tx-badge out">→</span>',
  in:   '<span class="tx-badge in">←</span>',
  fail: '<span class="tx-badge fail">✕</span>'
};
const TX_PERSON_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/></svg>';

function renderTransactions(containerId, seed) {
  const container = $(containerId); if (!container) return;
  const txs = genTransactions(seed);
  if (seed === 12345 && userPayments.length) {
    userPayments.forEach(t => txs.push(t));
    const dayNum = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); };
    txs.sort((a, b) => {
      const dd = dayNum(b.date) - dayNum(a.date);
      if (dd !== 0) return dd;
      const au = a._user ? 1 : 0, bu = b._user ? 1 : 0;
      if (au !== bu) return bu - au;
      if (au && bu) return (b._seq || 0) - (a._seq || 0);
      return 0;
    });
  }
  let html = '';
  let lastLabel = null;
  txs.forEach((tx) => {
    const label = dayLabel(tx.date);
    if (label !== lastLabel) {
      if (lastLabel !== null) html += '</div></div>';
      html += '<div class="tx-group"><div class="tx-card"><div class="tx-group-title">' + label + '</div>';
      lastLabel = label;
    }
    const amtCls = tx.type === 'in' ? 'tx-amount in' : 'tx-amount';
    const amtStr = (tx.amount < 0 ? '-' : '') + fmtCZK(Math.abs(tx.amount));
    const noteCls = tx.type === 'fail' ? 'tx-note fail' : 'tx-note';
    html += '<div class="tx-row">'
      + '<div class="tx-avatar">' + TX_PERSON_ICON + BADGE[tx.type] + '</div>'
      + '<div class="tx-main"><div class="tx-name">' + tx.name + '</div>'
      + '<div class="' + noteCls + '">' + tx.note + '</div></div>'
      + '<div class="' + amtCls + '">' + amtStr + '</div></div>';
  });
  if (lastLabel !== null) html += '</div></div>';
  container.innerHTML = html;
}

// ── Všechny platby ──
const PAY_OUT = [
  ['Perfect jídlo', 'Nákup u obchodníka'], ['O2', 'Dobití kreditu'],
  ['Česká pošta', 'Byt Novodvorská', 'SIPO'], ['O2', 'O2 – Internet měsíčně', 'Trvalý příkaz'],
  ['Tesco', 'Nákup potravin'], ['Shell', 'Tankování'], ['Albert', 'Platba kartou'],
  ['Alza.cz', 'Online objednávka'], ['Lidl', 'Nákup'], ['IKEA', 'Nákup'],
  ['Spotify', 'Předplatné', 'Trvalý příkaz'], ['Netflix', 'Předplatné', 'Trvalý příkaz'],
  ['ČEZ Prodej', 'Záloha elektřina', 'SIPO'], ['DPP', 'Jízdné'], ['Dr. Max', 'Lékárna']
];
const PAY_IN = [
  ['Joshua Stilton', 'Thanks for all'], ['3827897080/0100', 'Splátka za kolo'],
  ['Karel Kropáček', 'Příspěvek na chatu'], ['Mzda – Acme s.r.o.', 'Výplata'],
  ['Jana Nováková', 'Vrácení peněz'], ['Helmut Schwarz', 'Směna peněz', 'SEPA platba poplatek']
];
const FX = [['EUR', 24.79], ['USD', 22.89]];
function fmtForeign(n, cur) { return n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + cur; }

function genAllPayments(seed) {
  let s = seed;
  const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const r = (min, max) => rng() * (max - min) + min;
  const p = arr => arr[Math.floor(rng() * arr.length)];
  const count = Math.floor(r(34, 51));
  const txs = [];
  for (let i = 0; i < count; i++) {
    const roll = rng();
    let type, src, amount;
    if (roll < 0.58) { type = 'out'; src = p(PAY_OUT); amount = -r(50, 9000); }
    else if (roll < 0.82) { type = 'in'; src = p(PAY_IN); amount = (src[1] === 'Výplata') ? r(79000, 81000) : r(200, 27000); }
    else { type = 'pending'; src = p(PAY_OUT); amount = -r(200, 6000); }
    const tx = { type, name: src[0], note: src[1], tag: src[2] || null, amount,
                 status: type === 'pending' ? 'Platbu zpracováváme.' : null };
    if (rng() < 0.18) {
      const fx = p(FX);
      tx.amount2 = (amount < 0 ? '-' : '') + fmtForeign(Math.abs(amount) / fx[1], fx[0]);
    }
    const daysAgo = Math.floor(r(0, 60) * r(0, 1));
    const d = new Date(); d.setDate(d.getDate() - daysAgo);
    tx.date = d;
    txs.push(tx);
  }
  txs.sort((a, b) => b.date - a.date);
  return txs;
}

const MONTHS_CZ = ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];
let allPaymentsTxs = [];
let activeMonthKey = null;
let allPaymentsContainerId = null;

function renderAllPayments(containerId, seed) {
  allPaymentsTxs = genAllPayments(seed);
  allPaymentsContainerId = containerId;
  buildMonthChips();
  renderPaymentList();
}
function buildMonthChips() {
  const chips = $('month-chips'); if (!chips) return;
  const keys = [...new Set(allPaymentsTxs.map(t => t.date.getFullYear() * 12 + t.date.getMonth()))].sort((a, b) => a - b);
  activeMonthKey = keys[keys.length - 1];
  chips.innerHTML = keys.map(k =>
    '<div class="month-chip' + (k === activeMonthKey ? ' active' : '') + '" data-key="' + k + '" onclick="selectMonth(' + k + ')">' + MONTHS_CZ[k % 12] + '</div>'
  ).join('');
  chips.scrollLeft = chips.scrollWidth;
}
function selectMonth(key) {
  activeMonthKey = key;
  setActiveChip(key);
  track('payments_month_filter', { month: MONTHS_CZ[key % 12] });
  const anchor = document.querySelector('#' + allPaymentsContainerId + ' .tx-month-anchor[data-key="' + key + '"]');
  const cont = $(allPaymentsContainerId);
  const scroller = cont ? cont.closest('.screen-scroll') : null;
  if (anchor && scroller) scroller.scrollTo({ top: anchor.offsetTop - 8, behavior: 'smooth' });
}
function setActiveChip(key) {
  document.querySelectorAll('#month-chips .month-chip').forEach(c => {
    const on = +c.dataset.key === key;
    c.classList.toggle('active', on);
    if (on) c.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  });
}
function renderPaymentList() {
  const container = $(allPaymentsContainerId); if (!container) return;
  const monthKeys = [...new Set(allPaymentsTxs.map(t => t.date.getFullYear() * 12 + t.date.getMonth()))].sort((a, b) => b - a);
  let html = '';
  monthKeys.forEach(mk => {
    const monthTxs = allPaymentsTxs.filter(t => (t.date.getFullYear() * 12 + t.date.getMonth()) === mk);
    html += '<div class="tx-month-anchor" data-key="' + mk + '"></div>';
    html += '<div class="tx-month-title">' + MONTHS_CZ[mk % 12] + ' ' + Math.floor(mk / 12) + '</div>';
    let lastLabel = null;
    monthTxs.forEach(tx => {
      const label = dayLabel(tx.date);
      if (label !== lastLabel) {
        if (lastLabel !== null) html += '</div></div>';
        html += '<div class="tx-group"><div class="tx-card"><div class="tx-group-title">' + label + '</div>';
        lastLabel = label;
      }
      const badge = tx.type === 'pending' ? '<span class="tx-badge pending">◷</span>' : BADGE[tx.type];
      const amtCls = tx.type === 'in' ? 'tx-amount in' : 'tx-amount';
      const amtStr = (tx.amount < 0 ? '-' : '') + fmtCZK(Math.abs(tx.amount));
      html += '<div class="tx-row">'
        + '<div class="tx-avatar">' + TX_PERSON_ICON + badge + '</div>'
        + '<div class="tx-main"><div class="tx-name">' + tx.name + '</div>'
        + '<div class="tx-note">' + tx.note + '</div>'
        + (tx.status ? '<div class="tx-status">' + tx.status + '</div>' : '')
        + '</div>'
        + '<div class="tx-right"><div class="' + amtCls + '">' + amtStr + '</div>'
        + (tx.amount2 ? '<div class="tx-amount2' + (tx.type === 'in' ? ' in' : '') + '">' + tx.amount2 + '</div>' : '')
        + (tx.tag ? '<div class="tx-tag">' + tx.tag + '</div>' : '')
        + '</div></div>';
    });
    if (lastLabel !== null) html += '</div></div>';
  });
  if (!html) html = '<div style="text-align:center;color:var(--text-secondary);padding:40px 20px;font-size:15px;">Žádné platby.</div>';
  container.innerHTML = html;
  attachMonthScrollspy(container);
}
function attachMonthScrollspy(container) {
  const scroller = container.closest('.screen-scroll');
  if (!scroller || scroller.dataset.spyBound === '1') return;
  scroller.dataset.spyBound = '1';
  let ticking = false;
  scroller.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const anchors = container.querySelectorAll('.tx-month-anchor');
      let current = null;
      anchors.forEach(a => { if (a.offsetTop - scroller.scrollTop <= 60) current = +a.dataset.key; });
      if (current !== null && current !== activeMonthKey) { activeMonthKey = current; setActiveChip(current); }
      ticking = false;
    });
  });
}

// ── Spořicí účet – transakce ──
const SAVINGS_TX = [
  { type: 'in',  name: 'Vklad z běžného účtu',    note: 'Spoření',                  amount:  5000,    d: [2026, 5, 3]  },
  { type: 'in',  name: 'Připsání úroků',          note: 'Úrok za květen',           amount:  712.40,  d: [2026, 5, 1]  },
  { type: 'out', name: 'Srážková daň 15 %',       note: 'Daň z úroků',              amount: -106.86,  d: [2026, 5, 1]  },
  { type: 'out', name: 'Výběr na běžný účet',     note: 'Převod',                   amount: -10000,   d: [2026, 4, 22] },
  { type: 'in',  name: 'Vklad z běžného účtu',    note: 'Spoření',                  amount:  8000,    d: [2026, 4, 12] },
  { type: 'in',  name: 'Připsání úroků',          note: 'Úrok za duben',            amount:  690.15,  d: [2026, 4, 1]  },
  { type: 'out', name: 'Srážková daň 15 %',       note: 'Daň z úroků',              amount: -103.52,  d: [2026, 4, 1]  },
  { type: 'in',  name: 'Vklad z běžného účtu',    note: 'Mimořádný vklad',          amount:  15000,   d: [2026, 3, 18] },
  { type: 'out', name: 'Výběr na běžný účet',     note: 'Převod',                   amount: -4000,    d: [2026, 3, 9]  },
  { type: 'in',  name: 'Připsání úroků',          note: 'Úrok za březen',           amount:  665.30,  d: [2026, 3, 1]  },
  { type: 'out', name: 'Srážková daň 15 %',       note: 'Daň z úroků',              amount: -99.80,   d: [2026, 3, 1]  },
  { type: 'in',  name: 'Vklad z běžného účtu',    note: 'Spoření',                  amount:  6000,    d: [2026, 2, 24] },
  { type: 'out', name: 'Výběr na běžný účet',     note: 'Převod',                   amount: -7500,    d: [2026, 2, 15] },
  { type: 'in',  name: 'Připsání úroků',          note: 'Úrok za únor',             amount:  601.90,  d: [2026, 2, 1]  },
  { type: 'out', name: 'Srážková daň 15 %',       note: 'Daň z úroků',              amount: -90.29,   d: [2026, 2, 1]  },
  { type: 'in',  name: 'Vklad z běžného účtu',    note: 'Spoření',                  amount:  10000,   d: [2026, 1, 20] },
  { type: 'in',  name: 'Vklad z běžného účtu',    note: 'Mimořádný vklad',          amount:  20000,   d: [2026, 1, 8]  },
  { type: 'in',  name: 'Připsání úroků',          note: 'Úrok za leden',            amount:  548.70,  d: [2026, 1, 1]  },
  { type: 'out', name: 'Srážková daň 15 %',       note: 'Daň z úroků',              amount: -82.31,   d: [2026, 1, 1]  }
];
function renderSavingsPayments(containerId) {
  allPaymentsTxs = SAVINGS_TX.map(tx => ({
    type: tx.type, name: tx.name, note: tx.note, tag: null, amount: tx.amount,
    status: null, date: new Date(tx.d[0], tx.d[1] - 1, tx.d[2])
  }));
  allPaymentsContainerId = containerId;
  buildMonthChips();
  renderPaymentList();
}

// ── QR generátor ──
function renderFakeQR(id, seed) {
  const grid = $(id); if (!grid) return;
  let s = seed;
  const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const N = 25;
  const inFinder = (r, c) => {
    const f = (br, bc) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return f(0, 0) || f(0, N - 7) || f(N - 7, 0);
  };
  const finderOn = (r, c) => {
    const local = (br, bc) => { const lr = r - br, lc = c - bc;
      if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
      if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true; return false; };
    if (r < 7 && c < 7) return local(0, 0);
    if (r < 7 && c >= N - 7) return local(0, N - 7);
    if (r >= N - 7 && c < 7) return local(N - 7, 0);
    return false;
  };
  let html = '';
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      let on;
      if (inFinder(r, c)) on = finderOn(r, c);
      else on = rng() < 0.46;
      html += on ? '<i style="grid-row:' + (r+1) + ';grid-column:' + (c+1) + '"></i>' : '';
    }
  grid.innerHTML = html;
}

// ── Detekce způsobu vyplnění pole (ručně vs schránka) ──
function attachInputMethodTracking(inputId, eventName) {
  const el = $(inputId);
  if (!el) return;
  let pasted = false;
  let reported = false;
  el.addEventListener('paste', () => { pasted = true; reported = false; });
  el.addEventListener('input', (e) => {
    if (!el.value) { reported = false; pasted = false; return; }
    if (reported) return;
    const method = (pasted || (e.inputType === 'insertFromPaste')) ? 'paste' : 'manual';
    track(eventName, { method });
    reported = true;
    pasted = false;
  });
}

// ── Per-stránka init ──
function initPrehled() { updateDashboardBalance(); }
function updateDashboardBalance() {
  const el = $('dashboard-balance');
  if (!el) return;
  const whole = Math.floor(accountBalanceCZK).toLocaleString('cs-CZ');
  const decimal = (accountBalanceCZK % 1).toFixed(2).substring(1).replace('.', ',');
  el.innerHTML = whole + '<span>' + decimal + ' Kč</span>';
}
function initPlatba1() {
  unverifiableUsed = false;
  const ibanEl = $('iban-input'); if (ibanEl) ibanEl.value = paymentData.iban || '';
  const amtEl = $('amount-input'); if (amtEl) amtEl.value = paymentData.amount || '';
  const cur = paymentData.currency || 'CZK';
  const flag = (CURRENCIES.find(c => c.code === cur) || {}).flag || '🇨🇿';
  const fEl = $('currency-flag'); if (fEl) fEl.textContent = flag;
  const cEl = $('currency-code'); if (cEl) cEl.textContent = cur === 'CZK' ? 'Kč' : cur;
  updateBalanceHint();
  attachInputMethodTracking('iban-input', 'recipient_iban_filled');
}
function initPlatba2() {
  const nameEl = $('recipient-name'); if (nameEl) nameEl.value = paymentData.name || '';
  const icon = $('name-status-icon'); if (icon) icon.innerHTML = ICONS.info;
  currentNameState = (paymentData.name && paymentData.name.trim()) ? 'pending' : 'empty';
  updateSepaBanner();
  attachInputMethodTracking('recipient-name', 'recipient_name_filled');
}
function initBezny() { renderTransactions('tx-list-bezny', 12345); }
function initVsechnyPlatby() { renderSavingsPayments('tx-list-all'); }
function initZaplatMi() { renderFakeQR('pm-qr-grid', 24680); }
function initSplash() { startSplash(); }

const INIT = {
  s02: initSplash,
  s04: initPrehled,
  s05: initPlatba1,
  s06: initPlatba2,
  s08: initSummary,
  s11: initBezny,
  s13: initVsechnyPlatby,
  s15: initZaplatMi
};

// ── Sheet hash sync (browser back/forward zavře/otevře sheet) ──
function onHashChange() {
  const s = (window.location.hash || '').replace('#', '');
  if (s && pageSheets().includes(s)) {
    hideAllSheets();
    showSheetDOM(s);
    trackPageView(PAGE_ID() + '/' + s);
  } else if (isAnySheetOpen()) {
    hideAllSheets();
    trackPageView(PAGE_ID());
  }
}

// ── Boot ──
document.addEventListener('DOMContentLoaded', () => {
  restoreState();
  setClarityScreen(PAGE_ID());

  // Obnova sheetu z URL hash při refresh (sheet zůstává v rodičovské stránce).
  const s = (window.location.hash || '').replace('#', '');
  if (s && pageSheets().includes(s)) {
    showSheetDOM(s);
    history.replaceState({ sheet: s }, '', '#' + s);
  }
  window.addEventListener('hashchange', onHashChange);

  // default ikona pro pole názvu příjemce (pokud na stránce je)
  const nameIcon = $('name-status-icon');
  if (nameIcon && !nameIcon.innerHTML.trim()) nameIcon.innerHTML = ICONS.info;

  const fn = INIT[PAGE_ID()];
  if (fn) fn();
});
