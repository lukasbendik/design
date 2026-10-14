# Design QA – Kopírování zprávy pro příjemce

Datum: 14. 10. 2026.

final result: passed

## Vizuální zdroj a porovnání

- Zdroj: pět uživatelem dodaných obrazovek platebního flow; hlavní porovnání používá prázdný formulář doplňujících údajů (`codex-clipboard-ee1ef280-1c2b-411f-9cec-4e517dc8232a.png`).
- Zdroj 782 × 1642 px byl normalizován: odstraněn vnější černý rámeček, oblast x=16…766 / y=0…1624 zmenšena z 750 × 1624 na 375 × 812 px. Implementace byla zachycena při CSS viewportu 375 × 812; výsledný PNG má stejné rozměry.
- Stav: světlý režim, `#details`, všechna pole prázdná, Co nejdříve. Porovnání otevřeno jako jeden společný obrázek, nikoli dvě oddělená zobrazení.
- Záměrné změny: akce/nápověda pod cílovým polem posouvá následující pole; plovoucí label, Inter, border a segment používají autoritativní CORE design systém. Nejde o pixelovou kopii původního screenshotu. Pořadí polí, padding 16, input 60, header a sticky CTA zůstávají zachovány.
- Po porovnání nejsou otevřené nezamýšlené P0/P1/P2 vizuální vady hlavního formuláře.

## Iterace a opravy

1. P2: při změně šířky z desktopu na 320 px zůstala stará výška textarea (client 96 vs scroll 120). Doplněn přepočet při resize a po načtení fontů. Nová kontrola při 320 × 640: zpráva má 140 znaků, client i scroll 120; nic není skryté uvnitř pole. Náhled v akci má záměrně nejvýše dva řádky, skutečná kopie je úplná.
2. P2: lokální latin subset neobsahoval české znaky. Nahrazen sdíleným `prototype-kit/fonts.css`, který načítá latin i latin-ext pro váhy 400/500. Nové snímky jsou po opravě.
3. P2: při editaci po validační chybě zůstávala stará hláška. Nyní se při editaci a přepnutí scénáře odstraní; ověřeno prázdný účet → chyba → doplnění účtu → hláška zmizí → pokračování.
4. P2: po přepínání desktopových scénářů mohl aplikační Zpět následovat historii jiného scénáře. Nyní používá history.back pouze pro očekávaný předchozí krok, jinak přejde na předchozí krok flow. Ověřeno Souhrn → doplňující údaje → účet/částka. Prohlížečové Zpět dál funguje samostatně.

## Ověřené interakce v Codex in-app browseru

- Jedno klepnutí přenese zprávu do prázdného popisu; zobrazí potvrzení a Vrátit zpět.
- Undo obnoví prázdný i dříve vyplněný vlastní popis.
- Při obsazeném popisu dialog zobrazí oba texty. Ponechat můj popis nic nepřepíše; Nahradit popis vloží zprávu.
- Refresh zachová kopii, původní text pro undo a aktuální hash.
- Ruční editace zprávy nemění popis; ruční editace popisu odstraňuje undo, aby nevymazalo novou práci.
- Zpráva s českými znaky a novým řádkem se kopíruje přesně. Kontrola rovnosti hodnot obou textarea vrací true.
- Dlouhá zpráva: kopie všech 140 znaků, bez vodorovného overflow při 320 × 640; pole rostou podle obsahu.
- Prázdná zpráva: akce zmizí a objeví se vysvětlení.
- Souhrn zobrazuje zprávu a popis odděleně a konzistentně; prázdné volitelné údaje vynechá.
- Výběr Později a datum 20. 10. 2026 se přenášejí do souhrnu.
- Celý průchod: Přehled → Nová platba → doplňující údaje → Souhrn → demo PIN (včetně refresh na #pin) → Zadali jste platbu → Zadat další.
- Mobilní viewporty 375 × 812 a 320 × 640; desktop 1280 × 900 s přepínáním scénářů. Na mobilu se panel scénářů nezobrazuje. Při 375 px má tlačítko kopie výšku 54 px.
- Console: žádné zachycené chyby ani varování. Lokální odkazy/assety existují; JavaScript syntax check a git diff --check prošly.

## Evidence

Snímky zůstávají lokálně mimo veřejný checkout v `/home/lukinab/Projects/UX/.copy-message-qa/`:

- `comparison-details-final.png` – společné porovnání reference a prázdného formuláře.
- `details-ready-final.png` – hotová hlavní interakce před kopírováním.
- `details-copied.png` – potvrzení a undo (první iterace).
- `replace-dialog.png` – ochrana vlastního popisu.
- `long-320-final.png` – dlouhý text po opravě výšky při zúžení viewportu.
- `desktop-final.png` – scénáře na desktopu.

P3: Přehled je kontextový model se sdílenou ikonou profilu místo osobní fotografie a bez notifikačních badge z reference. Akce QR, Zaplať mi, kontakt, výběr účtu, šablona a trvalý příkaz jen vysvětlí, že nejsou součástí ukázky. To neblokuje požadovanou cestu kopírování.

## Hranice kontroly

Toto je kontrola renderu a interakcí v prohlížeči. Neproběhl výzkum s lidmi, kontrola nativní klávesnice na fyzickém iOS/Android ani end-to-end screen reader test. Žádná platba se neodesílá.
