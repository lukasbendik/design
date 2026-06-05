function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
const state = {
  recipientName: '',
  iban: '',
  swift: '',
  street: '',
  building: '',
  city: '',
  postal: '',
  country: '',
  amount: '100,00',
  currency: 'USD',
  message: '',
  feeType: 'sha',
  rate: 23.94
};

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const url = '#' + id.replace('screen-', '');
  history.pushState({ screen: id }, '', url);
}

window.addEventListener('popstate', (e) => {
  const id = (e.state && e.state.screen) || 'screen-payment';
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
});

(function() {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('screen-' + hash)) {
    showScreen('screen-' + hash);
    history.replaceState({ screen: 'screen-' + hash }, '', window.location.hash);
  }
})();

function saveState() {
  state.recipientName = document.getElementById('input-recipient-name').value;
  state.iban = document.getElementById('input-iban').value;
  state.swift = document.getElementById('input-swift').value;
  state.street = document.getElementById('input-street').value;
  state.building = document.getElementById('input-building').value;
  state.city = document.getElementById('input-city').value;
  state.postal = document.getElementById('input-postal').value;
  state.country = document.getElementById('input-country').value;
  state.amount = document.getElementById('input-amount').value || '100,00';
  state.message = document.getElementById('input-message').value;
  lsSet('intl_payment_state', JSON.stringify(state));
}

function loadState() {
  const saved = lsGet('intl_payment_state');
  if (saved) {
    Object.assign(state, JSON.parse(saved));
    document.getElementById('input-recipient-name').value = state.recipientName;
    document.getElementById('input-iban').value = state.iban;
    document.getElementById('input-swift').value = state.swift;
    document.getElementById('input-street').value = state.street;
    document.getElementById('input-building').value = state.building;
    document.getElementById('input-city').value = state.city;
    document.getElementById('input-postal').value = state.postal;
    document.getElementById('input-country').value = state.country;
    document.getElementById('input-amount').value = state.amount;
    document.getElementById('input-message').value = state.message;
  }
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

function goToFeeType() {
  saveState();
  showScreen('screen-fee');
}

function selectFeeType(type) {
  state.feeType = type;
  document.querySelectorAll('.fee-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('fee-' + type).classList.add('selected');
}

function goToSummary() {
  saveState();
  document.getElementById('sum-avatar').textContent = getInitials(state.recipientName || 'Sa');
  document.getElementById('sum-name').textContent = state.recipientName || 'Salman bin Abdulaziz';
  document.getElementById('sum-amount').textContent = state.amount + ' USD';

  let feeLabel = '';
  let feeAmount = '';
  if (state.feeType === 'sha') {
    feeLabel = 'SHA';
    feeAmount = '200 Kč';
  } else if (state.feeType === 'our') {
    feeLabel = 'OUR';
    feeAmount = '800 Kč';
  } else {
    feeLabel = 'BEN';
    feeAmount = 'Zdarma';
  }
  document.getElementById('sum-fee-type').textContent = feeLabel;
  document.getElementById('sum-fee-amount').textContent = feeAmount;

  const amountNum = parseFloat(state.amount.replace(',', '.'));
  const total = (amountNum * state.rate).toFixed(2);
  document.getElementById('sum-total').textContent = total + ' Kč + ' + feeAmount;

  showScreen('screen-summary');
}

function goToPayment() {
  showScreen('screen-payment');
}

function goToDetail() {
  saveState();
  document.getElementById('det-avatar').textContent = getInitials(state.recipientName || 'Sa');
  document.getElementById('det-name').textContent = state.recipientName || 'Salman bin Abdulaziz';
  document.getElementById('det-iban').textContent = (state.iban || 'SA038...').substring(0, 20) + '...';
  showScreen('screen-detail');
}

function goToFee() {
  showScreen('screen-fee-detail');
}

function goToHome() {
  showScreen('screen-home');
}

document.getElementById('btn-payment-back').addEventListener('click', () => {
  goToHome();
});

document.getElementById('btn-fee-back').addEventListener('click', () => goToPayment());
document.getElementById('btn-summary-back').addEventListener('click', () => goToFeeType());
document.getElementById('btn-detail-back').addEventListener('click', () => goToSummary());
document.getElementById('btn-fee-detail-back').addEventListener('click', () => goToDetail());

loadState();

// Povolit výběr SHA jako výchozí
selectFeeType('sha');
