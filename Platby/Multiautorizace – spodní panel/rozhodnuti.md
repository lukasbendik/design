# Multiautorizace – spodní panel

Lokální varianta z 6. 10. 2026. Zachovává výběr subjektu. Testovací data doplňuje o čtyři příkazy k inkasu z dodaného návrhu. Původní prototypy nemění.

## Návrhová hypotéza

Přehled má pouze účet a jeho typy instrumentů. Rozbaluje se jen účet; typ otevře vlastní spodní panel se seznamem položek. Dávkové platby otevřou panel přímo. Označit vše u subjektu a checkbox účtu či typu vybírá příslušné dostupné položky bez otevírání panelu. Jednotlivé položky se vybírají v panelu.

Panel podle návrhu ukazuje typ a seznam položek, nedostupné položky i jejich důvod. Kontext účtu zůstává dostupný čtečce obrazovky. Výběr je průběžný, křížek zavírá panel bez změny výběru. Aktuální počty a částečný výběr se promítnou do přehledu. Panel je modální, podklad během práce nelze měnit.

Očekávaná výhoda: při běžném výběru je přehled účtů a typů kratší; uživatel se vždy soustředí na jeden jasně pojmenovaný seznam. Kompromis: porovnávání mezi účty/typy vyžaduje zavření a otevření panelů. Je to hypotéza k ověření, ne důkaz lepší použitelnosti. S laiky porovnat výběr celého typu, jediné položky, kombinace ze dvou účtů a zrušení výběru. Sledovat zaměňování checkboxu s otevřením panelu a orientaci po návratu.

## Implementace a ověření

- Samostatný localStorage klíč. Výběr i rozbalení účtů přežívají refresh. Otevřený panel je reprezentován parametrem panel při stejném #overview.
- History umožňuje zavřít panel mobilním zpět. Zavření přes křížek, Escape, tažení hlavičky dolů nebo kliknutí mimo panel zachovává výběr a vrací fokus na správný typ.
- Native dialog, modal focus, vlastní cyklus Tab/Shift+Tab. Podklad uzamčen proti scrollování; seznam uvnitř panelu má vlastní scroll a stálou hlavičku.
- Detail konkrétní položky zůstává další obrazovkou. Návrat obnoví panel a pozici v seznamu. Kontrola finálního výběru zůstává modálním panelem předchozího návrhu.
- Ověřeno 375 × 812 a 320 × 812 bez horizontálního přetékání. Individuální výběr a pomlčka rodičů; 6 dostupných plateb z 8, 13 dostupných položek účtu z 15, 23 za subjekt z 25. Blokované položky nevybrané.
- Ověřen typ trvalých příkazů, přímé otevření šesti dávek a druhý účet se čtyřmi platbami. Výběr z různých účtů se nemíchá. Měny a pravidelné částky/limity oddělené stejně jako v předchozí variantě.
- Ověřeno obnovování panelu při refreshi, mobilní zpět, návrat z detailu v pozici scroll 191 px, klávesnice, zavření mimo panel, kontrola výběru. Konzole bez zachycených chyb nebo varování. JS syntax ověřena node --check.

## Zdroje

- W3C modal dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ – modální podklad, klávesnice, uzavírací tlačítko a návrat fokusu.
- W3C skupinový checkbox: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/ – výběr celé skupiny a částečný stav.
- CORE design systém z aktuálního projektu: tokeny, řádky, checkboxy, spodní lišta a modální plochy.

## Úprava podle screenshotů 6. 10. 2026

- Rozložení přehledu a panelu, obrysové červené checkboxy, částky EUR a absence šipek u konkrétních položek odpovídají dodanému návrhu. Při rozbalení účtu se šipka otočí nahoru.
- Panel otevírá Web Animations API: translateY(100%) → translateY(0), 320 ms, cubic-bezier(.2,.8,.2,1). Změna výběru ve stejném panelu animaci neopakuje. Respektuje prefers-reduced-motion.
- Ověřeno skutečné vysouvání (mezisnímek transform translateY 538 px), následný klidový stav a změna checkboxu s openingAnimated=false.
- Tři vybrané platby dávají 61 000 Kč, 3 z 25 položek. Blokované dvě platby zůstávají nevybratelné. Skupinový checkbox příkazů k inkasu vybírá čtyři položky.
- Návrh obsahoval rozpor: 8 + 2 + 1 + 4 = 15, nikoli 11. Účet i součet subjektu používají skutečný počet, celkem 6 + 15 + 4 = 25.
- Ověřeno 375 × 812 a 320 × 720 bez horizontálního přetékání, zavření křížkem, Escape a tažením hlavičky dolů; fokus se vrací na typ. JS syntax ověřena node --check.
- Náhledy: navrh-prehled.jpg a navrh-panel.jpg. Varianta zůstává lokální.
- API ověřeno v aktuální dokumentaci MDN: https://developer.mozilla.org/en-US/docs/Web/API/Element/animate

## Zesvětlení a omezení overlaye

Overlay spodního panelu používá CORE token --color-dialog-overlay (světlý režim #21212166, 40 % krytí místo 85 %). Backdrop je centrovaný a široký min(100 %, 430 px), tedy pouze přes plochu prototypu. Ověřeno v prohlížeči na desktopu 1200 × 900: šířka overlaye 430 px, okraje 385 px, okolí bez ztmavení. Na mobilu 375 × 812 overlay 375 px, okraje 0. Náhled overlay-desktop.jpg. Změna pouze lokálně.
