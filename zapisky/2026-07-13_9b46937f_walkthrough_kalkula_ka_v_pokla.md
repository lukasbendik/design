# Zápis z konverzace: Walkthrough — Kalkulačka v Pokladně

**Datum:** 2026-07-13 12:45:18
**ID konverzace:** `9b46937f-f731-42e8-a690-6d59f0c07a4b`
**Odkaz na logy:** [transcript.jsonl](file:///Users/lukasbendik/.gemini/antigravity/brain/9b46937f-f731-42e8-a690-6d59f0c07a4b/.system_generated/logs/transcript.jsonl)

## Zadání uživatele
```text
chci upravit prototyp https://lukasbendik.github.io/design/Platby/Zapla%C5%A5%20mi%20business/index.html#keypad

do hlavičky, kde je nadpis "pokladna" mi přidej vpravo ikonu kalkulačky. po kliknutí na ikonu se uživateli zobrazí obrazovky s klávesami kalkulačky, kde bude moci částku spočítat. dole bude tlačítko zaplatit, které povede na obrazovku s QR kódem. 

nebo ještě uvažuji, jestli by poteční symboly nešli přidat na stávající obrazovku pokladny. zkus se podívat na nějaké inspirace, paterny a konkurenci a navrhni vhodné řešení. cílem je, aby obsluha měla jednoduchou možnost si výsledek spočítat, pokud je to složitější výpočet.
```

## Provedené změny (z walkthrough.md)
# Walkthrough — Kalkulačka v Pokladně

Implementovali jsme do prototypu **Zaplať mi business** možnost přepínat mezi standardní pokladnou a plnohodnotnou kalkulačkou přímo v horní části obrazovky pomocí **Segmented control**.

## Provedené změny

### 1. [index.html](file:///Users/lukasbendik/Projects/UX/ux/Platby/Zapla%C5%A5%20mi%20business/index.html)
*   **Segmented Control v záhlaví:**
    *   Do `.topbar` jsme vložili nový `.segmented-control` s možnostmi **Pokladna** a **Kalkulačka** (iOS styl: šedé zaoblené pozadí, bílé tlačítko s jemným stínem pro aktivní režim).
    *   Volba se automaticky ukládá do `localStorage` (pod klíčem `zaplatmi_business__mode`) a při opětovném otevření obrazovky nebo refreshi se předvybere.
*   **Rozdělení pohledů:**
    *   Tělo obrazovky `#screen-keypad` bylo rozděleno na `#kp-content-pokladna` (stávající keypad) a `#kp-content-kalkulacka` (nová kalkulačka).
*   **Styly a rozvržení kalkulačky:**
    *   Nová mřížka `.calculator-grid` (4 sloupce, 5 řádků).
    *   Tlačítka mají elegantní a čistý vzhled, operátory `+ - * / ( ) C = ,` jsou vizuálně odlišeny šedým pozadím.
*   **Logika kalkulačky v JS:**
    *   Kalkulačka podporuje standardní zápis matematických výrazů (sčítání, odčítání, násobení, dělení, závorky, desetinná čísla).
    *   V horní části se zobrazuje průběžná historie výpočtu (např. `120 + 80 =`).
    *   Hlavní displej zobrazuje aktuální číslo nebo průběžný výsledek.
*   **Integrace s platbou:**
    *   Tlačítko **Zaplatit** ve spodní části dynamicky zobrazuje aktuální výsledek (např. **Zaplatit 200,00 Kč**).
    *   Po kliknutí na toto tlačítko (i bez předchozího stisku `=`) se vypočtená částka bezpečně zaokrouhlí a předá do generátoru QR platby.
*   **Vzhled záhlaví QR platby:**
    *   Zarovnali jsme nadpis **QR platba** na střed a změnili jeho písmo na regular (`font-weight: 400`). Toho bylo dosaženo přidáním postranního spaceru do záhlaví pro vyrovnání tlačítka Zpět.

## Checklist úkolů (z task.md)
# Úkoly pro implementaci kalkulačky v Pokladně

- [x] Upravit HTML strukturu pro topbar a segment control v `#screen-keypad`
- [x] Přidat CSS styly pro segment control a mřížku kalkulačky (`.calculator-grid`, `.calc-key`, atd.)
- [x] Rozdělit obrazovku Pokladna v HTML na dvě sekce (`#kp-content-pokladna` a `#kp-content-kalkulacka`) a přidat klávesy kalkulačky
- [x] Implementovat přepínání režimů v Javascriptu (ukládání do localStorage, zobrazení/skrytí sekcí)
- [x] Implementovat matematickou logiku kalkulačky (zápis, mazání, vyhodnocení, desetinná čísla)
- [x] Propojit kalkulačku s tlačítkem "Zaplatit" a generováním QR kódu
- [x] Otestovat a ověřit funkčnost (pamatování režimu, správnost výpočtů, QR kód)

