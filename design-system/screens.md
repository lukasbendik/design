# Anatomie obrazovek (jak se z komponent staví screeny)

Odvozeno z `Examples.fig`, `💠 CORE Templates.fig`, `💠 CORE Patterns.fig` (1200+ reálných obrazovek). Cíl: stavět **celé obrazovky věrně** – stejný scaffold, stejné rozměry, stejné skládání komponent.

Tokeny → `tokens.css`. Komponenty → `components.md`. Tady = **kompozice**.

---

## 1. Mobilní scaffold (kostra každé obrazovky)

Standardní app obrazovka = svislý stack `375×812` (iPhone), pozadí `--color-background-body` (`#f8f8f8`):

```
FRAME (root) 375×812  bg=body, [col]
├─ CO Header            375×48      ← horní lišta (back/title/akce), bg=body
├─ [CO Item Navigation] 375×48–67   ← volitelně: výběr účtu / segment / akce
├─ Content              375×…  [col gap16, pad horizontálně 16]  ← scrollovatelný obsah
│   └─ … karty / sekce / listy …
└─ [sticky dole]        375×80      ← CO Button Bar Bottom NEBO CO Toolbar Floating
```

Klíč: **Header (48) a Bottom Bar (80) jsou mimo scroll** (sticky), uprostřed scrollovatelný `Content`. Obsah má **horizontální padding 16**, mezi bloky **gap 16**.

### HTML kostra

```html
<div class="screen">                      <!-- 100dvh, flex column, bg body -->
  <header class="app-header">…</header>     <!-- výška 48, sticky top -->
  <main class="content">…</main>            <!-- flex:1, overflow-y:auto, padding:16 -->
  <div class="bottom-bar">…</div>           <!-- výška 80, sticky bottom -->
</div>
```
```css
.screen{display:flex;flex-direction:column;min-height:100dvh;background:var(--color-background-body)}
.app-header{height:48px;flex:0 0 auto;background:var(--color-background-body);display:flex;align-items:center;padding:0 var(--pad-xl)}
.content{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:var(--space-16);padding:var(--space-16)}
.bottom-bar{flex:0 0 auto;padding:var(--pad-xl);background:var(--color-background-body)} /* tlačítko 48 + padding */
```

---

## 2. Auto-layout → CSS (Figma stack = flexbox)

Ve výpisech komponent zápis `[dir gapN padT/R/B/L j:JUSTIFY a:ALIGN]`. Mapování 1:1 na flex:

| Figma | CSS |
|---|---|
| `row` / `col` | `flex-direction: row / column` |
| `gapN` | `gap: Npx` |
| `padT/R/B/L` | `padding: T R B L` |
| `j:MIN/CENTER/MAX/SPACE_BETWEEN` (primary) | `justify-content: flex-start/center/flex-end/space-between` |
| `a:MIN/CENTER/MAX/BASELINE` (counter) | `align-items: flex-start/center/flex-end/baseline` |
| `rN` | `border-radius: Npx` |

Vše je flex. Komponenta nemá fixní výšku z hlavy – roste obsahem (hug), proto v HTML preferuj `flex` + padding, ne pevné `height` (výjimka: Header 48, řádky 48–70, tlačítko 48).

---

## 3. Konvence rozměrů (z reálných screenů)

| Prvek | Hodnota |
|---|---|
| Šířka obsahu | 375 (mobil), karta uvnitř 343 (= 375 − 2×16) |
| Header | výška 48 |
| Bottom Button Bar | výška 80, padding 16 |
| Tlačítko | výška 48 |
| Řádek (Item Navigation / Display) | 48–67, padding 16, gap 8, radius 8 |
| Řádek transakce (Item Transaction) | 70, padding 16, gap 16 |
| Divider | výška 1, padding horizontálně 16 (= odsazený od kraje) |
| Input (Basic) | 60, SuperField 92, padding 8/12, radius 8 |
| InLine Message | padding 12/16, gap 16 |
| Padding obsahu | 16 horizontálně; gap mezi bloky 16 |

---

## 4. Recepty obrazovek

### A) Detail účtu (list transakcí)
```
FRAME root 375×812 bg=body [col]
├─ CO Header v4.0                        48
├─ CO Product DetailAccountCurrent  [col gap24 pad16] bg=surface   ← hlavička produktu
├─ CO Item Navigation               [row gap8 pad16] r8            ← akční řádek
├─ spacer 16
└─ CO Content Card (bg=surface) [col]                              ← KARTA = list
   ├─ CO Text Heading Section       [row pad16]                    ← nadpis sekce
   ├─ CO Divider                    1  [pad0/16]
   ├─ CO Item Transaction           70 [row gap16 pad16] r8        ┐
   ├─ CO Divider                    1  [pad0/16]                   │ opakuj
   ├─ CO Item Transaction           70 …                          ┘ Item + Divider
   └─ …
```
**Vzor listu:** karta `--color-background-surface` → `Heading` → opakované `Item + Divider`. Divider odsazený 16 od krajů, mezi posledním item už ne.

### B) Nová platba (formulář)
```
FRAME root 375×812 bg=body [col]
├─ content [col]
│  ├─ CO Header v4.0                      48
│  ├─ CO Item Navigation (výběr účtu)     67 [pad16] r8
│  ├─ Wrap-Form [col, pad0/16]                                   ← formulář, jen horiz. padding
│  │  ├─ CO Input SuperField            92
│  │  ├─ CO Input Basic                 60  [pad8/12 r8, border #adadad]
│  │  └─ row [gap8]: CO Input Basic + CO Input Select            ← částka + měna vedle sebe
│  └─ InLineMessages [col gap16]
│     └─ CO InLine Message  [row gap16 pad12/16]  bg=#ffede8(error)/#ededed(info)
└─ CO Button Bar Bottom   80 [pad16] bg=body  (sticky)           ← primární akce mimo scroll
```
**Vzor formuláře:** inputy ve `Wrap-Form` (col, horiz. padding 16), související pole v `row gap8` (částka+měna), validace/hinty jako InLine Message pod nimi, primární tlačítko ve sticky Button Bar dole.

### C) Homescreen (produktové karty)
```
FRAME root [col gap16, pad16]
└─ opakované CO Product … / CO Content Card  (každá karta bg=surface, radius=xl, shadow-panel)
```
Vertikální seznam produktových/obsahových karet, gap 16.

### D) Empty / Error / Result stavy
Viz Patterns sekce „PA Empty States", „PA Error and Result States": centrovaný `ES Illustration` + nadpis (`.t-headings-headline-primary`) + popis (`.t-content-body-secondary`, `--color-content-tertiary`) + akce (CO Button). Obsah svisle centrovaný (`justify-content:center`).

---

## 5. Datové placeholdery

V šablonách jsou texty jako `$name`, `$accNum`, `$overdraft`, `$owner`, `$amount`. Konvence `$klíč` = bindovaná hodnota. V prototypu nahraď reálným/mock textem a (per CLAUDE.md) persistuj do `localStorage`.

---

## 6. Katalog vzorů (Patterns)

`💠 CORE Patterns.fig` má 128 pojmenovaných sekcí = katalog UX vzorů, mj.:
`PA Screen Layout`, `PA Grid and breakpoints`, `PA Empty States`, `PA Error and Result States`, `Forms`, `PA Search and Suggestions`, `PA Select Subject/Digit`, `PA Messages in Context`, `PA Dark`, `PA Accessibility`, `PA Date and time`, `PA Signing RAS`, `PA Keyboard Opening`, `PA Product Variants Comparison`, payments / accounts / cards / channels / migration / consents.

Plné stromy všech 1200+ obrazovek jsou lokálně v `Figma/_pipeline/_work/outline-{examples,templates,patterns}.txt` (mimo git). Když potřebuju konkrétní obrazovku věrně, řekni „najdi v outline …" a vytáhnu přesný strom.

> Convention prefixů: `CO` = Core komponenta, `TMP`/`AUX` = pomocné/placeholder, `_MASTER`/`SCR` = celá obrazovka, `$x` = data, `❄`/`⚠` = WIP.
