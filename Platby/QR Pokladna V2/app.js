(function(){
  'use strict';

  var STORE = 'qr_pokladna_v2__state';
  var state;
  var entryBuffer = '';
  var entryMode = 'keypad';
  var calcExpression = '';
  var countdownTimer = null;
  var verifyTimer = null;

  var statusLabels = {
    pending: 'Čeká na platbu',
    paid: 'Zaplaceno',
    expired: 'Vypršelo',
    failed: 'Neprošlo'
  };

  function defaults(){
    var now = Date.now();
    return {
      selectedTill: 'till-1',
      tills: [
        {id:'till-1',name:'Stánek – keramika',category:'Keramika'},
        {id:'till-2',name:'Dílna',category:'Kurzy'}
      ],
      settings: {
        account:'CZ6501000000001234567890', expiry:10, eur:true,
        categories:['Keramika','Šperky','Kurzy'], accounting:true,
        notifications:true, employee:false
      },
      current: {
        id:null, amountCents:0, currency:'CZK', category:'Keramika', note:'',
        status:'empty', createdAt:null, expiresAt:null
      },
      payments: [
        {id:'QR-260805-018',amountCents:89000,currency:'CZK',till:'till-1',tillName:'Stánek – keramika',category:'Keramika',note:'Váza',status:'paid',createdAt:now-12*60000,updatedAt:now-11*60000},
        {id:'QR-260805-017',amountCents:45000,currency:'CZK',till:'till-2',tillName:'Dílna',category:'Kurzy',note:'Doplatek kurzu',status:'paid',createdAt:now-37*60000,updatedAt:now-36*60000},
        {id:'QR-260805-016',amountCents:120000,currency:'CZK',till:'till-1',tillName:'Stánek – keramika',category:'Šperky',note:'',status:'expired',createdAt:now-82*60000,updatedAt:now-72*60000},
        {id:'QR-260805-015',amountCents:33000,currency:'CZK',till:'till-1',tillName:'Stánek – keramika',category:'Keramika',note:'Miska',status:'paid',createdAt:now-113*60000,updatedAt:now-112*60000}
      ],
      sequence:18,
      lastAmountCents:0
    };
  }

  function loadState(){
    try{
      var parsed = JSON.parse(localStorage.getItem(STORE));
      if(parsed && parsed.settings && Array.isArray(parsed.tills) && parsed.current){
        var base = defaults();
        parsed.settings = Object.assign(base.settings, parsed.settings);
        parsed.payments = Array.isArray(parsed.payments) ? parsed.payments : base.payments;
        return parsed;
      }
    }catch(e){}
    return defaults();
  }

  function saveState(){
    try{ localStorage.setItem(STORE, JSON.stringify(state)); }catch(e){}
  }

  function el(id){ return document.getElementById(id); }
  function qsa(selector, root){ return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }
  function escapeHtml(value){
    return String(value == null ? '' : value).replace(/[&<>'"]/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch];});
  }
  function selectedTill(){
    return state.tills.find(function(t){return t.id === state.selectedTill;}) || state.tills[0];
  }
  function currencyLabel(code){ return code === 'EUR' ? 'EUR' : 'Kč'; }
  function formatAmount(cents, currency){
    return new Intl.NumberFormat('cs-CZ',{style:'currency',currency:currency || 'CZK',minimumFractionDigits:2,maximumFractionDigits:2}).format((cents || 0)/100);
  }
  function formatTime(timestamp){
    if(!timestamp) return '—';
    return new Intl.DateTimeFormat('cs-CZ',{hour:'2-digit',minute:'2-digit'}).format(new Date(timestamp));
  }
  function formatDateTime(timestamp){
    if(!timestamp) return '—';
    return new Intl.DateTimeFormat('cs-CZ',{day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(timestamp));
  }
  function plainAmount(cents){ return ((cents || 0)/100).toFixed(2).replace('.',','); }
  function normalizeBuffer(value){
    var clean = String(value || '').replace(/\s/g,'').replace(/[^0-9,.]/g,'').replace(',','.');
    var pieces = clean.split('.');
    var whole = (pieces.shift() || '').replace(/^0+(?=\d)/,'');
    var decimal = pieces.join('').slice(0,2);
    return whole + (clean.indexOf('.') >= 0 ? '.' + decimal : '');
  }
  function centsFromBuffer(buffer){
    var number = Number(buffer || 0);
    if(!isFinite(number) || number < 0) return 0;
    return Math.min(Math.round(number*100),999999999);
  }

  function setRoute(route, replace){
    var hash = '#'+route;
    if(location.hash === hash){ renderRoute(); return; }
    if(replace) history.replaceState(null,'',hash); else location.hash = route;
    renderRoute();
  }

  function routeFromHash(){
    var hash = location.hash.slice(1);
    if(hash.indexOf('nastaveni') === 0) return 'nastaveni';
    if(hash === 'platby') return 'platby';
    return 'pokladna';
  }

  function renderRoute(){
    var route = routeFromHash();
    qsa('.view').forEach(function(view){ view.classList.toggle('active',view.id === 'view-'+route); });
    qsa('[data-route]').forEach(function(button){ button.classList.toggle('active',button.getAttribute('data-route') === route); });
    document.title = 'Prototyp: QR Pokladna V2 – '+({pokladna:'Pokladna',platby:'Platby',nastaveni:'Nastavení'}[route]);
    if(route === 'pokladna') renderCashier();
    if(route === 'platby') renderPayments();
    if(route === 'nastaveni') renderSettings();
    if(location.hash.indexOf('#nastaveni-') === 0){
      setTimeout(function(){ var target=el(location.hash.slice(1)); if(target) target.scrollIntoView({block:'start'}); },0);
    }else{ window.scrollTo({top:0,behavior:'auto'}); }
  }

  function makePaymentId(){
    state.sequence = (state.sequence || 0) + 1;
    var d = new Date();
    var yy = String(d.getFullYear()).slice(-2);
    var mm = String(d.getMonth()+1).padStart(2,'0');
    var dd = String(d.getDate()).padStart(2,'0');
    return 'QR-'+yy+mm+dd+'-'+String(state.sequence).padStart(3,'0');
  }

  function ensureCurrent(){
    var current = state.current;
    if(current.amountCents <= 0){
      current.id = null; current.status = 'empty'; current.createdAt = null; current.expiresAt = null;
      return;
    }
    if(!current.id || current.status !== 'pending'){
      current.id = makePaymentId();
      current.status = 'pending';
      current.createdAt = Date.now();
      current.expiresAt = current.createdAt + Number(state.settings.expiry || 10)*60000;
      current.till = state.selectedTill;
      current.tillName = selectedTill().name;
    }
  }

  function updateAmount(cents, preserveInput){
    state.current.amountCents = Math.max(0,Math.min(cents,999999999));
    if(state.current.amountCents > 0) ensureCurrent();
    else ensureCurrent();
    saveState();
    renderCashier(preserveInput);
  }

  function renderCashier(preserveInput){
    var till = selectedTill();
    renderTillOptions();
    renderCategoryOptions();
    el('mobileTillName').textContent = till.name;
    if(document.activeElement !== el('amountInput') || !preserveInput){
      el('amountInput').value = formatAmount(state.current.amountCents,state.current.currency).replace(/\s?(Kč|€)$/,'').trim();
    }
    el('currencySelect').value = state.current.currency;
    el('qrAmount').textContent = formatAmount(state.current.amountCents,state.current.currency);
    el('qrMeta').textContent = (state.current.tillName || till.name)+' · '+state.current.currency;
    el('categorySelect').value = state.current.category || till.category || state.settings.categories[0];
    el('noteInput').value = state.current.note || '';
    renderLastAmount();
    renderQRCode();
    renderRecentPayments();
    updateBadges();
  }

  function renderTillOptions(){
    var select = el('tillSelect');
    select.innerHTML = '';
    state.tills.forEach(function(till){
      var option=document.createElement('option'); option.value=till.id; option.textContent=till.name; select.appendChild(option);
    });
    select.value=state.selectedTill;
  }

  function renderCategoryOptions(){
    ['categorySelect','newTillCategory'].forEach(function(id){
      var select=el(id); if(!select) return;
      var current=select.value;
      select.innerHTML='';
      state.settings.categories.forEach(function(category){
        var option=document.createElement('option'); option.value=category; option.textContent=category; select.appendChild(option);
      });
      if(state.settings.categories.indexOf(current)>=0) select.value=current;
    });
  }

  function renderLastAmount(){
    var button=el('lastAmountPreset');
    if(state.lastAmountCents>0){
      button.hidden=false;
      button.textContent='Naposledy '+formatAmount(state.lastAmountCents,state.current.currency);
      button.setAttribute('data-preset',String(state.lastAmountCents/100));
    }else button.hidden=true;
  }

  function safeMessage(){
    var bits=[];
    if(state.settings.accounting) bits.push(selectedTill().name,state.current.category);
    if(state.current.note) bits.push(state.current.note);
    return bits.join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9 .,_-]/g,' ').replace(/\s+/g,' ').trim().toUpperCase().slice(0,28) || 'QR POKLADNA';
  }

  function spaydString(){
    var vs=String(state.sequence || 1).padStart(10,'0').slice(-10);
    return 'SPD*1.0*ACC:'+state.settings.account+'*AM:'+(state.current.amountCents/100).toFixed(2)+'*CC:'+state.current.currency+'*X-VS:'+vs+'*MSG:'+safeMessage();
  }

  function renderQRCode(){
    var current=state.current;
    var frame=el('qrFrame'), code=el('qrCode'), placeholder=el('qrPlaceholder');
    var status=el('paymentStatus'), statusText=status.querySelector('span');
    var enabled=current.amountCents>0;
    frame.classList.toggle('empty',!enabled);
    placeholder.hidden=enabled;
    code.hidden=!enabled;
    code.innerHTML='';
    status.className='status-chip '+(enabled ? current.status : 'empty');
    statusText.textContent=enabled ? statusLabels[current.status] : 'Zadejte částku';
    el('verifyPayment').disabled=!enabled || current.status!=='pending';
    el('newPayment').disabled=!enabled;
    el('failPayment').disabled=!enabled || current.status!=='pending';
    el('qrExpiry').hidden=!enabled || current.status!=='pending';
    if(!enabled){
      el('qrHelp').textContent='Zákazník načte QR ve své bankovní aplikaci.';
      stopCountdown();
      return;
    }
    if(typeof QRCode!=='undefined'){
      try{
        new QRCode(code,{text:spaydString(),width:280,height:280,correctLevel:QRCode.CorrectLevel.M});
      }catch(error){
        code.innerHTML='';
        try{new QRCode(code,{text:spaydString(),width:280,height:280,correctLevel:QRCode.CorrectLevel.L});}
        catch(fallbackError){code.textContent='QR kód se nepodařilo vytvořit.';}
      }
    }else{
      code.textContent='QR kód se nepodařilo načíst.';
    }
    if(current.status==='pending'){
      el('qrHelp').textContent='Zákazník načte QR ve své bankovní aplikaci.';
      startCountdown();
    }else if(current.status==='paid'){
      el('qrHelp').textContent='Platba potvrzena. Můžete připravit další QR.';
      stopCountdown();
    }else if(current.status==='failed'){
      el('qrHelp').textContent='Platba nebyla dokončena. Vytvořte další požadavek.';
      stopCountdown();
    }else if(current.status==='expired'){
      el('qrHelp').textContent='Platnost skončila. Tlačítkem Další platba vytvoříte nový QR.';
      stopCountdown();
    }
  }

  function stopCountdown(){ if(countdownTimer){clearInterval(countdownTimer);countdownTimer=null;} }
  function startCountdown(){
    stopCountdown(); updateCountdown(); countdownTimer=setInterval(updateCountdown,1000);
  }
  function updateCountdown(){
    if(state.current.status!=='pending' || !state.current.expiresAt){stopCountdown();return;}
    var remaining=Math.max(0,state.current.expiresAt-Date.now());
    var total=Math.ceil(remaining/1000), min=Math.floor(total/60), sec=total%60;
    el('expiryText').textContent=String(min).padStart(2,'0')+':'+String(sec).padStart(2,'0');
    if(remaining<=0){
      state.current.status='expired'; archiveCurrent(); saveState(); renderCashier();
    }
  }

  function archiveCurrent(){
    var current=state.current;
    if(!current.id || current.amountCents<=0) return;
    var existing=state.payments.findIndex(function(p){return p.id===current.id;});
    var till=state.tills.find(function(item){return item.id===current.till;}) || selectedTill();
    var payment={
      id:current.id,amountCents:current.amountCents,currency:current.currency,till:current.till||till.id,tillName:current.tillName||till.name,
      category:current.category,note:current.note,status:current.status,createdAt:current.createdAt,updatedAt:Date.now()
    };
    if(existing>=0) state.payments[existing]=payment; else state.payments.unshift(payment);
    state.payments=state.payments.sort(function(a,b){return b.createdAt-a.createdAt;}).slice(0,20);
  }

  function visiblePayments(){
    var list=state.payments.slice();
    if(state.current.id && state.current.amountCents>0 && !list.some(function(p){return p.id===state.current.id;})){
      var till=selectedTill();
      list.unshift(Object.assign({},state.current,{till:state.current.till||till.id,tillName:state.current.tillName||till.name,updatedAt:Date.now()}));
    }
    return list.sort(function(a,b){return b.createdAt-a.createdAt;});
  }

  function transactionIcon(status){
    if(status==='paid') return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>';
    if(status==='failed') return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>';
    if(status==='expired') return '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>';
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5h4"/></svg>';
  }

  function transactionHtml(payment){
    var description=[payment.tillName,payment.category,payment.note].filter(Boolean).join(' · ');
    return '<button class="transaction-row '+escapeHtml(payment.status)+'" type="button" data-payment-id="'+escapeHtml(payment.id)+'">'+
      '<span class="transaction-icon">'+transactionIcon(payment.status)+'</span>'+
      '<span class="transaction-main"><strong>'+escapeHtml(description || 'QR platba')+'</strong><small>'+escapeHtml(payment.id)+' · '+escapeHtml(formatTime(payment.createdAt))+'</small></span>'+
      '<span class="transaction-side"><strong>'+escapeHtml(formatAmount(payment.amountCents,payment.currency))+'</strong><span>'+escapeHtml(statusLabels[payment.status] || payment.status)+'</span></span></button>';
  }

  function renderRecentPayments(){
    var list=visiblePayments().slice(0,3);
    el('recentPayments').innerHTML=list.length ? list.map(transactionHtml).join('') : '<div class="empty-list">Zatím žádné platby.</div>';
  }

  function renderPayments(){
    var all=visiblePayments();
    var filter=el('statusFilter').value;
    var filtered=(filter==='all' ? all : all.filter(function(p){return p.status===filter;})).slice(0,5);
    el('allPayments').innerHTML=filtered.length ? filtered.map(transactionHtml).join('') : '<div class="empty-list">Žádná platba v tomto stavu.</div>';
    var paid=all.filter(function(p){return p.status==='paid';});
    var total=paid.reduce(function(sum,p){return sum+(p.currency==='CZK'?p.amountCents:0);},0);
    var stats=[
      ['Dnes přijato',formatAmount(total,'CZK'),paid.length+' plateb'],
      ['Čeká na platbu',String(all.filter(function(p){return p.status==='pending';}).length),'Aktivní QR'],
      ['Neúspěšné',String(all.filter(function(p){return p.status==='failed'||p.status==='expired';}).length),'Vypršelé nebo neprošlé'],
      ['Pokladny',String(state.tills.length),'Aktivní zařízení']
    ];
    el('paymentStats').innerHTML=stats.map(function(s){return '<div class="stat-card"><span>'+escapeHtml(s[0])+'</span><strong>'+escapeHtml(s[1])+'</strong><small>'+escapeHtml(s[2])+'</small></div>';}).join('');
    updateBadges();
  }

  function updateBadges(){
    var count=visiblePayments().filter(function(p){return p.status==='pending';}).length;
    el('pendingBadge').textContent=count;
    el('mobilePendingBadge').textContent=count;
    el('pendingBadge').hidden=count===0;
    el('mobilePendingBadge').hidden=count===0;
  }

  function setMode(mode){
    entryMode=mode;
    qsa('#entryMode button').forEach(function(button){button.classList.toggle('active',button.getAttribute('data-mode')===mode);});
    el('calcExpression').classList.toggle('visible',mode==='calculator');
    renderKeypad();
  }

  function renderKeypad(){
    var keypad=el('keypad');
    var keys;
    if(entryMode==='calculator'){
      keypad.className='keypad calculator';
      keys=[['7','7',''],['8','8',''],['9','9',''],['÷','/','operator'],['4','4',''],['5','5',''],['6','6',''],['×','*','operator'],['1','1',''],['2','2',''],['3','3',''],['−','-','operator'],[',','.',''],['0','0',''],['⌫','del',''],['+','+','operator'],['C','clear','danger'],['00','00',''],['=','=','operator']];
    }else{
      keypad.className='keypad';
      keys=[['1','1',''],['2','2',''],['3','3',''],['4','4',''],['5','5',''],['6','6',''],['7','7',''],['8','8',''],['9','9',''],[',','.',''],['0','0',''],['⌫','del','']];
    }
    keypad.innerHTML=keys.map(function(key){return '<button type="button" data-key="'+key[1]+'" class="'+key[2]+'" aria-label="'+(key[1]==='del'?'Smazat poslední číslici':key[0])+'">'+key[0]+'</button>';}).join('');
    el('calcExpression').textContent=calcExpression ? calcExpression.replace(/\*/g,' × ').replace(/\//g,' ÷ ').replace(/-/g,' − ').replace(/\./g,',') : 'Zadejte výpočet';
  }

  function pressEntryKey(key){
    if(entryMode==='calculator'){ pressCalcKey(key); return; }
    if(key==='del') entryBuffer=entryBuffer.slice(0,-1);
    else if(key==='.') { if(entryBuffer.indexOf('.')<0) entryBuffer=(entryBuffer||'0')+'.'; }
    else {
      if(entryBuffer.indexOf('.')>=0 && entryBuffer.split('.')[1].length>=2) return;
      entryBuffer=(entryBuffer==='0'?'':entryBuffer)+key;
    }
    updateAmount(centsFromBuffer(entryBuffer));
  }

  function safeCalculate(expression){
    var clean=expression.replace(/[^0-9+\-*/.()]/g,'');
    if(!clean || !/[0-9]/.test(clean)) return null;
    try{
      var result=Function('"use strict";return ('+clean+')')();
      return typeof result==='number' && isFinite(result) && result>=0 ? Math.round(result*100)/100 : null;
    }catch(e){return null;}
  }

  function pressCalcKey(key){
    if(key==='clear') calcExpression='';
    else if(key==='del') calcExpression=calcExpression.slice(0,-1);
    else if(key==='='){
      var finalResult=safeCalculate(calcExpression);
      if(finalResult!==null){entryBuffer=String(finalResult);calcExpression=String(finalResult);updateAmount(Math.round(finalResult*100));}
    }else if(key==='.'){
      var last=(calcExpression.split(/[+\-*/]/).pop()||'');
      if(last.indexOf('.')<0) calcExpression+=(last?'':'0')+'.';
    }else if(/[+\-*/]/.test(key)){
      if(calcExpression && !/[+\-*/]$/.test(calcExpression)) calcExpression+=key;
    }else calcExpression+=key;
    var result=safeCalculate(calcExpression);
    if(result!==null) updateAmount(Math.round(result*100));
    renderKeypad();
  }

  function newPayment(){
    if(state.current.amountCents>0){
      if(state.current.status==='pending') archiveCurrent();
      state.lastAmountCents=state.current.amountCents;
    }
    state.current={id:null,amountCents:0,currency:state.current.currency,category:selectedTill().category||state.settings.categories[0],note:'',status:'empty',createdAt:null,expiresAt:null};
    entryBuffer=''; calcExpression='';
    saveState(); renderCashier(); renderKeypad();
    el('amountInput').focus();
  }

  function activateTill(id){
    if(id===state.selectedTill) return;
    if(state.current.amountCents>0){
      if(state.current.status==='pending') archiveCurrent();
      state.lastAmountCents=state.current.amountCents;
    }
    state.selectedTill=id;
    state.current={id:null,amountCents:0,currency:state.current.currency,category:selectedTill().category||state.settings.categories[0],note:'',status:'empty',createdAt:null,expiresAt:null,till:null,tillName:null};
    entryBuffer=''; calcExpression='';
  }

  function verifyPayment(){
    if(state.current.status!=='pending') return;
    var status=el('paymentStatus'); status.className='status-chip checking'; status.querySelector('span').textContent='Ověřujeme platbu';
    el('verifyPayment').disabled=true;
    clearTimeout(verifyTimer);
    verifyTimer=setTimeout(function(){
      state.current.status='paid'; state.lastAmountCents=state.current.amountCents; archiveCurrent(); saveState(); renderCashier();
      if(state.settings.notifications && 'Notification' in window && Notification.permission==='granted'){
        try{new Notification('Platba přijata',{body:formatAmount(state.current.amountCents,state.current.currency)+' · '+selectedTill().name});}catch(e){}
      }
    },850);
  }

  function failPayment(){
    if(state.current.status!=='pending') return;
    state.current.status='failed'; archiveCurrent(); saveState(); renderCashier();
  }

  function renderSettings(){
    renderTillList(); renderCategoryOptions();
    el('mobileTillName').textContent=selectedTill().name;
    el('accountSetting').value=state.settings.account;
    el('expirySetting').value=String(state.settings.expiry);
    el('eurSetting').checked=state.settings.eur;
    el('categoriesSetting').value=state.settings.categories.join(', ');
    el('accountingSetting').checked=state.settings.accounting;
    el('notificationsSetting').checked=state.settings.notifications;
    el('employeeSetting').checked=state.settings.employee;
  }

  function renderTillList(){
    el('tillList').innerHTML=state.tills.map(function(till,index){
      var active=till.id===state.selectedTill;
      return '<div class="till-row"><span class="till-symbol">'+(index+1)+'</span><span><strong>'+escapeHtml(till.name)+'</strong><small>Výchozí kategorie: '+escapeHtml(till.category||'Bez kategorie')+'</small></span><span class="till-actions">'+
        (active?'<span class="active-label">Používáte</span>':'<button class="text-button" type="button" data-use-till="'+escapeHtml(till.id)+'">Použít</button>')+
        (state.tills.length>1&&!active?'<button class="icon-button" type="button" data-delete-till="'+escapeHtml(till.id)+'" aria-label="Odebrat pokladnu '+escapeHtml(till.name)+'">×</button>':'')+'</span></div>';
    }).join('');
  }

  function markSaved(){
    el('saveStatus').textContent='Uloženo.';
    clearTimeout(markSaved.timer);
    markSaved.timer=setTimeout(function(){el('saveStatus').textContent='Změny se ukládají automaticky.';},1800);
  }

  function showPaymentDetail(id){
    var payment=visiblePayments().find(function(p){return p.id===id;}); if(!payment)return;
    el('detailTitle').textContent=formatAmount(payment.amountCents,payment.currency);
    var rows=[['Stav',statusLabels[payment.status]],['Pokladna',payment.tillName],['Kategorie',payment.category||'—'],['Poznámka',payment.note||'—'],['ID platby',payment.id],['Vytvořeno',formatDateTime(payment.createdAt)]];
    el('paymentDetail').innerHTML=rows.map(function(row){return '<div class="detail-row"><span>'+escapeHtml(row[0])+'</span><strong>'+escapeHtml(row[1])+'</strong></div>';}).join('');
    el('paymentDialog').showModal();
  }

  function bindEvents(){
    qsa('[data-route]').forEach(function(button){button.addEventListener('click',function(){setRoute(button.getAttribute('data-route'));});});
    window.addEventListener('hashchange',renderRoute);

    el('amountInput').addEventListener('focus',function(){
      entryBuffer=plainAmount(state.current.amountCents).replace(/,00$/,'');
      this.value=entryBuffer.replace('.',','); this.select();
    });
    el('amountInput').addEventListener('input',function(){
      entryBuffer=normalizeBuffer(this.value); updateAmount(centsFromBuffer(entryBuffer),true);
    });
    el('amountInput').addEventListener('blur',function(){this.value=formatAmount(state.current.amountCents,state.current.currency).replace(/\s?(Kč|€)$/,'').trim();});
    el('currencySelect').addEventListener('change',function(){state.current.currency=this.value;ensureCurrent();saveState();renderCashier();});
    el('tillSelect').addEventListener('change',function(){activateTill(this.value);saveState();renderCashier();});
    el('entryMode').addEventListener('click',function(event){var button=event.target.closest('[data-mode]');if(button)setMode(button.getAttribute('data-mode'));});
    el('keypad').addEventListener('click',function(event){var button=event.target.closest('[data-key]');if(button)pressEntryKey(button.getAttribute('data-key'));});
    document.querySelector('.preset-row').addEventListener('click',function(event){var button=event.target.closest('[data-preset]');if(!button)return;entryBuffer=String(button.getAttribute('data-preset'));updateAmount(Math.round(Number(entryBuffer)*100));});
    el('detailsToggle').addEventListener('click',function(){var expanded=this.getAttribute('aria-expanded')==='true';this.setAttribute('aria-expanded',String(!expanded));el('detailsFields').hidden=expanded;});
    el('categorySelect').addEventListener('change',function(){state.current.category=this.value;saveState();renderQRCode();});
    el('noteInput').addEventListener('input',function(){state.current.note=this.value;saveState();renderQRCode();});
    el('verifyPayment').addEventListener('click',verifyPayment);
    el('newPayment').addEventListener('click',newPayment);
    el('failPayment').addEventListener('click',failPayment);
    el('qrMenuButton').addEventListener('click',function(){el('detailsToggle').click();el('detailsToggle').scrollIntoView({behavior:'smooth',block:'center'});});
    el('statusFilter').addEventListener('change',renderPayments);
    document.addEventListener('click',function(event){var row=event.target.closest('[data-payment-id]');if(row)showPaymentDetail(row.getAttribute('data-payment-id'));});

    el('addTillButton').addEventListener('click',function(){el('newTillName').value='';renderCategoryOptions();el('tillDialog').showModal();setTimeout(function(){el('newTillName').focus();},0);});
    el('confirmTill').addEventListener('click',function(event){
      if(!el('newTillName').value.trim()){event.preventDefault();el('newTillName').focus();return;}
      var till={id:'till-'+Date.now(),name:el('newTillName').value.trim(),category:el('newTillCategory').value};
      state.tills.push(till);activateTill(till.id);saveState();renderSettings();markSaved();
    });
    el('tillList').addEventListener('click',function(event){
      var use=event.target.closest('[data-use-till]');var remove=event.target.closest('[data-delete-till]');
      if(use){activateTill(use.getAttribute('data-use-till'));saveState();renderSettings();markSaved();}
      if(remove){state.tills=state.tills.filter(function(t){return t.id!==remove.getAttribute('data-delete-till');});saveState();renderSettings();markSaved();}
    });
    el('accountSetting').addEventListener('change',function(){state.settings.account=this.value;saveState();markSaved();});
    el('expirySetting').addEventListener('change',function(){state.settings.expiry=Number(this.value);if(state.current.status==='pending')state.current.expiresAt=state.current.createdAt+state.settings.expiry*60000;saveState();markSaved();});
    el('eurSetting').addEventListener('change',function(){state.settings.eur=this.checked;if(!this.checked&&state.current.currency==='EUR')state.current.currency='CZK';el('currencySelect').querySelector('option[value="EUR"]').disabled=!this.checked;saveState();markSaved();});
    el('categoriesSetting').addEventListener('change',function(){var values=this.value.split(',').map(function(v){return v.trim();}).filter(Boolean);state.settings.categories=values.length?values:['Bez kategorie'];saveState();renderCategoryOptions();markSaved();});
    [['accountingSetting','accounting'],['notificationsSetting','notifications'],['employeeSetting','employee']].forEach(function(pair){el(pair[0]).addEventListener('change',function(){state.settings[pair[1]]=this.checked;saveState();markSaved();});});

    document.addEventListener('keydown',function(event){
      if(routeFromHash()!=='pokladna'||event.metaKey||event.ctrlKey||event.altKey)return;
      var tag=document.activeElement&&document.activeElement.tagName;
      if(tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA')return;
      var key=event.key;
      if(/^[0-9]$/.test(key)){pressEntryKey(key);event.preventDefault();}
      else if(key==='Backspace'){pressEntryKey('del');event.preventDefault();}
      else if(key===','||key==='.'){pressEntryKey('.');event.preventDefault();}
      else if(entryMode==='calculator'&&['+','-','*','/','='].indexOf(key)>=0){pressEntryKey(key);event.preventDefault();}
    });
  }

  document.addEventListener('DOMContentLoaded',function(){
    state=loadState();
    if(!state.settings.eur&&state.current.currency==='EUR')state.current.currency='CZK';
    entryBuffer=state.current.amountCents?String(state.current.amountCents/100):'';
    bindEvents(); renderKeypad();
    el('currencySelect').querySelector('option[value="EUR"]').disabled=!state.settings.eur;
    if(!location.hash) setRoute('pokladna',true); else renderRoute();
    if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js?v=1').catch(function(){});});}
  });
})();
