/* ============================================================
   Zaplať mi business — app.js
   ============================================================ */

/* ---- localStorage helpery (sandbox-safe) ---- */
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}

var STORE = 'zaplatmi_business__';
var ACCOUNT = '1234567890/0100';
var IBAN_RAW = 'CZ6501000000001234567890';
var IBAN_FMT = 'CZ65 0100 0000 0012 3456 7890';

/* ---- amount state (v haléřích jako string s desetinnou čárkou) ---- */
var amount = lsGet(STORE+'amount') || '';

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
   ČÁSTKA — formátování
   ============================================================ */
function formatAmount(raw){
  if(!raw) return '0';
  var parts = raw.split(',');
  var intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  if(parts.length > 1){
    return intPart + ',' + parts[1];
  }
  return intPart + (raw.indexOf(',') > -1 ? ',' : '');
}
function amountNumber(raw){
  if(!raw) return 0;
  return parseFloat(raw.replace(/\s/g,'').replace(',','.')) || 0;
}
function amountForQR(raw){
  // SPAYD AM: vždy s tečkou a 2 desetinnými místy
  return amountNumber(raw).toFixed(2);
}
function amountDisplay(raw){
  var n = amountNumber(raw);
  return n.toLocaleString('cs-CZ',{minimumFractionDigits:2, maximumFractionDigits:2}) + ' Kč';
}

/* ============================================================
   KLÁVESNICE
   ============================================================ */
function updateKeypad(){
  var disp = document.getElementById('kp-display');
  var box = document.querySelector('.kp-amount');
  var payBtn = document.getElementById('btn-pay');
  if(!disp) return;
  disp.textContent = formatAmount(amount);
  box.classList.toggle('empty', !amount || amountNumber(amount) === 0);
  payBtn.disabled = amountNumber(amount) <= 0;
}

function pressKey(k){
  if(k === 'del'){
    amount = amount.slice(0,-1);
  } else if(k === ','){
    if(amount.indexOf(',') === -1 && amount.length > 0) amount += ',';
    else if(amount.length === 0) amount = '0,';
  } else {
    // číslice
    if(amount.indexOf(',') > -1){
      var dec = amount.split(',')[1];
      if(dec.length >= 2) return;        // max 2 desetinná místa
    }
    var intPart = amount.split(',')[0].replace(/\s/g,'');
    if(amount.indexOf(',') === -1 && intPart.length >= 7) return; // max 7 číslic celé části
    if(amount === '0') amount = k;       // nahraď úvodní nulu
    else amount += k;
  }
  lsSet(STORE+'amount', amount);
  updateKeypad();
}

/* ============================================================
   QR OBRAZOVKA
   ============================================================ */
function genPaymentId(){
  var id = lsGet(STORE+'paymentId');
  return id || '—';
}
function newPaymentId(){
  // VS: datum + pořadové číslo (max 10 číslic dle SPAYD)
  var d = new Date();
  var ymd = '' + (d.getMonth()+1).toString().padStart(2,'0') + d.getDate().toString().padStart(2,'0');
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
  var amtFixed = amountForQR(amount);
  var vs = lsGet(STORE+'vs') || '';
  var pid = lsGet(STORE+'paymentId') || '—';

  document.getElementById('qr-amount').textContent = amountDisplay(amount);
  document.getElementById('qr-id-val').textContent = pid;
  document.getElementById('qr-account').textContent = ACCOUNT;
  document.getElementById('qr-iban').textContent = IBAN_FMT;
  document.getElementById('qr-vs').textContent = vs || '—';

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

  // Zaplatit → vygeneruj ID + QR
  document.getElementById('btn-pay').addEventListener('click', function(){
    if(amountNumber(amount) <= 0) return;
    newPaymentId();
    showScreen('screen-qr');
    renderQR();
  });

  // QR — zpět na klávesnici
  document.getElementById('btn-qr-back').addEventListener('click', function(){
    showScreen('screen-keypad');
    updateKeypad();
  });

  // QR — Zavřít → domů (reset částky)
  document.getElementById('btn-qr-close').addEventListener('click', function(){
    amount = '';
    lsSet(STORE+'amount', '');
    showScreen('screen-home');
  });

  // QR — Zadat další → klávesnice (reset částky)
  document.getElementById('btn-qr-another').addEventListener('click', function(){
    amount = '';
    lsSet(STORE+'amount', '');
    showScreen('screen-keypad');
    updateKeypad();
  });

  updateKeypad();
  // počáteční page_view pokud nejsme z hashe
  if(!window.location.hash) trackPageView('home');
});
