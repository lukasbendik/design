/* ============================================================
   Zaplať mi business — app.js
   ============================================================ */

/* ---- localStorage helpery (sandbox-safe) ---- */
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}

var STORE = 'zaplatmi_business__';
var IBAN_RAW = 'CZ6501000000001234567890';

var PRESETS = [100, 200, 500];   // rychlé předvolby (v Kč)
var MAX_CENTS = 99999999;            // max 999 999,99 Kč

/* ---- amount state: částka v haléřích (integer) ---- */
var cents = parseInt(lsGet(STORE+'cents') || '0', 10);

/* ============================================================
   NAVIGACE MEZI OBRAZOVKAMI
   ============================================================ */
function showScreen(id, opts){
  opts = opts || {};
  document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
  var el = document.getElementById(id);
  if(!el) return;
  el.classList.add('active');
  el.scrollTop = 0;
  var sc = el.querySelector('.scroll'); if(sc) sc.scrollTop = 0;

  var hash = id.replace('screen-','');
  if(!opts.skipHistory){
    history.pushState({screen:id}, '', '#'+hash);
  }
  trackPageView(hash);
}

/* ---- GA / Clarity virtuální page_view ---- */
var TITLES = {
  home:'Zaplať mi business — Domů',
  keypad:'Zaplať mi business — Pokladna (klávesnice)',
  qr:'Zaplať mi business — QR platba'
};
function trackPageView(hash){
  var title = TITLES[hash] || 'Zaplať mi business';
  document.title = 'Prototyp: ' + title;
  if(typeof gtag === 'function'){
    gtag('event','page_view',{
      page_title:title,
      page_path:'/zaplatmi-business/'+hash,
      page_location:location.href
    });
  }
  if(typeof clarity === 'function'){ try{ clarity('set','screen',hash); }catch(e){} }
}

/* ---- prohlížečové Zpět ---- */
window.addEventListener('popstate', function(e){
  var id = (e.state && e.state.screen) || 'screen-home';
  showScreenNoHist(id);
});
function showScreenNoHist(id){
  document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
  var el = document.getElementById(id);
  if(el){ el.classList.add('active'); }
  trackPageView(id.replace('screen-',''));
  if(id === 'screen-qr') renderQR();
  if(id === 'screen-keypad') updateKeypad();
}

/* ---- Obnova obrazovky z URL hash při refresh ---- */
(function(){
  var hash = window.location.hash.replace('#','');
  if(hash){
    var screenId = 'screen-' + hash;
    var el = document.getElementById(screenId);
    if(el){
      showScreen(screenId, { skipHistory:true });
      history.replaceState({ screen:screenId }, '', window.location.hash);
      if(screenId === 'screen-qr') renderQR();
      if(screenId === 'screen-keypad') updateKeypad();
    }
  }
})();

/* ============================================================
   ČÁSTKA — formátování (z haléřů)
   ============================================================ */
function formatCents(c){
  var kc = Math.floor(c / 100);
  var ha = c % 100;
  var kcStr = kc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return kcStr + ',' + ha.toString().padStart(2,'0');
}
function amountForQR(c){ return (c/100).toFixed(2); }              // SPAYD AM
function amountDisplay(c){ return formatCents(c) + ' Kč'; }

/* ============================================================
   RYCHLÉ PŘEDVOLBY
   ============================================================ */
function renderPresets(){
  var wrap = document.getElementById('kp-presets');
  if(!wrap) return;
  wrap.innerHTML = '';

  PRESETS.forEach(function(kc){
    addPreset(wrap, kc*100, kc + ' Kč');
  });
  // "Naposledy" chip jako poslední na novém řádku (pokud existuje a liší se od presetů)
  var lastCents = parseInt(lsGet(STORE+'lastCents') || '0', 10);
  if(lastCents > 0 && PRESETS.indexOf(lastCents/100) === -1){
    var brk = document.createElement('span');
    brk.className = 'kp-presets-break';
    wrap.appendChild(brk);
    addPreset(wrap, lastCents, 'Naposledy ' + formatCents(lastCents) + ' Kč', true);
  }
}
function addPreset(wrap, c, label, isLast){
  var b = document.createElement('button');
  b.className = 'kp-preset' + (isLast ? ' kp-preset-last' : '');
  b.type = 'button';
  b.textContent = label;
  b.addEventListener('click', function(){
    cents = c;
    lsSet(STORE+'cents', String(cents));
    updateKeypad();
  });
  wrap.appendChild(b);
}

/* ============================================================
   KLÁVESNICE
   ============================================================ */
function updateKeypad(){
  var disp = document.getElementById('kp-display');
  var box = document.querySelector('.kp-amount');
  var payBtn = document.getElementById('btn-pay');
  if(!disp) return;
  disp.textContent = formatCents(cents);
  box.classList.toggle('empty', cents === 0);
  payBtn.disabled = cents <= 0;
}

function pressKey(k){
  if(k === 'del'){
    cents = Math.floor(cents / 10);
  } else if(k === '00'){
    cents = cents * 100;
  } else {
    cents = cents * 10 + parseInt(k, 10);
  }
  if(cents > MAX_CENTS) cents = MAX_CENTS;
  lsSet(STORE+'cents', String(cents));
  updateKeypad();
}

/* ============================================================
   QR OBRAZOVKA
   ============================================================ */
function newPaymentId(){
  // VS: datum + pořadové číslo (max 10 číslic dle SPAYD)
  var d = new Date();
  var ymd = (d.getMonth()+1).toString().padStart(2,'0') + d.getDate().toString().padStart(2,'0');
  var seq = (parseInt(lsGet(STORE+'seq') || '0', 10) + 1);
  lsSet(STORE+'seq', String(seq));
  var vs = ymd + seq.toString().padStart(4,'0'); // 8 číslic
  var pid = 'PLT-' + d.getFullYear() + ymd + '-' + seq.toString().padStart(4,'0');
  lsSet(STORE+'vs', vs);
  lsSet(STORE+'paymentId', pid);
  return { vs:vs, pid:pid };
}

var qrInstance = null;
function renderQR(){
  var amtFixed = amountForQR(cents);
  var vs = lsGet(STORE+'vs') || '';
  var pid = lsGet(STORE+'paymentId') || '—';

  document.getElementById('qr-amount').textContent = amountDisplay(cents);
  document.getElementById('qr-id-val').textContent = pid;

  // SPAYD — český QR formát platby
  var spayd = 'SPD*1.0*ACC:' + IBAN_RAW + '*AM:' + amtFixed + '*CC:CZK*X-VS:' + vs + '*MSG:POKLADNA';

  var box = document.getElementById('qr-canvas');
  box.innerHTML = '';
  if(typeof QRCode !== 'undefined'){
    qrInstance = new QRCode(box, {
      text: spayd,
      width: 220,
      height: 220,
      correctLevel: QRCode.CorrectLevel.M
    });
  } else {
    box.textContent = 'QR: ' + spayd;
  }
}

/* ============================================================
   EVENT LISTENERY
   ============================================================ */
document.addEventListener('DOMContentLoaded', function(){

  renderPresets();

  // Domů → Pokladna (klávesnice)
  document.getElementById('btn-pokladna').addEventListener('click', function(){
    showScreen('screen-keypad');
    updateKeypad();
  });

  // Klávesnice — zpět na domů
  document.getElementById('btn-keypad-back').addEventListener('click', function(){
    showScreen('screen-home');
  });

  // Klávesy
  document.querySelectorAll('.kp-key').forEach(function(btn){
    btn.addEventListener('click', function(){ pressKey(btn.getAttribute('data-k')); });
  });

  // Zaplatit → vygeneruj ID + QR, ulož poslední částku, započítej platbu
  document.getElementById('btn-pay').addEventListener('click', function(){
    if(cents <= 0) return;
    newPaymentId();
    lsSet(STORE+'lastCents', String(cents));
    renderPresets();
    showScreen('screen-qr');
    renderQR();
  });

  // QR — zpět na klávesnici
  document.getElementById('btn-qr-back').addEventListener('click', function(){
    showScreen('screen-keypad');
    updateKeypad();
  });

  // QR — Zadat další → klávesnice (reset částky)
  document.getElementById('btn-qr-another').addEventListener('click', function(){
    cents = 0;
    lsSet(STORE+'cents', '0');
    showScreen('screen-keypad');
    updateKeypad();
  });

  updateKeypad();
  // počáteční page_view pokud nejsme z hashe
  if(!window.location.hash) trackPageView('home');
});
