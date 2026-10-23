# QR Pokladna V3 — ověření 23. 10. 2026

final result: passed

## Vizuální podklady a normalizace

- Schéma uživatele: `codex-clipboard-a6498cd3-b6e2-438e-ab44-c1bb171ea7b6.png`, 3182 × 2642 px.
- Přihlášení: `codex-clipboard-7277bbe0-4f48-45bb-a267-0cda68a381e9.png`, 750 × 1624 px, normalizováno na 375 × 812 a 393 × 851 px.
- Přehled KB+: `codex-clipboard-9e5b78ca-2217-493d-a253-e25d960b1b0b.png`, 750 × 1624 px, normalizováno na 393 × 851 px.
- Vizuální důkazy jsou lokálně v `../../zapisky/qr-pokladna-v3-qa-2026-10-23/` (nepublikované): `login-final-v2-comparison.png`, `cashier-comparison.png`, `home-verified.png`, `home-final-comparison.png`, `partial.png`, `removed.png`, `accounts.png`.
- Desktop QA: Brave, Playwright, viewport 1400 × 1100, deviceScaleFactor 1; obsah telefonu 393 × 852 CSS px. Samostatně ověřen výchozí nižší desktop viewport a automatické zmenšení celého telefonu.
- Mobil: 375 × 812 a 320 × 740; bez vodorovného přesahu. Nativní klávesnice je deklarována `inputmode="decimal"`; její skutečný vzhled na fyzickém zařízení nebyl ověřen.
- Screenshot API po změně viewportu někdy vrací předchozí vykreslený snímek. Pro porovnání byly snímky opakovány v dalším kroku a stav ověřen v DOM. Obrazovka telefonu byla z plných snímků vyříznuta beze změny měřítka.

## Porovnání a opravy

1. P2: pevné desktopové měřítko ořezávalo telefon na nízkém okně. Nahrazeno výpočtem měřítka z výšky okna; boční ovládání má vlastní scroll. Opětovně ověřen celý telefon včetně spodních akcí.
2. P2: zůstatky a šířka plovoucího panelu na přehledu byly větší než předloha, chyběla šipka souhrnu. Upraveny velikosti, rozestupy, stíny účtové karty, kruhové vlajky a zarovnání příjmů/výdajů. Porovnáno ve společném obrázku `home-final-comparison.png`; konečné vykreslení po odsazení panelu od home indikátoru v `home-verified.png`.
3. P2: přihlašovací panel měl na mobilu chybnou výšku kvůli přepsání min-height. Opraveno a ověřeno při 375 × 812. Desktopové klávesy následně přizpůsobeny hustotě 393 px; Face ID převzato přímo z dodané předlohy. Nové společné porovnání `login-final-v2-comparison.png`.
4. P2: návrat historie ke zrušenému QR ukazoval čekání. Nyní vede na vyřazený detail, identita platby je navíc uchována v history.state. Opětovně ověřeno prohlížečové zpět a refresh detailu.

### Povinné vizuální oblasti

- Typografie: Inter z místního DS, velikosti a váhy odvozeny z komponent a příloh. Bez nechtěného zalamování hlavních akcí; dlouhý výsledek nižší částky záměrně na dvou řádcích.
- Rozložení: obě vstupní cesty, hlavičky, výběr účtu, částka, QR, výsledky, přehled a vyřazení odpovídají anatomii schématu. Status bar a safe area jsou přidány jako součást telefonu.
- Barvy: napojení na `design-system/tokens.css`, červené primární akce, zelené zaplacení, chybové a vyřazené stavy.
- Obrázky: KB ikony a úspěch z existujícího DS; avatar, Face ID a ilustrace nedoručení extrahovány z dodaných obrázků. QR je generovaný z částky, čísla účtu a jedinečného ID; knihovny a ikony se načítají lokálně.
- Copy: zachovány texty příloh „Zaplatit“, „K zaplacení“, „Zadat další“, „Zaplaceno“, „Platba dorazila s nižší částkou“, „Platba zatím nedorazila“, „Vyřadit“, „Zrušit vyřazení“.
- Detailní porovnání: samostatný login a formulář/klávesnice ve společných obrázcích. Přehled zkontrolován v celé výšce i v oblastech zůstatku, měnových štítků a souhrnu.

## Funkční kontrola přes Playwright

- Widget → přihlášení libovolnými šesti číslicemi → pokladna; skutečný focus v částce.
- Ikona KB+ → přihlášení → přehled → běžný účet → Placení a správa účtu → QR pokladna.
- Kontextové menu ikony KB+ → QR pokladna → přihlášení. Podporováno podržení i pravé tlačítko; pravé tlačítko ověřeno.
- Numerická klávesnice na desktopu; na mobilu skrytá simulace a inputmode decimal. Fyzickou klávesnicí lze zadávat PIN i částku.
- Validace prázdné částky, desetinné částky, obnova částky a zvoleného účtu po refreshi.
- Výběr druhého účtu, QR vytvořený pro vybraný účet, oddělený přehled podle účtu.
- Zobrazení QR a odpočtu, refresh během čekání.
- Zaplacení celé částky, nižší částka a ruční vypršení odpočtu; automatický přeplatek po 8 s.
- Skutečné automatické vypršení po 60 s, ověřen výsledek „Platba zatím nedorazila“.
- Zadat další, zrušení s potvrzovacím panelem, přehled plateb, detail.
- Vyřazení včetně zaplacených/čekajících položek, trvalý stav po refreshi, zrušení vyřazení.
- Browser back, obnovení obrazovky z hashe, focus, Escape a omezení Tab v dialogu.
- Konzole bez zaznamenaných chyb a varování. `node --check app.js` a `git diff --check` bez chyb.

## Záměrné odlišnosti a limity

- Schéma mísí iOS homescreen s Android klávesnicí. Telefon používá jednotnou iOS numerickou klávesnici; na desktopu jde o funkční simulaci.
- Homescreen telefonu používá jednobarevnou tapetu a standardní ikony místo konkrétní osobní tapety a sady aplikací z malého obrázku schématu.
- Okolní bankovní akce mimo zadaný tok jsou vizuální kontext. Neprovádějí skutečné platby ani přihlášení.
- Stav příchozí platby je výhradně simulace, bez bankovního backendu. PIN se neukládá.

Nezůstává otevřená chyba P0/P1/P2 v požadovaném toku.
