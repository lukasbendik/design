# Design QA — Multiautorizace

Datum: 2. 10. 2026
final result: passed

## Rozsah a podklady

Pět přiložených obrazovek bylo vizuálně prohlédnuto jednotlivě. Cílem je rozšíření jejich customer journey o multivýběr, nikoli pixelová kopie původního přehledu. Barvy, radiusy a spacing vycházejí z aktuálních lokálních CORE tokenů a katalogu.

Zdroj přehledu: 750 × 1721 px; při srovnání normalizován na 360 × 826 px. Render v in-app browseru: CSS viewport 375 × 812, browser export 360 × 780 px (export zmenšuje fyzický snímek). Oba snímky byly vloženy vedle sebe do společného srovnání, stejná obrazovka přehledu, žádný výběr, zavřené skupiny, scroll nahoře. Evidence uložená lokálně mimo veřejný repozitář v `.multiautorizace-qa/`: `comparison-empty.jpg`, `overview-empty.jpg`, `overview.jpg`.

## Vizuální závěr

Zachováno: velký titul se Zpět, kontext subjektu, samostatná bílá karta dávek, bílé karty účtů s typy a šipkami, světlé pozadí, červená primární akce. Záměrně přidáno: checkboxy, globální/typový výběr, vysvětlení problémových záznamů a spodní souhrn. Delší obsah je přirozeně scrollovatelný; spodní lišta je sticky. Původní shop ikonu zastupuje existující CORE ikona banky. Nejde o ověření shody s aktuální produkční aplikací.

Žádná zjištěná P0/P1/P2 vizuální závada v kontrolovaných stavech. Desktop zobrazuje dodatečné nástroje; na mobilu jsou skryté. Detail dávky prohlédnut na 320 px. DOM kontrola na 375 px: scrollWidth 375, žádný horizontální overflow, 0 nenačtených obrázků. Na 320 px: žádný horizontální overflow a 0 nenačtených obrázků.

## Funkční ověření v prohlížeči

- Home → Autorizace → subjekt → přehled.
- Celý subjekt: 17 způsobilých z 19; 238 700 Kč a 300 EUR v platebním součtu. Dva chybné řádky zůstanou nevybrané.
- Všechny platby napříč účty: 8 záznamů; 169 700 Kč + 300 EUR.
- Celý druhý účet: 2 záznamy; 34 500 Kč. Refresh zachoval hash i výběr.
- Pomlčka globálního a účtového checkboxu při částečném výběru; vybrané jednotlivé položky po rozbalení.
- Souhrn: odebrání záznamu přepočítá počet i částku; detail ze souhrnu se vrací do souhrnu.
- Při prvním testu zjištěna P1 chyba: odznačení v detailu nesynchronizovalo review snapshot. Opraveno a opakovaně ověřeno; počet k potvrzení poklesl ze 16 na 15.
- Individuální podpis z detailu: 30 000 Kč, PIN simulace, výsledek 1 záznam; čekající počet 19 → 18.
- Hromadný podpis druhého účtu: 34 500 Kč, výsledek 2 záznamy.
- Dávka: rozbalení, detail se třemi platbami, oddělený počet dávky a podkladových plateb.
- Osobní subjekt: pouze jeho dva instrumenty. Návrat k firmě nemíchá výběr.
- Konzole finálního náhledu: žádné zachycené chyby.
- JavaScript syntax ověřena `node --check`.

## Limity ověření a další iterace

Neproběhl test s reálnými uživateli ani skutečný backendový podpis. Atomická dávka a jediný podpis jsou pracovní předpoklady. Bankovní limity jsou pouze demonstrace pro jednorázové CZK platby. Produkce musí samostatně řešit oprávnění, limity, FX, částečné neúspěchy a druhý podpis. Desktop export plné stránky zachycuje sticky footer v poloze viewportu; pro vizuální srovnání byl proto použit viewport screenshot.

## Úprava počtu položek — 5. 10. 2026

final result: passed

Rozsah: pouze zobrazení počtu na obrazovce `#subjects`. Reference uživatele 750 × 1624 px normalizována na CSS viewport 375 × 812 px. Reference a aktuální render otevřeny ve společném srovnání: lokální evidence `/Users/lukasbendik/Projects/UX/.multiautorizace-qa/subjects-comparison.jpg`.

Počet má vlastní řádek pod názvem osoby nebo pod IČO firmy, primární barvu textu, 12/16 px a odstup 4 px. Text „položka / položky / položek k autorizaci“ nahrazuje „záznamy“. Počet zůstává odvozený z čekajících dat (výchozí 2 a 19), reference 5 a 21 neurčuje změnu testovacích dat. Ostatní geometrie, typografie a ikony stávajícího prototypu zachovány dle rozsahu zadání.

Ověřeno v in-app browseru: oba popisky, vypočtená barva rgb(33,33,33), velikost 12 px, line-height 16 px, scrollWidth = viewport = 375 px; kliknutí na osobní subjekt otevřelo přehled se 2 položkami. JavaScript prošel `node --check`, diff prošel `git diff --check`. V rozsahu změny bez P0/P1/P2 závad.
