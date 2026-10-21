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
