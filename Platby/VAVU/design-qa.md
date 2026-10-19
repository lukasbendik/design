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
