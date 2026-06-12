# Walkthrough: Vícenásobná autorizace inkas

Byl úspěšně vytvořen nový interaktivní prototyp **Vícenásobná autorizace inkas** ve složce `ux/Platby/Vícenásobná autorizace inkas/`.

## Provedené změny

### [Nový prototyp]
- **HTML/CSS/JS soubor** [index.html](file:///Users/lukasbendik/Documents/Claude/UX/ux/Platby/V%C3%ADcen%C3%A1sobn%C3%A1%20autorizace%20inkas/index.html):
  - **Auth Guard**: První řádek v `<head>` obsahuje zabezpečení tokenem a správný relativní odkaz na rozcestník `../../`.
  - **Design systém**: Přesně nastavené barvy KB (hlavní červená `#E2001A`), zaoblení prvků (`16px`), stíny a písmo odpovídající bankovní aplikaci.
  - **Průchod (9 obrazovek)**:
    1. **Domů (Stav)**: Seznam účtů s reálnými zůstatky z plátna. Běžný účet (18 003 Kč) je proklikávací.
    2. **Detail účtu**: Zůstatek 48 490 Kč. Kliknutím na „Tuzemská platba“ se vysune spodní menu.
    3. **Spodní menu (Platby)**: Animovaný bottom drawer s volbami. Kliknutí na „Tuzemská platba“ zahájí proces autorizace.
    4. **Autorizace (Platba)**: Přehled odesílaného příkazu (částka 1 500 Kč, plátce, příjemce). Kliknutí na „Potvrdit“ nebo „Zobrazit detaily autorizace“ přechází na detaily.
    5. **Autorizace (Detaily)**: Kompletní přehled včetně datumu a zprávy. Kliknutí na „Potvrdit“ vede na Souhrn.
    6. **Souhrn**: Závěrečná rekapitulace před autorizací.
    7. **PIN klávesnice**: Bottom-sheet se 6místným PINem a interaktivní numerickou klávesnicí.
    8. **Výsledek autorizace**: Úspěšný stav s animací a proklikem na přehled autorizací.
    9. **Přehled autorizací**: Stavová obrazovka „Všechny autorizace dokončeny“.
  - **Data persistence**: Hodnoty polí (Jméno, Účet, Částka, Datum, Zpráva) jsou ukládány do `localStorage` a dají se v prototypu inline upravovat (červeně zvýrazněné hodnoty v tabulce).
  - **Deduction logic**: Po úspěšném schválení PINem se částka (1 500 Kč) odečte od zůstatku běžného účtu.
  - **URL Hash**: Funguje správné přepínání obrazovek pomocí `#home`, `#account`, `#auth-p1` atd., což zaručuje správnou obnovu při znovunačtení stránky (refresh) i funkční systémové tlačítko Zpět.

### [Rozcestník]
- **Aktualizovaný rozcestník** [index.html](file:///Users/lukasbendik/Documents/Claude/UX/ux/index.html):
  - Spuštěn generátor `generate.js`, prototyp byl automaticky zaregistrován a přidán do rozcestníku.

## Ověření funkčnosti
1. **Generátor rozcestníku**: Úspěšně detekoval nový prototyp a zapsal ho do `index.html`.
2. **Git deployment**: Změny foram commitnuty a pushnuty na GitHub. GitHub Actions automaticky nasadí novou verzi.

## Odkaz na rozcestník
- **Rozcestník:** [https://lukasbendik.github.io/design/](https://lukasbendik.github.io/design/)
> [!NOTE]
> Změny se na odkazu projeví přibližně do 1 minuty (jakmile doběhne GitHub Actions).
