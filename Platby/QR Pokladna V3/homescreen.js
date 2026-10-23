/* Pure homescreen renderers. Navigation and login state remain in app.js. */
window.QRHomescreen = (() => {
  const asset = name => `assets/ios-${name}.png`;
  const ds = name => `<img src="../../design-system/design-system/assets/icons/${name}.svg" alt="">`;
  const app = (label, image, position, action = '') => `<button class="ios-app ios-${position}" ${action ? `data-action="${action}"` : 'tabindex="-1"'} ${action === 'login-app' ? 'id="kb-app" aria-haspopup="menu" aria-label="KB+, podržením otevřete rychlé akce"' : ''}><img src="${asset(image)}" alt=""><span>${label}</span></button>`;
  function render() {
    return `<section class="screen ios-homescreen" aria-label="Homescreen telefonu"><button class="ios-widget" data-action="login-widget" aria-label="Otevřít widget QR pokladna"><img src="${asset('kb-icon')}" alt=""><strong>QR Pokladna</strong><span>Otevřít</span></button>
    ${app('KB+', 'kb-app', 'kb', 'login-app')}${app('Clock','clock','clock')}${app('Instagram','instagram','instagram')}${app('Telegram','telegram','telegram')}${app('Reminders','reminders','reminders')}${app('Figma','figma','figma')}${app('Folder','folder','folder')}${app('Mail','mail','mail')}${app('Spotify','spotify','spotify')}
    <div class="ios-pages" aria-hidden="true"><i></i><i></i><i></i></div><div class="ios-dock" aria-hidden="true">${app('Telefon','phone','dock-item')}${app('Safari','safari','dock-item')}${app('Nastavení','settings','dock-item')}${app('Zprávy','messages','dock-item')}</div></section>`;
  }
  function quickActions() {
    return `<div class="overlay ios-quick-overlay"><button class="ios-context-dismiss" data-action="close-sheet" aria-label="Zavřít rychlé akce"></button><nav class="ios-context-menu" aria-label="Rychlé akce KB+"><div class="ios-widget-sizes" aria-hidden="true"><span><img src="assets/ios-menu-size-grid.png" alt=""></span><span><img src="assets/ios-menu-size-small.png" alt=""></span><span><img src="assets/ios-menu-size-wide.png" alt=""></span><span><img src="assets/ios-menu-size-large.png" alt=""></span></div>
      <button type="button" tabindex="-1">${ds('send-payment')}<span>Platba</span></button>
      <button type="button" tabindex="-1"><img src="assets/qr-code.svg" alt=""><span>Vyfotit</span></button>
      <button type="button" tabindex="-1">${ds('pay-me')}<span>Zaplať mi</span></button>
      <button type="button" tabindex="-1">${ds('key')}<span>KB Klíč</span></button>
      <button type="button" data-action="login-widget"><img src="assets/ios-menu-devices.png" alt=""><span>QR pokladna</span></button>
      <button type="button" tabindex="-1"><img src="assets/ios-menu-edit-home.png" alt=""><span>Edit Home Screen</span></button>
      <button type="button" tabindex="-1"><img src="assets/ios-menu-face-id.png" alt=""><span>Require Face ID</span></button>
      <button type="button" tabindex="-1" class="ios-remove"><img src="assets/ios-menu-remove-app.png" alt=""><span>Remove App</span></button></nav></div>`;
  }
  return { render, quickActions };
})();
