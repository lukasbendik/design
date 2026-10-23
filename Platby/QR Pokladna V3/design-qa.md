# QR Pokladna V3 — opravy podle podkladů 23. 10. 2026

final result: passed

## Podklady a vizuální důkazy

Aktuální reference uživatele:

- `codex-clipboard-ecfb5e32-4dfd-4002-9b5e-c789298d9653.png`: 900 × 1840, kontextové menu KB+.
- `codex-clipboard-6b5890a7-3217-4b70-b5a5-6e4fd9e0027d.png`: 748 × 1626, homescreen s widgetem; normalizováno na šířku 375 CSS px a výšku 812 px (3 px rozdíl poměru stran oříznuty).
- `codex-clipboard-11472ba1-8a7e-40b1-8c67-ec34a5af8952.png`: 750 × 1624, částka a klávesnice; zdroj klávesnice 750 × 675 px, zobrazený se zachovaným poměrem stran a funkčními HTML klávesami.
- `codex-clipboard-ad3a0f15-874d-4431-b7e8-8adb4064e832.png`: 750 × 1624, QR platba; normalizováno na 375 × 812 CSS px.

Snímky i společná porovnání jsou uložené pouze lokálně v `../../zapisky/qr-pokladna-v3-fixes-2026-10-23/`:

- `comparison-home-final.png`: reference a finální skutečný render vedle sebe.
- `comparison-qr.png`: reference a skutečný render QR ve stejné šířce 375 px; implementace přidává 44px status bar telefonu a spodní safe area.
- `cashier-desktop.png`: celá desktopová simulace telefonu, Zaplatit nad Gboard klávesnicí.
- `menu-final.png`: skutečné HTML kontextové menu.
- `qr-320x568.png`, `paid-320x568.png`: celé obrazovky na malém displeji.
- `keyboard-visible-area.png`: lokální test modelující změnu pouze visual viewportu.

Prohlížeč: připojený Brave, ovládání a ověřování přes Playwright. Desktop 1400 × 1100, telefon 393 × 852 CSS px, deviceScaleFactor 1. Mobilní viewporty 375 × 812, 375 × 667 a 320 × 568. Snímky se pořizovaly po vykreslení v následujícím kroku, protože screenshot API někdy vrací poslední vykreslený frame.

## Nálezy, opravy a následné ověření

1. **P1 — Zaplatit mimo plochu při otevření systémové klávesnice.** Původní výška vycházela z layout viewportu. Výška mobilního telefonu nyní sleduje `visualViewport.height` a `offsetTop`; formulář má pevně dostupnou spodní akci a samostatně scrollovatelný obsah. Přidáno `interactive-widget=resizes-content` pro podporující prohlížeče. Test layout 812 px / viditelná plocha 360 px: input končí na 245 px, tlačítko je od 300 do 348 px; při posunu viditelné oblasti o 70 px zůstává pod její spodní hranicí 430 px.
2. **P2 — levá navigace zarovnaná ke středu.** Selektor `.header button:last-child` zasahoval i jediné tlačítko v levém sloupci. Zarovnání nyní řídí levý/pravý obal samostatně. Naměřeno levé tlačítko i obsah na x=16 px. QR návrat má také šipku podle reference.
3. **P2 — platební obrazovka přesahovala malý displej.** QR obrazovka má pružnou prostřední oblast, adaptivní QR a kompaktní režim. Na 320 × 568 je screen 524 px (zbývajících 44 px je status bar), scrollHeight=clientHeight, Zrušit platbu končí na y=544 px. Výsledek zaplacení má rovněž scrollHeight=clientHeight, spodní Zavřít končí na y=528 px.
4. **P2 — zbytečné potvrzování zrušení.** Dialog odstraněn. Akce přímo uloží zrušený/vyřazený stav a otevře `#zruseno` s výsledkem „Platba zrušena“. Po kliknutí je počet dialogů 0; stav a výsledek zůstávají i po refreshi.
5. **P2 — odlišný homescreen a menu.** Widget a menu jsou skutečné HTML komponenty, app ikony, KB+ značka a ikony menu jsou převzaté z podkladů. Tapeta byla očištěna přes ImageGen podle zdroje. Během porovnání zjištěna poloviční průhlednost některých výřezů; opravena a znovu porovnána v `comparison-home-final.png`.
6. **P2 — focus při ovládání nové klávesnice.** Přechod focusu z částky na její klávesy nesmí panel zavřít před kliknutím. Blur handler nyní rozlišuje klávesnici/primární akci od odchodu jinam. Přes Playwright ověřeno 2 → 3 → 8 = hodnota 238 a potvrzení šipkou. Spodek Zaplatit y=524, začátek klávesnice y=542 v desktopové simulaci.

## Povinné vizuální oblasti

- **Fonty a typografie:** Inter a sémantické tokeny KB; hierarchie částky s větší celou částí, sekundární popisky účtu a ID přiblíženy referenci; kompaktní režim zachovává čitelnost menšího telefonu.
- **Rozložení:** 16px vodorovné okraje; správná levá navigace; akce mimo scroll obsahu; celý QR i oba spodní ovladače viditelné. Konkrétní klíčové oblasti porovnány samostatně: widget a dock, menu, pole částky a Zaplatit/klávesnice, QR a spodní akce.
- **Barvy:** stávající KB DS tokeny, červená primární akce, světlé plochy a sekundární texty; zachováno rozlišení výsledků.
- **Obrázky:** skutečné výřezy ikon, obrázek nativní klávesnice pro desktop, zdrojové ikony kamery a čekání. Samotné bankovní obrazovky, widget a menu zůstávají HTML; QR je skutečně generovaný z částky, účtu a ID.
- **Copy:** zachováno „Zaplatit“, „K zaplacení“, „Zadat další“, „Zrušit platbu“. Nový přímý výsledek má jednoznačné „Platba zrušena“.

## Interakce a regrese

Playwright ověřil widget → PIN → focus částky, vstup přes ikonu KB+, QR rychlou akci z kontextového menu, klávesy a potvrzení částky, viditelnost Zaplatit, tvorbu QR, celé QR na malých displejích, zaplacení, přímé zrušení bez dialogu, refresh zrušeného výsledku a návrat na pokladnu/homescreen. Původní přehledy a práce s účty zůstávají stejné.

Model klávesnice používá izolovaný lokální `keyboard-fixture.html`, který drží layout na 812 px a zmenšuje pouze platformní visual viewport na 360 px. Prošel také posun viditelné oblasti o 70 px. Fixture se nepublikuje. Test skutečné klávesnice na fyzickém telefonu není součástí těchto browser kontrol.

Konzole bez zaznamenaných chyb a varování. `node --check app.js`, `node --check homescreen.js` a `git diff --check` prošly.

## Záměrné odlišnosti

- Přidána ikona KB+ do volného místa pod widgetem, aby byl dostupný i druhý vstup požadovaný v zadání.
- Telefon přidává status bar a safe area; bankovní screenshoty je v referenci nezobrazují.
- Numerická klávesnice na desktopu je funkční simulace; mobil používá systémovou klávesnici přes `inputmode=decimal`.
- Pozadí pod kontextovým menu používá stejný homescreen jako widget, aby obě vstupní cesty byly součástí jednoho telefonu.

Nezůstává otevřená chyba P0/P1/P2 v požadovaných změnách.

## Ikona pokladny

QR pokladna nyní používá dodanou ikonu `codex-clipboard-ac251a08-bbd7-488e-ba8d-9d9a858b318f.png` jako průhledný lokální asset `cash-register.png`: v rychlých akcích, nabídce placení účtu i v hlavičce pokladny. Playwright ověřil zdroj obrázku v menu, vzhled i čistou konzoli. Syntaxe a diff check prošly.

## Real iOS homescreen — 2026-10-23
- Supplied iOS screenshot used directly as the homescreen background; original widget and system icons preserved. KB+ uses the supplied red/black app icon.
- Playwright: widget and app both open login; context menu opens; no console errors.
- Desktop screenshot visually reviewed against the supplied iOS reference; mobile 375×812 reviewed, no horizontal overflow.
- final result: passed

## Mobile status bar — 2026-10-23
- Hide simulated status bar and remove its reserved space at widths up to 700px. Crop the baked-in status bar from the iOS screenshot, adjusting widget/app hitboxes accordingly. Desktop remains unchanged.
- Playwright: 375×812 homescreen visually reviewed without status indicators; widget opens login and cashier; cashier header at y=0. Desktop status bar display flex / visibility visible. No console errors.
- final result: passed

## Payment screenshot sharing and waiting rotation — 2026-10-23
- Camera button captures current phone viewport to PNG using bundled html2canvas 1.4.1 (MIT). Opens an iOS-style simulated sharing sheet with actual image preview, app choices, image download and native file sharing when supported. App choices explicitly simulate the destination.
- Waiting icon rotates 360 degrees around the horizontal X axis, with reduced-motion support.
- Playwright: desktop and 375×667 mobile capture/sheet visually reviewed; mobile PNG is 750×1334. Mock destination feedback and save action work; no console errors. Computed animation is waiting-flip with an X-axis matrix3d transform. Native OS sharing not available in the desktop browser and not device-tested.
- final result: passed

## Cashier header icon correction — 2026-10-23
- Replace calculator-shaped icon in cashier top right with Font Awesome cash-register SVG (CC BY 4.0, bundled license). Other icons unchanged.
- Playwright visually verified actual till silhouette and clicking opens payment list; console clean.
- final result: passed

## Result illustration M — 2026-10-23
- All result states use the documented ES Illustration M frame (375×212), per design-system/assets/icons-and-illustrations.md. Removed small-viewport shrinking and error-specific small sizing.
- Playwright: paid, partial, timeout and cancellation all measured 375×212. Mobile 375×667 reviewed visually; actions remain visible. Console clean.
- final result: passed

## Homescreen icon emphasis — 2026-10-23
- Overlay all surrounding applications and dock icons using the existing original full-strength iOS assets, matching the KB+ icon. Align labels with screenshot text and preserve screenshot wallpaper/layout.
- Playwright: desktop and 375×812 mobile visually reviewed; widget still opens login, console clean.
- final result: passed

## Close cashier opened from widget — 2026-10-23
- Close now opens KB+ homepage for widget entry. App entry still returns to account detail.
- Playwright verified widget → login → cashier → Close → #home, homepage survives refresh, console clean.
- final result: passed

## Remove duplicated homescreen artwork — 2026-10-23
- Root cause: full screenshot background already contained app icons/labels beneath live full-strength icons. Replaced with the existing icon-free wallpaper. Widget, page indicators, dock and app labels now each render once; desktop status indicators retained, mobile indicators hidden.
- Playwright desktop and 375×812 mobile screenshots visually reviewed: no duplicate icons or labels; 13 app images; widget opens login; console clean.
- final result: passed
