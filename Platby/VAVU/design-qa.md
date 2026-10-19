# VAVU – profil uživatele, 19. 10. 2026

final result: passed

## Doplnění: detail účtu – Oprávnění / Autorizace / Limity
- Oba řádky v Oprávněních jsou tlačítka otevírající `#pristupy-ucet-czk` a `#pristupy-ucet-eur`. Sdílený template zobrazuje název a číslo podle ACCOUNT_DATA, účet je určen adresou a zůstane správný v historii i po refreshi. Tab se ukládá zvlášť pro každý účet; nový vstup ze seznamu začíná na Oprávnění.
- Zdroj: `codex-clipboard-ba2aeaa5-d7c8-47a1-a896-a52e3a8cc26a.png` (2080 × 1640 px), `codex-clipboard-b6f1c9bb-dff2-4a22-aa28-399dc1d40927.png` a `codex-clipboard-91048cc3-e957-4d86-a146-9fe108247299.png` (2080 × 1554 px).
- Implementace: `/home/lukinab/Projects/UX/.vavu-profile-qa/account-permissions.png`, `account-authorization.png`, `account-limits.png`. Viewport 1040 × 820 CSS px pro Oprávnění, 1040 × 777 pro Autorizaci/Limity; DPR 2, výsledné pixely stejné jako zdroje.
- Společně porovnáno v `compare-account-permissions.jpg`, `compare-account-authorization.jpg`, `compare-account-limits.jpg` v téže QA složce. Vlevo zdroj a vpravo implementace normalizované na CSS rozměr. Celý pohled i čitelné regiony řádků a segmentů byly prohlédnuty. Černé okraje a šum snímků nejsou součástí aplikace.
- Typografie: lokální Inter, dosavadní DS titul, řádky 16/24, role 14/20, tři segmenty 14/20; dlouhý EUR IBAN a mobilní nadpisy se přirozeně zalamují.
- Rozložení/barvy: společný sloupec 520 px, DS tokeny pro plochy, texty, šedý segment, zvolený bílý segment, červené akce a oddělovače. Dole sticky panel Změnit. Samostatné a společné podepisování rozdělené do karet, statutární pravidla v obrysové navigační položce.
- Obrazový podklad: ilustrace Limity převzata jako přesný výřez existujícího obrázku z uživatelského návrhu, `assets/account-limits-empty.png` (168 × 152 px, slot 84 × 76 CSS px), bez překreslování. Ostatní ikony pocházejí z DS.
- Obsah: šest známých osob v původním pořadí. Dva členové představenstva mají v tomto demonstračním detailu „Autorizace plateb“, ostatní „Bez oprávnění“; dva členové jsou shodní v kartě společných podpisů i statutárních pravidlech. Obecný stav přístupu osoby do firmy z předchozího seznamu se nemění. Účet používá aktuální jméno/číslo namísto Business účet A a opakovaného čísla z návrhu. Text prázdného stavu je převzat přesně.
- Funkční kontrola pro oba účty: vstup ze seznamu, všechny tři stavy, správný název/číslo, počty osob a oprávnění, refresh na každém tabu, cyklické šipky/Home/End, browser zpět/vpřed, návrat do seznamu. Odkaz na statutární pravidla vrací do původního účtu i tabu po refreshi; vstup z rozcestníku pak správně resetuje návrat do rozcestníku.
- Mobil 320/390 CSS px: žádné horizontální přetečení, všechny panely i footer čitelné a dosažitelné; na 320 px byl statutární odkaz skutečně otevřen a prověřen návrat, spodní panel jej neblokuje. Bez JS chyb. Syntaxe všech inline skriptů a unikátnost ID ověřeny.
- První společné vizuální porovnání: bez P0/P1/P2. [P3] Drobné rozdíly výšek a odsazení, šířka společného DS sloupce a chybějící jemná mezisegmentová dělicí čára; neovlivňují čitelnost ani navigaci.
- Tlačítka Změnit zůstávají vizuální součástí dodaných stavů, editační obrazovky nejsou v aktuálním zadání. Změna neupravuje skutečná oprávnění ani backend.

## Doplnění: přístupy k účtům a tři návazné obrazovky
- Rozcestník `#pristupy-k-uctum` propojuje přesně tři položky s `#pristupy-opravneni`, `#pristupy-uzivatele` a `#pristupy-podpisova-pravidla`; vstup je z detailu firmy. Vzhled samotného rozcestníku nebyl dodán, používá existující CO Item Navigation a stejný scaffold.
- Zdrojové návrhy: `codex-clipboard-0b140249-6424-4d22-8a14-887a87669aa5.png` (2048 × 1536), `codex-clipboard-cf2e9742-54da-425f-bfe6-c798f7a45ca8.png` (2080 × 1598), `codex-clipboard-73ce49b1-02c5-4528-aa4c-31d7069bf870.png` (2048 × 1536).
- Implementace: `/home/lukinab/Projects/UX/.vavu-profile-qa/permissions.png`, `users.png`, `rules.png`. Viewport 1024 × 768, u Uživatelů 1040 × 799 CSS px; DPR 2. Snímky mají stejné pixelové rozměry jako jejich zdroje.
- Společné vizuální porovnání: `compare-permissions.jpg`, `compare-users.jpg`, `compare-rules.jpg` ve stejné QA složce. Vždy vlevo zdroj, vpravo implementace zmenšená na CSS rozměry. Celé obrazovky i čitelné řádky prohlédnuty společně; samostatný výřez nebyl potřeba. Černé okraje a šum z uživatelského snímku Uživatelé nejsou obsahem aplikace.
- Typografie: Inter z lokálního DS, nadpis 28/36 (mobil 24/32), karta 18/24, jméno a účet 16/24, role/číslo 14/20, stav 12/16. Rozestupy a barvy používají stávající DS tokeny; stálý sloupec 520 px zachován napříč prototypem.
- Obrazové prvky: stejné DS šipky a křížek, iniciály odpovídající uživatelům; bez nových rastrových podkladů. Texty, role, stavy i pořadí odpovídají zdroji při přihlášení Kateřiny H.
- Datová návaznost: názvy a čísla účtů pocházejí z existujícího ACCOUNT_DATA (Účet CZK a Účet EUR), nikoli ze zdrojového opakovaného čísla. Šest uživatelů a dva členové představenstva sdílejí COMPANY_USERS. Aktuální osoba je vždy první a nezobrazuje se podruhé; její skutečná role a demonstrační stav zůstávají zachovány i při změně přihlášení.
- Interakce: všechny tři položky se otevírají, Zpět vrací rozcestník, křížek Oprávnění zavírá do místa vstupu. Nastavit oprávnění otevře dodaný výběr účtů a křížek pak vrací do Uživatelů (kontext přežije refresh).
- První srovnání: [P2] desktopové tlačítko bylo roztažené a nadpisy příliš nízko. Oprava: šířka tlačítka podle obsahu, zarovnání doprava, nadpisy posunuty o 8 px výše; mezery textů uživatele upraveny na řádek 96 px. Druhá společná porovnání potvrzují opravu. Na mobilu má tlačítko plnou šířku.
- Ověřeno Playwrightem se souhlasem uživatele: úplný vstup z firmy, tři cíle, sdílené účty, šest unikátních uživatelů, podpisové skupiny, kontextový návrat z CTA, refresh, historie, šířky 320/390 px bez horizontálního přetečení a dosažitelný spodní panel, změna přihlášení na Naděždu P. včetně „Nemáte oprávnění“. Bez JS chyb.
- Detail účtu je doplněn níže popsaným rozšířením. Detail uživatele a vlastní editace oprávnění čekají na další návrhy. Tato změna přidává zobrazené obrazovky a navigaci, nemění bankovní kontext ani oprávnění.
- Bez zbývajících P0/P1/P2. [P3] Drobná odlišnost oddělovačů a šířky sloupce vychází ze společného DS.

## Doplnění: detail firmy
- Zdroj: `codex-clipboard-13bb7760-ace2-418a-ac55-1a87afc354cf.png` (2049 × 1536 px).
- Implementace: `#profil-firma`, `/home/lukinab/Projects/UX/.vavu-profile-qa/company.png` (2048 × 1536 px, viewport 1024 × 768 CSS px, DPR 2).
- Společné porovnání: `compare-company.jpg` ve stejné QA složce, oba pohledy normalizovány na 1024 × 768 px. Snímek i jednotlivé čitelné řádky byly vizuálně zkontrolovány.
- Typografie, barvy, stíny a mezery navazují na stejný DS jako osobní profil. Sdílená šířka sloupce zůstává 520 px; zdroj má přibližně 489 px. Jde o záměrné zachování společného DS sloupce napříč prototypem.
- Ikona firmy je stejná knihovní SVG jako na předchozí obrazovce. Ponechán tarif a pořadí pěti položek ze vzoru. Název a IČO vycházejí z jedné konstanty `COMPANY_PROFILE`, sdílené seznamem a detailem.
- Ověřeno: kliknutí na název firmy, shoda názvu a IČO, pět položek menu, refresh na detailu, návrat do Dalších profilů, historie prohlížeče, 320/390 px bez horizontálního přetečení a s čitelným zalamováním dlouhých textů. Bez JS chyb.
- Bez nových nálezů P0/P1/P2. [P3] Mírné rozdíly ikon a vertikálních mezer odpovídají stávajícím DS komponentám.

## Podklady a srovnání
- Zdroj: dva uživatelské návrhy `codex-clipboard-6a84941a-06ba-4f3d-bdb8-97a7480de57c.png` a `codex-clipboard-2fe98ab8-45b1-43ca-b954-689f65eaf90b.png` (2048 × 1758 px).
- Implementace: `index.html#profil`, screenshoty `/home/lukinab/Projects/UX/.vavu-profile-qa/details.png` a `profiles.png` (2048 × 1758 px; viewport 1024 × 879 CSS px, DPR 2).
- Společné porovnání: `compare-details.jpg`, `compare-profiles.jpg` ve stejné QA složce. Obě strany zmenšeny na 1024 × 879 px, vlevo zdroj, vpravo implementace.
- Celý pohled byl porovnán společně pro oba segmenty. Texty a ikony byly zkontrolovány také v původních snímcích. Samostatný výřez nebyl potřebný, řádky jsou čitelné.

## Ověřené povrchy
- Typografie: lokální Inter, DS titul 28/36 a řádky 16/24, segment 14/20; na úzkém displeji titul 24/32.
- Rozložení: DS sloupec 520 px, centrovaná identita, segmenty, oddělený tarif, šest řádků menu a odhlášení. Responzivní obsah má 16 px boční odsazení.
- Barvy: DS tokeny pro pozadí, plochy, texty, červené ikony, stíny a oddělovače; šipky mají primární barvu textu.
- Obrazové prvky: původní iniciály vybraného uživatele zachovávají identitu celého prototypu. Fotografie muže ze vzoru se nepřenáší k jinému přihlášenému uživateli. Ikony z lokálního DS, doplněné oficiálními Tabler SVG (MIT; licence v assets/tabler-LICENSE.txt).
- Obsah: jméno a iniciály ze stejného localStorage jako horní lišta. Název OSVČ odpovídá jménu. Další profily obsahují přesně dvě položky, druhá „Vodárny, a.s.“. IČO jsou demonstrační data. Tarif je demonstračně Standard.

## Iterace
1. První porovnání: [P2] červené šipky, nepřesná sémantika části ikon a kratší spodní mezera menu. Oprava: primární barva šipek, odpovídající knihovní ikony a větší mezera.
2. Nové porovnání: [P2] globální DS pravidlo vyplňovalo obrysové SVG. Oprava: lokální fill:none pro doplněné obrysové ikony. Poslední společná porovnání potvrzují opravu.
3. Opětovné otevření profilu nastavuje výchozí segment synchronně; refresh obnoví uložený segment.

## Funkční kontrola
Playwright se souhlasem uživatele, samostatný Chrome:
- Kliknutí na iniciály i jméno otevře profil.
- Výchozí segment Moje údaje, přepnutí na Další profily; přesně dva profily.
- Shodná identita v horní liště, profilu a OSVČ; ověřeni dva různí uživatelé.
- Refresh, zavření, historie zpět/vpřed, klávesové přepínání segmentů a odhlášení.
- Nová profilová obrazovka na 320 a 390 CSS px: bez horizontálního přetečení, obsah lze posouvat až k odhlášení.
- Bez JavaScriptových chyb. Syntaxe všech inline skriptů v pořádku, bez duplicitních ID.

## Rozsah a zbývající omezení
- Detail firmy je doplněn. Detaily jednotlivých položek menu, detail OSVČ ani přepínání bankovního kontextu nejsou součástí tohoto zadání; řádky jsou podkladem pro doplňování dalších obrazovek.
- Zbytek původního desktopového prototypu nebyl přepracován na mobilní aplikaci. Úzká kontrola se vztahuje na novou obrazovku profilu.
- [P3] Doplňkové knihovní ikony nejsou totožnými exporty ikon z uživatelského návrhu; zachovávají význam, obrys a rozměr. Drobné rozdíly oddělovačů vycházejí z aktuálních DS tokenů.

## Checklist
- [x] Oba segmenty porovnány s návrhy.
- [x] Opraveny nálezy P2 a znovu zachycena implementace.
- [x] Ověřeny interakce, identita, historie, obnova a úzké zobrazení.
