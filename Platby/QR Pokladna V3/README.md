# QR Pokladna V3

Telefonní prototyp KB+ podle dodaného schématu. Výchozí obrazovka je homescreen telefonu (`#telefon`). Widget vede přes přihlášení na pokladnu, ikona KB+ na přehled účtů. Demo přihlášení přijme libovolných šest číslic nebo Face ID.

Na desktopu jsou mimo telefon volby simulace. Nová platba se podle volby zaplatí za osm sekund, přijde s nižší/vyšší částkou nebo po minutě vyprší čekání. Ruční simulace ponechá výsledek na ovládání vedle telefonu.

Účet, rozpracovaná částka, scénář a historie jsou uložené pod samostatným klíčem `qr_pokladna_v3__state`. PIN se neukládá. Hash i historie zachovávají navigaci. Prototyp neobsahuje měření ani bankovní integraci.

## Úpravy podle podkladů

Zaplatit je ukotveno nad klávesnicí; mobilní výška reaguje na `visualViewport.height` i `offsetTop`. QR a výsledky se přizpůsobí malému displeji. Zrušit platbu vede rovnou na výsledek „Platba zrušena“, bez potvrzovacího dialogu.

Homescreen, HTML widget a kontextové menu vycházejí z aktuálních screenshotů. Ikony jsou extrahované ze zdrojů, tapeta je očištěná přes ImageGen. Desktop používá interaktivní obrazovou klávesnici podle reference; na mobilu se simulace skrývá a zůstává systémová klávesnice.

- [VisualViewport API](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [Chrome: změny velikosti viewportu při zobrazení klávesnice](https://developer.chrome.com/blog/viewport-resize-behavior)

## Zdroje

- Místní KB design systém, ikony, fonty a ilustrace.
- Přihlašovací panel, přehled a diagram dodané uživatelem; Face ID, avatar a ilustrace nedoručení extrahované z referencí.
- QRCode Generator 2.0.4 (MIT, Kazuhiko Arase), lokální `assets/qrcode.js`.
- Bootstrap Icons 1.13.2 (MIT), lokální SVG.
- Flag Icons 7.5.0 (MIT), vlajky CZ a EU.
- [HTML inputmode – MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inputmode), ověřeno 23. 10. 2026.

Ověření popisuje `design-qa.md`.
