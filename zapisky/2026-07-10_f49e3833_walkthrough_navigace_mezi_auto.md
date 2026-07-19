# Zápis z konverzace: Walkthrough: Navigace mezi autorizací a platbami/TP/inkasy (Oprava zalamování částky a měny)

**Datum:** 2026-07-10 10:50:57
**ID konverzace:** `f49e3833-0c06-420d-ad6c-f92c10d3b6e1`
**Odkaz na logy:** [transcript.jsonl](file:///Users/lukasbendik/.gemini/antigravity/brain/f49e3833-0c06-420d-ad6c-f92c10d3b6e1/.system_generated/logs/transcript.jsonl)

## Zadání uživatele
```text
udělej mi nový prototyp...chci aby byl pro desktop a odpovídal obrázkům, které jsem přiložil. flow chci, aby odpovídalo nakresleným šipkám. obrazovky budu vkládat postupně, takže ještě nic nedělej.
```

## Provedené změny (z walkthrough.md)
# Walkthrough: Navigace mezi autorizací a platbami/TP/inkasy (Oprava zalamování částky a měny)

Upravili jsme chování zalamování hlavních zůstatků na kartách, aby byla částka s měnou vždy na jednom společném řádku.

## Provedené změny

### 1. Zamezení zalamování zůstatků (white-space: nowrap)
- **Oprava**: Pro všechny hlavní typy karet se zůstatky bylo přidáno CSS pravidlo `white-space: nowrap`.
- **Dotčené karty**:
  - **Běžný účet** na obrazovce **Přehled** (tarif komfort widget).
  - **Spoření** na obrazovce **Přehled** (spoření card widget).
  - **Hlavní zůstatek** na obrazovce **Detail běžného účtu** (`680 063,38 Kč`).
- **Výsledek**: Číslo, desetinná část i symbol měny (Kč) jsou nyní pevně uzamčeny na jednom řádku a nebudou se zalamovat ani na užších displejích.

## Jak otestovat prototyp

1. Otevřete rozcestník prototypů: [Rozcestník](https://lukasbendik.github.io/design/) *(počkejte minutu na nasazení)*.
2. Na úvodní obrazovce **Přehled** zkontrolujte zůstatky u *Běžného účtu* i *Spoření*.
3. Rozklikněte *Běžný účet* a zkontrolujte hlavní velký zůstatek na obrazovce **Detail účtu**.
4. Všechny tyto hodnoty drží jednotnou linii na jednom řádku.

## Checklist úkolů (z task.md)
# Úkoly: Navigace mezi autorizací a platbami/TP/inkasy

- [x] **Příprava**
  - [x] Spustit `git pull` v repozitáři `~/Projects/UX/ux/`
- [x] **Implementace a úprava prototypu podle screenshotů**
  - [x] Vytvořit adresář `ux/Platby/navigace-mezi-autorizaci-a-platbami-tp-inkasy/`
  - [x] Vytvořit soubor `index.html` s SHA-256 Auth Guardem a tokeny z `tokens.css`
  - [x] Naimplementovat základní desktopový layout (levé menu, horní lišta, pravý panel, chatbot)
  - [x] Upravit vzhled jednotlivých obrazovek, aby byly 1:1 se screenshoty:
    - [x] Předělat červená tlačítka "Nová platba" a "+ Nastavit inkaso" na velké akční karty s ikonou nahoře
    - [x] Změnit všechny ikony v pravém panelu odkazů na červené
    - [x] Předělat vyhledávací pole "Filtr" (přidat červenou ikonu filtru vpravo)
    - [x] Upravit seznam transakcí na detailu účtu a ve všech platbách (přesné texty a barvy)
    - [x] Předělat formulář Povolení inkasa na SuperField (floating labels v rámečku)
    - [x] Doladit design a stíny pro celoobrazovkové modaly
  - [x] Napsat JS logiku (navigační flow, back flow, hash history, persistence formuláře v `localStorage`)
- [x] **Build a nasazení**
  - [x] Spustit `node generate.js` pro aktualizaci rozcestníku
  - [x] Přidat, commitnout a pushnout změny do gitu
- [x] **Dokumentace**
  - [x] Vytvořit/aktualizovat `walkthrough.md`

