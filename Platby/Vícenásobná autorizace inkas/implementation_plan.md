# Prototyp: Vícenásobná autorizace inkas

Tento plán popisuje vytvoření nového interaktivního prototypu podle přiloženého plátna. Prototyp je realizován jako single-page webová aplikace se simulací mobilního bankovnictví a je umístěn v adresáři `ux/Platby/Vícenásobná autorizace inkas/`.

## Schválené Parametry
- **Složka:** `ux/Platby/Vícenásobná autorizace inkas/`
- **Název prototypu:** Vícenásobná autorizace inkas

## Navržený průchod prototypem
Prototyp bude simulovat tok o 9 obrazovkách:
1. **Domovská obrazovka (Stav)**: Přehled produktů. Proklik z Běžného účtu (nebo karty) vede na Detail účtu.
2. **Detail účtu (Účet)**: Zůstatek `48 490 Kč`, tlačítka rychlých akcí. Kliknutí na „Tuzemská platba“ otevře spodní menu.
3. **Spodní menu (Platby)**: Seznam možností platby. Volba „Tuzemská platba“ přechází na obrazovku autorizace.
4. **Autorizace (Tab: Platba)**: První záložka s detailem příkazu. Kliknutí na „Potvrdit“ přechází na záložku Detaily.
5. **Autorizace (Tab: Detaily)**: Třetí záložka se všemi podrobnostmi. Kliknutí na „Potvrdit“ přechází na Souhrn.
6. **Souhrn (Souhrn)**: Rekapitulace platby s tlačítkem „Autorizovat“. Kliknutí vyvolá PIN klávesnici.
7. **Klávesnice PIN (Potvrzení PINem)**: Modální dialog pro zadání 6místného kódu. Po úspěšném zadání automaticky přechází na výsledek.
8. **Výsledek autorizace**: Úspěšný stav. Tlačítko „Hotovo“ vrací na Detail účtu. Odkaz „Přejít na přehled autorizací“ přechází na frontu.
9. **Přehled autorizací**: Stavová obrazovka „Všechny autorizace dokončeny“. Tlačítko „Zavřít“ vrací na Detail účtu.

## Proposed Changes

### [Nové komponenty prototypu]

#### [NEW] [index.html](file:///Users/lukasbendik/Documents/Claude/UX/ux/Platby/Vícenásobná%20autorizace%20inkas/index.html)
Vytvoření nového single-file prototypu obsahujícího HTML, CSS a JS logic. 
- Implementuje kompletní design systém banky.
- Zahrnuje auth guard na prvním řádku `<head>` se SHA-256 hashem tokenu a správnou relativní cestou k rozcestníku (`../../`).
- Správa stavu (URL hash změny, `localStorage` pro zapamatování hodnot).
- Interaktivní simulátor PIN klávesnice s animovaným vyplňováním teček.

## Verification Plan

### Manuální ověření
- Otestování průchodu všech 9 kroků na mobilním i desktopovém rozlišení.
- Ověření funkčnosti tlačítka Zpět a URL hash obnovy.
- Ověření auth guardu (nepřihlášený uživatel je přesměrován na rozcestník).
- Kontrola perzistence v `localStorage`.
- Kontrola odesílání eventů do Clarity a Google Analytics.
