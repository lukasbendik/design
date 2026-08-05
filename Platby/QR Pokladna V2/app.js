(function(){
  'use strict';

  var STORE='qr_pokladna_v2_simple__state';
  var state;
  var entryBuffer='';
  var calcExpression='';
  var verifyTimer=null;
  var qrRenderedFor=null;
  var backgroundTimer=null;

  var statusLabels={pending:'Čeká na platbu',paid:'Zaplaceno'};

  function defaults(){
    var now=Date.now();
    return {
      amountCents:0,
      currency:'CZK',
      entryMode:'keypad',
      lastAmountCents:0,
      sequence:24,
      settings:{account:'CZ6501000000001234567890',eur:true,notifications:true,employee:false},
      current:null,
      payments:[
        {id:'QR-260805-024',amountCents:89000,currency:'CZK',status:'paid',createdAt:now-12*60000,updatedAt:now-12*60000},
        {id:'QR-260805-023',amountCents:45000,currency:'CZK',status:'paid',createdAt:now-36*60000,updatedAt:now-36*60000},
        {id:'QR-260805-022',amountCents:120000,currency:'CZK',status:'paid',createdAt:now-74*60000,updatedAt:now-74*60000},
        {id:'QR-260805-021',amountCents:33000,currency:'CZK',status:'paid',createdAt:now-108*60000,updatedAt:now-108*60000}
      ]
    };
  }

  function loadState(){
    try{
      var parsed=JSON.parse(localStorage.getItem(STORE));
      if(parsed&&parsed.settings&&Array.isArray(parsed.payments)){
        var base=defaults();
        parsed.settings=Object.assign(base.settings,parsed.settings);
        parsed.entryMode=parsed.entryMode==='calculator'?'calculator':'keypad';
        return Object.assign(base,parsed);
      }
    }catch(error){}
    return defaults();
  }

  function saveState(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch(error){}}
  function el(id){return document.getElementById(id);}
  function qsa(selector,root){return Array.prototype.slice.call((root||document).querySelectorAll(selector));}
  function escapeHtml(value){return String(value==null?'':value).replace(/[&<>'"]/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char];});}
  function formatAmount(cents,currency){return new Intl.NumberFormat('cs-CZ',{style:'currency',currency:currency||'CZK',minimumFractionDigits:2,maximumFractionDigits:2}).format((cents||0)/100);}
  function formatTime(timestamp){return new Intl.DateTimeFormat('cs-CZ',{hour:'2-digit',minute:'2-digit'}).format(new Date(timestamp));}
  function formatDateTime(timestamp){return new Intl.DateTimeFormat('cs-CZ',{day:'numeric',month:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(timestamp));}
  function plainAmount(cents){return ((cents||0)/100).toFixed(2).replace('.',',');}
  function normalizeBuffer(value){
    var clean=String(value||'').replace(/\s/g,'').replace(/[^0-9,.]/g,'').replace(',','.');
    var parts=clean.split('.');
    var whole=(parts.shift()||'').replace(/^0+(?=\d)/,'');
    var decimal=parts.join('').slice(0,2);
    return whole+(clean.indexOf('.')>=0?'.'+decimal:'');
  }
  function centsFromBuffer(buffer){
    var number=Number(buffer||0);
    if(!isFinite(number)||number<0)return 0;
    return Math.min(Math.round(number*100),999999999);
  }

  function routeFromHash(){
    var hash=location.hash.slice(1);
    if(hash==='qr'&&state.current)return 'qr';
    if(hash==='platby')return 'platby';
    if(hash==='nastaveni')return 'nastaveni';
    return 'pokladna';
  }

  function setRoute(route,replace){
    var hash='#'+route;
    closeMenu();
    if(location.hash===hash){renderRoute();return;}
    if(replace)history.replaceState(null,'',hash);else location.hash=route;
    renderRoute();
  }

  function renderRoute(){
    reconcilePayments();
    var route=routeFromHash();
    qsa('.view').forEach(function(view){view.classList.toggle('active',view.id==='view-'+route);});
    qsa('#appMenu [data-route]').forEach(function(button){button.classList.toggle('active',button.getAttribute('data-route')===route);});
    el('headerMode').hidden=route!=='pokladna';
    el('headerTitle').hidden=route==='pokladna';
    el('headerTitle').textContent={qr:'QR platba',platby:'Platby',nastaveni:'Nastavení'}[route]||'';
    document.title='Prototyp: QR Pokladna V2 – '+({pokladna:'Pokladna',qr:'QR platba',platby:'Platby',nastaveni:'Nastavení'}[route]);
    stopVerifyTimer();
    if(route==='pokladna')renderCashier();
    if(route==='qr')renderQrView();
    if(route==='platby')renderPayments();
    if(route==='nastaveni')renderSettings();
    window.scrollTo({top:0,behavior:'auto'});
  }

  function toggleMenu(){
    var open=el('appMenu').hidden;
    el('appMenu').hidden=!open;
    el('menuButton').setAttribute('aria-expanded',String(open));
  }
  function closeMenu(){el('appMenu').hidden=true;el('menuButton').setAttribute('aria-expanded','false');}

  function renderMode(){
    qsa('#headerMode [data-mode]').forEach(function(button){button.classList.toggle('active',button.getAttribute('data-mode')===state.entryMode);});
    el('calcExpression').classList.toggle('visible',state.entryMode==='calculator'&&Boolean(calcExpression));
    el('calcExpression').hidden=!calcExpression;
    renderKeypad();
  }

  function renderCashier(preserveInput){
    if(document.activeElement!==el('amountInput')||!preserveInput){
      el('amountInput').value=formatAmount(state.amountCents,state.currency).replace(/\s?(Kč|€)$/,'').trim();
    }
    el('payButton').disabled=state.amountCents<=0;
    el('payButton').textContent=state.amountCents>0?'Zaplatit '+formatAmount(state.amountCents,state.currency):'Zaplatit';
    var last=el('lastAmountPreset');
    if(state.lastAmountCents>0){last.hidden=false;last.textContent='Naposledy '+formatAmount(state.lastAmountCents,state.currency);last.setAttribute('data-preset',String(state.lastAmountCents/100));}
    else last.hidden=true;
    renderMode();
    updateBadges();
  }

  function updateAmount(cents,preserveInput){state.amountCents=Math.max(0,Math.min(cents,999999999));saveState();renderCashier(preserveInput);}

  function renderKeypad(){
    var keypad=el('keypad');
    var keys;
    if(state.entryMode==='calculator'){
      keypad.className='keypad calculator';
      keys=[['7','7',''],['8','8',''],['9','9',''],['÷','/','operator'],['4','4',''],['5','5',''],['6','6',''],['×','*','operator'],['1','1',''],['2','2',''],['3','3',''],['−','-','operator'],[',','.',''],['0','0',''],['⌫','del',''],['+','+','operator'],['C','clear','danger'],['00','00',''],['=','=','operator']];
    }else{
      keypad.className='keypad';
      keys=[['1','1',''],['2','2',''],['3','3',''],['4','4',''],['5','5',''],['6','6',''],['7','7',''],['8','8',''],['9','9',''],[',','.',''],['0','0',''],['⌫','del','']];
    }
    keypad.innerHTML=keys.map(function(key){return '<button type="button" data-key="'+key[1]+'" class="'+key[2]+'" aria-label="'+(key[1]==='del'?'Smazat poslední číslici':key[0])+'">'+key[0]+'</button>';}).join('');
    el('calcExpression').textContent=calcExpression.replace(/\*/g,' × ').replace(/\//g,' ÷ ').replace(/-/g,' − ').replace(/\./g,',');
    el('calcExpression').classList.toggle('visible',state.entryMode==='calculator'&&Boolean(calcExpression));
    el('calcExpression').hidden=!calcExpression;
  }

  function pressEntryKey(key){
    if(state.entryMode==='calculator'){pressCalcKey(key);return;}
    if(key==='del')entryBuffer=entryBuffer.slice(0,-1);
    else if(key==='.'){
      if(entryBuffer.indexOf('.')<0)entryBuffer=(entryBuffer||'0')+'.';
    }else{
      if(entryBuffer.indexOf('.')>=0&&entryBuffer.split('.')[1].length>=2)return;
      entryBuffer=(entryBuffer==='0'?'':entryBuffer)+key;
    }
    updateAmount(centsFromBuffer(entryBuffer));
  }

  function safeCalculate(expression){
    var clean=expression.replace(/[^0-9+\-*/.()]/g,'');
    if(!clean||!/[0-9]/.test(clean))return null;
    try{
      var result=Function('"use strict";return ('+clean+')')();
      return typeof result==='number'&&isFinite(result)&&result>=0?Math.round(result*100)/100:null;
    }catch(error){return null;}
  }

  function pressCalcKey(key){
    if(key==='clear')calcExpression='';
    else if(key==='del')calcExpression=calcExpression.slice(0,-1);
    else if(key==='='){
      var finalResult=safeCalculate(calcExpression);
      if(finalResult!==null){entryBuffer=String(finalResult);calcExpression=String(finalResult);updateAmount(Math.round(finalResult*100));}
    }else if(key==='.'){
      var last=(calcExpression.split(/[+\-*/]/).pop()||'');
      if(last.indexOf('.')<0)calcExpression+=(last?'':'0')+'.';
    }else if(/[+\-*/]/.test(key)){
      if(calcExpression&&!/[+\-*/]$/.test(calcExpression))calcExpression+=key;
    }else calcExpression+=key;
    var result=safeCalculate(calcExpression);
    if(result!==null)updateAmount(Math.round(result*100));
    renderKeypad();
  }

  function makePaymentId(){
    state.sequence=(state.sequence||0)+1;
    var date=new Date();
    return 'QR-'+String(date.getFullYear()).slice(-2)+String(date.getMonth()+1).padStart(2,'0')+String(date.getDate()).padStart(2,'0')+'-'+String(state.sequence).padStart(3,'0');
  }

  function startPayment(){
    if(state.amountCents<=0)return;
    var now=Date.now();
    state.lastAmountCents=state.amountCents;
    state.current={id:makePaymentId(),amountCents:state.amountCents,currency:state.currency,status:'pending',createdAt:now,confirmAt:now+10000,updatedAt:now};
    state.payments.unshift(Object.assign({},state.current));
    state.payments=state.payments.slice(0,20);
    qrRenderedFor=null;
    saveState();
    setRoute('qr');
  }

  function spaydString(payment){
    var vs=String(state.sequence||1).padStart(10,'0').slice(-10);
    return 'SPD*1.0*ACC:'+state.settings.account+'*AM:'+(payment.amountCents/100).toFixed(2)+'*CC:'+payment.currency+'*X-VS:'+vs+'*MSG:QR POKLADNA';
  }

  function renderQrCode(){
    if(!state.current||qrRenderedFor===state.current.id)return;
    var code=el('qrCode');code.innerHTML='';
    if(typeof QRCode!=='undefined'){
      try{new QRCode(code,{text:spaydString(state.current),width:280,height:280,correctLevel:QRCode.CorrectLevel.M});}
      catch(error){code.innerHTML='';try{new QRCode(code,{text:spaydString(state.current),width:280,height:280,correctLevel:QRCode.CorrectLevel.L});}catch(fallbackError){code.textContent='QR kód se nepodařilo vytvořit.';}}
    }else code.textContent='QR kód se nepodařilo načíst.';
    qrRenderedFor=state.current.id;
  }

  function renderQrView(){
    if(!state.current){setRoute('pokladna',true);return;}
    el('qrAmount').textContent=formatAmount(state.current.amountCents,state.current.currency);
    renderQrCode();
    updateVerification();
    if(state.current.status==='pending')verifyTimer=setInterval(updateVerification,250);
    updateBadges();
  }

  function stopVerifyTimer(){if(verifyTimer){clearInterval(verifyTimer);verifyTimer=null;}}

  function reconcilePayments(){
    var now=Date.now();
    var changed=false;
    state.payments.forEach(function(payment){
      if(payment.status==='pending'&&payment.confirmAt&&payment.confirmAt<=now){payment.status='paid';payment.updatedAt=now;changed=true;}
    });
    if(state.current&&state.current.status==='pending'&&state.current.confirmAt<=now){state.current.status='paid';state.current.updatedAt=now;changed=true;}
    if(changed)saveState();
  }

  function updateVerification(){
    if(!state.current)return;
    var status=el('paymentStatus');
    if(state.current.status==='paid'){
      status.className='status-chip paid';status.querySelector('span').textContent='Platba ověřena';
      el('verifyProgress').hidden=false;el('verifyProgress').querySelector('div').hidden=true;el('verifyText').hidden=true;el('qrActionBar').hidden=false;
      stopVerifyTimer();return;
    }
    var now=Date.now();
    var remaining=Math.max(0,state.current.confirmAt-now);
    if(remaining<=0){confirmPayment();return;}
    var elapsed=Math.min(1,Math.max(0,1-remaining/10000));
    status.className='status-chip checking';status.querySelector('span').textContent='Čekáme na platbu';
    el('verifyProgress').hidden=false;el('qrActionBar').hidden=true;
    el('verifyProgress').querySelector('div').hidden=false;el('verifyText').hidden=false;
    el('progressBar').style.width=Math.round(elapsed*100)+'%';
    el('verifyText').textContent='Ověřujeme přijetí platby · '+Math.ceil(remaining/1000)+' s';
  }

  function confirmPayment(){
    if(!state.current||state.current.status==='paid')return;
    state.current.status='paid';state.current.updatedAt=Date.now();
    var index=state.payments.findIndex(function(payment){return payment.id===state.current.id;});
    if(index>=0)state.payments[index]=Object.assign({},state.current);
    saveState();updateVerification();updateBadges();
    if(state.settings.notifications&&'Notification'in window&&Notification.permission==='granted'){
      try{new Notification('Platba ověřena',{body:formatAmount(state.current.amountCents,state.current.currency)+' · Stánek – keramika'});}catch(error){}
    }
  }

  function resetPayment(){
    if(state.current)state.lastAmountCents=state.current.amountCents;
    state.amountCents=0;state.current=null;entryBuffer='';calcExpression='';qrRenderedFor=null;saveState();setRoute('pokladna');
    setTimeout(function(){el('amountInput').focus();},0);
  }

  function updateBadges(){
    var count=state.payments.filter(function(payment){return payment.status==='pending';}).length;
    el('menuBadge').hidden=count===0;el('menuBadge').textContent=count;
    el('paymentMenuCount').hidden=count===0;el('paymentMenuCount').textContent=count;
  }

  function transactionIcon(status){return status==='paid'?'<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>':'<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5h4"/></svg>';}
  function transactionHtml(payment){
    return '<button class="transaction-row '+escapeHtml(payment.status)+'" type="button" data-payment-id="'+escapeHtml(payment.id)+'"><span class="transaction-icon">'+transactionIcon(payment.status)+'</span><span class="transaction-main"><strong>QR platba</strong><small>'+escapeHtml(payment.id)+' · '+escapeHtml(formatTime(payment.createdAt))+'</small></span><span class="transaction-side"><strong>'+escapeHtml(formatAmount(payment.amountCents,payment.currency))+'</strong><span>'+escapeHtml(statusLabels[payment.status]||payment.status)+'</span></span></button>';
  }

  function renderPayments(){
    var filter=el('statusFilter').value;
    var list=(filter==='all'?state.payments:state.payments.filter(function(payment){return payment.status===filter;})).slice(0,5);
    el('paymentList').innerHTML=list.length?list.map(transactionHtml).join(''):'<div class="empty-list">Žádná platba v tomto stavu.</div>';
    updateBadges();
  }

  function renderSettings(){
    el('accountSetting').value=state.settings.account;
    el('currencySetting').value=state.currency;
    el('notificationsSetting').checked=state.settings.notifications;
    el('employeeSetting').checked=state.settings.employee;
    updateBadges();
  }

  function markSaved(){
    el('saveStatus').textContent='Uloženo.';clearTimeout(markSaved.timer);
    markSaved.timer=setTimeout(function(){el('saveStatus').textContent='Změny se ukládají automaticky.';},1600);
  }

  function showPaymentDetail(id){
    var payment=state.payments.find(function(item){return item.id===id;});if(!payment)return;
    el('detailTitle').textContent=formatAmount(payment.amountCents,payment.currency);
    var rows=[['Stav',statusLabels[payment.status]],['Pokladna','Stánek – keramika'],['ID platby',payment.id],['Vytvořeno',formatDateTime(payment.createdAt)]];
    el('paymentDetail').innerHTML=rows.map(function(row){return '<div class="detail-row"><span>'+escapeHtml(row[0])+'</span><strong>'+escapeHtml(row[1])+'</strong></div>';}).join('');
    el('paymentDialog').showModal();
  }

  function bindEvents(){
    qsa('[data-route]').forEach(function(button){button.addEventListener('click',function(){setRoute(button.getAttribute('data-route'));});});
    window.addEventListener('hashchange',renderRoute);
    el('menuButton').addEventListener('click',function(event){event.stopPropagation();toggleMenu();});
    el('appMenu').addEventListener('click',function(event){event.stopPropagation();});
    document.addEventListener('click',closeMenu);
    document.addEventListener('keydown',function(event){if(event.key==='Escape')closeMenu();});

    el('headerMode').addEventListener('click',function(event){var button=event.target.closest('[data-mode]');if(!button)return;state.entryMode=button.getAttribute('data-mode');saveState();renderMode();});
    el('amountInput').addEventListener('focus',function(){entryBuffer=plainAmount(state.amountCents).replace(/,00$/,'');this.value=entryBuffer.replace('.',',');this.select();});
    el('amountInput').addEventListener('input',function(){entryBuffer=normalizeBuffer(this.value);updateAmount(centsFromBuffer(entryBuffer),true);});
    el('amountInput').addEventListener('blur',function(){this.value=formatAmount(state.amountCents,state.currency).replace(/\s?(Kč|€)$/,'').trim();});
    document.querySelector('.preset-row').addEventListener('click',function(event){var button=event.target.closest('[data-preset]');if(!button)return;entryBuffer=String(button.getAttribute('data-preset'));updateAmount(Math.round(Number(entryBuffer)*100));});
    el('keypad').addEventListener('click',function(event){var button=event.target.closest('[data-key]');if(button)pressEntryKey(button.getAttribute('data-key'));});
    el('payButton').addEventListener('click',startPayment);
    el('qrBack').addEventListener('click',function(){setRoute('pokladna');});
    el('newPaymentButton').addEventListener('click',resetPayment);
    el('statusFilter').addEventListener('change',renderPayments);
    el('paymentList').addEventListener('click',function(event){var row=event.target.closest('[data-payment-id]');if(row)showPaymentDetail(row.getAttribute('data-payment-id'));});

    el('accountSetting').addEventListener('change',function(){state.settings.account=this.value;saveState();markSaved();});
    el('currencySetting').addEventListener('change',function(){state.currency=this.value;saveState();markSaved();});
    el('notificationsSetting').addEventListener('change',function(){state.settings.notifications=this.checked;saveState();markSaved();});
    el('employeeSetting').addEventListener('change',function(){state.settings.employee=this.checked;saveState();markSaved();});

    document.addEventListener('keydown',function(event){
      var route=routeFromHash();
      if(event.metaKey||event.ctrlKey||event.altKey)return;
      if(route==='qr'){
        if(event.key==='Enter'&&!el('qrActionBar').hidden){resetPayment();event.preventDefault();}
        return;
      }
      if(route!=='pokladna')return;
      if(event.key==='Enter'){
        if(!el('payButton').disabled){startPayment();event.preventDefault();}
        return;
      }
      var tag=document.activeElement&&document.activeElement.tagName;
      if(tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA')return;
      var key=event.key;
      if(/^[0-9]$/.test(key)){pressEntryKey(key);event.preventDefault();}
      else if(key==='Backspace'){pressEntryKey('del');event.preventDefault();}
      else if(key===','||key==='.'){pressEntryKey('.');event.preventDefault();}
      else if(state.entryMode==='calculator'&&['+','-','*','/','='].indexOf(key)>=0){pressEntryKey(key);event.preventDefault();}
    });
  }

  document.addEventListener('DOMContentLoaded',function(){
    state=loadState();
    reconcilePayments();
    entryBuffer=state.amountCents?String(state.amountCents/100):'';
    bindEvents();renderMode();
    if(!location.hash)setRoute('pokladna',true);else renderRoute();
    backgroundTimer=setInterval(function(){
      reconcilePayments();updateBadges();
      if(routeFromHash()==='platby')renderPayments();
      if(routeFromHash()==='qr'&&state.current)updateVerification();
    },500);
    if('serviceWorker'in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js?v=1').catch(function(){});});}
  });
})();
