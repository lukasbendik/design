// ── GA + Clarity Event tracking ──
function track(action, params) {
  params = params || {};
  if (typeof gtag !== 'undefined') {
    gtag('event', action, params);
  }
  if (typeof window.clarity === 'function') {
    try {
      // Clarity custom event
      window.clarity('event', action);
      // Parametry jako tagy (Clarity neumí strukturované params u eventu)
      Object.keys(params).forEach(function(k) {
        try { window.clarity('set', action + '_' + k, String(params[k])); } catch(e) {}
      });
    } catch(e) {}
  }
}

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

// ── State ──
let loginPin = '';
let authPin = '';
// Odkud byla otevřena nová platba (s04 home / s11 detail účtu) – kvůli návratu při Zavřít
let paymentOrigin = 's04';
function openNewPayment(origin) {
  paymentOrigin = origin || 's04';
  track('new_payment_open', { source: paymentOrigin === 's11' ? 'account_detail' : 'homescreen' });
  goTo('s05');
}
function closeNewPayment() { goTo(paymentOrigin || 's04'); }
// QR platba – návrat tam, odkud byla otevřena
let qrOrigin = 's04';
function openQR() { qrOrigin = (document.querySelector('.screen.active') || {}).id || 's04'; goTo('s14'); }
function closeQR() { goTo(qrOrigin || 's04'); }
// Zaplať mi
let payMeOrigin = 's04';
function openPayMe() { payMeOrigin = (document.querySelector('.screen.active') || {}).id || 's04'; goTo('s15'); }
function closePayMe() { goTo(payMeOrigin || 's04'); }
function renderFakeQR(id, seed) {
  const grid = document.getElementById(id);
  if (!grid) return;
  let s = seed;
  const rng = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const N = 25;
  // finder pattern 7x7 v rozích
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
const paymentData = { iban:'', amount:'', currency:'CZK', name:'', nameVerified:false };

// ── Persistence (localStorage, sandbox-safe) ──
const LS_PREFIX = 'vopsepa__';
function lsSet(k, v) { try { localStorage.setItem(LS_PREFIX + k, JSON.stringify(v)); } catch (e) {} }
function lsGet(k, def) { try { const r = localStorage.getItem(LS_PREFIX + k); return r == null ? def : JSON.parse(r); } catch (e) { return def; } }
function lsRemove(k) { try { localStorage.removeItem(LS_PREFIX + k); } catch (e) {} }

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
function updateDashboardBalance() {
  const el = document.getElementById('dashboard-balance');
  if (!el) return;
  const whole = Math.floor(accountBalanceCZK).toLocaleString('cs-CZ');
  const decimal = (accountBalanceCZK % 1).toFixed(2).substring(1).replace('.', ',');
  el.innerHTML = whole + '<span>' + decimal + ' Kč</span>';
}

// ── Sheet registry ──
// Každý sheet má parent obrazovku → hash je '#<parent>/<sheet>', aby šel sheet
// trackovat v GA jako vlastní page_view i obnovit po refreshi.
const SHEET_CONFIG = {
  partial:      { parent: 's06', display: 'block' },
  nomatch:      { parent: 's06', display: 'block' },
  unverifiable: { parent: 's06', display: 'block' },
  verify:       { parent: 's06', display: 'block' },
  currency:     { parent: 's05', display: 'flex'  },
  accountmgmt:  { parent: 's12', display: 'flex'  },
  mgmtbezny:    { parent: 's11', display: 'flex'  }
};
const SHEET_NAMES = Object.keys(SHEET_CONFIG);

function parseHash() {
  const h = (window.location.hash || '').replace('#', '');
  if (!h) return { screen: null, sheet: null };
  const parts = h.split('/');
  return { screen: parts[0] || null, sheet: parts[1] || null };
}

function showSheetDOM(name) {
  const cfg = SHEET_CONFIG[name];
  if (!cfg) return;
  if (name === 'verify') {
    document.getElementById('vs-icon-match').innerHTML = ICONS.match;
    document.getElementById('vs-icon-partial').innerHTML = ICONS.partial;
    document.getElementById('vs-icon-nomatch').innerHTML = ICONS.nomatch;
    document.getElementById('vs-icon-unverifiable').innerHTML = ICONS.unverifiable;
  }
  if (name === 'currency') renderCurrencyList();
  document.getElementById(name + '-overlay').style.display = 'block';
  const sheet = document.getElementById(name + '-sheet');
  sheet.style.display = cfg.display;
  sheet.style.animation = cfg.modal
    ? 'scaleIn 0.18s ease-out'
    : 'slideUpSheet 0.3s cubic-bezier(0.25,0.46,0.45,0.94)';
}

function hideSheetDOM(name) {
  const overlay = document.getElementById(name + '-overlay');
  const sheet = document.getElementById(name + '-sheet');
  if (overlay) overlay.style.display = 'none';
  if (sheet) sheet.style.display = 'none';
}

function hideAllSheets() {
  SHEET_NAMES.forEach(hideSheetDOM);
}

function isAnySheetOpen() {
  return SHEET_NAMES.some(n => {
    const el = document.getElementById(n + '-sheet');
    return el && el.style.display && el.style.display !== 'none';
  });
}

function openSheet(name) {
  const cfg = SHEET_CONFIG[name];
  if (!cfg) return;
  showSheetDOM(name);
  const hash = '#' + cfg.parent + '/' + name;
  if (window.location.hash !== hash) {
    history.pushState({ screen: cfg.parent, sheet: name }, '', hash);
  }
  trackPageView(cfg.parent + '/' + name);
}

function closeSheet(name, opts) {
  opts = opts || {};
  hideSheetDOM(name);
  const cfg = SHEET_CONFIG[name];
  if (!cfg) return;
  const hash = '#' + cfg.parent;
  if (window.location.hash !== hash) {
    history.replaceState({ screen: cfg.parent }, '', hash);
  }
  if (!opts.skipTrack) trackPageView(cfg.parent);
}

// ── Navigation ──
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  target.classList.add('active');
  if (isAnySheetOpen()) hideAllSheets();
  const hash = '#' + id;
  if (window.location.hash !== hash) {
    history.pushState({ screen: id }, '', hash);
  }
  trackPageView(id);
  // hide auth overlay if navigating away
  if (id !== 's08') {
    const auth = document.getElementById('s09');
    auth.style.display = 'none';
  }
  // lišta měsíců: po zobrazení odrolovat na nejnovější (vpravo)
  if (id === 's13') {
    const chips = document.getElementById('month-chips');
    if (chips) requestAnimationFrame(() => { chips.scrollLeft = chips.scrollWidth; });
  }
}

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
        // deduct payment from balance
        const amt = parseFloat(paymentData.amount) || 0;
        const rate = EXCHANGE_RATES_ALL[paymentData.currency] || 1;
        const amtCZK = amt * rate;
        accountBalanceCZK = Math.max(0, accountBalanceCZK - amtCZK);
        updateDashboardBalance();
        // přidej dokončenou platbu do historie běžného účtu
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
  if (mode === 'login') {
    for (let i=0; i<4; i++) {
      const d = document.getElementById('d'+i);
      d.classList.toggle('filled', i < loginPin.length);
    }
  } else {
    for (let i=0; i<4; i++) {
      const d = document.getElementById('ap'+i);
      if (d) d.classList.toggle('filled', i < authPin.length);
    }
  }
}

// ── S05 logic ──
function validateIBAN() {
  const val = document.getElementById('iban-input').value.trim();
  paymentData.iban = val;
  if (val) {
    document.getElementById('iban-wrap').classList.remove('error-border');
    document.getElementById('iban-error').style.display = 'none';
  }
  checkS05();
}

// Validace IBAN (mod-97) nebo českého čísla účtu ([predcisli-]cislo/kodbanky)
function isValidAccountNumber(raw) {
  const val = raw.replace(/\s+/g, '');
  if (!val) return false;

  // IBAN – začíná dvěma písmeny + dvěma číslicemi
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

  // České číslo účtu: volitelné předčíslí (max 6 míst), číslo (2–10 míst), lomítko, kód banky (4 míst)
  return /^(\d{1,6}-)?\d{2,10}\/\d{4}$/.test(val);
}

// Zůstatek na běžném účtu v Kč
let accountBalanceCZK = 125063.38;
const EXCHANGE_RATES = { CZK: 1, EUR: 24.79, USD: 22.89, GBP: 28.90 };
const CURRENCY_SYMBOLS = { CZK: 'Kč', EUR: 'EUR', USD: 'USD', GBP: 'GBP' };

function formatAmount(val, currency) {
  const formatted = val.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return currency === 'CZK' ? formatted + ' Kč' : formatted + ' ' + currency;
}

function updateBalanceHint() {
  const currency = paymentData.currency || 'CZK';
  const rate = EXCHANGE_RATES_ALL[currency] || 1;
  const balanceInCurrency = accountBalanceCZK / rate;
  const entered = parseFloat(document.getElementById('amount-input').value) || 0;
  const remaining = balanceInCurrency - entered;
  const hint = document.getElementById('balance-hint');
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
  const val = document.getElementById('amount-input').value;
  paymentData.amount = val;
  if (val && parseFloat(val) > 0) {
    document.getElementById('amount-wrap').classList.remove('error-border');
    document.getElementById('amount-error').style.display = 'none';
    document.getElementById('balance-hint').style.display = 'block';
  }
  updateSepaBanner();
  updateBalanceHint();
  checkS05();
}

function updateSepaBanner() {
  const val = parseFloat(document.getElementById('amount-input').value) || 0;
  const currency = paymentData.currency || 'CZK';
  const rate = EXCHANGE_RATES_ALL[currency] || 1;
  const czk = val * rate;
  const margin = czk * 0.015;
  const fmt = n => n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč';
  document.getElementById('sepa-czk').textContent = val > 0 ? fmt(czk) : '–';
  document.getElementById('sepa-margin').textContent = val > 0 ? fmt(margin) : '–';
}

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

const EXCHANGE_RATES_ALL = { CZK:1, EUR:24.79, USD:22.89, AUD:14.95, BGN:12.68, CAD:16.74, DKK:3.32, GBP:28.90, HUF:0.062, JPY:0.152, NOK:2.11, PLN:5.76, RON:4.98, SEK:2.17 };

function openVerifySheet() { track('recipient_name_info_tapped'); openSheet('verify'); }
function closeVerifySheet() { closeSheet('verify'); }

function renderCurrencyList() {
  const list = document.getElementById('currency-list');
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
  document.getElementById('currency-flag').textContent = flag;
  document.getElementById('currency-code').textContent = code === 'CZK' ? 'Kč' : code;
  track('currency_selected', { currency: code });
  closeSheet('currency', { skipTrack: true });
  updateBalanceHint();
  updateSepaBanner();
}

function updateCurrency() {}

function checkS05() { /* prototype – always enabled */ }

function goToS06() {
  const iban = document.getElementById('iban-input').value.trim();
  const amount = document.getElementById('amount-input').value;
  let valid = true;

  const ibanErr = document.getElementById('iban-error');
  if (!iban) {
    ibanErr.textContent = 'Číslo protiúčtu je povinný údaj.';
    document.getElementById('iban-wrap').classList.add('error-border');
    ibanErr.style.display = 'block';
    valid = false;
  } else if (!isValidAccountNumber(iban)) {
    ibanErr.textContent = 'Zadejte platné číslo účtu nebo IBAN.';
    document.getElementById('iban-wrap').classList.add('error-border');
    ibanErr.style.display = 'block';
    valid = false;
  } else {
    document.getElementById('iban-wrap').classList.remove('error-border');
    ibanErr.style.display = 'none';
  }

  if (!amount || parseFloat(amount) <= 0) {
    document.getElementById('amount-wrap').classList.add('error-border');
    document.getElementById('amount-error').style.display = 'block';
    document.getElementById('balance-hint').style.display = 'none';
    valid = false;
  } else {
    document.getElementById('amount-wrap').classList.remove('error-border');
    document.getElementById('amount-error').style.display = 'none';
    document.getElementById('balance-hint').style.display = 'block';
  }

  if (!valid) return;

  paymentData.iban = iban;
  paymentData.amount = amount;

  track('payment_step1_continue', { iban: paymentData.iban, amount: paymentData.amount, currency: paymentData.currency });
  goTo('s06');
}

function initS05() {
  unverifiableUsed = false;
  document.getElementById('amount-input').value = '';
  document.getElementById('currency-flag').textContent = '🇨🇿';
  document.getElementById('currency-code').textContent = 'Kč';
  paymentData.amount = '';
  paymentData.currency = 'CZK';
  updateBalanceHint();
}

// ── S06 logic ──
const ICONS = {
  info:        `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" stroke="#E2001A" stroke-width="1.8"/><text x="11" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="#E2001A" font-family="serif">i</text></svg>`,
  match:       `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" stroke="#2E7D32" stroke-width="1.8"/><polyline points="6,11 9.5,14.5 16,8" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  partial:     `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 2L21 20H1L11 2Z" stroke="#FF9500" stroke-width="1.8" stroke-linejoin="round"/><text x="11" y="17" text-anchor="middle" font-size="11" font-weight="800" fill="#FF9500" font-family="sans-serif">!</text></svg>`,
  nomatch:     `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.67718 1.56743C8.12087 1.38304 8.63121 1.25 9.1 1.25H14.9C15.3688 1.25 15.8791 1.38304 16.3228 1.56743C16.7666 1.75187 17.2201 2.01941 17.5503 2.34967L21.6503 6.44967C21.9806 6.77993 22.2481 7.23336 22.4326 7.67718C22.617 8.12087 22.75 8.63121 22.75 9.1V14.9C22.75 15.3688 22.617 15.8791 22.4326 16.3228C22.2481 16.7666 21.9806 17.2201 21.6503 17.5503L17.5503 21.6503C17.2201 21.9806 16.7666 22.2481 16.3228 22.4326C15.8791 22.617 15.3688 22.75 14.9 22.75H9.1C8.63121 22.75 8.12087 22.617 7.67718 22.4326C7.23336 22.2481 6.77993 21.9806 6.44967 21.6503L2.34967 17.5503C2.01941 17.2201 1.75187 16.7666 1.56743 16.3228C1.38304 15.8791 1.25 15.3688 1.25 14.9V9.1C1.25 8.63121 1.38304 8.12087 1.56743 7.67718C1.75187 7.23336 2.01941 6.77993 2.34967 6.44967L6.44967 2.34967C6.77993 2.01941 7.23336 1.75187 7.67718 1.56743ZM8.25282 2.95257C7.92664 3.08813 7.66007 3.26059 7.51033 3.41033L3.41033 7.51033C3.26059 7.66007 3.08813 7.92664 2.95257 8.25282C2.81696 8.57913 2.75 8.88879 2.75 9.1V14.9C2.75 15.1112 2.81696 15.4209 2.95257 15.7472C3.08813 16.0734 3.26059 16.3399 3.41033 16.4897L7.51033 20.5897C7.66007 20.7394 7.92664 20.9119 8.25282 21.0474C8.57913 21.183 8.88879 21.25 9.1 21.25H14.9C15.1112 21.25 15.4209 21.183 15.7472 21.0474C16.0734 20.9119 16.3399 20.7394 16.4897 20.5897L20.5897 16.4897C20.7394 16.3399 20.9119 16.0734 21.0474 15.7472C21.183 15.4209 21.25 15.1112 21.25 14.9V9.1C21.25 8.88879 21.183 8.57913 21.0474 8.25282C20.9119 7.92664 20.7394 7.66007 20.5897 7.51033L16.4897 3.41033C16.3399 3.26059 16.0734 3.08813 15.7472 2.95257C15.4209 2.81696 15.1112 2.75 14.9 2.75H9.1C8.88879 2.75 8.57913 2.81696 8.25282 2.95257ZM8.5 7.43934L12 10.9393L15.5 7.43934L16.5607 8.5L13.0607 12L16.5607 15.5L15.5 16.5607L12 13.0607L8.5 16.5607L7.43934 15.5L10.9393 12L7.43934 8.5L8.5 7.43934Z" fill="#BE0000"/></svg>`,
  unverifiable:`<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="10" stroke="#888" stroke-width="1.8"/><text x="11" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="#888" font-family="sans-serif">?</text></svg>`,
};
const CORRECT_NAME = 'Alpenpanorama Gasstehaus';
// Vypnutí stavu "Název nelze ověřit." – pro zapnutí nastav na true
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
  const wrap = document.getElementById('name-wrap');
  const hintEl = document.getElementById('name-hint');
  const icon = document.getElementById('name-status-icon');
  const suggestion = document.getElementById('name-suggestion');

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

  if (state !== 'unverifiable') {
    const iconEl = document.getElementById('name-status-icon');
    iconEl.style.color = '';
  }
  if (state !== 'unverifiable') hintEl.style.color = '';
}

function validateRecipient() {
  const name = document.getElementById('recipient-name').value;
  paymentData.name = name;
  if (!name.trim()) {
    setNameState('empty');
  } else {
    // reset to neutral while typing
    currentNameState = 'pending';
    const wrap = document.getElementById('name-wrap');
    wrap.classList.remove('verified', 'error-border', 'warning-border');
    document.getElementById('name-status-icon').innerHTML = ICONS.info;
    document.getElementById('name-status-icon').className = 'info-icon';
    document.getElementById('name-hint').textContent = '';
    document.getElementById('name-suggestion').style.display = 'none';
    paymentData.nameVerified = false;
  }
}

function scheduleCheckRecipient() {
  clearTimeout(checkTimer);
  checkTimer = setTimeout(checkRecipient, 0);
}

function checkRecipient() {
  const name = document.getElementById('recipient-name').value.trim();
  if (!name) { setNameState('empty'); return; }

  // max once per payment flow
  // Přepínač zobrazování stavu "Název nelze ověřit." – pro zapnutí změň na true
  if (UNVERIFIABLE_ENABLED && !unverifiableUsed && Math.random() < 0.3) {
    unverifiableUsed = true;
    setTimeout(() => {
      document.getElementById('verify-loader').style.display = 'none';
      setNameState('unverifiable');
      if (pendingContinue) { pendingContinue = false; goToS08(); }
    }, 1000);
    return;
  }

  const input = removeDiacritics(name);
  const correct = removeDiacritics(CORRECT_NAME);
  const dist = levenshtein(input, correct);

  setTimeout(() => {
    document.getElementById('verify-loader').style.display = 'none';
    if (dist === 0) {
      setNameState('match');
    } else if (dist <= 3) {
      setNameState('partial');
    } else {
      setNameState('nomatch');
    }
    if (pendingContinue) { pendingContinue = false; goToS08(); }
  }, 1000);
}

function acceptSuggestion() {
  track('recipient_name_suggestion_accepted', { suggestion: CORRECT_NAME });
  document.getElementById('recipient-name').value = CORRECT_NAME;
  paymentData.name = CORRECT_NAME;
  setNameState('match');
}

function selectSegment(idx) {
  document.querySelectorAll('#timing-seg .segment-btn').forEach((b,i) => b.classList.toggle('active', i===idx));
  track('timing_selected', { timing: idx === 0 ? 'co_nejdrive' : 'pozdeji' });
  const dateWrap = document.getElementById('date-wrap');
  const instantRow = document.getElementById('instant-row');
  if (idx === 1) {
    dateWrap.style.display = 'block';
    instantRow.style.display = 'none';
    const t = new Date();
    document.getElementById('payment-date').value = t.getDate() + '. ' + (t.getMonth()+1) + '. ' + t.getFullYear();
  } else {
    dateWrap.style.display = 'none';
    document.getElementById('payment-date').value = '';
    instantRow.style.display = '';
  }
}

function toggleInstant() {
  const toggle = document.getElementById('instant-toggle');
  const hint = document.getElementById('instant-hint');
  toggle.classList.toggle('on');
  const isOn = toggle.classList.contains('on');
  hint.style.display = isOn ? 'block' : 'none';
  track('instant_payment_toggled', { value: isOn ? 'on' : 'off' });
}

function toggleSwitch(id) {
  document.getElementById(id).classList.toggle('on');
}

function fillSummaryAndGoS08(verifyLabel, isError) {
  document.getElementById('sum-iban').textContent = paymentData.iban;
  const amt = parseFloat(paymentData.amount) || 0;
  document.getElementById('sum-amount').textContent = amt.toFixed(2).replace('.',',') + ' ' + paymentData.currency;
  document.getElementById('sum-name').textContent = paymentData.name || '–';
  const verifyEl = document.getElementById('sum-verify');
  verifyEl.textContent = verifyLabel;
  verifyEl.classList.toggle('error', !!isError);
  const today = new Date();
  document.getElementById('sum-date').textContent = today.getDate()+'. '+(today.getMonth()+1)+'. '+today.getFullYear();
  track('payment_step2_continue', { name: paymentData.name, name_verified: paymentData.nameVerified });
  goTo('s08');
}

function goToS08() {
  const name = document.getElementById('recipient-name').value.trim();
  if (!name) {
    setNameState('required');
    return;
  }
  if (currentNameState === 'empty' || currentNameState === 'pending') {
    clearTimeout(checkTimer);
    pendingContinue = true;
    const loaderEl = document.getElementById('verify-loader');
    loaderEl.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => checkRecipient()));
    return;
  }
  paymentData.name = name;

  if (currentNameState === 'match') {
    fillSummaryAndGoS08('Název odpovídá číslu účtu.');
  } else if (currentNameState === 'partial') {
    document.getElementById('partial-suggested-name').textContent = CORRECT_NAME;
    document.getElementById('partial-user-name').textContent = name;
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

function showSheet(type) { openSheet(type); }

function closePartialSheet() { closeSheet('partial'); }
function closeNomatchSheet() { closeSheet('nomatch'); }
function closeUnverifiableSheet() { closeSheet('unverifiable'); }

function choosePartialSuggested() {
  closeSheet('partial', { skipTrack: true });
  paymentData.name = CORRECT_NAME;
  document.getElementById('recipient-name').value = CORRECT_NAME;
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

// ── Auth ──
function showAuth() {
  track('payment_confirm_tapped');
  document.getElementById('s09').style.display = 'flex';
}
function hideAuth() {
  document.getElementById('s09').style.display = 'none';
  authPin = '';
  updatePinDots('auth');
}

// ── Konec testu: dokončení úkolu ──
// Smaže jen klíče tohoto prototypu (LS_PREFIX), ať další běh začíná čistý.
// Sdílený klíč rozcestnik__auth nechává být – je společný pro všechny prototypy.
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

// ── Reset ──
function resetAndGoHome() {
  loginPin = ''; authPin = '';
  document.getElementById('iban-input').value = '';
  document.getElementById('recipient-name').value = '';
  document.getElementById('name-wrap').classList.remove('verified','error-border');
  document.getElementById('name-hint').textContent = '';
  initS05();
  goTo('s04');
}

function resetAndGoNew() {
  document.getElementById('iban-input').value = '';
  document.getElementById('recipient-name').value = '';
  document.getElementById('name-wrap').classList.remove('verified','error-border');
  document.getElementById('name-hint').textContent = '';
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

function fmtCZK(n) {
  return n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč';
}
function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function genTransactions(seed) {
  // jednoduchý deterministický generátor podle seedu, aby byl seznam stabilní
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
    const daysAgo = Math.floor(r(0, 60) * r(0, 1)); // novější váženo více
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
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

// platby dokončené uživatelem v prototypu (prepend do historie běžného účtu)
let userPayments = [];
let userSeq = 0;

function renderTransactions(containerId, seed) {
  const txs = genTransactions(seed);
  if (seed === 12345 && userPayments.length) {
    userPayments.forEach(t => txs.push(t));
    const dayNum = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); };
    txs.sort((a, b) => {
      const dd = dayNum(b.date) - dayNum(a.date);
      if (dd !== 0) return dd;                       // novější den první
      const au = a._user ? 1 : 0, bu = b._user ? 1 : 0;
      if (au !== bu) return bu - au;                 // platby uživatele na začátku dne
      if (au && bu) return (b._seq || 0) - (a._seq || 0); // nejnovější platba první
      return 0;                                      // generované ponech v pořadí
    });
  }
  let html = '';
  let lastLabel = null;
  txs.forEach((tx, idx) => {
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
  document.getElementById(containerId).innerHTML = html;
}

// ── Všechny platby (bohatší výpis) ──
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

function fmtForeign(n, cur) {
  return n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + cur;
}

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
    // občas druhá měna
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
  // distinct měsíce přítomné v datech, od nejstaršího (vlevo) po nejnovější (vpravo)
  const keys = [...new Set(allPaymentsTxs.map(t => t.date.getFullYear() * 12 + t.date.getMonth()))].sort((a, b) => a - b);
  activeMonthKey = keys[keys.length - 1];
  const chips = document.getElementById('month-chips');
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
  const scroller = document.getElementById(allPaymentsContainerId).closest('.screen-scroll');
  if (anchor && scroller) {
    scroller.scrollTo({ top: anchor.offsetTop - 8, behavior: 'smooth' });
  }
}

function setActiveChip(key) {
  document.querySelectorAll('#month-chips .month-chip').forEach(c => {
    const on = +c.dataset.key === key;
    c.classList.toggle('active', on);
    if (on) c.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  });
}

function renderPaymentList() {
  // všechny transakce pod sebou, seskupené po měsících a dnech
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
  const container = document.getElementById(allPaymentsContainerId);
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
      anchors.forEach(a => {
        if (a.offsetTop - scroller.scrollTop <= 60) current = +a.dataset.key;
      });
      if (current !== null && current !== activeMonthKey) {
        activeMonthKey = current;
        setActiveChip(current);
      }
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

// ── Boot ──
document.addEventListener('DOMContentLoaded', () => {
  restoreState();
  updateDashboardBalance();
  renderTransactions('tx-list-bezny', 12345);
  renderSavingsPayments('tx-list-all');
  renderFakeQR('pm-qr-grid', 24680);
  const nameIcon = document.getElementById('name-status-icon');
  if (nameIcon) nameIcon.innerHTML = ICONS.info;

  // ── Detekce způsobu vyplnění pole (ručně vs schránka) ──
  // Fire jednou za fill: paste => 'paste', psaní znaků => 'manual'.
  function attachInputMethodTracking(inputId, eventName) {
    const el = document.getElementById(inputId);
    if (!el) return;
    let pasted = false;
    let reported = false;
    el.addEventListener('paste', () => {
      pasted = true;
      reported = false;
    });
    el.addEventListener('input', (e) => {
      if (!el.value) { reported = false; pasted = false; return; }
      if (reported) return;
      // inputType 'insertFromPaste' = vloženo ze schránky
      const method = (pasted || (e.inputType === 'insertFromPaste')) ? 'paste' : 'manual';
      track(eventName, { method });
      reported = true;
      pasted = false;
    });
  }
  attachInputMethodTracking('iban-input', 'recipient_iban_filled');
  attachInputMethodTracking('recipient-name', 'recipient_name_filled');

  // Intercept S02 activation and auto-advance
  const origGoTo = window.goTo;
  window.goTo = function(id) {
    origGoTo(id);
    if (id === 's02') startSplash();
  };

  // Handle browser/Android back gesture — sync screen + sheet to URL hash.
  // pushState/replaceState v goTo a openSheet/closeSheet hashchange neemitují,
  // takže tento listener reaguje jen na browser back/forward.
  window.addEventListener('hashchange', () => {
    const { screen, sheet } = parseHash();
    if (!screen || !document.getElementById(screen)) return;
    const activeScreen = document.querySelector('.screen.active');
    const screenChanged = !activeScreen || activeScreen.id !== screen;
    if (screenChanged) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(screen).classList.add('active');
    }
    if (sheet && SHEET_CONFIG[sheet]) {
      hideAllSheets();
      showSheetDOM(sheet);
      trackPageView(screen + '/' + sheet);
    } else {
      const wasSheetOpen = isAnySheetOpen();
      if (wasSheetOpen) hideAllSheets();
      if (screenChanged || wasSheetOpen) trackPageView(screen);
    }
  });
  window._origGoTo = origGoTo;

  // Obnova obrazovky (a případného sheetu) z URL hash při refresh.
  const { screen: initialScreen, sheet: initialSheet } = parseHash();
  if (initialScreen && document.getElementById(initialScreen)) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(initialScreen).classList.add('active');
    const restoredHash = initialSheet && SHEET_CONFIG[initialSheet]
      ? '#' + initialScreen + '/' + initialSheet
      : '#' + initialScreen;
    history.replaceState({ screen: initialScreen, sheet: initialSheet || null }, '', restoredHash);
    if (initialSheet && SHEET_CONFIG[initialSheet]) showSheetDOM(initialSheet);
  } else {
    // Žádný hash → start na s00b (Vyčkejte na instrukce); obrazovka souhlasu s00 se přeskakuje
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('s00b').classList.add('active');
    history.replaceState({ screen: 's00b' }, '', '#s00b');
  }
});
