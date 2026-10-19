# VAVU – profil uživatele, 19. 10. 2026

final result: passed

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
- Detaily jednotlivých položek menu ani přepínání subjektu nejsou součástí tohoto zadání; řádky jsou podkladem pro doplňování dalších obrazovek.
- Zbytek původního desktopového prototypu nebyl přepracován na mobilní aplikaci. Úzká kontrola se vztahuje na novou obrazovku profilu.
- [P3] Doplňkové knihovní ikony nejsou totožnými exporty ikon z uživatelského návrhu; zachovávají význam, obrys a rozměr. Drobné rozdíly oddělovačů vycházejí z aktuálních DS tokenů.

## Checklist
- [x] Oba segmenty porovnány s návrhy.
- [x] Opraveny nálezy P2 a znovu zachycena implementace.
- [x] Ověřeny interakce, identita, historie, obnova a úzké zobrazení.
