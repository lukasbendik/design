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

## Zjednodušení přehledu autorizací — 5. 10. 2026

final result: passed

### Návrh

Požadavky uživatele: odstranit samostatné Změnit, samostatný řádek Vybrat vše, globální výběr podle typu a globální zprávu o dvou chybách; první pohled ukazuje sbalené dávky a účty s počty; všechny rozbalovací kroky probíhají na přehledu.

Zvolen textový přepínač Vybrat vše / Zrušit výběr u subjektu. Klepnutí na název subjektu se šipkou mění subjekt. Checkboxy slouží pouze výběru skupin/položek; oddělená velká tlačítka se šipkou rozbalují. Účet má viditelný počet a souhrn typů s počty i před rozbalením. Účet s více typy rozbalí typy, poté položky; účet s jediným typem a dávkové platby rozbalí rovnou položky. Stav výběru je viditelný i na sbalené skupině. Chybné položky mají lokální důvod a disabled checkbox.

Zdroje ověřené 5. 10. 2026:
- https://design-system.service.gov.uk/components/accordion/ — accordion pro přehled souvisejících sekcí, upozornění na vnořování a nutnost uživatelského ověření.
- https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/ — částečný výběr skupiny.
- https://www.nngroup.com/articles/accordions-on-desktop/ — vnoření může zhoršit orientaci.

Toto je pracovní kompromis pro požadavek jediné stránky, nikoli výzkumem potvrzená vhodnost vnoření na mobilu.

### Ověření

In-app browser, mobil 375 × 812 a 320 × 740:
- Výchozí firma: pouze sbalené dávky (2 dávky / 6 podkladových plateb), Business (15 položek, souhrn čtyř typů), Business 2 (2 platby).
- Vybrat vše označí 17 způsobilých z 19 čekajících položek, žádnou skupinu nerozbalí. Tlačítko se přepne na Zrušit výběr, které vymaže výběr.
- Účet → typ → položky zůstává na #overview. Checkboxy a rozbalovací tlačítka fungují nezávisle. Pomlčka částečného výběru potvrzena v accessibility tree.
- Dvě problémové platby zůstanou disabled a nevybrané; důvody u položek, globální banner odstraněn.
- Refresh zachoval označenou platbu a obě úrovně rozbalení.
- Detail p1 otevře #detail/p1; návrat zachová výběr a rozbalení.
- Business 2 otevře rovnou dvě platby, výběr účtu = 2 položky / 34 500 Kč; souhrn obsahuje pouze tyto dvě platby.
- Dávky otevřou dvě dávky, výběr = 2 záznamy / 69 000 Kč.
- Změna subjektu funguje klepnutím na jeho kontext.
- Žádný horizontální overflow při 320 ani 375 px, žádné nenačtené obrázky.
- Konzole bez zachycených varování/chyb. JavaScript node --check a git diff --check prošly.

Vizuálně prohlédnuty finální snímky uložené pouze lokálně v /Users/lukasbendik/Projects/UX/.multiautorizace-qa/: overview-collapsed-v2.png a overview-expanded-v2.png. Plný snímek rozbalené stránky zachycuje sticky footer v poloze viewportu; při běžném scrollování lišta zůstává dole. Hierarchie rozlišena kartou účtu, řádky typů, jemným odsazením a podkladem položek. Bez nalezených P0/P1/P2 závad v rozsahu změny.
