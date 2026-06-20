# KB Design System (pro prototypy)

Zdroj pravdy pro **barvy, typografii, spacing, radius, stíny a komponenty** používané při tvorbě prototypů v tomto repozitáři.

Tokeny jsou **vygenerované přímo z Figmy** (`💠 CORE Components.fig`) – ne odhadnuté z screenshotů. Hodnoty jsou tedy přesné (přesné HEX, px, font-weighty, multi-theme).

## Soubory

| Soubor | Co obsahuje | Pro koho |
|---|---|---|
| `tokens.css` | CSS custom properties: barvy (light/dark/HC), spacing, radius, border, stíny + typografické utility třídy `.t-*`. **Toto se používá v prototypech.** | runtime |
| `tokens.json` | Stejná data strojově čitelná (barvy primitive + semantic, typografie, spacing, stíny). Pro nástroje/skripty. | nástroje |
| `components.md` | Katalog komponent (CO Button, CO Input, …) – varianty, stavy, mapování na tokeny, jak postavit v HTML. | já při tvorbě |
| `README.md` | Tento soubor. | člověk |

## Jak používat při tvorbě prototypu

**Single-file prototyp** (CSS i JS inline – preferováno kvůli Clarity): zkopíruj obsah `:root{…}` (a `[data-theme="dark"]` pokud řešíš dark) z `tokens.css` do `<style>` prototypu. Pak stav komponenty přes proměnné:

```css
.btn-primary{
  background: var(--color-interactive-primary);
  color: var(--color-interactive-on-primary);
  border-radius: var(--radius-md);
  padding: 0 var(--pad-2xl);
  height: 48px;                 /* sizing/buttonHeight */
}
.btn-primary:active{ background: var(--color-interactive-primary-action); }
```

```html
<h1 class="t-headings-title-secondary">Nadpis</h1>
<p class="t-content-body-primary">Text…</p>
```

**Rozdělený prototyp** (`index.html` + `styl.css`): linkuj staticky s verzí (kvůli cache + Clarity):
```html
<link rel="stylesheet" href="../../design-system/tokens.css?v=1">
<link rel="stylesheet" href="styl.css?v=1">
```
Při změně `tokens.css` zvedni `?v=`.

## Theming

Barvy mají 4 módy. Přepínáš atributem na `<html>`:

```html
<html data-theme="dark">          <!-- light | dark | light-hc | dark-hc -->
```
Bez atributu = light. Všechny `--color-*` se přepnou samy.

## Klíčové hodnoty (rychlý přehled)

- **Brand / akce:** `--color-interactive-primary` = `#e00000`
- **Font:** Inter (400 / 500 / 600)
- **Spacing:** 2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 px
- **Radius:** xs 2 · sm 4 · (segment 6) · md 8 · xl 16 · full 1024
- **Border:** sm 1 · md 2 · lg 3
- **Výška tlačítka:** 48 px
- **Stíny:** `--shadow-panel`, `--shadow-floating`, `--shadow-highlighted`

## Regenerace (když přijde nová Figma)

Tokeny jsou auto-generované. **Needituj `tokens.css`/`tokens.json` ručně.** Při nové verzi Figmy:

1. Ulož nové `.fig` do lokálního adresáře `../../Figma/` (mimo git).
2. Spusť pipeline (rozbalí `.fig` → zstd dekomprese → kiwi decode → extrakce variables/stylů → generátor tokenů). Skripty jsou u Claude; stačí říct „přegeneruj design systém z Figmy".
3. Zkontroluj diff `tokens.css`, zvedni `?v=` v prototypech které linkují CSS.

> `.fig` soubory se do gitu **nepushují** (jsou velké, lokální). Commituje se jen výstup (`tokens.*`, dokumentace).
