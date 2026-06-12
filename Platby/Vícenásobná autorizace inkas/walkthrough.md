# Walkthrough: Vícenásobná autorizace inkas (KB Styl)

Byl úspěšně zrekonstruován a opraven prototyp **Vícenásobná autorizace inkas** ve složce `ux/Platby/Vícenásobná autorizace inkas/` na základě přesných podkladových screenshotů z bankovní aplikace KB.

## Detaily implementace

### [Opravený prototyp]
- **Soubor** [index.html](file:///Users/lukasbendik/Documents/Claude/UX/ux/Platby/V%C3%ADcen%C3%A1sobn%C3%A1%20autorizace%20inkas/index.html):
  - **Věrný vzhled KB**: Barvy (červená `#E2001A`), zakulacené bílé karty na pozadí `#F4F5F7`, a stíny odpovídají reálné aplikaci.
  - **Průchod 9 obrazovkami**:
    1. **Přehled (Stav)**: Uživatel vidí Běžný účet (18 063,38 Kč), Běžný účet 2 (48 490,20 Kč) se státními vlajkami pod ním, Spoření (11 490,20 Kč) a kartu červnového souhrnu. Spodní plovoucí lišta je červená s ikonami. Kliknutí na **Běžný účet 2** přejde do detailu.
    2. **Detail účtu**: Zůstatek 48 490,20 Kč, možnost kliknout na „Detail a správa účtu“. Transakce: Tesco (-2 430,30 Kč), Karel Kropáček (2 000 Kč) a Josef Pokorný (-12 000 Kč s textem „Platba neodešla“ a křížkem).
    3. **Spodní menu (Drawer)**: Vysouvací drawer s červenými ikonami. Výběr položky **Autorizace** přechází na seznam.
    4. **Autorizace (Výchozí)**: Záložka *Inkasa* je aktivní. Zobrazuje se limit disponenta a subjektu a dvě nezaškrtnutá inkasa (ČEZ elektřina 1 300,00 Kč, Obědy 1 000,00 Kč). Lišta ukazuje „Částka k autorizaci: 0,00 Kč“ (0 z 2).
    5. **Autorizace (Vybráno)**: Obě položky jsou zaškrtnuty, lišta ukazuje „Částka k autorizaci: 2 300,00 Kč“ (2 z 2) a tlačítko „K autorizaci“ je aktivní.
    6. **Souhrn**: Rekapitulace účtu a počtu inkas. Uživatel kliká na „Autorizovat inkasa“.
    7. **PIN klávesnice (Potvrzení inkas)**: Spodní sheet s kruhovou klávesnicí a Face ID ikonou. Po zapsání 6 místného kódu (nebo kliknutí na Face ID) se provede úspěšné schválení.
    8. **Výsledek autorizace**: Zobrazuje se 3D symbol KB klíče a seznam schválených položek označených jako „Autorizováno“. Kliknutím na „Zavřít“ se vracíme na detail účtu, kde se zůstatek snížil na `46 190,20 Kč` a na domovské stránce na `37 700,00 Kč` (česká část). Tlačítko „Pokračovat v autorizacích“ vede do prázdného stavu.
    9. **Autorizace (Prázdný stav)**: Záložka Inkasa zobrazuje 3D ilustraci a text „Nemáte žádná inkasa k autorizaci.“.
  - **Data persistence**: Uložené zůstatky a stavy se ukládají v `localStorage` pod klíčem `kb_debits_...`.
  - **URL Hash**: Zajišťuje plnohodnotné fungování tlačítka Zpět v prohlížeči a obnovu obrazovky po stisknutí F5.

## Ověření funkčnosti
1. **Generátor rozcestníku**: Detekoval opravený prototyp a úspěšně vygeneroval rozcestník `index.html`.
2. **Git a GitHub**: Všechny změny byly commitnuty a pushnuty na GitHub.

## Odkaz na rozcestník
- **Rozcestník:** [https://lukasbendik.github.io/design/](https://lukasbendik.github.io/design/)
> [!NOTE]
> Změny se na odkazu projeví přibližně do 1 minuty (jakmile doběhne GitHub Actions).
