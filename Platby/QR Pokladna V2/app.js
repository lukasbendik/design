(function(){
  'use strict';

  var STORE='qr_pokladna_v2_simple__state';
  var state;
  var entryBuffer='';
  var calcExpression='';
  var verifyTimer=null;
  var qrRenderedFor=null;
  var backgroundTimer=null;
  var toastQueue=[];
  var toastTimer=null;

  var statusLabels={pending:'Čeká na platbu',paid:'Zaplaceno',expired:'Vypršelo'};
  var registers=[
    {id:'pernicky',name:'Stánek – perníčky'},
    {id:'motokary',name:'Motokáry'},
    {id:'potraviny',name:'Potraviny U Náměstí'},
    {id:'kvetiny',name:'Květinový stánek'},
    {id:'kavarna',name:'Kavárna Na rohu'},
    {id:'remesla',name:'Řemeslný stánek'}
  ];

  function defaults(){
    var now=Date.now();
    return {
      amountCents:0,
      currency:'CZK',
      lastAmountCents:0,
      sequence:24,
      settings:{account:'CZ6501000000001234567890',presets:[100,200,500],eur:true,notifications:true,employee:false},
      session:null,
      activePaymentId:null,
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
        if(!Array.isArray(parsed.settings.presets)||!parsed.settings.presets.length)parsed.settings.presets=[100,200,500];
        if(!parsed.activePaymentId&&parsed.current&&parsed.current.id){
          parsed.activePaymentId=parsed.current.id;
          if(!parsed.payments.some(function(payment){return payment.id===parsed.current.id;}))parsed.payments.unshift(parsed.current);
        }
        delete parsed.current;
        delete parsed.entryMode;
        parsed.payments.forEach(function(payment){
          if(payment.status==='pending'){
            payment.confirmAt=payment.confirmAt||payment.createdAt+randomSeconds(10,50)*1000;
            payment.expiresAt=payment.expiresAt||payment.createdAt+60000;
            payment.account=payment.account||parsed.settings.account;
            payment.variableSymbol=payment.variableSymbol||payment.id.replace(/\D/g,'').slice(-10);
          }
        });
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
  function randomSeconds(min,max){return min+Math.floor(Math.random()*(max-min+1));}
  function getActivePayment(){return state.payments.find(function(payment){return payment.id===state.activePaymentId;})||null;}
  function createSession(username){
    var clean=username.trim();
    var hash=0;
    for(var index=0;index<clean.length;index++)hash=((hash<<5)-hash+clean.charCodeAt(index))|0;
    var register=registers[Math.abs(hash)%registers.length];
    var displayName=clean.indexOf('@')>=0?clean.split('@')[0]:clean;
    displayName=displayName.replace(/[._-]+/g,' ').replace(/\b\w/g,function(letter){return letter.toUpperCase();});
    var initials=displayName.split(/\s+/).filter(Boolean).slice(0,2).map(function(part){return part.charAt(0).toUpperCase();}).join('')||'U';
    return {username:clean,displayName:displayName,initials:initials,registerId:register.id,registerName:register.name,loggedInAt:Date.now()};
  }
  function currentRegisterName(){return state.session&&state.session.registerName?state.session.registerName:'Pokladna';}
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
    if(!state.session)return 'prihlaseni';
    var hash=location.hash.slice(1);
    if(hash==='qr'&&getActivePayment())return 'qr';
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
    var route=routeFromHash();
    var completed=reconcilePayments();
    if(route!=='prihlaseni')announcePayments(completed);
    if(route==='prihlaseni'&&location.hash!=='#prihlaseni')history.replaceState(null,'','#prihlaseni');
    if(route==='pokladna'&&state.session&&location.hash==='#prihlaseni')history.replaceState(null,'','#pokladna');
    document.body.classList.toggle('logged-out',route==='prihlaseni');
    qsa('.view').forEach(function(view){view.classList.toggle('active',view.id==='view-'+route);});
    qsa('#appMenu [data-route]').forEach(function(button){button.classList.toggle('active',button.getAttribute('data-route')===route);});
    document.title='Prototyp: QR Pokladna V2 – '+({prihlaseni:'Přihlášení',pokladna:'Pokladna',qr:'QR platba',platby:'Platby',nastaveni:'Nastavení'}[route]);
    stopVerifyTimer();
    if(state.session)renderSession();
    if(route==='prihlaseni')renderLogin();
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

  function renderLogin(){
    setTimeout(function(){el('loginUsername').focus();},0);
  }

  function renderSession(){
    if(!state.session)return;
    el('menuAvatar').textContent=state.session.initials;
    el('menuUserName').textContent=state.session.displayName;
    el('menuRegisterName').textContent=state.session.registerName;
    el('settingsAvatar').textContent=state.session.initials;
    el('settingsUserName').textContent=state.session.displayName;
    el('settingsRegisterName').textContent='Pokladna: '+state.session.registerName;
  }

  function formatPresetLabel(cents,currency,isLast){
    var val=cents/100;
    var formatted=val%1===0?String(val):val.toFixed(2).replace('.',',');
    var symbol=currency==='EUR'?'€':'Kč';
    return (isLast?'Naposledy ':'')+formatted+' '+symbol;
  }

  function renderPresets(){
    var container=el('kpPresets');
    if(!container)return;
    var presets=state.settings.presets||[100,200,500];
    var html=presets.map(function(kc){
      var cents=Math.round(kc*100);
      var label=formatPresetLabel(cents,state.currency,false);
      return '<button type="button" class="kp-preset" data-preset-cents="'+cents+'">'+escapeHtml(label)+'</button>';
    });
    var lastCents=state.lastAmountCents||0;
    if(lastCents>0){
      var lastVal=lastCents/100;
      if(presets.indexOf(lastVal)<0){
        var lastLabel=formatPresetLabel(lastCents,state.currency,true);
        html.push('<button type="button" class="kp-preset kp-preset-last" data-preset-cents="'+lastCents+'">'+escapeHtml(lastLabel)+'</button>');
      }
    }
    container.innerHTML=html.join('');
  }

  function renderCashier(preserveInput){
    if(document.activeElement!==el('amountInput')||!preserveInput){
      el('amountInput').value=formatAmount(state.amountCents,state.currency).replace(/\s?(Kč|€)$/,'').trim();
    }
    el('payButton').disabled=state.amountCents<=0;
    el('payButton').textContent=state.amountCents>0?'Zaplatit '+formatAmount(state.amountCents,state.currency):'Zaplatit';
    renderPresets();
    renderKeypad();
    updateBadges();
  }

  function updateAmount(cents,preserveInput){state.amountCents=Math.max(0,Math.min(cents,999999999));saveState();renderCashier(preserveInput);}

  function renderKeypad(){
    var keypad=el('keypad');
    var keys=[
      ['C','clear','operator'],['(','(','operator'],[')',')','operator'],['/','/','operator'],
      ['7','7',''],['8','8',''],['9','9',''],['*','*','operator'],
      ['4','4',''],['5','5',''],['6','6',''],['-','-','operator'],
      ['1','1',''],['2','2',''],['3','3',''],['+','+','operator'],
      ['00','00',''],['0','0',''],[',','.',''],['','del','delete']
    ];
    keypad.innerHTML=keys.map(function(key){
      var label=key[1]==='del'?'Smazat poslední znak':key[0];
      var content=key[1]==='del'?'<svg aria-hidden="true" viewBox="0 0 32 24"><path d="M12 3h15a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H12L2 12 12 3Z"/><path d="m18 8 6 8M24 8l-6 8"/></svg>':key[0];
      return '<button type="button" data-key="'+key[1]+'" class="'+key[2]+'" aria-label="'+label+'">'+content+'</button>';
    }).join('');
    el('calcExpression').textContent=calcExpression.replace(/\./g,',');
    el('calcExpression').classList.toggle('visible',Boolean(calcExpression));
  }

  function safeCalculate(expression){
    var clean=expression.replace(/[^0-9+\-*/.()]/g,'');
    if(!clean||!/[0-9]/.test(clean))return null;
    var evalable=clean.replace(/[+\-*/.(]+$/,'');
    if(!evalable)return null;
    try{
      var result=Function('"use strict";return ('+evalable+')')();
      return typeof result==='number'&&isFinite(result)&&result>=0?Math.round(result*100)/100:null;
    }catch(error){return null;}
  }

  function pressCalcKey(key){
    if(key==='clear')calcExpression='';
    else if(key==='del')calcExpression=calcExpression.slice(0,-1);
    else if(key==='.'){
      var last=(calcExpression.split(/[+\-*/()]/).pop()||'');
      if(last.indexOf('.')<0)calcExpression+=(last?'':'0')+'.';
    }else if(/[+\-*/]/.test(key)){
      if(calcExpression){
        if(/[+\-*/]$/.test(calcExpression))calcExpression=calcExpression.slice(0,-1)+key;
        else if(!/[.(]$/.test(calcExpression))calcExpression+=key;
      }
    }else if(key==='('){
      if(!calcExpression||/[+\-*/(]$/.test(calcExpression))calcExpression+='(';
    }else if(key===')'){
      var opens=(calcExpression.match(/\(/g)||[]).length;
      var closes=(calcExpression.match(/\)/g)||[]).length;
      if(opens>closes&&/[0-9)]$/.test(calcExpression))calcExpression+=')';
    }else calcExpression+=key;
    var result=safeCalculate(calcExpression);
    if(result!==null){entryBuffer=String(result);state.amountCents=Math.round(result*100);saveState();}
    else if(!calcExpression){entryBuffer='';state.amountCents=0;saveState();}
    renderCashier();
  }

  function makePaymentId(){
    state.sequence=(state.sequence||0)+1;
    var date=new Date();
    return 'QR-'+String(date.getFullYear()).slice(-2)+String(date.getMonth()+1).padStart(2,'0')+String(date.getDate()).padStart(2,'0')+'-'+String(state.sequence).padStart(3,'0');
  }

  function startPayment(){
    if(state.amountCents<=0)return;
    var now=Date.now();
    var id=makePaymentId();
    var willFail=Math.random()<0.10;
    var payment={
      id:id,
      amountCents:state.amountCents,
      currency:state.currency,
      account:state.settings.account,
      variableSymbol:id.replace(/\D/g,'').slice(-10),
      registerName:currentRegisterName(),
      status:'pending',
      willFail:willFail,
      createdAt:now,
      confirmAt:willFail?null:(now+randomSeconds(8,25)*1000),
      expiresAt:willFail?(now+randomSeconds(12,25)*1000):(now+60000),
      updatedAt:now
    };
    state.lastAmountCents=state.amountCents;
    state.activePaymentId=id;
    state.payments.unshift(payment);
    var pending=state.payments.filter(function(item){return item.status==='pending';});
    var completed=state.payments.filter(function(item){return item.status!=='pending';}).slice(0,20);
    state.payments=pending.concat(completed).sort(function(a,b){return b.createdAt-a.createdAt;});
    qrRenderedFor=null;
    saveState();
    setRoute('qr');
  }

  function spaydString(payment){
    var account=payment.account||state.settings.account;
    var variableSymbol=payment.variableSymbol||payment.id.replace(/\D/g,'').slice(-10);
    return 'SPD*1.0*ACC:'+account+'*AM:'+(payment.amountCents/100).toFixed(2)+'*CC:'+payment.currency+'*X-VS:'+variableSymbol+'*MSG:QR POKLADNA';
  }

  function renderQrCode(){
    var payment=getActivePayment();
    if(!payment||qrRenderedFor===payment.id)return;
    var code=el('qrCode');code.innerHTML='';
    if(typeof QRCode!=='undefined'){
      try{new QRCode(code,{text:spaydString(payment),width:280,height:280,correctLevel:QRCode.CorrectLevel.M});}
      catch(error){code.innerHTML='';try{new QRCode(code,{text:spaydString(payment),width:280,height:280,correctLevel:QRCode.CorrectLevel.L});}catch(fallbackError){code.textContent='QR kód se nepodařilo vytvořit.';}}
    }else code.textContent='QR kód se nepodařilo načíst.';
    qrRenderedFor=payment.id;
  }

  function renderQrView(){
    var payment=getActivePayment();
    if(!payment){setRoute('pokladna',true);return;}
    el('qrAmount').textContent=formatAmount(payment.amountCents,payment.currency);
    el('qrPaymentId').textContent='ID platby '+payment.id;
    renderQrCode();
    updateVerification();
    if(payment.status==='pending')verifyTimer=setInterval(updateVerification,250);
    updateBadges();
  }

  function stopVerifyTimer(){if(verifyTimer){clearInterval(verifyTimer);verifyTimer=null;}}

  function reconcilePayments(){
    var now=Date.now();
    var changed=false;
    var newEvents=[];
    state.payments.forEach(function(payment){
      if(payment.status!=='pending')return;
      if(!payment.willFail&&payment.confirmAt&&payment.confirmAt<=now){
        payment.status='paid';payment.paidAt=now;payment.updatedAt=now;changed=true;
        if(!payment.announcedAt)newEvents.push({payment:payment,type:'paid'});
      }else if(payment.expiresAt&&payment.expiresAt<=now){
        payment.status='expired';payment.updatedAt=now;changed=true;
        if(!payment.announcedAt)newEvents.push({payment:payment,type:'expired'});
      }
    });
    if(newEvents.length){newEvents.forEach(function(event){event.payment.announcedAt=now;});changed=true;}
    if(changed)saveState();
    return newEvents;
  }

  function updateVerification(){
    announcePayments(reconcilePayments());
    var payment=getActivePayment();
    if(!payment)return;
    var status=el('paymentStatus');
    var progressTrack=el('verifyProgress').querySelector('div');
    el('verifyProgress').hidden=false;
    if(payment.status==='paid'){
      status.className='status-chip paid';status.querySelector('span').textContent='Platba ověřena';
      progressTrack.hidden=true;
      stopVerifyTimer();return;
    }
    if(payment.status==='expired'){
      status.className='status-chip expired';status.querySelector('span').textContent='Platba neověřena';
      progressTrack.hidden=true;
      stopVerifyTimer();return;
    }
    var now=Date.now();
    var duration=Math.max(1,payment.expiresAt-payment.createdAt);
    var remaining=Math.max(0,payment.expiresAt-now);
    var elapsed=Math.min(1,Math.max(0,(now-payment.createdAt)/duration));
    status.className='status-chip checking';status.querySelector('span').textContent='Čekáme na platbu';
    progressTrack.hidden=false;
    el('progressBar').style.width=Math.round(elapsed*100)+'%';
  }

  function resetPayment(){
    var payment=getActivePayment();
    if(payment)state.lastAmountCents=payment.amountCents;
    state.amountCents=0;state.activePaymentId=null;entryBuffer='';calcExpression='';qrRenderedFor=null;saveState();setRoute('pokladna');
    setTimeout(function(){el('amountInput').focus();},0);
  }

  function updateBadges(){
    var count=state.payments.filter(function(payment){return payment.status==='pending';}).length;
    var indicator=el('verificationIndicator');
    var badge=el('verificationCount');
    badge.textContent=count;
    indicator.classList.toggle('has-pending',count>0);
    indicator.setAttribute('aria-label',count?count+' '+(count===1?'platba čeká':'platby čekají')+' na ověření':'Žádné platby k ověření');
    el('paymentMenuCount').hidden=count===0;el('paymentMenuCount').textContent=count;
  }

  function flashIndicator(){
    var indicator=el('verificationIndicator');
    indicator.classList.remove('just-paid');
    void indicator.offsetWidth;
    indicator.classList.add('just-paid');
    setTimeout(function(){indicator.classList.remove('just-paid');},1400);
  }

  function announcePayments(events){
    if(!state.session||!events||!events.length)return;
    updateBadges();
    var notifications=events.filter(function(item){
      var visibleQr=routeFromHash()==='qr'&&state.activePaymentId===item.payment.id&&document.visibilityState==='visible'&&document.hasFocus();
      return !visibleQr;
    });
    if(!notifications.length)return;
    notifications.forEach(function(item){
      toastQueue.push(item);
      if(item.type==='paid'&&state.settings.notifications&&'Notification'in window&&Notification.permission==='granted'){
        try{new Notification('Platba ověřena',{body:formatAmount(item.payment.amountCents,item.payment.currency)+' · '+item.payment.id});}catch(error){}
      }
    });
    flashIndicator();showNextToast();
  }

  function dismissToast(){
    var toast=el('paymentToast');
    if(!toast)return;
    toast.classList.remove('show');
    setTimeout(function(){
      toast.hidden=true;
      toastTimer=null;
      showNextToast();
    },250);
  }

  function retryPayment(amountCents){
    if(!amountCents||amountCents<=0)return;
    var dialog=el('paymentDialog');
    if(dialog&&dialog.open)dialog.close();
    dismissToast();
    state.amountCents=amountCents;
    startPayment();
  }

  function showNextToast(){
    if(toastTimer||!toastQueue.length)return;
    var item=toastQueue.shift();
    var payment=item.payment;
    var toast=el('paymentToast');
    var icon=el('paymentToastIcon');
    var closeBtn=el('paymentToastClose');
    var toastRetryBtn=el('toastRetryBtn');
    var toastActions=el('paymentToastActions');

    if(item.type==='expired'){
      toast.classList.add('toast-alert');
      icon.innerHTML='<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>';
      el('paymentToastAmount').textContent=formatAmount(payment.amountCents,payment.currency)+' neověřeno';
      el('paymentToastId').textContent='ID platby '+payment.id+' · Čas vypršel';
      if(toastActions)toastActions.hidden=false;
      if(toastRetryBtn){
        toastRetryBtn.hidden=false;
        toastRetryBtn.onclick=function(){retryPayment(payment.amountCents);};
      }
      if(closeBtn)closeBtn.hidden=false;
    }else{
      toast.classList.remove('toast-alert');
      icon.innerHTML='<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>';
      el('paymentToastAmount').textContent=formatAmount(payment.amountCents,payment.currency)+' zaplaceno';
      el('paymentToastId').textContent='ID platby '+payment.id;
      if(toastRetryBtn)toastRetryBtn.hidden=true;
      if(closeBtn)closeBtn.hidden=true;
    }

    toast.hidden=false;
    requestAnimationFrame(function(){toast.classList.add('show');});

    if(item.type==='expired'){
      toastTimer='sticky';
    }else{
      toastTimer=setTimeout(function(){
        toast.classList.remove('show');
        setTimeout(function(){toast.hidden=true;toastTimer=null;showNextToast();},250);
      },4000);
    }
  }

  function transactionIcon(status){
    if(status==='paid')return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>';
    if(status==='expired')return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 7l10 10M17 7 7 17"/><circle cx="12" cy="12" r="9"/></svg>';
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5h4"/></svg>';
  }
  function transactionHtml(payment){
    return '<button class="transaction-row '+escapeHtml(payment.status)+'" type="button" data-payment-id="'+escapeHtml(payment.id)+'"><span class="transaction-icon">'+transactionIcon(payment.status)+'</span><span class="transaction-main"><strong>QR platba</strong><small>'+escapeHtml(payment.id)+' · '+escapeHtml(formatTime(payment.createdAt))+'</small></span><span class="transaction-side"><strong>'+escapeHtml(formatAmount(payment.amountCents,payment.currency))+'</strong><span>'+escapeHtml(statusLabels[payment.status]||payment.status)+'</span></span></button>';
  }

  function renderPayments(){
    var filter=el('statusFilter').value;
    var list=filter==='all'?state.payments:state.payments.filter(function(payment){return payment.status===filter;});
    el('paymentList').innerHTML=list.length?list.map(transactionHtml).join(''):'<div class="empty-list">Žádná platba v tomto stavu.</div>';
    updateBadges();
  }

  function renderSettings(){
    renderSession();
    el('accountSetting').value=state.settings.account;
    el('currencySetting').value=state.currency;
    if(el('presetsSetting'))el('presetsSetting').value=(state.settings.presets||[100,200,500]).join(', ');
    el('notificationsSetting').checked=state.settings.notifications;
    el('employeeSetting').checked=state.settings.employee;
    updateBadges();
  }

  function markSaved(){
    el('saveStatus').textContent='Uloženo.';clearTimeout(markSaved.timer);
    markSaved.timer=setTimeout(function(){el('saveStatus').textContent='Změny se ukládají automaticky.';},1600);
  }

  function renderDetailQr(payment){
    var wrapper=el('detailQr');
    var code=el('detailQrCode');
    var show=payment.status==='pending';
    wrapper.hidden=!show;
    code.innerHTML='';
    if(!show)return;
    if(typeof QRCode!=='undefined'){
      try{new QRCode(code,{text:spaydString(payment),width:220,height:220,correctLevel:QRCode.CorrectLevel.M});}
      catch(error){code.innerHTML='';try{new QRCode(code,{text:spaydString(payment),width:220,height:220,correctLevel:QRCode.CorrectLevel.L});}catch(fallbackError){code.textContent='QR kód se nepodařilo vytvořit.';}}
    }else code.textContent='QR kód se nepodařilo načíst.';
  }

  var activeDetailId=null;
  var detailTimer=null;

  function stopDetailTimer(){
    if(detailTimer){clearInterval(detailTimer);detailTimer=null;}
  }

  function updateDetailView(){
    var dialog=el('paymentDialog');
    if(!dialog||!dialog.open||!activeDetailId){
      stopDetailTimer();return;
    }
    var payment=state.payments.find(function(item){return item.id===activeDetailId;});
    if(!payment)return;
    var statusText=el('detailStatusText');
    if(statusText)statusText.textContent=statusLabels[payment.status]||payment.status;
    var progressTrack=el('detailProgressTrack');
    if(payment.status==='pending'){
      if(progressTrack)progressTrack.hidden=false;
      var bar=el('detailProgressBar');
      if(bar){
        var now=Date.now();
        var duration=Math.max(1,payment.expiresAt-payment.createdAt);
        var elapsed=Math.min(1,Math.max(0,(now-payment.createdAt)/duration));
        bar.style.width=Math.round(elapsed*100)+'%';
      }
    }else{
      if(progressTrack)progressTrack.hidden=true;
      renderDetailQr(payment);
      stopDetailTimer();
    }
  }

  function showPaymentDetail(id){
    var payment=state.payments.find(function(item){return item.id===id;});if(!payment)return;
    activeDetailId=id;
    el('detailTitle').textContent=formatAmount(payment.amountCents,payment.currency);
    var now=Date.now();
    var duration=Math.max(1,payment.expiresAt-payment.createdAt);
    var elapsed=Math.min(1,Math.max(0,(now-payment.createdAt)/duration));
    var percent=Math.round(elapsed*100);
    var isPending=payment.status==='pending';

    var statusHtml='<div><strong id="detailStatusText">'+escapeHtml(statusLabels[payment.status]||payment.status)+'</strong>'+
      '<div class="detail-progress-track" id="detailProgressTrack" '+(isPending?'':'hidden')+'>'+
      '<span id="detailProgressBar" style="width:'+percent+'%;"></span>'+
      '</div></div>';

    var rowsHtml='<div class="detail-row"><span>Stav</span>'+statusHtml+'</div>'+
      '<div class="detail-row"><span>Pokladna</span><strong>'+escapeHtml(payment.registerName||currentRegisterName())+'</strong></div>'+
      '<div class="detail-row"><span>ID platby</span><strong>'+escapeHtml(payment.id)+'</strong></div>'+
      '<div class="detail-row"><span>Vytvořeno</span><strong>'+escapeHtml(formatDateTime(payment.createdAt))+'</strong></div>';

    el('paymentDetail').innerHTML=rowsHtml;
    var retryBtn=el('retryPaymentBtn');
    if(retryBtn){
      retryBtn.hidden=payment.status!=='expired';
      retryBtn.onclick=function(){retryPayment(payment.amountCents);};
    }
    renderDetailQr(payment);
    el('paymentDialog').showModal();
    stopDetailTimer();
    if(isPending)detailTimer=setInterval(updateDetailView,250);
  }

  function refreshBackground(){
    announcePayments(reconcilePayments());
    updateBadges();
    if(routeFromHash()==='platby')renderPayments();
    if(routeFromHash()==='qr'&&getActivePayment())updateVerification();
    updateDetailView();
  }

  function bindEvents(){
    qsa('[data-route]').forEach(function(button){button.addEventListener('click',function(){setRoute(button.getAttribute('data-route'));});});
    window.addEventListener('hashchange',renderRoute);
    el('menuButton').addEventListener('click',function(event){event.stopPropagation();toggleMenu();});
    el('appMenu').addEventListener('click',function(event){event.stopPropagation();});
    document.addEventListener('click',closeMenu);
    document.addEventListener('keydown',function(event){if(event.key==='Escape')closeMenu();});

    el('loginForm').addEventListener('submit',function(event){
      event.preventDefault();
      var username=el('loginUsername').value.trim();
      var password=el('loginPassword').value;
      if(!username||!password){this.reportValidity();return;}
      state.session=createSession(username);
      state.amountCents=0;state.activePaymentId=null;entryBuffer='';calcExpression='';qrRenderedFor=null;
      saveState();this.reset();setRoute('pokladna',true);
    });
    el('loginForm').addEventListener('keydown',function(event){
      if(event.key==='Enter'){event.preventDefault();this.requestSubmit();}
    });
    el('logoutButton').addEventListener('click',function(){
      state.session=null;state.amountCents=0;state.activePaymentId=null;entryBuffer='';calcExpression='';qrRenderedFor=null;
      saveState();setRoute('prihlaseni',true);
    });

    el('amountInput').addEventListener('focus',function(){entryBuffer=plainAmount(state.amountCents).replace(/,00$/,'');this.value=entryBuffer.replace('.',',');this.select();});
    el('amountInput').addEventListener('input',function(){entryBuffer=normalizeBuffer(this.value);calcExpression=entryBuffer;updateAmount(centsFromBuffer(entryBuffer),true);});
    el('amountInput').addEventListener('blur',function(){this.value=formatAmount(state.amountCents,state.currency).replace(/\s?(Kč|€)$/,'').trim();});
    if(el('kpPresets')){
      el('kpPresets').addEventListener('click',function(event){
        var button=event.target.closest('[data-preset-cents]');
        if(!button)return;
        var cents=parseInt(button.getAttribute('data-preset-cents'),10);
        if(isNaN(cents)||cents<=0)return;
        entryBuffer=plainAmount(cents);
        calcExpression=entryBuffer;
        updateAmount(cents,true);
      });
    }
    el('keypad').addEventListener('click',function(event){var button=event.target.closest('[data-key]');if(button)pressCalcKey(button.getAttribute('data-key'));});
    if(el('paymentToastClose'))el('paymentToastClose').addEventListener('click',dismissToast);
    el('payButton').addEventListener('click',startPayment);
    el('newPaymentButton').addEventListener('click',resetPayment);
    el('statusFilter').addEventListener('change',renderPayments);
    el('paymentList').addEventListener('click',function(event){var row=event.target.closest('[data-payment-id]');if(row)showPaymentDetail(row.getAttribute('data-payment-id'));});
    el('paymentDialog').addEventListener('close',function(){activeDetailId=null;stopDetailTimer();});

    el('accountSetting').addEventListener('change',function(){state.settings.account=this.value;saveState();markSaved();});
    el('currencySetting').addEventListener('change',function(){state.currency=this.value;saveState();markSaved();renderPresets();});
    if(el('presetsSetting')){
      el('presetsSetting').addEventListener('change',function(){
        var raw=this.value;
        var parsed=raw.split(/[,;\s]+/).map(function(item){
          var num=parseFloat(item.replace(',','.'));
          return isNaN(num)||num<=0?null:Math.round(num*100)/100;
        }).filter(Boolean);
        state.settings.presets=parsed.length?parsed:[100,200,500];
        saveState();
        markSaved();
        renderPresets();
      });
    }
    el('notificationsSetting').addEventListener('change',function(){state.settings.notifications=this.checked;saveState();markSaved();});
    el('employeeSetting').addEventListener('change',function(){state.settings.employee=this.checked;saveState();markSaved();});

    document.addEventListener('keydown',function(event){
      var route=routeFromHash();
      if(event.metaKey||event.ctrlKey||event.altKey)return;
      if(route==='qr'){
        if(event.key==='Enter'){resetPayment();event.preventDefault();}
        return;
      }
      if(route!=='pokladna')return;
      if(event.key==='Enter'){
        if(!el('payButton').disabled){startPayment();event.preventDefault();}
        return;
      }
      var tag=document.activeElement&&document.activeElement.tagName;
      if(tag==='SELECT'||tag==='TEXTAREA')return;
      var key=event.key;
      if(/^[0-9]$/.test(key)){pressCalcKey(key);event.preventDefault();}
      else if(key==='Backspace'){pressCalcKey('del');event.preventDefault();}
      else if(key===','||key==='.'){pressCalcKey('.');event.preventDefault();}
      else if(['+','-','*','/','(',')'].indexOf(key)>=0){pressCalcKey(key);event.preventDefault();}
      else if(key.toLowerCase()==='c'){pressCalcKey('clear');event.preventDefault();}
    });

    document.addEventListener('visibilitychange',function(){if(!document.hidden)refreshBackground();});
    window.addEventListener('focus',refreshBackground);
  }

  document.addEventListener('DOMContentLoaded',function(){
    state=loadState();
    reconcilePayments();
    entryBuffer=state.amountCents?String(state.amountCents/100):'';
    calcExpression=entryBuffer;
    bindEvents();renderKeypad();
    if(!state.session)setRoute('prihlaseni',true);
    else if(!location.hash||location.hash==='#prihlaseni')setRoute('pokladna',true);
    else renderRoute();
    backgroundTimer=setInterval(refreshBackground,500);
    if('serviceWorker'in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js?v=2').catch(function(){});});}
  });
})();
