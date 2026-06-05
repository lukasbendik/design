/* ------------------------------------------------------------------ */
/*  STATE                                                               */
/* ------------------------------------------------------------------ */
const state = {
  recipientName: '',
  recipientIban: '',
  recipientAccount: '',
  recipientBank: '',
  amount: '',
  currency: 'CZK',
  message: '',
  vs: '',
  note: '',
  instant: true,
  inputType: 'account',  // 'account' | 'iban' | 'phone'
};

const BANKS = {
  '0100': 'Komerční banka',
  '0300': 'ČSOB',
  '0600': 'MONETA Money Bank',
  '0710': 'Česká národní banka',
  '0800': 'Česká spořitelna',
  '2010': 'Fio banka',
  '2020': 'MUFG Bank',
  '2060': 'Citibank',
  '2070': 'MPSS',
  '2100': 'Hypoteční banka',
  '2200': 'Peněžní dům',
  '2250': 'Banka Creditas',
  '2600': 'Citibank Europe',
  '2700': 'UniCredit Bank',
  '3030': 'Air Bank',
  '3050': 'BNP Paribas',
  '3060': 'PKO BP',
  '4000': 'Expobank',
  '4300': 'Českomoravská záruční',
  '5500': 'Raiffeisenbank',
  '6100': 'Equa bank',
  '6200': 'COMMERZBANK',
  '6210': 'mBank',
  '6300': 'BNP Paribas',
  '6800': 'Sberbank',
  '7910': 'Deutsche Bank',
  '7940': 'Waldviertler Sparkasse',
  '7960': 'Volksbank',
  '7970': 'Všeobecná úverová banka',
  '7990': 'Modrá pyramida',
  '8030': 'Volksbank',
  '8040': 'Oberbank',
  '8060': 'Stavební spořitelna',
  '8090': 'Česká exportní banka',
  '8150': 'HSBC',
  '8200': 'PRIVAT BANK',
  '8220': 'Payment execution system',
  '8230': 'ABANKA',
  '8240': 'Česká pojišťovna',
  '8250': 'Bank of China',
  '8260': 'CREDITAS',
  '8265': 'Wüstenrot',
  '8270': 'ReiffeIsen stavební spořitelna',
  '8280': 'ČSOB Stavební spořitelna',
  '8290': 'Hypotéka Bank',
};

/* ------------------------------------------------------------------ */
/*  SCREENS                                                             */
/* ------------------------------------------------------------------ */
const SCREEN_TITLES = {
  'screen-home': 'Domů',
  'screen-payment': 'Nová platba',
  'screen-summary': 'Shrnutí platby',
  'screen-auth': 'Autorizace platby',
  'screen-success': 'Platba odeslána'
};

function showScreen(id, options = {}) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  trackPage('platba_jednokrokova_' + id.replace('screen-', ''));
  if (!options.skipHistory) {
    const url = '#' + id.replace('screen-', '');
    history.pushState({ screen: id }, SCREEN_TITLES[id] || '', url);
    document.title = (SCREEN_TITLES[id] || 'Prototyp') + ' · Jednokrokový platební příkaz';
  }
}

// Mobilní/prohlížečové zpět tlačítko
window.addEventListener('popstate', (e) => {
  const id = (e.state && e.state.screen) || 'screen-home';
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  trackPage('platba_jednokrokova_' + id.replace('screen-', '') + '_back');
});


// Obnova obrazovky z URL hash při refresh
(function() {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const screenId = 'screen-' + hash;
    const el = document.getElementById(screenId);
    if (el) {
      showScreen(screenId, { skipHistory: true });
      history.replaceState({ screen: screenId }, '', window.location.hash);
    }
  }
})();
/* ------------------------------------------------------------------ */
/*  RECENT CONTACTS                                                     */
/* ------------------------------------------------------------------ */
document.querySelectorAll('.contact-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const name = chip.dataset.name;
    const iban = chip.dataset.iban;
    const type = chip.dataset.type;

    if (type === 'new') {
      // Switch to IBAN mode and focus
      setInputType('iban');
      document.getElementById('input-iban').focus();
      return;
    }

    // Fill in the recipient
    state.recipientName = name;
    state.recipientIban = iban;

    // Switch to IBAN mode and fill
    setInputType('iban');
    const ibanFormatted = formatIban(iban);
    document.getElementById('input-iban').value = ibanFormatted;
    validateIban(iban);
    showVop(name, 'ok');
    updateSendButton();
  });
});

/* ------------------------------------------------------------------ */
/*  INPUT TYPE TOGGLE                                                   */
/* ------------------------------------------------------------------ */
function setInputType(type) {
  state.inputType = type;

  // Update toggle buttons
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });

  // Show/hide rows
  document.getElementById('row-account').style.display = (type === 'account') ? '' : 'none';
  document.getElementById('row-iban').style.display = (type === 'iban') ? '' : 'none';
  document.getElementById('row-phone').style.display = (type === 'phone') ? '' : 'none';

  // Clear errors and vop
  hideVop();
  document.getElementById('error-account').classList.remove('show');
  document.getElementById('error-iban').classList.remove('show');
  resetValidIcon('valid-account');
  resetValidIcon('valid-iban');
  resetValidIcon('valid-phone');
  updateSendButton();
}

document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => setInputType(btn.dataset.type));
});

/* ------------------------------------------------------------------ */
/*  IBAN FORMATTING AND VALIDATION                                      */
/* ------------------------------------------------------------------ */
function formatIban(raw) {
  const clean = raw.replace(/\s/g, '').toUpperCase();
  return clean.match(/.{1,4}/g)?.join(' ') || clean;
}

function validateIbanChecksum(iban) {
  const clean = iban.replace(/\s/g, '').toUpperCase();
  if (clean.length < 15) return false;
  const rearranged = clean.slice(4) + clean.slice(0, 4);
  const numeric = rearranged.split('').map(c => {
    const code = c.charCodeAt(0);
    return code >= 65 ? (code - 55).toString() : c;
  }).join('');
  let remainder = 0;
  for (let i = 0; i < numeric.length; i++) {
    remainder = (remainder * 10 + parseInt(numeric[i])) % 97;
  }
  return remainder === 1;
}

function validateIban(raw) {
  const clean = raw.replace(/\s/g, '').toUpperCase();
  const el = document.getElementById('valid-iban');
  const err = document.getElementById('error-iban');

  if (clean.length === 0) {
    resetValidIcon('valid-iban');
    err.classList.remove('show');
    return false;
  }
  if (clean.length < 15) {
    resetValidIcon('valid-iban');
    err.classList.remove('show');
    return false;
  }
  const ok = validateIbanChecksum(clean);
  setValidIcon('valid-iban', ok);
  err.classList.toggle('show', !ok);
  return ok;
}

const ibanInput = document.getElementById('input-iban');
ibanInput.addEventListener('input', (e) => {
  hideVop();
  state.recipientName = '';
  const raw = e.target.value.replace(/\s/g, '').toUpperCase();
  e.target.value = formatIban(raw);
  const ok = validateIban(raw);
  if (ok) {
    // Simulate VoP lookup
    state.recipientIban = raw;
    simulateVop(raw);
  }
  updateSendButton();
});

function simulateVop(iban) {
  // Fake Verification of Payee — in real app this would be an API call
  const known = {
    'CZ6508000000192000145399': 'Jan Novák',
    'CZ3455000000001234567890': 'Marie Horáková',
    'CZ7601000000000000012345': 'Tomáš Veselý',
    'CZ2420100000002301888810': 'Alena Procházková',
  };
  const name = known[iban];
  if (name) {
    setTimeout(() => showVop(name, 'ok'), 400);
  } else if (iban.startsWith('CZ')) {
    setTimeout(() => showVop('Neznámý příjemce', 'warn'), 400);
  }
}

function showVop(name, type) {
  const badge = document.getElementById('vop-badge');
  const nameEl = document.getElementById('vop-name');
  badge.className = 'vop-badge ' + type;
  nameEl.textContent = name;
  state.recipientName = name;
  if (type === 'ok') {
    badge.querySelector('svg').style.display = '';
  }
}
function hideVop() {
  document.getElementById('vop-badge').className = 'vop-badge';
}

/* ------------------------------------------------------------------ */
/*  ACCOUNT NUMBER VALIDATION (kombinované pole čísloúčtu/kódbanka)   */
/* ------------------------------------------------------------------ */
const accountFullInput = document.getElementById('input-account-full');

accountFullInput.addEventListener('input', () => {
  const raw = accountFullInput.value;
  const slashIdx = raw.indexOf('/');
  const hint = document.getElementById('account-bank-hint');
  const err  = document.getElementById('error-account');

  if (slashIdx === -1) {
    // Uživatel ještě nezadal '/' — jen číslo účtu
    const acc = raw.replace(/\s/g, '');
    state.recipientAccount = acc;
    state.recipientBank    = '';
    resetValidIcon('valid-account');
    hint.textContent = '';
    hint.className = 'account-bank-hint';
    err.classList.remove('show');
    updateSendButton();
    return;
  }

  const accPart  = raw.slice(0, slashIdx).replace(/\s/g, '');
  const bankPart = raw.slice(slashIdx + 1).replace(/\s/g, '').slice(0, 4);

  // Zkrátit vstup na max 4 číslice za lomítkem
  if (raw.slice(slashIdx + 1).length > 4) {
    accountFullInput.value = accPart + '/' + bankPart;
  }

  state.recipientAccount = accPart;
  state.recipientBank    = bankPart;

  // Validace čísla účtu: volitelné předčíslí-čísloúčtu nebo 6–10 číslic
  const accOk = /^(\d{1,6}-)?\d{2,10}$/.test(accPart) && accPart.length >= 2;

  // Zobraz název banky
  const bankName = BANKS[bankPart];
  if (bankPart.length > 0) {
    if (bankPart.length < 4) {
      hint.textContent = '';
      hint.className = 'account-bank-hint';
    } else if (bankName) {
      hint.textContent = bankName;
      hint.className = 'account-bank-hint ok';
    } else {
      hint.textContent = 'Neznámý kód banky';
      hint.className = 'account-bank-hint err';
    }
  } else {
    hint.textContent = '';
    hint.className = 'account-bank-hint';
  }

  const allOk = accOk && bankPart.length === 4 && !!bankName;
  if (accPart.length >= 2 && bankPart.length === 4) {
    setValidIcon('valid-account', allOk);
    err.classList.toggle('show', !allOk);
  } else {
    resetValidIcon('valid-account');
    err.classList.remove('show');
  }

  updateSendButton();
});

/* ------------------------------------------------------------------ */
/*  PHONE VALIDATION                                                    */
/* ------------------------------------------------------------------ */
document.getElementById('input-phone').addEventListener('input', (e) => {
  const val = e.target.value.replace(/\s/g, '');
  const ok = /^\+?\d{9,15}$/.test(val);
  if (val.length >= 9) {
    setValidIcon('valid-phone', ok);
    if (ok) showVop('Uložený kontakt', 'ok');
  } else {
    resetValidIcon('valid-phone');
    hideVop();
  }
  updateSendButton();
});

/* ------------------------------------------------------------------ */
/*  AMOUNT                                                              */
/* ------------------------------------------------------------------ */
const amountInput = document.getElementById('input-amount');

amountInput.addEventListener('input', () => {
  let val = amountInput.value.replace(/[^0-9,\.]/g, '');
  state.amount = val;
  updateSendButton();
});

// Currency selection is handled by the bottom sheet (CURRENCIES array below)

// Instant toggle
document.getElementById('instant-toggle').addEventListener('change', (e) => {
  state.instant = e.target.checked;
  if (state.instant) {
    const cur = (typeof CURRENCIES !== 'undefined') ? CURRENCIES.find(c => c.code === state.currency) : null;
    document.getElementById('fee-hint').textContent = cur ? cur.instant : '⚡ Okamžitá platba · zdarma';
  } else {
    document.getElementById('fee-hint').textContent = 'Standardní převod · do 1 pracovního dne';
  }
});

/* ------------------------------------------------------------------ */
/*  EXPANDABLE DETAILS                                                  */
/* ------------------------------------------------------------------ */
document.getElementById('details-toggle').addEventListener('click', () => {
  const body = document.getElementById('details-body');
  const chevron = document.getElementById('details-chevron');
  const isOpen = body.classList.toggle('open');
  chevron.classList.toggle('open', isOpen);
});

/* ------------------------------------------------------------------ */
/*  SEND BUTTON ACTIVATION                                              */
/* ------------------------------------------------------------------ */
function isRecipientValid() {
  switch (state.inputType) {
    case 'account': {
      const full = document.getElementById('input-account-full').value;
      const slashIdx = full.indexOf('/');
      if (slashIdx === -1) return false;
      const acc  = full.slice(0, slashIdx).replace(/\s/g, '');
      const bank = full.slice(slashIdx + 1).replace(/\s/g, '');
      return acc.length >= 2 && bank.length === 4 && !!BANKS[bank];
    }
    case 'iban': {
      const iban = document.getElementById('input-iban').value.replace(/\s/g, '').toUpperCase();
      return validateIbanChecksum(iban);
    }
    case 'phone': {
      const phone = document.getElementById('input-phone').value.replace(/\s/g, '');
      return /^\+?\d{9,15}$/.test(phone);
    }
  }
  return false;
}

function isAmountValid() {
  const val = parseFloat(state.amount.replace(',', '.'));
  return !isNaN(val) && val > 0;
}

function updateSendButton() {
  const btn = document.getElementById('btn-send');
  btn.disabled = !(isRecipientValid() && isAmountValid());
}

/* ------------------------------------------------------------------ */
/*  VALIDATION ICONS                                                    */
/* ------------------------------------------------------------------ */
function setValidIcon(id, ok) {
  const el = document.getElementById(id);
  el.classList.remove('ok', 'err');
  el.classList.add('show', ok ? 'ok' : 'err');
  el.innerHTML = ok
    ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
    : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
}

function resetValidIcon(id) {
  const el = document.getElementById(id);
  el.classList.remove('show', 'ok', 'err');
  el.innerHTML = '';
}

/* ------------------------------------------------------------------ */
/*  HOME → FORMULÁŘ                                                     */
/* ------------------------------------------------------------------ */
document.getElementById('btn-new-payment').addEventListener('click', () => {
  showScreen('screen-payment');
});
document.getElementById('qa-pay').addEventListener('click', () => {
  showScreen('screen-payment');
});

/* ------------------------------------------------------------------ */
/*  FORMULÁŘ → SHRNUTÍ                                                  */
/* ------------------------------------------------------------------ */
function getRecipientText() {
  if (state.recipientName) return state.recipientName;
  if (state.inputType === 'account') {
    return document.getElementById('input-account-full').value || '—';
  }
  if (state.inputType === 'iban') return document.getElementById('input-iban').value || '—';
  if (state.inputType === 'phone') return document.getElementById('input-phone').value || '—';
  return '—';
}

function getAccountText() {
  if (state.inputType === 'account') {
    return document.getElementById('input-account-full').value || '—';
  }
  if (state.inputType === 'iban') return document.getElementById('input-iban').value || '—';
  if (state.inputType === 'phone') return document.getElementById('input-phone').value || '—';
  return '—';
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]).join('').toUpperCase();
}

function populateSummary() {
  const curData = (typeof CURRENCIES !== 'undefined') ? CURRENCIES.find(c => c.code === state.currency) : null;
  const amount = amountInput.value + ' ' + (curData ? curData.symbol : state.currency);
  const recipient = getRecipientText();

  document.getElementById('sum-name').textContent = recipient;
  document.getElementById('sum-amount').textContent = amount;
  document.getElementById('sum-avatar').textContent = getInitials(recipient);
  document.getElementById('sum-account').textContent = getAccountText();

  const msg = document.getElementById('input-message').value;
  if (msg) {
    document.getElementById('sum-message-row').style.display = '';
    document.getElementById('sum-message').textContent = msg;
  } else {
    document.getElementById('sum-message-row').style.display = 'none';
  }

  const vs = document.getElementById('input-vs').value;
  if (vs) {
    document.getElementById('sum-vs-row').style.display = '';
    document.getElementById('sum-vs').textContent = vs;
  } else {
    document.getElementById('sum-vs-row').style.display = 'none';
  }

  document.getElementById('sum-when').textContent = state.instant
    ? '⚡ Okamžitě (do několika sekund)'
    : 'Do 1 pracovního dne';

  // VoP banner — show only if recipient name was verified
  const banner = document.getElementById('sum-info-banner');
  banner.style.display = state.recipientName ? '' : 'none';
}

document.getElementById('btn-send').addEventListener('click', () => {
  populateSummary();
  showScreen('screen-summary');
});

/* ------------------------------------------------------------------ */
/*  SHRNUTÍ → AUTORIZACE                                                */
/* ------------------------------------------------------------------ */
document.getElementById('btn-summary-edit').addEventListener('click', () => {
  showScreen('screen-payment');
});
document.getElementById('btn-summary-back').addEventListener('click', () => {
  showScreen('screen-payment');
});

document.getElementById('btn-summary-confirm').addEventListener('click', () => {
  const curData = (typeof CURRENCIES !== 'undefined') ? CURRENCIES.find(c => c.code === state.currency) : null;
  const amount = amountInput.value + ' ' + (curData ? curData.symbol : state.currency);
  document.getElementById('auth-amount').textContent = amount;
  document.getElementById('auth-to').textContent = '→ ' + getRecipientText();
  showScreen('screen-auth');

  // Auto-trigger biometric after 1.5s (simulate)
  const ring = document.getElementById('bio-ring');
  const bioLabel = document.getElementById('bio-label');
  ring.classList.add('scanning');
  bioLabel.textContent = 'Skenování…';

  setTimeout(() => {
    ring.classList.remove('scanning');
    ring.classList.add('done');
    ring.style.background = 'var(--green-bg)';
    document.getElementById('bio-icon-face').style.display = 'none';
    document.getElementById('bio-icon-check').style.display = '';
    bioLabel.textContent = 'Ověřeno ✓';

    setTimeout(() => {
      goToSuccess();
    }, 600);
  }, 2000);
});

/* ------------------------------------------------------------------ */
/*  SUCCESS SCREEN                                                      */
/* ------------------------------------------------------------------ */
function goToSuccess() {
  const curData = (typeof CURRENCIES !== 'undefined') ? CURRENCIES.find(c => c.code === state.currency) : null;
  const amount = amountInput.value + ' ' + (curData ? curData.symbol : state.currency);
  const recipient = getRecipientText();

  document.getElementById('suc-recipient').textContent = recipient || '—';
  document.getElementById('suc-amount').textContent = amount;
  document.getElementById('suc-instant').textContent = state.instant ? '⚡ Okamžitě (SEPA Instant)' : 'Do 1 pracovního dne';
  document.getElementById('success-when').textContent = state.instant ? 'několika sekund' : '1 pracovního dne';

  const msg = document.getElementById('input-message').value;
  if (msg) {
    document.getElementById('suc-message-row').style.display = '';
    document.getElementById('suc-message').textContent = msg;
  }
  showScreen('screen-success');
}

/* ------------------------------------------------------------------ */
/*  NAVIGATION BUTTONS                                                  */
/* ------------------------------------------------------------------ */
document.getElementById('btn-payment-back').addEventListener('click', () => {
  showScreen('screen-home');
});

document.getElementById('btn-auth-back').addEventListener('click', () => {
  showScreen('screen-summary');
  resetBio();
});
document.getElementById('btn-auth-cancel').addEventListener('click', () => {
  showScreen('screen-summary');
  resetBio();
});

function resetBio() {
  const ring = document.getElementById('bio-ring');
  ring.classList.remove('scanning', 'done');
  ring.style.background = '';
  document.getElementById('bio-icon-face').style.display = '';
  document.getElementById('bio-icon-check').style.display = 'none';
  document.getElementById('bio-label').textContent = 'Potvrďte platbu';
}

document.getElementById('btn-success-close').addEventListener('click', () => goHome());
document.getElementById('btn-home').addEventListener('click', () => goHome());
document.getElementById('btn-another').addEventListener('click', () => {
  resetForm();
  showScreen('screen-payment');
});

function resetForm() {
  // Clear fields
  document.getElementById('input-account-full').value = '';
  document.getElementById('input-iban').value = '';
  document.getElementById('input-phone').value = '';
  document.getElementById('input-amount').value = '';
  document.getElementById('input-message').value = '';
  document.getElementById('input-vs').value = '';
  document.getElementById('input-note').value = '';

  // Reset state
  state.recipientName = '';
  state.amount = '';

  // Reset icons
  ['valid-account','valid-iban','valid-phone'].forEach(resetValidIcon);
  hideVop();

  // Reset bio
  resetBio();

  // Reset success screen
  document.getElementById('suc-message-row').style.display = 'none';

  // Reset details section
  document.getElementById('details-body').classList.remove('open');
  document.getElementById('details-chevron').classList.remove('open');

  // Disable send button
  document.getElementById('btn-send').disabled = true;

  document.getElementById('main-scroll').scrollTop = 0;
}

function goHome() {
  resetForm();
  showScreen('screen-home');
}

/* ------------------------------------------------------------------ */
/*  ANALYTICS HELPERS                                                   */
/* ------------------------------------------------------------------ */
function trackPage(name) {
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', { page_title: name, prototype: 'platba_jednokrokova' });
  }
  if (typeof window.clarity === 'function') {
    window.clarity('set', 'screen', name);
  }
}

// Initial state pro prohlížečové zpět — jen pokud není v URL jiná obrazovka
if (!window.location.hash || window.location.hash === '#home') {
  history.replaceState({ screen: 'screen-home' }, 'Domů', '#home');
}
trackPage('platba_jednokrokova_home');

function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
const CURRENCIES = [
  { code: 'CZK', flag: '🇨🇿', name: 'Česká koruna',    balance: '38 420 Kč',   symbol: 'Kč',  instant: '⚡ Okamžitá platba · zdarma' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro',             balance: '1 540 €',     symbol: '€',   instant: '⚡ SEPA Instant · zdarma' },
  { code: 'USD', flag: '🇺🇸', name: 'Americký dolar',   balance: '820 $',       symbol: '$',   instant: 'Standardní převod · 1–2 pracovní dny' },
  { code: 'GBP', flag: '🇬🇧', name: 'Britská libra',    balance: '310 £',       symbol: '£',   instant: 'Standardní převod · 1–2 pracovní dny' },
  { code: 'CHF', flag: '🇨🇭', name: 'Švýcarský frank',  balance: '240 CHF',     symbol: 'CHF', instant: 'Standardní převod · 1–2 pracovní dny' },
  { code: 'PLN', flag: '🇵🇱', name: 'Polský zlotý',     balance: '1 200 PLN',   symbol: 'PLN', instant: 'Standardní převod · 1–2 pracovní dny' },
  { code: 'HUF', flag: '🇭🇺', name: 'Maďarský forint',  balance: '42 000 HUF',  symbol: 'HUF', instant: 'Standardní převod · 1–2 pracovní dny' },
  { code: 'NOK', flag: '🇳🇴', name: 'Norská koruna',    balance: '1 800 NOK',   symbol: 'NOK', instant: 'Standardní převod · 1–2 pracovní dny' },
  { code: 'SEK', flag: '🇸🇪', name: 'Švédská koruna',   balance: '2 100 SEK',   symbol: 'SEK', instant: 'Standardní převod · 1–2 pracovní dny' },
  { code: 'DKK', flag: '🇩🇰', name: 'Dánská koruna',    balance: '940 DKK',     symbol: 'DKK', instant: 'Standardní převod · 1–2 pracovní dny' },
];

(function() {
  const overlay = document.getElementById('cur-overlay');
  const sheet   = document.getElementById('cur-sheet');
  const list    = document.getElementById('cur-list');
  const openBtn = document.getElementById('cur-select-btn');
  const flagEl  = document.getElementById('cur-flag');
  const codeEl  = document.getElementById('cur-code');

  function buildList() {
    list.innerHTML = '';
    CURRENCIES.forEach(c => {
      const item = document.createElement('div');
      item.className = 'cur-item' + (state.currency === c.code ? ' selected' : '');
      item.innerHTML = `
        <span class="cur-item-flag">${c.flag}</span>
        <div class="cur-item-info">
          <div class="cur-item-code">${c.code} – ${c.symbol}</div>
          <div class="cur-item-name">${c.name}</div>
        </div>
        <svg class="cur-item-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      `;
      item.addEventListener('click', () => selectCurrency(c));
      list.appendChild(item);
    });
  }

  function openSheet() {
    buildList();
    overlay.classList.add('open');
    sheet.classList.add('open');
    // scroll to selected
    const sel = list.querySelector('.selected');
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }

  function closeSheet() {
    overlay.classList.remove('open');
    sheet.classList.remove('open');
  }

  function selectCurrency(c) {
    state.currency = c.code;
    lsSet('novat_currency', c.code);
    flagEl.textContent = c.flag;
    codeEl.textContent = c.code;
    // update balance hint
    const balEl = document.getElementById('balance-hint');
    if (balEl) balEl.querySelector('span').textContent = c.balance;
    // update fee hint
    const feeEl = document.getElementById('fee-hint');
    if (feeEl) feeEl.textContent = state.instant ? c.instant : 'Standardní převod · do 1 pracovního dne';
    closeSheet();
  }

  openBtn.addEventListener('click', openSheet);
  overlay.addEventListener('click', closeSheet);

  // Restore from localStorage
  const saved = lsGet('novat_currency');
  if (saved) {
    const c = CURRENCIES.find(x => x.code === saved);
    if (c) {
      state.currency = c.code;
      flagEl.textContent = c.flag;
      codeEl.textContent = c.code;
    }
  }
})();
