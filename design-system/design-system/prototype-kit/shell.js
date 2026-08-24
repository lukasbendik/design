/* The prototype shell — one shared tool for every Golem prototype in this repository.

   A prototype should not rebuild the device switcher, the breakpoint switcher, the colour mode,
   the language toggle and the step list. Those are the same everywhere, they were wrong in three
   places before this file existed, and a fix has to land once.

   ------------------------------------------------------------------ how to use it

     <link rel="stylesheet" href="<kit>/shell.css">
     <script src="<kit>/shell.js"></script>
     <script>
       GolemShell({
         file:  'journey.html',                       // the file holding the screens
         title: 'Spořicí účet — cesta klienta',
         url:   'kb.cz/plus/sporeni',                 // shown in the simulated browser chrome
         steps: [
           { id: 'home',  label: 'Spoření',       sub: 'Ground / Main page' },
           { id: 'offer', label: 'Potvrzení',     sub: 'Sheet', overlay: 'confirm' }
         ]
       });
     </script>

   ------------------------------------------------------------------ what the screens file must do

   Read these query parameters on load:
       ?screen=<id>  ?platform=ios|android|ib  ?theme=light|dark  ?lang=cs|en  ?overlay=<name>

   Put `platform` and `theme` on <html> as data-platform / data-theme, because templates.css keys
   the scrollbar and the header off them.

   Accept these messages from the parent, without reloading:
       { theme }  { lang }  { screen }  { overlay }

   Post one message up whenever the user navigates inside it:
       parent.postMessage({ screen: <id>, overlay: <name or ''> }, '*')

   The shell never posts `screen` back in response to that message. It used to, and that is what
   made every sheet close the instant it opened: the screen said "I opened a sheet on offer", the
   shell answered "show offer", and showing a screen clears its overlays. A prototype that can only
   be clicked through when opened on its own is this bug. */

function GolemShell(config) {
  'use strict';

  /* The four Golem design canvases — ../patterns/screen-layout.md. */
  var SIZES = { sm: [375, 812], md: [768, 1024], lg: [1024, 768], lgWide: [1680, 1000] };
  var OPTIONS = {
    platform: ['ios', 'android', 'ib'],
    size: ['sm', 'md', 'lg', 'lgWide'],
    theme: ['light', 'dark'],
    lang: ['cs', 'en']
  };
  var LABELS = {
    platform: { ios: 'iOS', android: 'Android', ib: 'Prohlížeč' },
    size: { sm: 'sm 375', md: 'md 768', lg: 'lg 1024', lgWide: 'lgWide 1680' },
    theme: { light: 'Světlý', dark: 'Tmavý' },
    lang: { cs: 'CS', en: 'EN' }
  };
  var GROUPS = [
    ['platform', 'Zařízení'], ['size', 'Rozlišení'], ['theme', 'Režim'], ['lang', 'Jazyk']
  ];

  var steps = config.steps || [];
  var state = { platform: 'ios', size: 'sm', theme: 'light', lang: 'cs', step: 0 };

  new URLSearchParams(location.search).forEach(function (v, k) {
    if (OPTIONS[k] && OPTIONS[k].indexOf(v) !== -1) state[k] = v;
    if (k === 'step' && steps[Number(v)]) state.step = Number(v);
  });

  /* ---------------------------------------------------------------- the frame */

  document.body.classList.add('gs');
  if (config.title) document.title = config.title + ' · prototyp';

  var bar = el('div', 'gs__bar');
  GROUPS.forEach(function (g) {
    var key = g[0];
    var group = el('div', 'gs__group');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', g[1]);
    group.appendChild(el('span', 'gs__label', g[1]));
    OPTIONS[key].forEach(function (value) {
      var b = el('button', null, LABELS[key][value]);
      b.type = 'button';
      b.dataset.set = key;
      b.dataset.value = value;
      group.appendChild(b);
    });
    bar.appendChild(group);
  });
  var links = el('div', 'gs__links');
  var standalone = el('a', null, 'Otevřít obrazovky samostatně');
  standalone.target = '_blank';
  standalone.rel = 'noopener';
  links.appendChild(standalone);
  bar.appendChild(links);

  var stepsNav = el('nav', 'gs__steps');
  stepsNav.setAttribute('aria-label', 'Kroky prototypu');
  stepsNav.appendChild(el('h2', null, config.stepsTitle || 'Kroky'));
  steps.forEach(function (s, i) {
    var b = el('button');
    b.type = 'button';
    b.dataset.step = String(i);
    b.appendChild(el('span', 'gs__num', String(i + 1)));
    var text = el('span');
    text.appendChild(document.createTextNode(s.label));
    text.appendChild(el('br'));
    text.appendChild(el('span', 'gs__sub', s.sub || ''));
    b.appendChild(text);
    stepsNav.appendChild(b);
  });

  var frame = el('iframe');
  frame.id = 'gs-frame';
  frame.title = config.title || 'Prototyp';

  var chromeBar = el('div', 'gs__chrome');
  chromeBar.appendChild(el('span', 'gs__dot'));
  chromeBar.appendChild(el('span', 'gs__dot'));
  chromeBar.appendChild(el('span', 'gs__dot'));
  chromeBar.appendChild(el('span', 'gs__url', config.url || 'kb.cz/plus'));

  var notch = el('span', 'gs__notch');
  var home = el('span', 'gs__home');
  var screen = el('div', 'gs__screen');
  screen.appendChild(frame);

  var device = el('div', 'gs__device');
  device.appendChild(chromeBar);
  device.appendChild(notch);
  device.appendChild(screen);
  device.appendChild(home);

  var fit = el('div', 'gs__fit');
  fit.appendChild(device);
  var meta = el('p', 'gs__meta');
  var column = el('div');
  column.appendChild(fit);
  column.appendChild(meta);
  var viewport = el('div', 'gs__viewport');
  viewport.appendChild(column);

  var stage = el('div', 'gs__stage');
  if (steps.length) stage.appendChild(stepsNav);
  stage.appendChild(viewport);

  document.body.appendChild(bar);
  document.body.appendChild(stage);

  /* ---------------------------------------------------------------- behaviour */

  function src() {
    var s = steps[state.step] || {};
    var q = '?platform=' + state.platform + '&theme=' + state.theme + '&lang=' + state.lang;
    if (s.id) q += '&screen=' + s.id;
    if (s.overlay) q += '&overlay=' + s.overlay;
    return config.file + q;
  }

  function post(message) {
    if (frame.contentWindow) frame.contentWindow.postMessage(message, '*');
  }

  /* `reload` is true only when the shell itself decides which screen is shown. Everything the user
     does inside the frame is left alone — see the note at the top of this file. */
  function apply(reload) {
    var size = SIZES[state.size];
    var browser = state.platform === 'ib';

    frame.style.width = size[0] + 'px';
    frame.style.height = size[1] + 'px';
    device.classList.toggle('gs__device--browser', browser);
    notch.hidden = browser; home.hidden = browser; chromeBar.hidden = !browser;

    /* Scale the device down when the chosen canvas is wider than the window. */
    var available = viewport.clientWidth - 24;
    var scale = Math.min(1, available / (size[0] + (browser ? 0 : 24)));
    fit.style.transform = 'scale(' + scale + ')';
    requestAnimationFrame(function () {
      fit.style.height = fit.firstElementChild.getBoundingClientRect().height + 'px';
    });

    each('[data-set]', function (b) {
      b.setAttribute('aria-pressed', String(state[b.dataset.set] === b.dataset.value));
    });
    each('[data-step]', function (b) {
      if (Number(b.dataset.step) === state.step) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });

    standalone.href = src();
    meta.innerHTML = size[0] + ' × ' + size[1] + ' · <code>' + state.platform + '</code> · <code>'
      + state.theme + '</code> · <code>' + state.lang + '</code>'
      + (steps[state.step] && steps[state.step].sub ? ' · ' + steps[state.step].sub : '');

    if (reload) frame.src = src();
    else post({ theme: state.theme, lang: state.lang });
  }

  each('[data-set]', function (b) {
    b.addEventListener('click', function () {
      state[b.dataset.set] = b.dataset.value;
      /* The platform is read once, when the screen loads, so changing it reloads the frame. */
      apply(b.dataset.set === 'platform');
    });
  });

  stepsNav.addEventListener('click', function (e) {
    var b = e.target.closest('[data-step]');
    if (!b) return;
    state.step = Number(b.dataset.step);
    apply(true);
  });

  /* Walking the prototype inside the frame moves the step list with it — and nothing is sent back
     down, so an overlay the user just opened stays open. */
  addEventListener('message', function (e) {
    var m = e.data || {};
    if (!m.screen) return;
    var j = -1;
    for (var i = 0; i < steps.length; i++) {
      var match = m.overlay ? steps[i].overlay === m.overlay : !steps[i].overlay;
      if (steps[i].id === m.screen && match) { j = i; break; }
    }
    if (j !== -1 && j !== state.step) { state.step = j; apply(false); }
  });

  addEventListener('resize', function () { apply(false); });
  frame.addEventListener('load', function () { apply(false); });
  frame.src = src();

  /* ---------------------------------------------------------------- helpers */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }
}
