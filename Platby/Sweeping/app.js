function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
// ─── Telemetrie ───
function track(action, params) {
  if (typeof gtag !== 'undefined') gtag('event', action, params || {});
}

// ─── Navigace ───
const SCREENS = ['s00','home','rules','predict','pay','history','txDetail','notif'];

function goTo(id) {
  if (!document.getElementById(id)) return;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // Scroll top
  const sc = document.getElementById(id).querySelector('.screen-scroll');
  if (sc) sc.scrollTop = 0;
  // Hash bez vytvoření duplicitní položky pokud už je
  if (window.location.hash !== '#' + id) {
    history.pushState({ screen: id }, '', '#' + id);
  }
  // GA page view
  track('page_view', { page_location: window.location.href, page_title: id });
}

// ─── Onboarding ───
const ONB = [
  { e: '💸', t: 'Jak fungují vyrovnávací platby', b: 'Když v jedné měně nebude dost peněz, váš účet může automaticky použít jiné měny. Vždy jen podle pravidel, která si nastavíte sami.' },
  { e: '🛡️', t: 'Chráněné měny', b: 'Některé měny si můžete označit jako chráněné — nikdy se jich systém nedotkne. Hodí se pro dovolenou nebo rezervu.' },
  { e: '🔔', t: 'Vždy víte, co se děje', b: 'Před každým sweepingem dostanete upozornění. Po dokončení uvidíte kurz, zdroj i důvod přímo v detailu transakce.' }
];
let onbStep = 0;
function onbNext() {
  onbStep++;
  if (onbStep >= ONB.length) {
    lsSet('sweeping__onboarded', '1');
    goTo('home');
    return;
  }
  document.getElementById('onb-emoji').textContent = ONB[onbStep].e;
  document.getElementById('onb-title').textContent = ONB[onbStep].t;
  document.getElementById('onb-body').textContent = ONB[onbStep].b;
  for (let i = 0; i < 3; i++) {
    document.getElementById('dot' + i).classList.toggle('active', i === onbStep);
  }
  if (onbStep === ONB.length - 1) {
    document.getElementById('onb-cta').textContent = 'Začít';
  }
  track('onboarding_step', { step: onbStep });
}

// ─── Mode picker ───
function setMode(mode) {
  ['easy','ctrl','strict'].forEach(m => {
    document.getElementById('mode-' + m).classList.toggle('active', m === mode);
  });
  lsSet('sweeping__mode', mode);
  track('mode_changed', { mode });
}

// ─── Toggles ───
function toggleSetting(itemEl, key) {
  const t = itemEl.querySelector('.toggle');
  t.classList.toggle('on');
  const val = t.classList.contains('on') ? '1' : '0';
  lsSet('sweeping__' + key, val);
  track('toggle_' + key, { value: val });
}

// ─── Sheets ───
function openSheet(id) {
  document.getElementById(id).classList.add('active');
  track('sheet_open', { sheet: id });
}
function closeSheet(id) {
  document.getElementById(id).classList.remove('active');
}
function closeSheetIfBg(e, id) {
  if (e.target.id === id) closeSheet(id);
}

// ─── Settings sheets ───
function setLimit(el, val) {
  el.parentNode.querySelectorAll('.radio-item').forEach(r => r.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('limit-input').value = val;
  lsSet('sweeping__limit', val);
}
function saveRate() {
  const v = document.getElementById('rate-input').value;
  lsSet('sweeping__rate', v);
  document.getElementById('rate-display').textContent = 'EUR/CZK ' + v;
  closeSheet('sheet-rate');
  track('rate_saved', { rate: v });
}
function savedRules() {
  track('rules_saved');
  // Toast náhrada — jednoduchý alert pro prototyp
  const btn = document.querySelector('#rules .btn-primary');
  const orig = btn.textContent;
  btn.textContent = '✓ Uloženo';
  btn.style.background = 'var(--success)';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; goTo('home'); }, 900);
}
function paymentDone() {
  track('payment_confirmed');
  const btn = document.querySelector('#pay .btn-primary');
  const orig = btn.textContent;
  btn.textContent = '✓ Platba odeslána';
  btn.style.background = 'var(--success)';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; goTo('txDetail'); }, 1000);
}

// ─── Obnova stavu z localStorage ───
function restoreState() {
  const mode = lsGet('sweeping__mode');
  if (mode) setMode(mode);
  const rate = lsGet('sweeping__rate');
  if (rate) {
    document.getElementById('rate-input').value = rate;
    document.getElementById('rate-display').textContent = 'EUR/CZK ' + rate;
  }
  const limit = lsGet('sweeping__limit');
  if (limit !== null) document.getElementById('limit-input').value = limit;
  ['auto-sweep','notif-before','reject-on-fail'].forEach(k => {
    const stored = lsGet('sweeping__' + k);
    if (stored === null) return;
    const t = document.querySelector('.toggle[data-key="' + k + '"]');
    if (t) t.classList.toggle('on', stored === '1');
  });
}

// ─── Hashchange + initial restore ───
window.addEventListener('hashchange', () => {
  const id = window.location.hash.replace('#', '');
  if (id && document.getElementById(id)) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  restoreState();

  // Obnova obrazovky z URL hash při refresh
  const initialHash = window.location.hash.replace('#', '');
  const onboarded = lsGet('sweeping__onboarded') === '1';
  if (initialHash && document.getElementById(initialHash)) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(initialHash).classList.add('active');
    history.replaceState({ screen: initialHash }, '', '#' + initialHash);
  } else {
    const start = onboarded ? 'home' : 's00';
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(start).classList.add('active');
    history.replaceState({ screen: start }, '', '#' + start);
  }
});
