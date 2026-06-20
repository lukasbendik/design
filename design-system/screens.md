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

Klíč: **Header (48) a Bottom Bar (80) jsou mimo scroll** (sticky), obsah má **horizontální padding 16**, mezi bloky **gap 16**.

### ⚠️ Scrollování: stránka scrolluje, obsah je HUG (DŮLEŽITÉ)

**Nepoužívej fixní výšku obrazovky s vnitřním `overflow:auto` na contentu** – na reálném mobilu se to rozbije (obsah se ořízne, nejde scrollovat). Místo toho:

- **Obsah je hug** (přirozená výška, roste s obsahem), **scrolluje celá stránka** (na mobilu dokument, na desktopu rámeček telefonu).
- Header = `position:sticky; top:0`. Bottom bar / floating toolbar = `position:sticky; bottom:0`. Drží na místě, zbytek scrolluje pod nimi.
- Obrazovka má `min-height:100dvh` → vyplní aspoň výšku okna (tlačítko dole i u krátkého obsahu), ale **smí přerůst** a pak scrolluje stránka.

```css
/* MOBIL: scrolluje dokument. DESKTOP: scrolluje rámeček telefonu. */
.phone{width:100%;max-width:390px;margin:0 auto;background:var(--color-background-body);}
@media(min-width:480px){
  body{display:flex;justify-content:center;padding:24px;}
  .phone{height:min(844px,calc(100dvh - 48px));overflow-y:auto;border-radius:40px;}
}
.screen{display:none;}
.screen.active{display:flex;flex-direction:column;min-height:100dvh;}   /* hug, ale aspoň přes okno */
@media(min-width:480px){ .screen.active{min-height:100%;} }              /* fill rámečku */

.hdr{position:sticky;top:0;z-index:10;flex:0 0 auto;}                    /* sticky header */
.content{flex:1 0 auto;display:flex;flex-direction:column;
         gap:var(--space-16);padding:var(--space-16);}                  /* HUG – žádný overflow:auto! */
.bottombar{position:sticky;bottom:0;z-index:10;flex:0 0 auto;padding:var(--pad-xl);}
.toolbar{position:sticky;bottom:16px;align-self:center;margin-top:auto;} /* floating toolbar (home) */
```

Tím page scrolluje nativně (i pull-to-refresh, adresní lišta se schovává), `100dvh` řeší mobilní viewport, a sticky prvky drží. Ověřeno na mobilním viewportu 375×812.

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

### C) Homescreen / Přehled (`SCR NDB Home screen`)
Reálná home je **série „widgetů", každý = `CO Content Card`** (bg=surface, radius=xl, shadow-panel), uvnitř konkrétní komponenty. NESkládej z holých řádků – každý blok je Content Card obalující item/product komponentu:
```
Header 48 · [Notification] · [Navigation] · spacer16
Content (col gap16, pad horiz. 16):
├─ Tariff badge widget   = CO Content Card  →  CO Item Navigation  (tarif + caret, kompakt ~56)
├─ Main product widget   = CO Content Card  →  CO Product AccountCurrent ×N  (název/číslo/zůstatek
│                                              + měnové tagy)  [+ CO Item Transaction list]
├─ Next accounts widget  = CO Content Card  →  CO Product AccountCurrent  (Spoření…)
└─ Summary widget        = CO Content Card  →  graf příjmy/výdaje
Floating: CO Toolbar (Nová platba / QR / Zaplať mi)  – sticky bottom
```
Pozor: „Tarif" NENÍ generický řádek – je to **Tariff badge widget (CO Content Card + CO Item Navigation)**. Účet NENÍ ad-hoc div – je to **CO Product AccountCurrent**. Vždy si vytáhni konkrétní widget z outline (`grep -A8 "Home screen" _work/outline-patterns.txt`) a obal ho do Content Card.

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
