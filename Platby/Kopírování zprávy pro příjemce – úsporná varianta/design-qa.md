# Design QA

Datum: 14. 10. 2026
final result: passed

Vizuálně ověřeno v prohlížeči: 375 × 812, 320 × 640 a 1280 × 900. Kombinovaný náhled původního a nového formuláře při 375 × 812 a stejné zprávě: `.copy-message-qa/comparison-compact.png` mimo veřejný repozitář. Finální náhledy: `compact-ready-375.png`, `compact-sheet-375.png`.

- Typografie, barvy, radius, spacing a skutečná kopírovací ikona odpovídají sdílenému CORE systému. Požadovaná změna přesouvá akci dovnitř inputu a šetří 52 px. Ostatní formulářová pole zachována.
- Ikona 48 × 48 px; dlouhý víceřádkový text má rezervované místo a nepřekrývá ji. Na úzkém mobilu lze obsah odrolovat a pokračovací akce zůstává přístupná. Bez horizontálního přetečení.
- Bottom sheet má dvě přesně pojmenované volby a křížek. Na mobilu je u dolního okraje; na desktopu končí ve stejné souřadnici jako telefon (872 px při 1280 × 900). Dialog zajišťuje modalitu a práci s fokusem.
- Ověřen celý tok Přehled → Nová platba → údaje → Souhrn → ukázkový PIN → výsledek. Souhrn zobrazuje správnou zprávu i osobní popis.
- Ověřena kopie aktuálního textu do existujícího popisu bez potvrzení/undo/hlášky, uložení a refresh. Ověřen zápis do skutečné schránky vložením klávesovou zkratkou do textarea (obsah shodný se zdrojem); pomocná session clipboard.readText v IAB není spolehlivým readbackem systémové schránky.
- Ověřena neaktivní ikona pro prázdnou zprávu, zavření křížkem/Escape/prohlížečovým zpět a refresh přímo v #copy.
- Konzole bez chyb a varování. Chyba zamítnutého oprávnění schránky je implementována, avšak zamítnutí nebylo v tomto prohlížeči vynuceno. Fyzický mobil nebyl testován.

Bez nevyřešených P0/P1/P2 vizuálních nálezů. Původní prototyp nezměněn.

## Animace bottom sheetu

Ověřeno 14. 10. 2026 při 375 × 812: otevření začíná pod spodním okrajem (top 844 px, transform 220 px, backdrop opacity 0), končí v top 624 px a backdrop opacity 1. Zavření zachová modalitu do konce animace a potom dialog zavře; fokus vrací na copy-action. V prohlížeči ověřeno kopírování do popisu, refresh #copy, rychlé zpět/vpřed během animace a reduced-motion emulací: 1ms CSS pravidlo, dokončené zavření a návrat fokusu. Emulace po ověření odstraněna. Konzole bez chyb. Náhled skutečných zachycených snímků: `.copy-message-qa/bottom-sheet-animation.gif` mimo veřejný repozitář.
