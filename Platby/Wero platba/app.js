// ====== NAVIGATION ======
var history_stack = [];

function goTo(screenId, opts) {
  opts = opts || {};
  var screens = document.querySelectorAll('.screen');
  screens.forEach(function(s){ s.classList.remove('active'); });
  var next = document.getElementById('screen-' + screenId);
  if (next) {
    next.classList.add('active');
    if (!opts.skipHistory) {
      history.pushState({ screen: 'screen-' + screenId }, '', '#' + screenId);
    } else {
      history.replaceState({ screen: 'screen-' + screenId }, '', '#' + screenId);
    }
    trackScreen(screenId);
  }
}

window.addEventListener('popstate', function(e) {
  var screenId = null;
  if (e.state && e.state.screen) {
    screenId = e.state.screen;
  } else {
    var hash = window.location.hash.replace('#', '');
    if (hash) screenId = 'screen-' + hash;
  }
  if (screenId) {
    var screens = document.querySelectorAll('.screen');
    screens.forEach(function(s){ s.classList.remove('active'); });
    var el = document.getElementById(screenId);
    if (el) {
      el.classList.add('active');
      trackScreen(screenId.replace('screen-', ''));
    }
  }
});

// Obnova obrazovky z URL hash při refresh
(function() {
  var hash = window.location.hash.replace('#', '');
  if (hash) {
    var screenId = 'screen-' + hash;
    var el = document.getElementById(screenId);
    if (el) {
      var screens = document.querySelectorAll('.screen');
      screens.forEach(function(s){ s.classList.remove('active'); });
      el.classList.add('active');
      history.replaceState({ screen: screenId }, '', window.location.hash);
    }
  } else {
    // Nastav výchozí stav pro první obrazovku, aby gesto zpět fungovalo hned od začátku
    var active = document.querySelector('.screen.active');
    if (active) {
      history.replaceState({ screen: active.id }, '', '#' + active.id.replace('screen-', ''));
    }
  }
})();

// ====== WERO CURRENCY SHEET ======
var weroCur = { code: 'EUR', flag: '🇪🇺', label: 'EUR', balance: '334,26 EUR' };

function openWeroCurSheet() {
  document.getElementById('wero-cur-overlay').classList.add('open');
  document.getElementById('wero-cur-sheet').classList.add('open');
}
function closeWeroCurSheet() {
  document.getElementById('wero-cur-overlay').classList.remove('open');
  document.getElementById('wero-cur-sheet').classList.remove('open');
}
function selectWeroCur(code, flag, label, balance) {
  // deselect all
  ['EUR','CZK','USD','GBP'].forEach(function(c) {
    var el = document.getElementById('cur-item-' + c);
    if (el) el.classList.toggle('selected', c === code);
  });
  weroCur = { code: code, flag: flag, label: label, balance: balance };
  lsSet('wero_cur', JSON.stringify(weroCur));
  // update UI
  document.getElementById('wero-cur-flag').textContent = flag;
  document.getElementById('wero-cur-code').textContent = label;
  var hint = document.getElementById('wero-balance-hint');
  if (hint) hint.innerHTML = 'Na účtu máte <span>' + balance + '</span>.';
  // update quick chips
  var quickMap = { EUR:[10,20,50,100], CZK:[100,200,500,1000], USD:[10,25,50,100], GBP:[10,20,50,100] };
  var amounts = quickMap[code] || [10,20,50,100];
  var chips = document.querySelectorAll('.quick-chip');
  chips.forEach(function(btn, i) {
    var val = amounts[i];
    btn.textContent = val + ' ' + label;
    btn.setAttribute('onclick', 'setAmount(' + val + ')');
  });
  closeWeroCurSheet();
}

// ====== WERO TABS ======
function switchWeroTab(tab) {
  document.getElementById('tab-contacts').classList.toggle('active', tab === 'contacts');
  document.getElementById('tab-phone').classList.toggle('active', tab === 'phone');
  document.getElementById('wero-contacts-panel').style.display = tab === 'contacts' ? '' : 'none';
  document.getElementById('wero-phone-panel').style.display = tab === 'phone' ? '' : 'none';
}

// ====== LS HELPERS ======
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch(e) {} }
function lsGet(k) { try { return localStorage.getItem(k); } catch(e) { return null; } }
function lsRemove(k) { try { localStorage.removeItem(k); } catch(e) {} }

// ====== RESET STATE ======
function resetWeroState() {
  ['wero_name','wero_color','wero_phone','wero_initial','wero_amount','wero_message','wero_cur'].forEach(lsRemove);
  var amtInp = document.getElementById('wero-amount');
  if (amtInp) amtInp.value = '';
  var msgInp = document.getElementById('wero-message');
  if (msgInp) msgInp.value = '';
  // reset currency to default EUR
  weroCur = { code: 'EUR', flag: '🇪🇺', label: 'EUR', balance: '334,26 EUR' };
  var flagEl = document.getElementById('wero-cur-flag');
  if (flagEl) flagEl.textContent = '🇪🇺';
  var codeEl = document.getElementById('wero-cur-code');
  if (codeEl) codeEl.textContent = 'EUR';
  var hint = document.getElementById('wero-balance-hint');
  if (hint) hint.innerHTML = 'Na účtu máte <span>334,26 EUR</span>.';
  // reset quick chips
  var chips = document.querySelectorAll('.quick-chip');
  var defaults = [10,20,50,100];
  chips.forEach(function(btn,i){ btn.textContent = defaults[i]+' EUR'; btn.setAttribute('onclick','setAmount('+defaults[i]+')'); });
  ['EUR','CZK','USD','GBP'].forEach(function(c){
    var el = document.getElementById('cur-item-'+c);
    if (el) el.classList.toggle('selected', c==='EUR');
  });
}

// ====== PREPARE CONFIRMATION ======
function prepareConfirmation() {
  var name = lsGet('wero_name') || document.getElementById('castka-name').textContent;
  var phone = lsGet('wero_phone') || document.getElementById('castka-phone').textContent;
  var color = lsGet('wero_color') || '#FF6B6B';
  var amount = document.getElementById('wero-amount').value || lsGet('wero_amount') || '0';
  var msg = document.getElementById('wero-message').value || lsGet('wero_message') || '';
  var cur = weroCur.label || 'EUR';

  // save current amount
  lsSet('wero_amount', amount);

  var initial = name.charAt(0).toUpperCase();
  var avatarEl = document.getElementById('potv-avatar');
  if (avatarEl) { avatarEl.style.background = color; avatarEl.childNodes[0].textContent = initial; }
  var nameEl = document.getElementById('potv-name');
  if (nameEl) nameEl.textContent = name;
  var phoneEl = document.getElementById('potv-phone');
  if (phoneEl) phoneEl.textContent = phone;

  var formatted = parseFloat(amount||0).toLocaleString('cs-CZ',{minimumFractionDigits:0,maximumFractionDigits:2});
  var amtEl = document.getElementById('potv-amount');
  if (amtEl) amtEl.textContent = formatted;
  var curEl = document.getElementById('potv-cur-label');
  if (curEl) curEl.textContent = cur;

  var msgEl = document.getElementById('potv-message');
  if (msgEl) { msgEl.textContent = msg || '—'; msgEl.style.color = msg ? 'var(--text)' : 'var(--text-3)'; }
}

// ====== SELECT CONTACT ======
function selectContact(fullName, key, color, phone) {
  lsSet('wero_name', fullName);
  lsSet('wero_color', color);
  lsSet('wero_phone', phone);
  lsSet('wero_initial', fullName.charAt(0).toUpperCase());

  // Update castka screen
  document.getElementById('castka-avatar').style.background = color;
  document.getElementById('castka-avatar').childNodes[0].textContent = fullName.charAt(0).toUpperCase();
  document.getElementById('castka-name').textContent = fullName;
  document.getElementById('castka-phone').textContent = phone;

  // Update potvrzeni screen
  document.getElementById('potv-avatar').style.background = color;
  document.getElementById('potv-avatar').childNodes[0].textContent = fullName.charAt(0).toUpperCase();
  document.getElementById('potv-name').textContent = fullName;
  document.getElementById('potv-phone').textContent = phone;

  // Update uspech screen
  document.getElementById('uspech-name').textContent = fullName;
  document.getElementById('uspech-name2').textContent = fullName;
  document.getElementById('uspech-phone').textContent = phone;

  goTo('wero-castka');
}

// ====== AMOUNT ======
function setAmount(val) {
  document.getElementById('wero-amount').value = val;
  lsSet('wero_amount', val);
  updateWeroAmount();
}

function updateWeroAmount() {
  var val = document.getElementById('wero-amount').value;
  lsSet('wero_amount', val);
  var cur = weroCur.label || 'EUR';
  var formatted = parseFloat(val || 0).toLocaleString('cs-CZ', {minimumFractionDigits: 0, maximumFractionDigits: 2});
  document.getElementById('potv-amount').textContent = formatted;
  // update currency label on confirm screen
  var potvCur = document.getElementById('potv-cur-label');
  if (potvCur) potvCur.textContent = cur;
  var uspechAmt = formatted + ' ' + cur;
  document.getElementById('uspech-amount').textContent = uspechAmt;
  document.getElementById('uspech-amount2').textContent = uspechAmt;
}

// ====== SEND PAYMENT ======
function sendWeroPayment() {
  var name = lsGet('wero_name') || document.getElementById('potv-name').textContent;
  var phone = lsGet('wero_phone') || document.getElementById('potv-phone').textContent;
  var amount = document.getElementById('potv-amount').textContent;
  var cur = (document.getElementById('potv-cur-label') || {}).textContent || 'EUR';
  var uspechAmt = amount + ' ' + cur;
  document.getElementById('uspech-name').textContent = name;
  document.getElementById('uspech-name2').textContent = name;
  document.getElementById('uspech-phone').textContent = phone;
  document.getElementById('uspech-amount').textContent = uspechAmt;
  document.getElementById('uspech-amount2').textContent = uspechAmt;
  goTo('wero-uspech');
}

// ====== PIN SHEET ======
var pinValue = '';

function openPinSheet() {
  pinValue = '';
  updatePinDots();
  document.getElementById('pin-overlay').classList.add('open');
  document.getElementById('pin-sheet').classList.add('open');
}

function closePinSheet() {
  document.getElementById('pin-overlay').classList.remove('open');
  document.getElementById('pin-sheet').classList.remove('open');
  pinValue = '';
  updatePinDots();
}

function updatePinDots() {
  for (var i = 0; i < 6; i++) {
    var dot = document.getElementById('dot-' + i);
    dot.classList.toggle('filled', i < pinValue.length);
    dot.classList.remove('error');
  }
}

function pinInput(digit) {
  if (pinValue.length >= 6) return;
  pinValue += digit;
  updatePinDots();
  if (pinValue.length === 6) {
    setTimeout(function() {
      closePinSheet();
      sendWeroPayment();
    }, 180);
  }
}

function pinDelete() {
  pinValue = pinValue.slice(0, -1);
  updatePinDots();
}

function pinFaceId() {
  // simulace Face ID – rovnou potvrdí
  for (var i = 0; i < 6; i++) {
    var dot = document.getElementById('dot-' + i);
    dot.classList.add('filled');
  }
  setTimeout(function() {
    closePinSheet();
    sendWeroPayment();
  }, 400);
}

// ====== RESTORE localStorage ======
(function restoreState() {
  var savedCur = lsGet('wero_cur');
  if (savedCur) {
    try {
      var c = JSON.parse(savedCur);
      selectWeroCur(c.code, c.flag, c.label, c.balance);
    } catch(e) {}
  }
  var name = lsGet('wero_name');
  var color = lsGet('wero_color');
  var phone = lsGet('wero_phone');
  var amount = lsGet('wero_amount');

  if (name) {
    var initial = name.charAt(0).toUpperCase();
    ['castka', 'potv'].forEach(function(prefix) {
      var el = document.getElementById(prefix + '-avatar');
      if (el) { el.style.background = color || '#FF6B6B'; el.childNodes[0].textContent = initial; }
      var nameEl = document.getElementById(prefix + '-name');
      if (nameEl) nameEl.textContent = name;
      var phoneEl = document.getElementById(prefix + '-phone');
      if (phoneEl) phoneEl.textContent = phone || '';
    });
    if (document.getElementById('uspech-name')) document.getElementById('uspech-name').textContent = name;
    if (document.getElementById('uspech-name2')) document.getElementById('uspech-name2').textContent = name;
    if (document.getElementById('uspech-phone')) document.getElementById('uspech-phone').textContent = phone || '';
  }
  if (amount) {
    var inp = document.getElementById('wero-amount');
    if (inp) inp.value = amount;
    updateWeroAmount();
  }
  var msg = lsGet('wero_message');
  if (msg) {
    var msgInp = document.getElementById('wero-message');
    if (msgInp) msgInp.value = msg;
  }
})();
