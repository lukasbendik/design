# Samostatné podepisování – Podepisující, 22. 10. 2026

final result: passed

Rozsah: Změnit u Samostatného podepisování v #nastaveni-autorizace-czk/eur otevírá novou obrazovku #nastaveni-samostatni-podepisujici-czk/eur. Nadpis Podepisující, skutečný účet, všech šest existujících osob v pořadí reference, checkboxy, role, přesný text „Vybraní uživatelé budou podepisovat samostatně.“, křížek a spodní Uložit. Výběr je oddělený od společných podpisů, uložený po účtech; draft přežije refresh, zavření jej zahodí. Uložit se vrací do původního běžného nebo kontrolního kontextu. Uložený výběr se promítá do nastavení, přehledu účtu a souhrnu změn. Jde o rozšíření editoru nastavení; provádění plateb ani implementace uživatelských limitů nejsou součástí této úpravy.

Zdroj vizuální pravdy: /home/lukinab/.codex/attachments/53edae54-f8ad-4ff8-a54e-fb145e1d7ed1/codex-clipboard-8f4c1224-4b16-4ac5-9a47-76ba44909f50.png (2080 × 1554 px). Pro porovnání normalizováno /2 na1040 ×777; toto je normalizace zdrojového obrázku, nikoli tvrzení o jeho známém fyzickém DPR. Implementace: /home/lukinab/Projects/UX/.vavu-solo-qa/solo-1040.png (1040 ×777 CSS i px, DPR1), solo-desktop.png (1280 ×1000) a solo-{320,390}.png (320/390 ×844). Stav: šest nezaškrtnutých osob, CZK účet. comparison-full.png a comparison-card.png obsahují společné porovnání zdroje a implementace; oba otevřeny a vizuálně posouzeny.

Pět povrchů: stávající Inter a DS váhy/velikosti; stejný rytmus šesti řádků, spacing16, zaoblení8, panel a spodní lišta (šířka z existujícího narrow sloupce); stávající DS barvy, červené checkboxy a CTA; existující knihovní ikona zavření a asset zaškrtnutí, bez nových obrazových náhražek; přesné názvy osob a role, pouze název/číslo účtu nahrazeny skutečným kontextem prototypu. Bez P0/P1/P2 v rozsahu požadavku. Drobné rozdíly šířky panelu a okolního rámu oproti zdroji zachovávají stávající DS scaffold. Žádné vizuální opravy po finálním porovnání nebyly potřeba.

Playwright/Brave: skutečný vstup přes Změnit, šest checkboxů, zaškrtnutí více osob, refresh rozepsaného výběru, Uložit a vykreslení osob, zavření bez uložení, browser zpět/vpřed, prázdný výběr, různé volby CZK/EUR bez přenosu, kontext kontroly s návratem, společný editor zachová samostatný výběr, souhrn rozpozná samotnou změnu samostatných podpisů. Poslední checkbox i Uložit dostupné na320px;320/390 bez horizontálního přetečení. Bez JS chyb. Syntaxe inline skriptů ověřena node --check. Doplňková regresní kontrola ověřila zachování historického částečného podpisu při chybějícím starém poli solo a zneplatnění podpisů při skutečné změně solo.

---

# Účet / Autorizace – jediné Změnit, 22. 10. 2026

final result: passed

Odstraněna dvě sekční tlačítka Změnit z přehledu autorizace účtu (#pristupy-ucet-czk/eur). Ponecháno jediné primární tlačítko v dolní liště, které spouští startPermissionFlow(). Editační průvodce zachován. Zdroj: dodaný screenshot codex-clipboard-7a8d1d9e-c3c4-4c82-99b6-b21f251367c2.png. Důkaz: /home/lukinab/Projects/UX/.vavu-subject-qa/account-authorization-single-change.png. Playwright/Brave ověřil právě jedno viditelné Změnit na obou účtech, jeho skutečný vstup na Jak to proběhne, zachování aktivní záložky po refreshi a absenci chyb konzole. Vizuálně beze změny typografie, ikon, spacingu a dat sekcí; odstraněny jen požadované dvě akce.

---

# Název subjektu nad tarifem – 22. 10. 2026

final result: passed

Rozsah: navigační řádek Vodárny, a.s. nad Tarif Komfort Business na Přehledu. Otevírá existující #profil-firma; návrat se řídí vstupem (Přehled nebo Další profily), včetně refresh. Zachován stávající desktopový rámec a ostatní obsah VAVU. Mobilní reference slouží pro anatomii řádku, nikoli jako zadání přestavět celý Přehled.

Zdroj: /home/lukinab/.codex/attachments/07fa9046-2085-42ae-b99d-1f011a270fa9/codex-clipboard-c301fd7b-ce6d-40cc-af2e-4b62c786f820.png (676 × 2372 px). Druhá reference v zadání odpovídá existujícímu firemnímu profilu. Implementace: /home/lukinab/Projects/UX/.vavu-subject-qa/overview-1280.png (1280 × 900 px, CSS viewport 1280 × 900, DPR1); company-390.png (390 × 844 px). comparison-full.png porovnává celý mobilní vzor a stávající desktopový rámec se záměrně odlišnou šířkou; comparison-row.png porovnává výřezy subjekt/tarif. Výřezy nejsou vydávány za pixelovou shodu: zdroj má jinou hustotu a obsah; implementace dodržuje DS a data existujícího prototypu.

Pět povrchů: Inter a stávající CO Item Navigation typografie; řádek 64 px, odsazení16, mezera16 před tarifem, bez nového kartového pozadí; stávající DS barvy a radius8; skutečná existující Tabler ikona firmy sdílená s profilem a knihovní šipka (bez nových rastrových náhražek); název Vodárny, a.s. konzistentní se stávající firmou a cílovou obrazovkou, nevkládá se referenční Satuzi ani Jan Novák.

Iterace P2: první render měl vyplněnou ikonu kvůli scoped CSS profilu a zbytečně zdvojenou mezeru za řádkem. Opraven fill:none pro existující outline ikonu a odstraněn margin navíc; finální capture a společné porovnání comparison-row.png ověřeny po opravě. V rozsahu nové komponenty bez zbývajících P0/P1/P2.

Playwright v Brave: přihlášení, proklik celého řádku, Enter, správné jméno a IČO v cíli, refresh subjektu, Zpět na Přehled, browser zpět/vpřed, původní vstup přes profil a návrat na Další profily. Bez JS chyb. Cíl profilu se vejde na 320 i 390 px bez horizontálního přetečení. Známé omezení mimo rozsah: samotný starý Přehled na 390 px zachovává desktopový sidebar a ořezává obsah. Mobilní použitelnost celého Přehledu proto neprošla; úprava ji neřeší a uživatel byl informován.

---

# Spořicí účet Business – detail podle reference, 22. 10. 2026

final result: passed

Rozsah: nový detail `#sporeni-detail`, plná historie `#sporeni-platby`, vstupy z Přehledu a sekce Spoření. Zachován společný desktopový rámec prototypu, topbar, navigace a Golem DS. Hlavička účtu se zůstatkem, sazbou a firmou, karta správy, filtr, denní skupiny plateb, dva červené ovladače a čtyři řádky pravého panelu navazují na dodanou referenci. Mobilní varianta skládá panely do jednoho sloupce.

Zdroj: dodaný screenshot `codex-clipboard-7bbd8ae1-dcdc-406b-9fa8-dd4272046fdf.png` (2400 × 1936 px včetně vnějšího rámu zařízení). Zdroj a aktuální implementace byly společně otevřeny a vizuálně porovnány. Aplikační obsah je přizpůsoben již existujícímu rámci VAVU 1440 px; vnější rám zařízení se nereprodukuje. Finální důkazy: `/home/lukinab/Projects/UX/.vavu-savings-qa/detail-{320,390,768,1024,1440}.png`.

Iterace [P2]: první porovnání zachytilo červené koncové šipky a nadbytečnou mezeru za kartou správy. Opraveny barvy šipek a specificita resetu marginu karty. Po opravě pořízeny nové snímky a znovu společně porovnány s referencí; bez zbývajících P0/P1/P2. Drobné rozdíly hustoty vůči screenshotu vycházejí ze stávajícího rámce a tokenů aplikace. Obsah se podle zadání liší: Vodárny, a.s., existující číslo účtu 326683764/0100, ukázkový zůstatek 1 850 000 Kč. Sazba 3 % p. a. a pásmo 200 tisíc–30 milionů Kč odpovídají aktuální stránce KB ověřené v této konverzaci; nejsou převzaty ze staršího screenshotu (2,75 %).

Funkční kontrola Playwright/Chrome: vstup z obou přehledů, shodný zůstatek ve všech třech místech, aktivní navigace Spoření, čtyři poslední a šest všech ukázkových transakcí. Otevření transakce, správný spořicí účet a Detail autorizace, návrat. Filtrování směru, persistentní stav po refreshi a reset; informační dialogy a CSV se skutečnými novými řádky. Vklad předvyplní příjemce a CZK zdroj; Nová platba projde skutečným formulářem a prvním podpisem se zdrojem Spořicí účet Business. Návrat z platebního flow je zpět na spoření. Šířky 320/390/768/1024/1440 bez přetečení a koncových oddělovačů. Bez JS chyb. Regrese autorizace Evou u dávky, platby, TP a inkasa, změn práv a oddělení CZK/EUR účtů prošla.

Návaznost autorizací: částečně podepsaná nová platba ze spoření se v přehledu autorizací zobrazuje pod Spořicím účtem Business se správným počtem položek. Kategorie se počítají ze zdrojových dat pro konkrétní účet, bez přepínání skrytých tabů. Ověřeno po skutečném prvním podpisu.

---

# Detail autorizace v platbě, TP a inkasu – 21. 10. 2026

final result: passed

Rozsah: doplnění samostatné navigační karty Detail autorizace pod údaji a před akcemi, podle přiložené reference. Existující ostatní části detailu (nadpis, iniciálový avatar, údaje a akce) zachovány; nejde o přestavbu celé obrazovky. TP a inkasa otevírají stejný datový detail ze svých aktivních seznamů, bez autorizačních akcí u již dokončené položky. U čekajících TP a inkas je nyní také stejný vstup do auditu místo vložených podpisů v tabulce.

Zdroj: /home/lukinab/.codex/attachments/27d2be84-c3c6-4fff-ac89-85b608c58584/codex-clipboard-88310347-591d-4186-92c2-68da51da4d1c.png (750 × 2282 px, 375 × 1141 CSS px). Implementace: .vavu-profile-qa/completed-payment-reference.png (750 × 3000 px, 375 × 1500 CSS px, DPR2; rozšířený viewport pro zachycení celého obsahu). Společné porovnání completed-payment-comparison.png obě strany normalizuje na 375px šířku, různou výšku doplňuje okolním pozadím. Zaměřený výřez completed-audit-row-comparison.png porovnává vlastní navigační kartu ve stejném měřítku. Porovnání i reálné screenshoty completed-{platby,tp,inkasa}-{375,320,390}.png a příslušné -audit- snímky byly vizuálně zkontrolovány.

Pět povrchů: stávající Inter a DS typografie řádku 16px; stejný padding16 a mezera16 pod údaji; DS bílý povrch, radius a stín; původní sdílená knihovní šipka a ikony osob v dialogu bez nových obrazových náhražek; přesný popisek Detail autorizace a stávající sekce Vytvořeno / Autorizovali. Ostatní části platby se podle zadání nepřekreslují, proto zůstává stávající nadpis, avatar a hustota tabulky odlišná od reference.

Data: dokončené položky používají uložený neměnný záznam autora a podpisů z autorizačního ledgeru, čekající položky jejich skutečné rozpracované podpisy. Nově zadané TP a inkaso ukládají autora a čas při vytvoření. U historických položek bez metadat se nevymýšlí osoby ani časy: Autor není uložený / Datum není uložené a Údaje o autorizaci nejsou uložené. Formát času Europe/Prague. Dříve uložené inkaso bez metadat nemění fingerprint a neztrácí rozpracované podpisy.

Playwright/Chrome: skutečná tvorba TP a inkasa přes formuláře a první podpis, druhý podpis jiným uživatelem; platba podepsaná dvěma osobami přes původní potvrzovací modál. Audit před dokončením i po něm přes aktivní seznam/historii, shoda jmen a časů, autor nových TP/inkasa, historický fallback. Refresh detailu i otevřeného auditu, browser zpět/vpřed, Escape a návrat fokusu. Klávesové otevření aktivní položky. Desktop1280 a mobil375/320/390 bez přetečení; bez JS chyb. Detail platby se nově obnovuje ze svého uloženého kontextu, stabilní ID a návratová cesta. Záložka TP/inkasa se obnovuje společně s obsahem.

Iterace: [P2] odstraněna zdvojená mezera nad novou kartou a opraveno pořadí akcí pod údaji u mobilních TP/inkas. Po opravě nové snímky a kompletní test opět prošly. Bez zbývajících P0/P1/P2 v rozsahu doplněné sekce. P3: stávající renderování písma a ikon vůči referenci.

# Dokončení autorizací, business přehledu a restartu – 21. 10. 2026

final result: passed (lokální Playwright/Chrome)

- Oprávnění: podepisující se odvozují od schváleného práva Autorizace plateb, včetně dříve uložených konfigurací se skupinou omezenou na jednatele. Výslovně potvrzeno uživatelem. Počet požadovaných různých podpisů zachován; rozpracované změny práv se neuplatní před schválením. Členství skupiny odpovídá právům a nelze je ručně rozpojit.
- Plně autorizované platby se zobrazují v historii příslušného účtu, TP a inkasa v aktivních seznamech. Částečně autorizované položky čekají na zbývající podpisy. Deduplikace dle ID autorizace, zachování po refreshi, skutečné údaje nových plateb v detailu.
- Souhrn účtu CZK počítá aktuální měsíc v Europe/Prague, příjmy, výdaje, rozdíl a poměry ukazatelů z historie včetně dokončených plateb. Cizoměnová platba používá uloženou částku odpisu; bez známého převodu se do CZK součtu nevymýšlí kurz. Zůstatky účtů zůstávají demonstračními daty. Tarif Komfort Business a Příjmy bez motivu kapesného.
- TP: částečný výsledek Autorizovali jste trvalý příkaz / Trvalý příkaz ještě musí autorizovat ostatní.; úplný Vytvořili jste trvalý příkaz bez podtextu. Inkaso analogicky Autorizovali jste povolení inkasa / Povolení inkasa ještě musí autorizovat ostatní.; úplný Povolili jste inkaso.
- Restartovat prototyp otevírá sjednocený zaoblený dialog s křížkem, oddělenou patičkou, obrysovým Zrušit a červeným Smazat. Potvrzený reset zachovává data ostatních prototypů i přístupový token.

Playwright: skutečná změna práv a dvě schválení jednateli; podpisy nejednatelů u platby, TP a inkasa; blokování neschválených práv, duplicitních podpisů a zachování pravidla tří různých podpisů. Skutečný průchod dvěma uživateli přes potvrzovací modál až do historie/aktivních seznamů, izolace CZK/EUR, přesná kontrola měsíčních součtů, refresh bez duplikátů. Oba renderery výsledků TP/inkasa ve všech stavech. Zrušit, Escape a potvrzený reset. Desktop 1440 a mobilní šířky 320/390 bez přetečení a JS chyb. Screenshoty business-overview.png ve složce .vavu-profile-qa a /tmp/vavu-reset-modal-{1440,390,320}.png vizuálně zkontrolovány. Bez nových P0/P1/P2; ikonografie a typografie navazují na existující DS.

# Detail platby k autorizaci a sdílený Detail autorizace – 21. 10. 2026

final result: passed

Zdroj: /home/lukinab/.codex/attachments/4426d635-3b68-410d-938c-028543b72f45/codex-clipboard-bad2e2f2-6d99-4cc5-9080-a182c1a424f7.png (750 × 2263 px → 375 × 1131,5 CSS px). Implementace /home/lukinab/Projects/UX/.vavu-profile-qa/payment-detail-reference.png (750 × 2400 px, viewport 375 × 1200 CSS px, DPR 2). Testovací platba odpovídá copy předlohy; účet plátce zůstává existující skutečný účet prototypu, ilustrativní účet z obrázku nebyl přepsán do produkčních dat. Společné plné porovnání payment-detail-comparison.png normalizuje oba snímky na šířku 375 CSS px, zdroj doplněn okolním canvasem na 1200 px. Texty i detail sekce jsou v porovnání čitelné, další výřez není nutný.

Oprava [P1]: stav a podpisy byly součástí údajů platby a chyběl Detail autorizace. Nyní pořadí hlavní karta → samostatný stavový pruh → šest údajů o platbě → vstup Detail autorizace → akce. Mobilní akce podle předlohy na plnou šířku bez obalu se zaoblením. Prázdný podpisový stav Čeká se na autorizaci., po prvním podpisu Částečně autorizováno. Datum v hlavní kartě doplněno o den v týdnu, údaje ze skutečné položky zachovány.

Reálně znovu použit tentýž DOM dialog #batch-audit-dialog, stejné nadpisy Vytvořeno / Autorizovali / případně Zrušeno, stejný renderer řádků a styly jako dávky. Sdílený renderAuthorizationAudit přijímá data platby či dávky a návratovou cestu. Události podpisu se čtou ze skutečného instrumentSignatures. Nové platby ukládají autora a čas vytvoření při vytvoření položky; historické položky bez metadat mají existující pravdivý fallback Autor není uložený / Datum není uložené. Žádná historická událost se nevymýšlí.

Iterace [P2]: první společné porovnání odhalilo rozdílné mezery a akční kartu; layout upraven podle předlohy. Playwright následně zachytil překrývání gridových řádků na 320px při nižším viewportu: grid-auto-rows:max-content, přirozená výška detailu a vypnutí shrinku zajistily čitelné karty bez překryvu. Nový detail resetuje hlavní scroll, otevření/zavření auditu uchovává místo a vrací fokus. Po opravě nový screenshot, společné porovnání a celý interakční test prošly. Bez zbývajících P0/P1/P2. P3: drobné rozdíly rasterizace a stávajících DS ikon vůči screenshotu.

Pět povrchů: stávající Inter a DS hierarchie; šířka 343px ve 375px viewportu, gap16 a struktura podle reference; povrchy, děliče a stavový pruh z DS tokenů; skutečné existující ikony a sdílený dialog; přesné popisky a dynamické údaje. Podpisová a autorizační logika zachována. TP/inkasa mají stávající datový detail, nový vizuál a auditní vstup jsou omezeny na platby.

Playwright/Chrome: seznam → detail → audit před podpisem i po skutečném prvním podpisu přes nový potvrzovací modál; autor, datum a jedna reálná událost podpisu. Refresh auditu, browser zpět/vpřed, Escape/křížek, návrat fokusu, persistentní označení i smazání položky. 320/390/1024 bez overflow, bez překryvu klikacího vstupu a bez JS chyb. Screenshoty payment-audit-empty.png a payment-audit-signed.png. Regrese sdíleného dialogu u nepodepsané, podepsané dvěma osobami a zrušené dávky, včetně refresh/Escape/fokusu, prošla. Samostatná reálná tvorba CHF platby z EUR účtu potvrdila uložené created.name/at a zachování účtu i měny.

---

# Stav částečné autorizace – 21. 10. 2026

final result: passed

Zadání: v Autorizaci používat přesný stav Částečně autorizováno místo Čeká na další podpis s počtem. Změněn společný instrumentSigningStatus pro řádky seznamu a detail platby/TP/inkasa. Nepodepsaný stav K autorizaci, plná autorizace i kontrola oprávnění zůstávají stejné; podpisová logika nezměněna.

Playwright/Chrome: skutečný první podpis platby, TP a inkasa přes nový sdílený modál → výsledek → Zavřít → seznam. U všech tří typů přesně Částečně autorizováno, bez starého textu a počtu 1/2. Stejný stav po refreshi a v detailu. Mobil 320 bez overflow, bez JS chyb. Screenshot /home/lukinab/Projects/UX/.vavu-profile-qa/partial-status.png, viewport 1024 × 900 CSS px, DPR 2.

---

# Modál potvrzení v KB Klíči / KB+ – 21. 10. 2026

final result: passed

Vizuální zdroj: /home/lukinab/.codex/attachments/b67088db-506d-4bc1-b196-b6bc5b071022/codex-clipboard-beda81bf-f7eb-4d90-a8c7-1af84270896e.png (1596 × 914 px). Předloha obsahuje čekání na potvrzení v mobilní aplikaci, nikoli výběr podpisové metody. Starý sdílený modál nahrazen na stejném routingu a nad původním souhrnem.

Implementace: /home/lukinab/Projects/UX/.vavu-profile-qa/confirmation-desktop.png, viewport 1024 × 768 CSS px, DPR 2. Element confirmation-modal.png má 1512 × 808 px, tedy 756 × 404 CSS px. Společné porovnání confirmation-comparison.png: zdrojový modál x46/y49/w1514/h810 normalizován na 756 × 405, implementace na 756 × 404. Toto fokusované porovnání zobrazuje celý modál a jeho všechny prvky; samostatný screenshot celé stránky kontroluje i dimming a umístění. Vizuálně zkontrolovány také confirmation-{320,390}.png (výška 800 CSS px, DPR 2).

Původní [P1]: nesprávný výběrový modál místo čekání na mobilní potvrzení. Oprava: levý panel s přesnou ilustrací klíče z přílohy, titulek, doslovná instrukce KB Klíč/KB+, dělič, podtržený odkaz s přesnou ikonou offline z přílohy, křížek, footer Zamítnout. Kontextové titulky pro trvalý příkaz, inkaso, dávky a oprávnění používají stejnou komponentu. První porovnání [P2] ukázalo obsah cca 10px níže; horní padding a line-height upraveny a zachycen nový screenshot/porovnání. Bez zbývajících P0/P1/P2.

Pět povrchů: typografie Inter a DS hierarchie; layout panelů a rozměry podle předlohy, tokeny pro spacing/radius; DS barvy a obrys sekundárního tlačítka; oba bitmapové assety přímo ze zdroje bez překreslení; přesné české texty a kontextové nadpisy. P3: drobné odlišnosti rasterizace a vertikálního umístění textu vůči původnímu řezu; tlačítko má společnou DS výšku 48px v souladu s předchozím výslovným požadavkem na jednotná secondary tlačítka.

Chování prototypu: potvrzení z mobilní aplikace se simuluje po 6 sekundách, žádný externí požadavek se neposílá. Uživatel byl během práce požádán o preferenci simulace; při absenci odpovědi byl použit oznámený předpoklad krátké automatické prodlevy. Zamítnout, křížek, Escape a opuštění modálu ruší timer a nic nepodepisují. Timer je vázán na jedinečné ID čekajícího požadavku a stav/user guard; nemůže potvrdit později otevřenou jinou operaci. Refresh obnoví čekání, dokončená operace se neopakuje. Fokus zůstává v dialogu a při zrušení se vrací na spouštěcí tlačítko. Offline odkaz rozbalí radu k připojení mobilu a pozastaví simulaci; sbalení ji obnoví. Na mobilu se panely skládají do sloupce bez overflow, Zamítnout je dostupné.

Playwright/Chrome: reálná nová platba → detaily → nový modál → výsledek; Zamítnout/křížek/Escape bez mutace, focus trap a návrat fokusu, pomoc, refresh, jediné potvrzení, 320/390 a bez JS chyb. Regrese 7 vstupů: nová platba, nový TP, nové inkaso, nová dávka, existující dávka, oprávnění CZK a EUR. Zamítnutí/Escape/refresh zachovají původní obrazovku a před potvrzením nic nepodepisují. Tři individuální autorizační souhrny (platba/TP/inkaso), výsledek a idempotence; hromadný výběr dvou plateb potvrdí pouze vybrané. Zachována první autorizace jako partial a čekání na druhého podepisujícího. Starší testy předpokládaly okamžitý klik na KB Klíč a jediný podpis: testovací očekávání přizpůsobena nové 6s prodlevě a existujícímu pravidlu dvou podpisů, produktová podpisová logika se neměnila.

---

# Jednotná sekundární tlačítka – 21. 10. 2026

final result: passed

Zadání: Zavřít na Autorizovali jste platbu má být sekundární tlačítko s rámečkem; sjednotit tuto variantu v celém VAVU. Autoritativní zdroj: design-system/design-system/prototype-kit/components.css, CO Button secondary (1px solid interactive-secondary, transparentní výplň, secondary-action hover).

Příčina: lokální .btn { border:none } se načítá po DS a přepisovala .btn--secondary. Starší alias .btn-secondary, pravidlo pro dávky a inline styly rámeček místy obnovovaly různými barvami a tloušťkou. Oprava: společná .btn.btn--secondary podle DS a odstranění duplicitních výjimek/aliasů. Všechny existující sekundární akce sdílejí border 1px solid #212121 a transparentní výplň; hover používá DS. Rozložení a navazující akce zachovány. Horní navigační ovladače zůstávají navigačními ovladači.

Playwright/Chrome: skutečná cesta Nová platba → další krok → podpis KB Klíčem → Autorizovali jste platbu. Vypočtené styly všech 21 sekundárních tlačítek odpovídají společné definici (rámeček, barva, výplň). Ověřen hover po doběhnutí přechodu, focus, viditelnost a návrat Zavřít do přehledu. Mobil 320/390 bez overflow a s dostupným CTA. Bez JS chyb. Regrese předání CHF platby z EUR účtu do podpisu prošla.

Vizuálně zkontrolované screenshoty: /home/lukinab/Projects/UX/.vavu-profile-qa/secondary-payment-result.png (1024 × 900 CSS px, DPR 2) a secondary-payment-result-{320,390}.png ve stejné složce (výška 800 CSS px, DPR 2). Typografie Inter, spacing, DS barvy a ilustrace zachovány; nově viditelný obrys tlačítka. Bez zbývajících P0/P1/P2.

---

# Nová platba – nový prázdný formulář – 21. 10. 2026

final result: passed

Kliknutí na Nová platba nyní volá startNewPayment(): vyprázdní příjemce, částku, zprávu, popis a všechny symboly, obnoví výchozí měnu aktuálního účtu a termín Co nejdříve, odstraní validační chyby a QR soubor. Odstraněna také HTML výchozí částka 500. Maže se jen koncept formuláře; vytvořené položky k autorizaci zůstávají zachované. Zpět z dalšího kroku i refresh zachovají právě rozpracovaný koncept.

Playwright/Chrome: vyplnění obou kroků a pozdějšího termínu → zpět → refresh zachová hodnoty → zavření → Nová platba vyprázdní všechna pole; stejný výsledek při otevření klávesou Enter. Prázdná částka ponechá celý zůstatek účtu. Bez JS chyb. Screenshot: /home/lukinab/Projects/UX/.vavu-profile-qa/payment-new-empty.png (1024 × 900 CSS px, DPR 2). Stávající vzhled a DS zachovány; změna je chování nového konceptu.

---

# Nová platba – výška měny a dynamický zůstatek – 21. 10. 2026

final result: passed

Zdroj: /home/lukinab/.codex/attachments/5986461c-5db7-468e-bae7-a24b056101f5/codex-clipboard-3c97f740-cc4b-4e22-abcb-e28df5949ed7.png, 1462 × 1544 px. Příloha ukazuje původní chybu; požadavek výslovně mění výšku měny a zůstatek. Implementace: /home/lukinab/Projects/UX/.vavu-profile-qa/payment-form-final.png, 2048 × 1800 px, viewport 1024 × 900 CSS px, DPR 2. Stav: CZK účet, příjemce 87564765/0800, 150000 Kč. Fokus sejmut před finálním snímkem.

Celý formulář a mobilní snímky payment-form-{320,390}.png ve stejné složce zkontrolovány. Fokusované společné porovnání payment-form-comparison.png: původní obsah přílohy x103/y572/w1074/h476 normalizován na šířku 488 CSS px, implementace x268/y268/w488/h216 zachycena při DPR 2 a normalizována na 488 px. Srovnává se stejné pole příjemce, částka a měna; rozdíly výšky a zůstatku jsou požadovanou opravou.

Nálezy a opravy: [P2] currency label se roztahoval na výšku celého sousedního pole včetně helperu; scoped align-items:start odstranil roztažení. Obě pole nyní 76 CSS px na desktopu i 320/390 px. [P1] zůstatek byl pevný text 18063,38; nyní stejný ACCOUNT_DATA zdroj jako detail účtu minus zadaná platba. CZK 680063,38 − 150000 = 530063,38; EUR 24850,42 − 100 = 24750,42. Žádné zbývající P0/P1/P2.

Typografie a rozložení: stávající Inter/DS, paddingy, 488px sloupec a navigace zachovány; měna zarovnána s částkou. Barvy/tokeny: existující DS; nedostatek prostředků využívá existující error variantu. Assety: původní DS ikony, bez nových ilustrací. Copy: dynamický český zůstatek, u FX označení orientačně a datum kurzu bez poplatků. Mobilní popisek se přirozeně zalomí, bez overflow.

Měny: oficiální KB seznam pro MojeBanka Business ověřen 21. 10. 2026 na https://www.kb.cz/cs/obcane/ucty/platby-a-hotovostni-sluzby/zahranicni-platby — AUD, CAD, CNY, CZK, DKK, EUR, GBP, HUF, CHF, JPY, NOK, PLN, RON, SEK, TRY, USD. RUB a papírové-only měny nezařazeny. FX snapshot z https://www.kb.cz/cs/kurzovni-listek, validDate 2026-10-21T15:10:00. CZK účet používá deviza prodej; EUR účet při převodu používá deviza nákup zdrojové měny a deviza prodej cílové měny, včetně currencyUnit JPY/HUF. Nejde o live feed ani garantovaný kurz zúčtování; datum je viditelné ve formuláři. Formulář sám zůstatek účtu nemění.

Playwright/Chrome: skutečné přihlášení → přehled → Nová platba, editace částky včetně haléřů a prázdného vstupu, všech 16 měn, JPY jednotky, CZK/EUR účet a číslo účtu, persistence výběru/částky po refreshi, další krok a browser Zpět. Nedostatek prostředků brání pokračování a po opravě částky zmizí. Nová CHF platba z EUR účtu předána přes skutečný podpisový dialog se správným účtem a měnou; nové měny zachovány i v parseru součtů autorizací. Bez JS chyb. První běh testu očekával EUR místo nativního symbolu €; sjednoceno zobrazení na účetní označení EUR, test zopakován a prošel.

---

# Přístupy k účtům – ikony a popisky – 21. 10. 2026

final result: passed

Zdroj: /home/lukinab/.codex/attachments/fa085276-1813-4b89-bcf7-7e3640f90632/codex-clipboard-5bb41dbb-265a-466d-9185-777298b6af31.png (2048 × 1536, normalizováno na 1024 × 768 CSS px). Implementace: /home/lukinab/Projects/UX/.vavu-profile-qa/access-reference.png, viewport 1024 × 768, DPR 2, 2048 × 1536 px; shodná obrazovka pristupy-k-uctum. Plné porovnání: /home/lukinab/Projects/UX/.vavu-profile-qa/access-reference-comparison.png. Detail ikon a textu byl zkontrolován také v plném snímku implementace; samostatný výřez nebyl nutný, obsah je čitelný.

Původní P2: chybějící ikony a popisky. Doplněny přesné texty a tři zdrojové ikony z přílohy jako transparentní PNG @2x. První porovnání ukázalo širší kartu a větší mezery mezi nadpisem a popisem. Oprava: pouze pro tuto obrazovku sloupec 488 px odvozený z DS tokenů, mezera padding-xs a horní zarovnání ikon a šipek. Nový snímek a společné porovnání po opravě bez zbývajících P0/P1/P2.

Typografie: existující Inter a DS fonty, hlavní/sekundární hierarchie a zalamování shodné s předlohou. Rozložení: centrovaná karta, zdrojová šířka, paddingy a děliče DS; mobilní vnější odsazení 16 px zachováno. Barvy: DS povrch, primární text, terciární popisky a červené ikony. Assety: přímo ze zdroje, zachované proporce 24 × 24 CSS px v 32px slotu, transparentní pozadí. Copy: všechny tři titulky a popisy doslovně podle předlohy. P3: drobné rozdíly rasterizace a výchozího DS řezu písma oproti screenshotu; bez dopadu na čitelnost či strukturu.

Playwright/Chrome: reálná cesta přihlášení → profil → Další profily → firma → Přístupy k účtům; všechny tři destinace a browser Zpět, refresh stejné obrazovky. Mobilní viewporty 320 × 800 a 390 × 800 bez overflow, snímky access-reference-320.png a access-reference-390.png ve stejné složce. Bez JavaScriptových chyb. Původní podpisová a datová logika nezměněna.

---

# Oprávnění účtu a společná autorizace instrumentů – 21. 10. 2026

final result: passed

Platby, trvalé příkazy, povolení inkasa i dávky nyní používají společnou kontrolu schválených oprávnění a podpisového schématu konkrétního účtu. Výchozí schéma vyžaduje dva různé vybrané uživatele s úrovní Autorizace plateb. Používá se permissionAppliedSettings; rozepsané nastavení ani změna s jediným podpisem ještě neplatí. Po schválení změny oběma uživateli se použijí nová práva a vybraní podepisující. U schématu s vyšším počtem podpisů se počítá skutečná schválená hodnota; editor nedovolí uložit méně osob, než požadovaný počet podpisů.

Podpisy se ukládají pro konkrétní typ, ID a verzi instrumentu, včetně jména a času. První podpis zachová instrument k autorizaci, zobrazí žádost o podpis dalšího oprávněného uživatele a počítadlo v seznamu. Detail zobrazuje stav i dosavadní podepisující s datem. Tentýž uživatel nepřidá další podpis, uživatel bez práva nebo mimo schéma nezmění podpisy. Teprve dosažení počtu různých oprávněných podpisů odstraní položku z čekajících; dokončené TP a inkasa se zobrazují v aktivním seznamu účtu. Podpis při vytvoření nové platby/TP/inkasa se započítá jako první; nová verze dostává vlastní identitu i při stejných údajích.

Jednotlivé i hromadné souhrny zůstávají přes výběr způsobu podpisu. Hromadná operace zpracuje pouze výběr aktuální záložky, vyhodnotí každou položku samostatně a rozlišuje částečný/úplný/duplicitní/neoprávněný/chybový výsledek. Zrušení dialogu nemění podpisy. Po refreshi se zobrazí stejný výsledek; potvrzení stejné operace se neopakuje. Podpisový požadavek je svázaný s uživatelem a kontroluje schválenou politiku; změněný obsah individuální/hromadné položky ani dávky není skrytě podepsán.

Odhlášení zachová instrumenty i podpisy, zruší podpisový kontext. Přihlášení nabízí všech šest osob z COMPANY_USERS včetně Evy a Lindy; další uživatel může pokračovat přes Přehled → Autorizace. Rozhodují stejná data v obou cestách do detailu dávky. Historické zpracované/zrušené dávky se znovu nepodepisují. Starší uložené podpisy dávek se přebírají ze skutečných záznamů.

Nové formuláře platby/TP/inkasa zůstávají výslovně pro Účet CZK; platební formulář má sjednocené číslo a firmu s účtem v modelu. Instrument s EUR zdrojem používá EUR práva. Import simulované dávky z detailu účtu ukládá jeho identitu, detail/souhrn i ukázkové řádky zobrazují tento zdroj; EUR import proto nikdy nepoužije CZK podpisové schéma. Současný import nadále simuluje soubor a platby, nejde o novou implementaci parsování XML/KPC. Původní demo dávky jsou přiřazené k CZK.

Chrome/Playwright lokálně: všechny tři typy individuálně první podpis → refresh → opakovaný podpis → neoprávněný uživatel → odhlášení a druhý oprávněný podpis; skutečná tvorba všech tří typů zachovala údaje a první podpis, druhý podpis dokončil položky a aktivní seznamy. Hromadné TP a inkasa přes dva uživatele, izolace skrytého výběru, jména/období/limity a součty, uložené výsledky. Dávka přes oba vstupy, nově nahraná dávka a duplicitní pokus. Skutečné editory práv a schématu → dva podpisy změny → Eva místo Šárky na CZK; před schválením stará politika, EUR beze změny. EUR import přes skutečný účetní vstup s odlišnou fixture politikou zablokoval CZK podepisující a přijal správného EUR podepisujícího. Změna údajů po otevření souhrnu zablokována. Žádné JS chyby.

Mobil 320/375 px: autorizační seznam, jednotlivý výsledek, šest uživatelů na loginu i hromadný výsledek inkas bez vodorovného přetékání. Screenshoty /home/lukinab/Projects/UX/.vavu-profile-qa/two-signers-{result,login}-{320,375}.png a bulk-result-inkasa-{320,375}.png vizuálně ověřeny. Bez zbývajících P0/P1/P2.

# Mezery v modálu Detail autorizace – 21. 10. 2026

final result: passed

Mezi sousední karty Vytvořeno / Autorizovali / Zrušeno přidán token --space-16. Ověřeno skutečné otevření modálu přes detail dávky na desktopu 1680 a mobilu 375/320: oba rozestupy přesně 16 px, bez overflow dialogu i stránky, bez JS chyb. Vizuálně porovnáno s novou přílohou; evidence batch-audit-spacing-{1680,375,320}.png v /home/lukinab/Projects/UX/.vavu-profile-qa/.

---

# Potvrzení resetu prototypu – 21. 10. 2026

final result: passed

Chcete poradit? otevírá nativní modální dialog Smazat data prototypu? s upozorněním na návrat do výchozího stavu. Zavřít / Escape nic nemažou, červené Smazat spouští existující reset dat VAVU a přechod na login. Zachován vstupní flag rozcestníku i data jiných prototypů. Nativní dialog drží focus; počáteční focus je na Zavřít. Použité stávající DS styly panelu a tlačítek.

Chrome/Playwright lokálně: otevření nemění uložené hodnoty, Zavřít i Escape zachovají data, Smazat má červené pozadí a vymaže pouze původní rozsah klíčů. Ověřen návrat na login a zachování nesouvisejících dat. Mobil 320 px bez overflow; screenshot /home/lukinab/Projects/UX/.vavu-profile-qa/reset-confirm-mobile.png vizuálně zkontrolován. Bez JS chyb.

---

# Výsledek hromadné autorizace inkas – 21. 10. 2026

final result: passed

Nová příloha 80e396b6-56ce-4cfe-89b1-19c666b99b6b/codex-clipboard-1a1d5017-7106-41df-8736-0b8dc6a0bd25.png doplňuje výsledkovou variantu inkas. Řádek zobrazuje název inkasa, období, limit a skutečný stav ze snímku schválených položek. Číslo příjemce a VS zůstávají ve výsledcích ostatních instrumentů. Ilustrace červeného minus odpovídá této referenci i při úspěchu všech inkas; stavové ikony a texty nadále vyjadřují skutečný výsledek.

Vizuálně ověřeno oproti příloze normalizované z 2048 × 2046 na 1024 × 1023 CSS px: stejný sloupec, ilustrace, nadpis, dvouřádkový seznam a spodní akce. Evidence: /home/lukinab/Projects/UX/.vavu-profile-qa/bulk-result-inkasa.png a bulk-result-inkasa-{320,375}.png. Testovací výběr Elektřina / Čtvrtletně / 1 950 Kč a Internet / Měsíčně / 350 Kč ověřuje skutečné různé hodnoty místo přepsání veřejných dat ilustračními údaji. Bez zbývajících P0/P1/P2.

Chrome/Playwright: výběr dvou inkas → souhrn 2 300 Kč → Vyberte způsob podpisu → výsledek; správné názvy/období/limity/stavy, refresh výsledku, odstranění úspěšných položek a Autorizovat další. Mobil 320/375 bez vodorovného overflow. Regrese hromadné autorizace plateb a TP, oddělení aktivní záložky, FX a chybových stavů prošla. Bez JS chyb.

---

# Souhrnná autorizace aktivní záložky – 21. 10. 2026

final result: passed

K autorizaci ze seznamu nyní pro libovolný neprázdný výběr otevírá souhrnný Souhrn bez detailů položek. Rozsah se zachytí výhradně z checkboxů právě vykreslené záložky. Označení na ostatních záložkách zůstane uložené, ale nezahrne se do této operace, součtů, podpisu ani výsledku. Souhrn je uložen pod vlastním ID se snímkem konkrétních vybraných položek a původní cestou; zpět/refresh a další operace jej nesměšují.

Souhrn seskupuje účty a měny, zobrazuje skutečný účet, počty a součty částek. Čeština počtů: 1 platba / 2–4 platby / 5+ plateb, stejné pravidlo pro trvalé příkazy a inkasa; footer má podle reference platby nebo položky. CTA Autorizovat platby / Autorizovat trvalé příkazy / Autorizovat inkasa → existující Vyberte způsob podpisu → Výsledek autorizace. Zrušení nic nemění. Výsledek používá příjemce, VS a částku ze schváleného snímku, po úspěchu odstraní pouze úspěšné položky dané operace. Chyba či odmítnutí zůstávají k dalšímu pokusu; položka mezitím odstraněná má Autorizováno nebo smazáno. Změna údajů mezi souhrnem a podpisem není skrytě autorizována. Autorizační operace je vázaná na uživatele a opakování/reload neopakuje zápis. Zavřít a Autorizovat další vracejí původní seznam.

Výchozí položky nemají vymyšlené chyby. Smíšené výsledky jsou podporovány pro explicitní authorizationOutcome error/rejected a skutečně zmizelé položky; pro QA byly použity izolované fixtures. Veřejná demo data se kvůli obrázku neměnila. Konverzní upozornění se ukáže u cizoměnových plateb. Je-li v datech authorizationAmount, používá se pro částku k autorizaci v seznamu i souhrnu a původní měna se zobrazí pod řádkem. Bez předané konverzní částky se měny sečtou odděleně, žádný kurz se nevymýšlí. FX fixture měla explicitní 100 EUR / 2 527 Kč, ostatní částky byly z vybraných položek; nejde o nový veřejný kurz.

Zdroje pod /home/lukinab/.codex/attachments/: 6a164f73-7826-4e25-9876-0fe3e8a3c3d2/codex-clipboard-f85f1042-4751-49de-89b7-33d94e053476.png (platby); e8de6f17-705b-4a7c-a61b-0f451ce7a03b/codex-clipboard-ee324fce-9822-4e92-a230-720935a33c55.png (FX); a356cf49-b281-43d4-9007-e3fad6f2d4cf/codex-clipboard-07287d1b-09c1-481d-95a5-17b7dc09a7c0.png (TP); 49be3a6a-fbb0-45ee-b3ba-36503afbd60d/codex-clipboard-3e9e16b6-46fb-4094-873f-3a5316e91df0.png (inkasa); 83074e14-72ca-4907-8fde-56dd515aced1/codex-clipboard-81824528-34a9-4ba2-b8e5-5e552b2a1e01.png (výsledky). Poslední příloha je duplicitní výsledek. Varianta výsledku inkas byla následně doplněna podle nové přílohy; viz aktuální záznam výše.

Normalizace: první dvě přílohy 2048 × 1536 → 1024 × 768 CSS px; TP 2080 × 1576 a inkasa 2080 × 1554 oříznuty o rám na x16–2064/y0–1536 → 1024 × 768. Výsledek 2048 × 2046 → 1024 × 1023. Implementační viewporty stejné, DPR 1. Evidence /home/lukinab/Projects/UX/.vavu-profile-qa/: bulk-summary-{platby,tp,inkasa,fx}.png, bulk-result-mixed.png, bulk-mobile-{320,375,768}.png, bulk-result-mobile-{320,375}.png. Soubory compare-bulk-{payment,fx,tp,inkasa,result}.png a jejich -focus.png obsahují plné a detailní porovnání vedle sebe. Počty/údaje se záměrně řídí skutečným výběrem, ne ilustračními částkami z příloh.

Povrchy QA: Inter/DS 28/36 pro tituly, 16/24 hodnoty a počty, 14/20 sekundární měna/VS a 12/16 stav; rozložení sloupce 520 px u souhrnu, 488 px u výsledku, trvalý footer. Barvy, mezery, radiusy a děliče z tokenů. Ilustrace částečného výsledku přímo vyříznuta ze zdroje, úspěch je sdílený DS asset. Ikony ze stávající sady, šipka Tabler (oficiální export arrow-right.svg, stávající Tabler licence). Copy řádků a CTA odpovídá typu/stavu. [P2] horní umístění partial ilustrace/titulku a vodorovné odsazení souhrnu/footeru upraveno podle prvního porovnání; po opravě nové zachycení a porovnání. Na mobilu se dlouhé účty zalomí, částka může být pod nimi, footer se skládá bez overflow. Žádné zbývající P0/P1/P2.

Ověřeno Chrome/Playwright: platba vybraná na jedné záložce → dva TP na jiné → souhrn a podpis pouze TP; platba zůstala vybraná a nezpracovaná. Jedna platba, dva TP, dvě inkasa s odpovídajícími součty a texty, prázdný aktuální výběr nezpracuje skrytý výběr. Zpět, cancel, refresh souhrnu/modálu/výsledku, idempotence, navazující další autorizace. FX fixture a shodný součet v seznamu/souhrnu; success/error/rejected/gone a odstranění pouze success. Mobil 320/375/768 bez overflow, výsledky skrolují se spodními akcemi. Regrese jednotlivých souhrnů, obou vstupů do dávek, sedmi podpisových flow a tří autorizačních seznamů prošla. Bez JS chyb.

---

# Souhrny a výsledky jednotlivých instrumentů – 21. 10. 2026

final result: passed

Detail platby / trvalého příkazu / povolení inkasa → Autorizovat nyní otevírá odpovídající Souhrn. Souhrn používá stejnou položku ze společného datového modelu jako detail, včetně účtu, příjemce, částky/limitu, zprávy, popisu, symbolů a termínů; TP navíc frekvenci a ukončení, inkaso období a platnost. Přílohy souhrnů jsou tři stejné platební vzory; TP a inkaso zachovávají jejich anatomii s relevantními poli svého typu. Nezaměňují se s ilustračními hodnotami reference.

Teprve Odeslat (platba) / Autorizovat (TP a inkaso) otevře existující Vyberte způsob podpisu nad Souhrnem. KB Klíč zpracuje jen otevřenou položku a zobrazí samostatný výsledek: Platbu jste plně autorizovali / Vytvořili jste trvalý příkaz / Povolili jste inkaso. Výsledkový snímek dat, uživatel a čas se uloží před odebráním položky ze seznamu. Ostatní výběry se zachovají. Zrušení/Únik ze způsobu podpisu ponechá nezměněný Souhrn. Zavřít vrací původní autorizační seznam. Refresh souhrnu, modálu i výsledku zachovává kontext. Historie neprovede podpis znovu; dokončený podpisový hash zobrazí uložený výsledek. Neexistující/smazaný detail, souhrn nebo nepodepsaný přímý výsledek vrací funkční seznam, nikoli prázdnou obrazovku.

Vizuální zdroje: attachments 579a1f1c-caa0-4a9d-a6f0-f688e4db5418/codex-clipboard-194fabf1-0ff0-4c48-bbfa-be0e8ea5fca7.png (Souhrn), 54faccad-4c07-41df-ba01-d5246233bca2/codex-clipboard-8f3cdf47-0cf8-4494-a3f4-8fa625ab332a.png (platba), 1716d675-6ce2-4d75-b33d-1c461354ce74/codex-clipboard-20ae78d9-96f5-4b97-a7fc-10d9f7d615f9.png (inkaso), bc7ef021-fedd-46cd-8091-d50c219680c9/codex-clipboard-c19d975b-eb3f-4071-aea1-3d941700ac1a.png (TP), vše pod /home/lukinab/.codex/attachments/. Zbývající dvě přílohy souhrnu jsou duplicitní.

Normalizace: souhrn 2080 × 2066 px, ořez rámu na x16–2064/y0–2048 → 1024 × 1024 CSS px (2:1); výsledky 782 × 1642 px, ořez x16–766/y0–1624 → 375 × 812 CSS px (2:1). Implementace stejné viewporty, DPR 1. Evidence /home/lukinab/Projects/UX/.vavu-profile-qa/: instrument-summary-{platby,tp,inkasa}.png; instrument-result-{platby,tp,inkasa}.png; compare-instrument-summary.png a -focus.png; compare-instrument-result-{platby,tp,inkasa}.png a -focus.png. Plné pohledy i detaily byly porovnány vedle sebe.

Vizuální QA: Inter/DS titulek 28/36 a hodnoty 16/24, popisky 12/16, pozadí/povrchy/děliče/radiusy/stíny ze stávajících tokenů. Šířka sloupce 488 px, správné mezery a spodní trvalé tlačítko. Success ilustrace přímo ze sdíleného DS assetu, bez překreslení; měřítko/ostrost/umístění ověřeny. Texty výsledků a CTA přesně podle typu. [P2] počáteční vertikální posun o 8 px opraven u souhrnu i titulku výsledku, po opravě nové snímky a opakované porovnání. Malé odchylky kresby fontu proti rastru přijaty pro konzistenci DS. Žádné zbývající P0/P1/P2.

Ověřeno Chrome/Playwright: všechny tři úplné průchody, shodná data souhrnu a výsledkového snímku s položkou detailu, žádná mutace před podpisem, návrat do detailu, cancel, refresh všech tří kroků, historie a ochrana před opakovaným zápisem, správný text výsledku a odebrání právě jedné položky. Nové položky vzniklé skutečnými třemi formulářovými flow zobrazují své zadané hodnoty; přetrvává označení jiných položek. Mobilní souhrny 320/375/768 px a výsledky 375 px bez overflow, Escape funguje pro všechny typy. Neplatné URL nemají falešný úspěch. Regrese detailů/checkboxů a všech sedmi stávajících podpisových flow plus tří seznamů prošla. Bez JS chyb.

---

# Detail položek k autorizaci a výběr – 21. 10. 2026

final result: passed

Zdroje: /home/lukinab/.codex/attachments/6f084d39-e215-42b6-96f1-2edadcfce92d/codex-clipboard-51f1d1a7-1f85-4aee-bc5c-b8dcd695eab5.png (platba, 2048 × 2364 px); /home/lukinab/.codex/attachments/6ef0bd5e-b62d-4eea-bbcc-68a337a818ee/codex-clipboard-4b51d528-aa8f-4c25-9b4a-333c2f18748b.png (TP, 2048 × 2461 px). Třetí příloha je stejná varianta TP. Hustota normalizována 2:1 na šířku 1024 CSS px; implementace 1024 × 1230, DPR 1. Rozdílná výška zdroje platby je doplněna pouze pozadím v porovnání. Evidence /home/lukinab/Projects/UX/.vavu-profile-qa/: auth-detail-{platby,tp,inkasa}.png, auth-detail-checked-{platby,tp,inkasa}.png, compare-auth-detail-{platby,tp}.png (plné pohledy), compare-auth-detail-{platby,tp}-focus.png (obsah a akce), auth-detail-mobile-{320,375,768}.png.

Nové detaily všech plateb, TP a povolení inkasa používají společný model dat se seznamem. Záznam otevře detail, samostatný label obsahuje pouze zaškrtávátko. Akce Označit k autorizaci mění check v detailu a výběr v seznamu. Stav je uložen podle uživatele a přežije návrat, přepnutí typu, historii i refresh. Nové platby uchovávají i zprávu, popis a symboly pro následný detail; nové TP a inkasa používají uložené hodnoty formulářů. Staré chybějící údaje jsou označené pomlčkou. Výchozí položky zachovávají názvy/částky/data seznamu a mají doplněné demo detailní údaje; nejde o nové reálné bankovní záznamy.

Autorizovat z detailu otevře stávající výběr způsobu podpisu; až KB Klíč zpracuje právě danou položku, ostatní výběry zachová. Zrušení nic nezpracuje. Smazat v detailu odstraní pouze otevřenou položku a vrátí seznam. Přímá URL a refresh fungují, chybějící/smazaná položka vrací na seznam. Návrat zachovává původní vstup (účet či přehled autorizací) a správný typ; volba segmentu se obnovuje. Součty čtou částku položky, nikoli její název.

Vizuální QA: fonty Inter/DS 28/36 titulek, 16/24 hodnoty a akce, 12/16 popisky; mezery, povrchy, děliče, radiusy a stíny DS; ikony a avatar ze stávající sady a assetů. Kopie akcí odpovídá zdroji, TP má celou sadu polí, inkaso používá stejné rozložení s relevantními údaji (samostatná vizuální reference inkasa nebyla přiložena). Platba má číselného příjemce, částku a datum v kartě; datum je uvnitř karty oproti chybně přetékajícímu datu v referenci. Aktuální účty, jméno uživatele a demo položky zachovány místo ilustračních hodnot z příloh. [P2] počáteční horní odstup a příliš vysoká hero karta opraveny; [P2] výchozí desktopový scaffold na 320 px skrýval obsah, nyní pro seznam/detail responzivní a bez postranní navigace. Mobilní akce nad údaji, aby byly dostupné bez dlouhého scrollu. [P2] aktivní navigace a velikost checku opraveny. Finální snímky byly znovu zachyceny a porovnány. Žádné zbývající P0/P1/P2.

Interakční QA v samostatném Chrome/Playwright: všech sedm výchozích položek, klik na text/řádek otevírá detail bez změny výběru, pouze checkbox mění výběr v seznamu, označení/odznačení a check v detailu, návrat Zpět i historie zpět/vpřed, refresh detailu a seznamu. Všechny tři skutečné formulářové flow ověřeny přes výběr podpisu do nově vytvořené položky, uložené zprávy/symboly/termíny a odpovídající součty. Selekce mezi typy a uživateli, izolovaná autorizace jedné položky (včetně cancel a refresh modálu), smazání jedné položky. 320/375/768 px bez overflow. Regrese sedmi podpisových flow a tří seznamů autorizací prošla. Bez JS chyb.

---

# Primární cesta autorizace dávek a sdílený detail – 21. 10. 2026

final result: passed

Přehled → Autorizace → Přehled autorizací → Dávkové platby otevírá Autorizaci dávek pouze s dávkami čekajícími na podpis aktuálního uživatele. Detail účtu → Dávkové platby → Přehled dávek nadále obsahuje všechny stavy včetně dávek K autorizaci. Oba seznamy otevírají stejný detail se stejnými ID, údaji a historií; podpisy se mezi seznamy nepřevádějí ani nekopírují, jde o společný stav.

Oprava: výsledkové Přehled dávek, Zavřít i horní křížek zachovají původní seznam (Autorizace dávek nebo celkový Přehled dávek). Cílová cesta je součástí persistovaného výsledku a funguje po refreshi. Starší uložené výsledky bez této vlastnosti používají uložený původ dávky. Návrat z detailu používá stejnou funkci. Po prvním podpisu se dávka odebere z autorizační nabídky podepisujícího, u účtu zůstává K autorizaci; jiný uživatel ji stále má k podpisu. Po druhém různém podpisu je Čekající v celkovém přehledu a není v nabídce k podpisu.

Zdroj: /home/lukinab/.codex/attachments/ef3f41b2-9bb3-4caa-aa8c-06e47d8fdd66/codex-clipboard-76d5fe90-5a6d-4eb6-972a-ead10c094f86.png. Originál 3360 × 2048 px, normalizace 2:1 na implementační viewport 1680 × 1024 CSS px, DPR 1. Evidence v /home/lukinab/Projects/UX/.vavu-profile-qa/: batch-entry-hub.png, compare-batch-entry.png (plný pohled), compare-batch-entry-focus.png (titulek, limit, první karta), batch-entry-hub-{320,375}.png. V aktuálním demo stavu je jedna dávka k podpisu a jiné údaje než dvě ilustrační dávky v příloze; data nebyla nahrazena kvůli screenshotu.

Pět povrchů QA: typografie z existujících DS tokenů (28/36 titulek, 16/24 položky a limit), zarovnání a mezery podle stávajícího scaffoldu, barvy/povrchy/radiusy z tokenů, dokumentová ikona ze stávající sady s hodinovým badge, texty a stavy odpovídají společným datům. [P2] podklad dokumentové ikony a zarovnání názvu byly menší oproti referenci; upraven DS avatar na 32 px a mezera 16 px, znovu zachyceno a porovnáno. Váha K dispozici sjednocena s DS. Bez nových ilustrací. Mobilní jméno může používat stávající zkrácení, ID a částka zůstávají viditelné. Žádné zbývající P0/P1/P2.

Interakční QA Chrome/Playwright: skutečné kliky oběma vstupy, autorizační seznam 1 vs celkový seznam 4 dávky, shodné údaje detailu, detail/refresh/zpět do původního seznamu, první podpis a zmizení z nabídky, opakovaný pokus z účtu bez dalšího záznamu, druhý podepisující a dokončení, trvající společný stav po přepnutí cesty. Návrat z výsledku přes Přehled dávek / Zavřít / X, včetně refresh výsledku, 320/375 px bez overflow. Bez JS chyb.

---

# Výsledky autorizace dávky – 21. 10. 2026

final result: passed

Vizuální zdroje: tři přílohy codex-clipboard-2b4f77c8-7799-42a1-b9b1-a631e64c0dc5.png (úplná autorizace), codex-clipboard-8f1847e1-6973-40ad-8629-bfc5b7087045.png (další podpis) a codex-clipboard-ca568a33-9b32-438c-9d32-30c519674614.png (opakovaný podpis), v uživatelských attachments. Originály 2080 × 1554 px, ořez aplikační plochy x16–2064/y0–1536 a normalizace 2:1 na 1024 × 768 CSS px. Implementační viewport 1024 × 768, DPR 1. Evidence v /home/lukinab/Projects/UX/.vavu-profile-qa/: batch-result-{complete,partial,duplicate}.png, plná porovnání compare-batch-result-{complete,partial,duplicate}.png a odpovídající -focus.png (ilustrace, titulek, podtitulek). Mobilní snímky batch-result-mobile-{320,375,768}-{complete,partial,duplicate}.png.

Stavy: první ze dvou různých podpisů zobrazí Autorizovali jste dávku / Musí ji ještě autorizovat ostatní. Druhý zobrazí pouze Autorizovali jste dávku. Opakovaný pokus stejného uživatele zobrazí Dávku už jste autorizovali / Musí ji autorizovat ještě ostatní., varovnou ilustraci a pouze Zavřít. Hotové dávky již nenabízejí autorizaci. Opakovaný pokus je dostupný z rozpracované dávky v běžném Přehledu dávek; seznam k autorizaci nadále ukazuje jen dávky čekající na podpis přihlášeného uživatele.

Oba platné podpisy ukládají jméno a ISO čas do stejné historie dávky. Opakovaný podpis nic nepřidává ani nemění stav. Existující a nově importované dávky používají společnou funkci; podpis se provede až po KB Klíči. Nové importy dostávají samostatná ID, aby se podpisy různých souborů nesdílely. Výsledkový stav přežije refresh. Odstraněna nepodložená pevná hláška o nedostatečném limitu.

Vizuální iterace: [P2] první snímky měly obsah příliš nízko, malé success artwork a velké mezery. Upravená výška, umístění a mezery byly znovu zachyceny a porovnány. Finální barvy a typografie používají stávající DS (titulek 28/36, podtitulek 18/24, na mobilu 24/32); malé rozdíly kresby písma oproti rastru reference jsou přijaty pro konzistenci prototypu. Rozložení: stejný levý okraj obou textů, středová ilustrace, spodní lišta v pořadí Zavřít / Přehled dávek, u duplicity jen Zavřít. Obrázky: success-light z DS, varování přímo vyříznuté ze zdrojové přílohy bez překreslování; velikost a ostrost ověřeny v detailu porovnání. Texty odpovídají zdroji, žádná nadbytečná hláška o limitu. Žádné zbývající P0/P1/P2.

Interakční QA samostatným Chrome/Playwright: obě pořadí Kateřina H. / Šárka B., první podpis, opakovaný podpis bez změny uložených dat, druhý podpis, výsledky, refresh, zpět/vpřed bez dalšího podpisu, historie s oběma jmény a časy, skrytí autorizace hotové dávky, Přehled dávek i Zavřít. Skutečný import a jeho podpis, opakování z nového flow, druhý import s odlišným ID a oddělenými podpisy. Mobilní stavy 320/375/768 px bez overflow a se spodními akcemi dostupnými. Regrese společného modálu prošla pro sedm autorizačních flow a tři seznamy označených položek. Bez JS chyb.

---

# Společný výběr způsobu podpisu – 21. 10. 2026

final result: passed

Stávající modál Vyberte způsob podpisu je nově zapojen před dokončením podpisu změn oprávnění (CZK i EUR), existující dávky ze Souhrnu a označených položek v seznamech autorizací. Platba, nový trvalý příkaz, inkaso a nová dávka používají stejný společný vstup. Vzhled a metody podpisu zůstávají ze stávajícího prototypu.

Kontext uchovává výchozí obrazovku, druh operace a označené položky. Refresh obnoví modál nad správnou obrazovkou; Zrušit, křížek, Escape i backdrop se vracejí bez podpisu. Zápis nastává až po výběru Elektronicky KB Klíčem. Dokončený nebo zrušený požadavek se z historie znovu nepodepisuje.

Ověřeno samostatným Chrome/Playwright: sedm průchodů (platba, TP, inkaso, nová dávka, existující dávka, oprávnění CZK a EUR) a tři seznamy označených autorizací. Refresh a zrušení zachovají účet, původní obrazovku a výběr. U oprávnění a dávky před volbou metody žádný podpis, po volbě právě jeden; správný výsledek každého flow. Bez JS chyb. Mobil 375 × 812 bez vodorovného přetečení, backdrop nic neautorizuje. Vizuálně ověřeno 1040 × 900 i 375 × 812, evidence v /home/lukinab/Projects/UX/.vavu-profile-qa/shared-signature-{batch,mobile}.png. Žádné zbývající P0/P1/P2.

---

# Detail autorizace dávky a Souhrn – 21. 10. 2026

final result: passed

Zdroje: přílohy `/home/lukinab/.codex/attachments/e9a6873b-1dce-4acf-9747-955a16ea6ec7/codex-clipboard-c618a58e-a76f-4e62-b2f9-07180f37a0c8.png` (detail), `/home/lukinab/.codex/attachments/519fcb3e-2b4b-4b24-853c-7a3bbc2c736e/codex-clipboard-da3c297c-137f-43dd-adff-46035f2a6bfb.png` (modál) a `/home/lukinab/.codex/attachments/bb531f1b-65e9-4da8-a4f2-35612766d8b9/codex-clipboard-d485876d-42f3-4678-ab9c-6a69f2a5ce32.png` (Souhrn). Normalizace zdrojů 3360 px na 1680 CSS px (2:1); zdroj modálu/Souhrnu 2048 px výška → 1024 CSS px. Detail je delší snímek se seznamem. Implementační viewport 1680 × 1024, DPR 1; dále funkční snímky 1040 × 1100 a mobilní 375 × 812. Evidence `/home/lukinab/Projects/UX/.vavu-profile-qa/batch-audit-*`, porovnání `compare-batch-audit-detail.png`, `compare-batch-audit-modal.png`, `compare-batch-audit-summary.png`. Výřezy x400–1300 zachycují celý nový obsah.

Detail obsahuje odkaz Detail autorizace mezi souhrnnými poli a platbami. Modál zůstává nad stejnou dávkou, má sekce Vytvořeno, Autorizovali a volitelně Zrušeno. Události mají jméno a lokalizované datum/čas Europe/Prague. Nové importy ukládají skutečný čas a aktuálního autora; nové podpisy zaznamenávají jméno a čas potvrzení. Výchozí demo dávky mají explicitní demo metadata. Staré uložené záznamy bez autora/data zobrazují chybějící údaj poctivě; datum otevření se nevydává za čas vytvoření či podpisu. Události jsou oddělené podle ID a přežijí refresh i přepnutí uživatele. Reset VAVU je odstraní spolu s ostatními daty vavu_.

Autorizovat z detailu nyní otevírá Souhrn se stejným ID/názvem, režimem Online, odchozími částkami podle měn a částkou k autorizaci s počtem plateb. Teprve Autorizovat na Souhrnu otevírá stávající prototypové potvrzení podpisu. Samotné otevření Souhrnu ani zrušení potvrzení neukládá podpis. Po potvrzení návrat na detail a aktualizace historie/stavu. Souhrn nemá Smazat.

CZK dávky zobrazují skutečnou ukázkovou částku v CZK, bez vymyšleného měnového kurzu. Volitelná předaná data currencyTotals/authorizationAmount/conversionNote byla ověřena pouze v izolované FX fixture podle reference; žádný reálný přepočet ani nové EUR platby se nevymýšlejí. FX fixture a druhý podepisující ve snímcích jsou jen testovací data, ne změna veřejných dávek.

Vizuální iterace: [P2] výchozí margin h2 zvětšoval mezeru v kartě Odejde v měně; odstraněn a doplněn divider. [P2] starší scaffold byl příliš úzký oproti referenci; cílové detail/Souhrn mají změřenou šířku obsahu 824 px při 1680 px viewportu, modál 824 + vnější padding. Použity tokeny fontu 28/36, mezery/radiusy/povrchy DS. Opakované snímky ověřují opravy. Překrytí používá průhledný DS backdrop, aby byl patrný podklad, podle dřívějšího požadavku na overlay. Ostatní obrazovky nové dávky si zachovávají původní rozměry.

Ověření: modál nad aktivním detailem, přímá URL a refresh, X/Escape/backdrop, historie zpět/vpřed, žádný podpis před potvrzením, zrušení potvrzení, dvě odlišná jména a uložené ISO časy, persistence, vytvoření importu se jménem/časem, zrušený stav, 320/375 px bez overflow, skrytí autorizace u zpracované dávky. Regrese přehledu autorizací: jeden/více subjektů, filtrace podepsaných dávek a návrat do správného seznamu prošla. Bez JS chyb.

Žádné zbývající P0/P1/P2. Záměrné rozdíly obsahu: dávky, částky a jména z prototypu místo ilustračních hodnot z referencí; podklad pod modálem zůstává viditelný.

---

# Reset dat tlačítkem Chcete poradit? – 21. 10. 2026

final result: passed

Tlačítko zachovává text a vzhled, nově resetuje celý lokální stav VAVU a po skutečném reloadu otevírá výběr uživatele. Čistí všechny klíče vavu_ (včetně budoucích), starší formulářové a inkasní klíče používané VAVU a seznamy smazaných plateb/trvalých příkazů. Sdílený přístupový flag rozcestníku ani nesouvisející klíče jiných prototypů nemaže. Žádná nová potvrzovací obrazovka.

Ověřeno izolovaným Chrome/Playwright: vložené vzorky formulářů, plateb, oprávnění, importovaných dávek, podpisového stavu a starších klíčů odstraněny. Výběr uživatele resetován, společný auth a cizí klíč zachovány. Ověřen skutečný reload, opětovný vstup, opakovaný reset a Enter. Bez JS chyb. Vizuálně ověřeno 1440 × 1000 px, DPR 1: `/home/lukinab/Projects/UX/.vavu-profile-qa/reset-button.png`.

---

# Výběr subjektu, přehled autorizací a autorizace dávek – 20. 10. 2026

final result: passed

Zdroje: tři uživatelské přílohy `codex-clipboard-537b6b55-84a8-4331-b1a6-08fcb7d824ea.png` (dávky), `codex-clipboard-7dcbc0cd-99ba-4acd-ad18-f6bfed676951.png` (subjekty) a `codex-clipboard-cd8c4637-b905-4c78-b291-5c0548d1e906.png` (přehled). Zdrojové rozměry 3360 × 2048 px; normalizace na 1680 × 1024 CSS px. Implementace 1680 × 1000 px, DPR 1. Stejné oblasti obsahu porovnány vedle sebe v `compare-authorization-hub-subjects.png`, `compare-authorization-hub-overview.png`, `compare-authorization-hub-batches.png`; původní a implementační snímky v `/home/lukinab/Projects/UX/.vavu-profile-qa/`. Výřezy x240–1290, y40–900 zachycují všechny podstatné části nové UI.

Průchod: Autorizace na Přehledu → při více subjektech Vyberte subjekt → Přehled autorizací → Dávkové platby → Autorizace dávek → existující Detail dávky. V aktuálních datech je pouze Vodárny, a.s.; výběr se přeskočí a i přímý odkaz na výběr přesměruje bez přidání zbytečné položky historie. Výběr pro více subjektů je připraven v AUTHORIZATION_SUBJECTS; druhý subjekt existoval výhradně jako testovací fixture v izolovaném prohlížeči, nebyl přidán do prototypu.

Počty odpovídají stávající autorizaci (3 platby, 3 trvalé příkazy a 1 inkaso ve výchozím stavu; změny a smazané položky se zohledňují). Typ Příkazy k inkasu nemá ve stávajícím prototypu žádná data. Žádné ukázkové firmy ani počty z referencí se nevydávají za skutečný stav prototypu. Účet EUR zobrazuje prázdný stav. Seznam dávek filtruje pouze dávky vybraného subjektu, které čekají na podpis aktuálního uživatele. Jméno subjektu a IČO jsou ze společných dat Vodáren, limit ze stávajícího prototypu.

Vizuální iterace: [P2] původní obecné CSS rozprostřelo prvky do výšky a centrovalo firemní identitu; opraveno specifickým scaffoldem a vodorovnou identitou. [P2] titul/odstup a červené ikony výběru neodpovídaly zdroji; použit token 28/36, odstup 8 a šedý avatar. Nové snímky a porovnání ověřují opravy. Aktuálně fonty Inter/DS, gap/padding/radius/stíny/barvy DS, správné texty, avatar, dokument a čekací ikona; zbývající odlišnosti obsahu jsou záměrné podle aktuálních dat. Bez nových bitmapových nebo kreslených náhrad assetů.

Ověření přes uživatelem schválený samostatný Chrome/Playwright: přeskočení jednoho subjektu, přímý odkaz, více subjektů a izolace dat, výběr, refresh, historie zpět/vpřed, návaznost na starší autorizační seznamy a správný segment, dávky a jejich detail, návrat do správného seznamu i po refreshi, odstranění podepsané dávky z nabídky a prázdný stav, počty, 320/375/768 px včetně neprázdného seznamu dávek bez vodorovného přetečení. Bez JS chyb. Regrese staršího detailu dávek prošla pro všechny čtyři stavy, podpisy a smazání.

Žádné zbývající P0/P1/P2. Záměrné odlišnosti: názvy a počty z aktuálních dat, stávající DS ikona firmy místo loga z ilustrační reference. Starší přímá autorizace u konkrétního účtu zůstává dostupná.

---

# Přehled – tlačítko Autorizace, 20. 10. 2026

final result: passed

Dvě stejně velké červené akce Nová platba a Autorizace vedle sebe v pravém sloupci Přehledu podle dodané reference `codex-clipboard-5f68c6e4-b0f0-4b0d-8fce-ef70442fa0e6.png`. Sdílená komponenta card-action-red--control a DS tokeny; ikona Autorizace z Tabler (MIT). Úprava se omezuje na tuto dvojici akcí.

Vizuálně ověřeno 1440 × 1000 px, DPR 1: `/home/lukinab/Projects/UX/.vavu-profile-qa/home-authorization.png`. Stejná výška, šířka i horní hrana obou tlačítek. Funguje kliknutí i Enter do stávající autorizace, historie zpět, Nová platba i refresh. Bez JS chyb.

---

# Detail dávky z přehledu – 20. 10. 2026

final result: passed

Zdroj: `/home/lukinab/.codex/attachments/39bfeacf-780e-4516-8ea8-ea2410d3857a/codex-clipboard-c9a78ab8-8043-4f61-a9f2-3ff51f503518.png` (3360 × 2617 px). Implementace: `/home/lukinab/Projects/UX/.vavu-profile-qa/existing-batch-desktop.png` (1040 × 1100 CSS px, DPR 1) a `existing-batch-mobile.png` (375 × 812). Obsahové porovnání: `compare-existing-batch.png`, výřez zdrojového sloupce převeden na šířku 620 px vedle implementace. Toto je porovnání anatomie; šířka a typografické tokeny zůstávají z existujícího prototypu, nejde o pixelovou shodu různých viewportů.

Přehled dávek má nově tlačítkové řádky se samostatnou URL podle ID dávky. Detail obsahuje hlášku, pět souhrnných polí, platby seskupené podle splatnosti, stav každé platby, čekací ikony a spodní akce Autorizovat/Smazat. Stávající Nová dávka zůstává samostatnou obrazovkou.

Hlášky: K autorizaci → Čeká na podpisy.; po prvním prototypovém podpisu → Čeká na další podpis.; Čekající → Čeká na zpracování.; úspěšná dávka → Dávka byla zpracována.; Zrušeno → Dávka byla zrušena. Podepsaný uživatel nepodepisuje znovu; po dvou různých podpisech přejde prototyp do Čekající. Stav je uložen podle ID a projeví se v přehledu. Smazání má vlastní potvrzení a je vratně reprezentováno příznakem v lokálním úložišti.

Data: název, ID, počet a celková částka pocházejí z vybrané položky přehledu; nepřebírají historické příklady z obrázku. Import již před změnou pouze simuloval platby. Osm plateb importované dávky používá existující ukázková data; u ostatních ukázkových dávek se řádky odvozují z tohoto vzoru s počtem a součtem odpovídajícím souhrnu. Fotografie Jana Janka a logo Mojry z reference se nepřenášejí na jiné příjemce. Ikony jsou existující DS a Tabler (MIT).

Ověření: všechny čtyři výchozí stavy, každá dávka se správnými údaji a počtem řádků, import se dvěma skupinami, refresh, dva různí uživatelé, propsání stavu do přehledu, zrušení a potvrzení smazání, persistence, neznámé ID a mobil 320/375/768 px bez přetečení. Bez JS chyb. Regrese společného zarovnání VS prošla na šesti šířkách.

Vizuální kontrola: fonty, layout a spacing používají stávající DS; barvy a informační plocha odpovídají sémantice, texty a pořadí polí odpovídají referenci. Zdrojové ikonky čekání doplněny po prvním porovnání; opakovaná kontrola aktuálního snímku prošla. Žádné zbývající P0/P1/P2. Záměrné rozdíly: ukázkoví příjemci a částky z prototypu, původní scaffold 620 px a jeho typografická velikost.

---

# Zarovnání VS v dávce – 20. 10. 2026

final result: passed

Prostřední sloupec detailu nové dávky měl různou levou hranu, protože třetí sloupec se v každém řádku počítal samostatně podle šířky částky (`auto`). Nyní má třetí sloupec společný poměr `minmax(0, 1fr)`, takže VS i doplňující text začínají na stejné souřadnici napříč oběma kartami.

Ověřeno všech osm řádků na šířkách 1440/1040/768/681 px: levé souřadnice prostředních sloupců a jejich textů shodné s tolerancí <1 px. Mobilní 375/320 px zachovávají jednosloupcové rozložení bez přetečení. Částky zůstávají uvnitř řádků. Bez JS chyb.

Vizuální kontrola: `/home/lukinab/Projects/UX/.vavu-profile-qa/batch-vs-aligned.png` a `batch-vs-mobile.png`. Ostatní typografie, mezery, barvy, texty a assety zůstávají beze změny.

---

# Oprava: Jak to funguje jako overlay – 20. 10. 2026

final result: passed

Příčina: dialog měl neprůhledný backdrop a hash nápovědy znovu přepínal obrazovky; u limitů směroval na obecnou kontrolu. Nápověda nyní zachovává aktivní zdrojovou obrazovku, její obsah a scroll. Při přímém odkazu a refreshi obnoví odpovídající podklad. Průhlednost čerpá z DS `--dialog-overlay`. Styl dokumentového dialogu zůstává beze změny.

Zdroj: `/home/lukinab/.codex/attachments/9993784c-4834-4b7d-8903-e9d2ffb462fc/codex-clipboard-7c155a8a-d2ce-4dcd-9a3f-5adb6a8e5802.png`; požadovanou odchylkou od obrázku je viditelná spouštěcí obrazovka pod průhledným překrytím. Obsah, typografie, rozměry a zaoblení původního dialogu zachovány.

Implementace: `/home/lukinab/Projects/UX/.vavu-profile-qa/help-overlay-desktop.png` a `help-overlay-mobile.png`, 1040 × 780 a 375 × 780 CSS px, DPR 1. Vizuálně ověřen obsah dialogu a viditelný podklad na desktopu i mobilu. Žádné nové assety ani copy.

Ověření: oba účty, Oprávnění/Autorizace/Limity v běžném flow i editaci z Kontroly; zavření křížkem, Escape a backdropem, refresh i historie zpět/vpřed. Otevření a zavření zachovává scroll v okamžiku aktivace odkazu. Bez JS chyb. Žádné zbývající P0/P1/P2 nálezy.

---

# Detail uživatele a jeho oprávnění – 20. 10. 2026

final result: passed

- Zdroj: přílohy `codex-clipboard-8e673f59-131d-4826-8b71-d3b7088bd8f8.png` a `codex-clipboard-f11536bc-eea7-4825-a659-dea4607ad0a7.png` z lokálních adresářů `/home/lukinab/.codex/attachments/fd65d854-5892-490a-8be8-fc030fe5f953/` a `/home/lukinab/.codex/attachments/4da4aceb-9cf0-4af7-8206-ff9e608b2569/`.
- Implementace a porovnání: `/home/lukinab/Projects/UX/.vavu-profile-qa/user-detail-desktop.png`, `user-permissions-desktop.png`, `compare-user-detail.png`, `compare-user-permissions.png` a odpovídající `*-focused.png`. Snímky mimo veřejný Git.
- Viewport: 1040 × 780 CSS px, DPR 1. Oba zdroje 2048 × 1536 px normalizovány na 1040 × 780 px; implementace 1040 × 780 px. Stav: Eva Š., light, bez oprávnění.
- Typografie: stávající Inter a DS tokeny; kontrola názvu, data narození, akcí a prázdného stavu. Obsah a pořadí odpovídají přílohám.
- Rozložení: zachována existující DS šířka 520 px oproti přibližně 497 px v normalizované referenci. Jde o vědomé použití existujícího scaffoldingu prototypu. Mobilní šířky 320/375/390 × 812 px bez vodorovného přetečení.
- Barvy: DS povrchy, avatar, oddělovače a alert pro Smazat uživatele. Ilustrace složky a ikona nastavení jsou vyříznuté originální assety z přílohy; kopírování a mazání používají stávající DS sprite.
- První porovnání: [P2] avatar a následující obsah byly o 16 px níže; opraven horní odstup identity. [P2] náhradní ikona měla tři řádky místo dvou; nahrazena originálem z reference. Aktuální plné a detailní porovnání ověřuje opravy.
- Interakce: seznam → detail → oprávnění, všechny osoby i přihlášený uživatel, samostatné hashe, refresh, browser back/forward, tlačítka Zpět, obě Nastavit oprávnění → existující výběr účtu → návrat na správnou zdrojovou obrazovku.
- Datum narození je známé pouze u Evy a u dalších osob se nevymýšlí. Přehled oprávnění čte uložená oprávnění a výchozí data existujícího prototypu.
- Podpisové skupiny, kopírování a mazání zobrazují informaci o nepřipravené části prototypu. Jejich navazující obrazovky nejsou součástí zadání.
- Automatizovaná kontrola přes samostatný Chrome/Playwright schválený uživatelem: bez JS chyb a chyb aplikačních assetů; existující chybějící favicon je v testu obsloužena odpovědí 204.
- Zbývající P0/P1/P2: žádné. P3: malé rozdíly v kresbě caret/copy/delete odpovídají použití sdílených DS ikon.

---

# Aktuální oprava: vstup do flow z Účtu (19. 10. 2026)

Výsledek: passed. Spodní tlačítko Změnit na obrazovce Účet otevírá úvod Jak to proběhne. Osoby v segmentu Oprávnění jsou statické řádky bez prokliku a bez button/focus sémantiky. Následný editovatelný seznam osob v kroku Oprávnění je zachován.

Playwright: oba účty, klik na všech šest osob beze změny URL, vstup přes Změnit ze všech tří segmentů, refresh úvodu, pokračování do oprávnění a detailu osoby, 375 px bez přetečení, bez JS chyb.

---

# Aktuální doplnění: Podepisování oprávnění (19. 10. 2026)

Výsledek: passed. Čtyři dodané obrazovky porovnány s implementací v Chrome přes Playwright; úvod, potvrzení, první i konečný podpis odpovídají rozložení při použití stávajících IB a DS komponent.

- Pokračovat ze Souhrnu -> přehled dokumentů -> potvrzení podpisu -> výsledek podle skutečně uložených podpisů dvou odlišných statutárních zástupců. První podpis má informaci o druhém podpisu; druhý má Změnili jste oprávnění k účtu / Změny platí okamžitě.
- Zavřít i křížek výsledku vrací na Účet stejného CZK/EUR účtu, segment Oprávnění. Po prvním podpisu lze z této obrazovky znovu otevřít čekající souhrn; druhý přihlášený zástupce jej může dokončit.
- Stejná osoba nemůže podepsat dvakrát. Přímý vstup na potvrzení nebo výsledek kontroluje stav a přihlášeného. Zrušit vrátí Souhrn bez přidání podpisu; zobrazení dokumentu ani refresh nepodepisuje.
- Záznam je v localStorage pro konkrétní účet a verzi. Druhý podpis uloží nastavení jako potvrzený základ dalšího návrhu. Dokončený souhrn zachová historii proti původnímu základu; nová editace vychází z posledního potvrzeného stavu a ruší předchozí podpisy.
- Náhled dokumentu používá aktuální údaje a sekce Souhrnu, v nativním dialogu s obnovou URL a Escape. Jde o obsah prototypu; nepřidává vymyšlené znění právního dokumentu. Podpis i text o KB+ jsou simulace prototypu, bez externí služby.
- Ilustrace tužky je výřez dodané reference (`permission-signing-pencil.png`). Výsledek používá ořez sdíleného DS `success-light.png` (`permission-signing-success.png`). Žádná generovaná náhrada.
- UI ověření obou účtů: skutečný proklik prvního a druhého uživatele v obou pořadích, náhled dokumentu, zrušení, refresh, čekající souhrn, ochrana proti duplicitnímu/neoprávněnému podpisu, oba návraty na Účet, nový návrh po dokončení a šířky 320/375/390. Regrese Souhrnu také passed. Bez JS chyb, syntaxe a statická ID v pořádku.
- Při kontrole opraven obrys vedlejších tlačítek a posun na začátek po dokončení změny obrazovky (rAF). Snímky a společná porovnání jsou v `.vavu-profile-qa/compare-signing-*.png` mimo Git.

---

# Aktuální doplnění: Souhrn změn oprávnění (19. 10. 2026)

Výsledek: passed. Nový souhrn za Kontrolou porovnán s dodanou referencí a kontrolován v desktopovém i mobilním Chrome přes Playwright. Názvy firmy, IČO, účtu a osob přebírá ze sdílených dat prototypu.

- Změna oprávnění obsahuje jen osoby odlišné od výchozího nastavení, včetně úrovně a povolení výběru hotovosti. Při nulové změně se sekce skryje.
- Změna autorizace popisuje počet společných podpisů i okruh vybraných osob. Při výběru všech šesti osob používá znění ze vzoru. Přidání způsobu autorizace vypisuje nově přidané osoby; odebrání má vlastní podmíněnou sekci. Údaje i indikátory na Kontrole vycházejí ze stejného výpočtu změn.
- Podepisující změnu jsou původní dva statutární zástupci, nikoli nově navržení podepisující plateb. Stav čekání rozlišuje přihlášenou osobu. Podepsáno je zelené a vychází pouze z uloženého záznamu podpisů.
- Záznam podpisů je oddělený podle účtu a konkrétní verze nastavení. Editace oprávnění nebo způsobu podepisování jej zneplatní; otevření souhrnu nikoho nepodepisuje.
- Ověřeny oba účty: nulové změny, změna jedné úrovně bez změny autorizace, čtyři přidané osoby, všechny osoby vybrané, odebrání osoby, výběr hotovosti, návrat na Kontrolu, refresh/historie a 320/375/390 px bez přetečení. Regrese Kontroly také prošla. Bez JS chyb, syntaxe a unikátní ID v pořádku.
- Varianta Podepsáno / Čeká na váš podpis byla ověřena vložením testovacího záznamu podpisu a přepnutím testovací přihlášené osoby v samostatném prohlížeči. Samotný podpis ani následný krok Pokračovat ze Souhrnu nebyl v tomto zadání přidán.
- Vizuální doklady mimo Git: `.vavu-profile-qa/compare-permission-summary.png`, `permission-summary-all.png`, `permission-summary-signed.png`, `permission-summary-mobile.png`.

---

# Aktuální doplnění: Kontrola (19. 10. 2026)

Výsledek: passed. Porovnány přiložené návrhy s desktopovým vykreslením; mobilní kontrola 320/375/390 px bez vodorovného přetečení. Zachovány sdílené údaje účtu, DS komponenty a existující formuláře.

- Pokračovat ze Způsobu autorizace otevře Kontrolu se třemi položkami. Stav Provedené změny / Beze změny se odvozuje od uloženého nastavení proti výchozím hodnotám prototypu.
- Oprávnění a Autorizace z kontroly používají stejné obrazovky jako předchozí kroky. Uložit a Zpět vrací na kontrolu; původní postup nadále používá Pokračovat. Kontext je v URL a zachová se po refreshi.
- Detail každé z šesti osob: Uložit zachová změnu a vrátí seznam; křížek změnu zahodí a vrátí seznam. Výběr podepisujících se rovněž vrací do správného kontextu.
- Limity obsahují informaci o samostatném podepisování, existující prázdný stav, Jak to funguje a Zpět na kontrolu. Samostatné podepisování dosud nikdo nemá nastavené.
- Opraven posun obsahu: profilové obrazovky se při otevření zobrazí od začátku.
- Playwright: oba účty, všechny tři položky, všech šest osob, save/cancel, výběr podepisujících, nápověda, reload, historie, původní postup a úzké viewporty; bez JS chyb. Porovnání jsou lokálně v `.vavu-profile-qa/compare-review*.png` mimo Git.
- Navazující akce Pokračovat z Kontroly zatím nemá dodaný návrh a zůstává připravená pro další zadání.

---

# Aktuální doplnění: Způsob autorizace a Podepisující (19. 10. 2026)

Výsledek: passed. Porovnány dodané návrhy s vykreslením v samostatném Chrome přes Playwright (dříve schválený uživatelem). Zachována šířka a tokeny stávajícího IB prototypu; názvy a čísla účtů z jeho sdílených dat. Zaškrtnutí používá stejný DS stav jako existující formulář oprávnění.

- Pokračovat z nastavení Oprávnění otevře Způsob autorizace. Nově oprávněné osoby jsou v Nemůže podepisovat, dokud nejsou vybrány jako podepisující. Sekce zmizí, pokud je prázdná.
- Změnit u společných podpisů otevře Podepisující. Nabízí osoby s úrovní Autorizace plateb, výběr a počet podpisů ukládá samostatně pro každý účet. Počet vybraných osob může být vyšší než požadovaný počet podpisů (kombinace podpisů).
- Uložit vrací na přehled a aktualizuje také segment Autorizace v detailu účtu. Zpět zahodí rozpracovanou změnu; refresh editoru ji obnoví. Odebrání oprávnění vyřadí osobu i z podepisujících.
- Ověřeny oba účty, všechny osoby, jeden i čtyři čekající uživatelé, dva i šest vybraných, změna počtu, opětovné otevření, historie, dialog a zobrazení 320/375/390 px bez horizontálního přetečení. Bez JS chyb.
- Vizuální porovnání a snímky: lokální `.vavu-profile-qa/compare-signers-two.png`, `compare-authorization-pending-four.png`, `compare-authorization-all.png`, `signers-mobile.png` (mimo Git).
- Samostatné podepisování a následný krok tlačítka Pokračovat na obrazovce Způsob autorizace zůstávají podkladem pro další zadání; tato změna přidává požadovaný výběr společně podepisujících.

---

# VAVU – profil uživatele, 19. 10. 2026

final result: passed

## Doplnění: editace oprávnění osoby – čtyři varianty a uložení
- Všechny osoby v seznamu Oprávnění, včetně statutárních zástupců, otevírají editor. Účet i osoba mají vlastní URL. Název osoby a účet jsou převzaty ze společných dat; Alena Modrá z mobilních podkladů není novou osobou v prototypu.
- Čtyři úrovně: Bez oprávnění, Náhled na účet, Příprava plateb, Autorizace plateb. Sekce Umožňuje obsahuje postupně 0/1/2/3 možnosti podle návrhu. Pouze u autorizace je navíc checkbox Výběr hotovosti. Při snížení úrovně se tato doplňková volba vypne.
- Zdrojové soubory: `codex-clipboard-cf837b56-7753-4a7f-9ebc-0bd902995f17.png` a `codex-clipboard-d29d6128-3cbc-4b33-b478-5d5c8c6fd48a.png` (IB, 2080 × 1554 px), `codex-clipboard-0c16da79-af7d-4f4c-afed-848d36051eea.png` a `codex-clipboard-d1bd0859-c590-4a9a-8e5b-e239e8432b1a.png` (mobil, 750 × 1624 px).
- Implementační snímky `/home/lukinab/Projects/UX/.vavu-profile-qa/person-level-{0,1,2,3}.png`, viewport 1040 × 777 CSS px / DPR 2; mobilní `person-level-{level}-375.png`, 375 × 812 / DPR 2. Stejné snímky existují pro 320/390 px.
- Společná porovnání `compare-person-level-{0,1,2,3}.jpg` v téže QA složce: 0 a 3 srovnány ve stejném IB viewportu, 1 a 2 ve stejném mobilním viewportu kvůli přepisu obsahu a anatomy. Zdroj vlevo, implementace vpravo, zmenšené na CSS pixely. IB adaptace prostředních variant byla navíc otevřena a vizuálně zkontrolována v `person-level-1.png` a `person-level-2.png`; přímé IB zdroje těchto variant nebyly dodány.
- IB adaptace na výslovné zadání: společný 520 px DS sloupec, křížek vpravo, titul osoby, název/číslo účtu, CO Input SuperField s nativním výběrem, karty s možnostmi a pravé tlačítko Uložit ve sticky spodním panelu. Na mobilu se zachová responzivní verze stejného toku s plnou šířkou tlačítka.
- Povrchy QA: lokální Inter a stávající DS velikosti/řádkování, společný rytmus 16 px a DS radius/stíny/oddělovače, barvy DS včetně červeného checkboxu a akce. Copy možností a popisů je přesně z podkladů. Check ikona je oficiální Tabler SVG (assets/permission-check.svg; licence už v assets/tabler-LICENSE.txt), bez nových rastrových podkladů nebo kreslených náhrad.
- Uložit zapíše nastavení konkrétní osoby/účtu a vrátí seznam se správným popiskem. Oprávnění v přehledu účtu i seznam osob oprávněných autorizovat se načítají ze stejných uložených hodnot. Firemní obecný stav přístupu odráží explicitně uložená nastavení. Identita a statutární role osoby se nemění.
- Rozpracovaná volba má vlastní localStorage draft, takže přežije refresh editoru. Uložit ji převede na platné nastavení a odstraní draft; křížek draft zahodí a ponechá původně uložený stav. Výslovné nové otevření osoby začíná uloženým nastavením. Stav je oddělen pro obě měny a každou ze šesti osob.
- Ověřeno Playwrightem: všechny čtyři varianty a kumulativní popisy, skrytí/povolení checkboxu, jeho uložení a obnovení i automatické odstranění při snížení úrovně; refresh draftu a jeho zahození; Uložit/návrat; všech 12 kombinací účet/osoba včetně statutárních zástupců; nezávislost hodnot; aktualizované seznamy/přehled a oprávnění autorizovat; opětovné otevření, refresh a browser historie.
- 320/375/390 CSS px: všechny varianty bez horizontálního přetečení, dlouhé texty se zalamují, skutečně dosažitelné Uložit. Bez JS chyb, syntaxe inline skriptů a unikátnost ID ověřeny.
- První vizuální srovnání bez P0/P1/P2. [P3] šířka 520 px a jemné odlišnosti ikon/oddělovačů odpovídají společnému DS; IB křížek nahrazuje mobilní text Zavřít v rámci požadované adaptace.
- Další krok Pokračovat z celkového seznamu dosud nemá dodaný navazující návrh. Toto zadání dokončuje individuální změny a jejich ukládání v prototypu.

## Doplnění: osoba → Jak to proběhne → Oprávnění → Jak to funguje
- Každá ze šesti osob na tabu Oprávnění obou účtů je nově celým řádkem klikací. Otevírá úvod a uloží vybranou osobu odděleně pro každý účet. Úvod Pokračovat otevírá seznam ze druhé přílohy. Vybraný účet je součástí URL; obě nové obrazovky i dialog se obnoví při refreshi.
- Zdrojové obrázky: `codex-clipboard-3850dd5c-71b4-4c1b-82cb-441acfc03f89.png` (2080 × 1554), `codex-clipboard-db9de5d9-a4cf-427e-a155-e328cffaa36f.png` (2080 × 1752), `codex-clipboard-6b342d89-e1b7-42fa-ab51-4b6d1ead913c.png` (2048 × 1536).
- Implementační snímky: `/home/lukinab/Projects/UX/.vavu-profile-qa/permission-intro.png`, `permission-edit.png`, `permission-help.png`; viewporty 1040 × 777, 1040 × 876, 1024 × 768 CSS px, DPR 2. Pixelové rozměry odpovídají zdrojům.
- Společná porovnání: `compare-permission-intro.jpg`, `compare-permission-edit.jpg`, `compare-permission-help.jpg` ve stejné složce, vlevo zdroj a vpravo implementace normalizované na CSS rozměry. U zdrojového dialogu byla průhlednost zkomponována na tmavé pozadí zobrazené v referenci, aby srovnání nebylo zkresleno bílým podkladem. Celé pohledy i čitelné texty/řádky/ilustrace byly prohlédnuty; samostatné výřezy nebyly nutné.
- Typografie: lokální Inter a stávající DS tokeny, titul 28/36, popisky 16/24, vedlejší a vysvětlující texty 14/20. Na mobilu standardní zmenšení titulu a přirozené zalamování.
- Layout a barvy: stejný sloupec 520 px, 16 px odsazení, karty, oddělovače a spodní panel jako ve zbytku prototypu. Úvod má centrovanou ilustraci a tři očíslované kroky. Seznam obsahuje čtyři osoby a zvláštní kartu dvou statutárních zástupců. Dialog je centrovaný na tmavém podkladu.
- Obrazové podklady: `assets/permission-intro-clock.png` je přesný výřez hodin z uživatelského návrhu (235 × 300 px), nikoli překreslení. DS ikony a iniciály jsou stejné jako dříve. Očíslované kroky jsou sémantický ordered list.
- Copy: všechny instrukce a texty dialogu převzaty z návrhů. Název a číslo účtu vycházejí z ACCOUNT_DATA; osoby a pořadí z COMPANY_USERS. Původní stav zástupců byl Autorizace plateb bez chevronu. Novější zadání povoluje editaci všech osob, proto aktuálně mají také chevron a zobrazují uloženou úroveň. Vybraná osoba se uchovává pro další rozšíření bez přidávání nedodaného zvýraznění.
- První srovnání: [P2] seznam měl vyšší řádky a odkaz zasahoval do spodního panelu; dialog měl navíc horní odsazení. Oprava: 78 px pro běžné dvouřádkové položky, menší mezera pod účtem, spodní padding obsahu a odstranění dodatečného marginu titulku dialogu. Druhé společné porovnání potvrzuje opravu a celý odkaz nad spodním panelem.
- Ověřeno pro každou osobu na obou účtech: vstup a zavření úvodu; následně Pokračovat, správný účet, počty 4+2 a pořadí, refresh úvodu/seznamu/dialogu, křížek, Escape, prohlížečové zpět/vpřed a návraty na původní účet. Nativní dialog poskytuje modalitu a zachycení fokusu.
- 320/390 CSS px: bez horizontálního přetečení; dialog uvnitř viewportu, skutečně otevřený odkaz Jak to funguje, zavření, návraty a dostupné tlačítko Pokračovat. Bez JS chyb; syntaxe inline skriptů a unikátnost ID ověřeny.
- Bez zbývajících P0/P1/P2. [P3] jemné odlišnosti oddělovačů a šířky vycházejí ze společného DS; viditelný keyboard-focus na křížku je záměrná přístupnost.
- Individuální nastavení osoby a jeho uložení je doplněno aktuálním rozšířením. Další pokračování z celkového seznamu čeká na další návrh.

## Odstranění profilu OSVČ
- Na výslovnou žádost odebrán celý řádek OSVČ ze segmentu Další profily včetně jeho naplňování v JavaScriptu.
- Zůstává jediná položka Vodárny, a.s. s původním IČO a funkčním přechodem do detailu firmy. Tato změna nahrazuje původní zadání se dvěma profily.

## Oprava mezery pod Nastavením
- Uživatelský screenshot `codex-clipboard-b460a983-acfb-4ba2-b64e-3da2caa6815b.png` ukazuje nadbytečnou prázdnou plochu pod poslední položkou osobního profilu.
- Příčina: dodatečný padding-bottom 56 px na `.profile-menu`. Pravidlo odstraněno; poslední řádek má nadále standardní vnitřní odsazení.
- Zadání výslovně mění dřívější shodu s velkou spodní mezerou prvního návrhu. Ostatní seznamy a řádky beze změny.

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

## 2026-10-23 – autorizační dialogy podle dvou předloh

- Zdroj: `/home/lukinab/.codex/attachments/ec63375b-de48-4be1-ace1-99f032dab882/codex-clipboard-ba29f635-4fad-4be1-9dcd-0310decc7226.png` (dokumenty) a `/home/lukinab/.codex/attachments/33acc2d1-6752-4081-a3a7-9fd529a80fba/codex-clipboard-9a07ea77-ff66-4622-8ff9-6acecbd1e5e4.png` (klíček).
- Implementace: `/tmp/vavu-dialog-qa/payment.png`, `document.png`, `mobile.png`; společná porovnání `/tmp/vavu-dialog-qa/compare-payment.png` a `compare-document.png` otevřena a posouzena.
- Normalizace: zdroj 2048×1536, dialog crop 1376×594 zmenšen na 756×326; implementace viewport 1280×900, DPR 1, dialog 756×326. Mobilní kontrola 390×844. Desktopové společné porovnání zobrazuje celý dialog i čitelný detail písma a ilustrací, samostatný výřez proto není potřeba.
- Stav: čekání na potvrzení v mobilní aplikaci; dokumenty pro změnu oprávnění/schématu, telefon s klíčkem pro instrumenty. Pozadí aplikace zachovává dosavadní překryv; předloha má za dialogem jednolitou tmavou plochu.
- Typografie: zachován lokální Inter a DS titul 32/40, text 16/24, nápověda 18/24; na mobilu titul 28/36. Bez ořezu nadpisů.
- Rozložení: levý panel 184 px, pravý obsah, oddělený footer; výška opravena z 404 na 326 px. Zarovnání nápovědy sjednoceno s titulkem. Na 320/390/768/1280 px se dialog vejde do viewportu, obsah lze posouvat a Zamítnout zůstává dostupné.
- Barvy: původní DS tokeny pro pozadí, text, šedý ilustrační panel, oddělovače, rámeček a stíny.
- Ilustrace: dvě samostatné bitmapy odvozené nástrojem ImageGen z dodaných předloh. [P3] Nejde o původní exporty: drobně se liší stín a proporce telefonu a tužky. Význam, barva a kompozice odpovídají předlohám; žádné náhradní CSS kresby.
- Obsah: Podpis dokumentů, Příkaz k úhradě v CZK/EUR, Trvalý příkaz, Povolení inkasa a Dávka plateb. Vícenásobný výběr používá množné číslo. Jediná vybraná platba odvozuje měnu ze skutečně vybrané položky.
- Iterace: první společné vizuální porovnání po implementaci bez nálezů P0/P1/P2. Testovací skript byl opraven o čekání na viditelnost dialogu po navigaci; nešlo o chybu produktu.
- Playwright v Brave Origin: skutečné CTA pro platbu, TP a inkaso → zamítnutí → znovu otevřít → simulované potvrzení; úprava oprávnění a podepisujících → dokumenty → nápověda zastaví časovač → Escape → znovu otevřít → refresh → dokončení; skutečná existující dávka → potvrzení. Ověřen fokus v otevřeném dialogu a šířky 320/390/768/1280. Bez JavaScriptových chyb. Samostatná kontrola názvů pro novou platbu EUR, nový TP/inkaso/dávku a jednotlivý i vícenásobný výběr.
- Simulace potvrzení v mobilní aplikaci po šesti sekundách zůstává původní; prototyp neposílá skutečný podpis do banky.

final result: passed
