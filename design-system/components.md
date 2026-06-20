# Katalog komponent (CORE)

Komponenty z `💠 CORE Components.fig`. Při tvorbě prototypu **stav je z těchto komponent** + tokenů z `tokens.css`. Nevymýšlej nové – drž se tohoto a screenshotů v `Podklady/`.

Konvence názvů ve Figmě: `CO` = Core component, `ES` = Elements (ikony/ilustrace), `PA` = Payments, `🛠️`/`⚠︎` = WIP verze.

---

## Foundations → tokeny

| Co | Token(y) |
|---|---|
| Plocha / pozadí | `--color-background-body` (app pozadí), `--color-background-surface` (karty/panely), `--color-background-surface-highlighted` |
| Text | `--color-content-primary` (hlavní), `--color-content-secondary`, `--color-content-tertiary`, `--color-content-quaternary` (disabled) |
| Akce / brand | `--color-interactive-primary` (#e00000), `--color-interactive-primary-action` (pressed), `--color-interactive-on-primary` (text na brandu) |
| Sekundární akce | `--color-interactive-secondary`, `--color-interactive-secondary-action`, `--color-interactive-secondary-active` |
| Linky / okraje | `--color-background-border`, `--color-background-border-highlighted`, `--color-background-divider` |
| Stavy | `--color-attention-success` / `-alert` / `-information` / `-processing` (+ `*-surface` varianty pro pozadí) |
| Dialog | `--color-dialog-surface`, `--color-dialog-overlay` |
| Stíny | `--shadow-panel`, `--shadow-floating`, `--shadow-highlighted` |

Typografie: utility třídy `.t-*` (viz dole).

---

## Komponenty

### CO Button
- **Varianty:** Primary, Secondary, (FullWidth on/off), velikosti sm/md/lg.
- **Tokeny:** výška 48 px (md), `border-radius: var(--radius-md)`, padding horizontálně `var(--pad-2xl)`, text `.t-content-button` (500/16/24).
- Primary: bg `--color-interactive-primary`, text `--color-interactive-on-primary`, pressed `--color-interactive-primary-action`.
- Secondary: bg `--color-interactive-secondary-active` (jemná) nebo border `--color-background-border`, text `--color-content-primary`.
- Disabled: text `--color-content-quaternary`, bg ztlumené.

### CO Button Bar Bottom
- Sticky lišta dole s 1–2 tlačítky. Pozadí `--color-background-surface`, horní stín `--shadow-panel`, padding `--pad-xl`.

### CO Input / Input SuperField / Input Select / Input TextArea / Input Search Bar
- **Stavy:** Resting, Focus, Error, + Placeholder varianty (Focus/Error/FocusPlaceholder/ErrorFocus…). SuperField = float label.
- **Tokeny:** radius `--radius-md`, border `--border-sm` `--color-background-border`; focus border `--color-content-primary` nebo brand; error border + text `--color-attention-alert`; label `.t-content-caption-primary`, hodnota `.t-content-body-primary`.
- Search Bar = input s ikonou lupy vlevo, radius může být `--radius-xl`/`full`.

### CO Item Navigation (řádek s navigací)
- **Stavy:** Resting / Focus, leading ikona `24: ES Icon` nebo `32: Avatar/Flag`, trailing chevron, toggle On/Off, badge Success/Error.
- **Layout:** leading icon + (title `.t-content-body-primary` / subtitle `.t-content-body-secondary` v `--color-content-tertiary`) + trailing chevron `--color-content-tertiary`. Divider `--color-background-divider` dole. Padding `--pad-xl`.

### CO Item Transaction (řádek transakce)
- **Stavy:** Incoming / Outgoing / Done / Error / Waiting / Paused; 1–3 řádky (One/Two/Three); Resting / Select(Inactive).
- **Layout:** avatar/ikona vlevo, uprostřed název obchodníka (`.t-content-body-primary`) + datum/kategorie (`.t-content-body-secondary`, `--color-content-tertiary`), vpravo částka. Příchozí částka může být `--color-attention-success`, error `--color-attention-alert`.

### CO Item Display
- Read-only řádek label/hodnota (Value Horizontal / Vertical), volitelně leading ikona, volitelně akce. Label `--color-content-tertiary`, hodnota `--color-content-primary`.

### CO Item CheckBox
- Řádek s checkboxem (Normal / Consent), On/Off. Zaškrtnuto = `--color-interactive-primary`.

### CO Content Card
Obal pro skupiny obsahu. **Varianta určuje pozadí – nepleť si je:**

| Varianta | Pozadí | Stín | Border | Použití |
|---|---|---|---|---|
| **WrapPrimary** | `--color-background-surface` (#fff) | `--shadow-panel` | – | hlavní karta (účet, produkt) |
| **WrapSecondary** | **transparent / body** | **žádný** | `--border-sm` `--color-background-border` | podružná karta (souhrn, statistiky, skupinový obal) |
| **WrapHighlighted** | #fff | `--shadow-highlighted` | – | zvýrazněná/promo |

Společné: radius `--radius-xl`, padding `--pad-2xl`.

**Grouped widget pattern (home):** sekundární karta jako **obal**, uvnitř bílá primary subkarta. Např. „Tarif Komfort" = WrapSecondary obal → Tarif řádek nahoře → bílá `acctcard` (účty) uvnitř (margin 8). Souhrn/statistiky = samostatná WrapSecondary. Nedělej všechno jako bílou primary kartu.

### CO Tab (horní přepínač sekcí)
Vodorovný scrollovatelný řádek pilulek (Přehled/Extra/Karty…). Aktivní = `--color-interactive-primary` (bílý text), neaktivní = bílá s `--border-sm` `--color-background-border`, radius `--radius-full`, výška ~38, padding 0/16, font 15 (aktivní 500). Gap `--space-8`, vodorovný scroll.

### CO Header / CO Header Assisted
- Horní hlavička obrazovky: titul (`.t-headings-title-*`), volitelně back chevron vlevo a akce vpravo. Assisted = větší/kontextová varianta.

### CO Tag
- **Varianty:** Enabled / Inactive, s ikonou, Flag+Outline. Malý štítek: radius `--radius-full` nebo `--radius-sm`, text `.t-content-caption-primary`, padding `--pad-sm`/`--pad-md`. Barva dle významu (`attention/*`).

### CO Snackbar
- Toast dole: bg tmavá plocha, text světlý, radius `--radius-md`, stín `--shadow-floating`. Auto-dismiss.

### CO Paginator
- Tečky/indikátor stránek (carousel). Aktivní `--color-interactive-primary`, neaktivní `--color-background-border`.

### CO DigitPicker
- Numpad pro PIN/částku (Android / iOS / IB varianty).

### CO Chart (v4.0)
- **Typy:** Donut, PlotPortfolioValue, PlotFundPerformance, PlotTwoValues, PlotValueRange. Barvy řad: `--color-chart-*` (in/out/funds/bonds/stocks/cool/neon/evaluation/rusty-red).

### CO Product / CO Product Investment / CO Detail Transaction
- Složené bloky (produktová karta, detail transakce). Stav z výše uvedených atomů + tokenů.

### CO Icon / CO Icon Avatar / ES Icon / ES Illustration
- Ikony 16/24/32 px (`ES Icon`), avatar (`CO Icon Avatar`), ilustrace (`ES Illustration`). V prototypu nahraď inline SVG o stejném rozměru.
- **Vlajky/měnové ikony dělej věcně správně** (ne nahodile). ČR = bílá nahoře / červená dole + modrý trojúhelník zleva (`#fff`/`#d7141a`/`#11457e`), NE polská (bílo-červená vodorovně). EU = modrá `#039` se žlutými hvězdami. Měnový tag (`.curtag`) = vlajka v kolečku + částka na jednom řádku (`white-space:nowrap`), tagy vedle sebe v řádku.

---

## Typografické třídy (z `tokens.css`)

| Třída | weight / size / line |
|---|---|
| `.t-headings-title-primary` | 500 / 42 / 52 |
| `.t-headings-title-secondary` | 500 / 32 / 44 |
| `.t-headings-title-tertiary` | 500 / 28 / 36 |
| `.t-headings-title-quaternary` | 500 / 24 / 32 |
| `.t-headings-headline-primary` | 500 / 20 / 28 |
| `.t-headings-headline-secondary` | 500 / 18 / 24 |
| `.t-headings-headline-secondary-bold` | 600 / 18 / 24 |
| `.t-content-body-primary` | 400 / 16 / 24 |
| `.t-content-body-primary-bold` | 500 / 16 / 24 |
| `.t-content-button` | 500 / 16 / 24 |
| `.t-content-body-secondary` | 400 / 14 / 20 |
| `.t-content-body-secondary-bold` | 500 / 14 / 20 |
| `.t-content-caption-primary` | 400 / 12 / 16 |
| `.t-content-caption-primary-bold` | 500 / 12 / 16 |
| `.t-content-caption-secondary` | 400 / 10 / 16 |
| `.t-content-caption-secondary-bold` | 500 / 10 / 16 |
