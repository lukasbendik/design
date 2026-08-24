---
id: kb-design-system-2026-0010
title: Navigation and structure components — Header, Navigation, Tab, Paginator, Segmented Control, Divider
type: component-spec
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
source_lang: en
lang_exception: "navigation destination names are quoted verbatim from Figma and are Czech"
valid_from: 2026-08-12
last_correction: "2026-08-12 (second pass) — CO Navigation was wrong in both sizes: the sm pill is 32 tall in a 48 slot with a 12/16 caption label, not a 48 button, and the lg panel is 252 wide on background/body with no border. Corrected against the built Savings screens and re-approved by @robert.puschel the same day."
review_by: 2027-08-12
sources:
  - "Figma variant matrices of CO Header / v4.0 iOS, Android, IB Ground, IB Flow, IB Dialog, IB Sheet, CO Navigation / 3.0, CO Tab / v5.0, CO Paginator / v1.0 IB, CO Segmented Control v3.2 and CO Divider / v3.0, file LF8w8yzyLqGKOJvZs1qApB, read via the Figma MCP connector on 2026-08-12"
  - "Figma component description of CO Navigation / 3.0 ('Main application navigation'), read 2026-08-12"
  - "Figma variant matrix of TMP Navigation, file dbNZdTD169mAZ39fNGlNUg, read 2026-08-12"
  - "Figma variables read from CO Segmented Control node 26320:190634 on 2026-08-12: borderRadius/segmentedControl/segmentRadius 6, background/surfaceHighlighted #ffffff, shadow/floating"
  - "CO Navigation / 3.0 at md-lg-Apple+lg-IB as instantiated at 52075:4599 in SCR NDB KB Sporeni Detail uctu / IB-LG (file 67HAfngTySwIA0PZKCUnN6, node 31589:24763): panel width, padding, item geometry and the eight destination icon names, read 2026-08-12"
  - "Pixel measurement of the sm pill row on a 1:1 render of SCR NDB Home screen - Spoření / MB-SM (file F457yhuR3zuIy5fdWEZrB6, node 4018:23865), 2026-08-12"
related: [kb-design-system-2026-0003, kb-design-system-2026-0008, kb-design-system-2026-0017]
tags: [components, navigation, information-architecture]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Navigation and structure components

**Summary:** The header and the main navigation are chosen by the screen's navigation style, not
by taste — see [`../patterns/navigation-styles.md`](../patterns/navigation-styles.md). Tabs,
paginator, segmented control and divider structure what is inside.

## CO Header — six components, one property in common

There is no single header component. Pick by platform and channel; every one of them exposes
`variant (PA Navigation Styles)`, and it must match the template's navigation style.

| Component | Sizes | Navigation styles | Uses |
|---|---|---|---|
| `CO Header / v4.0 iOS` | `responsive-iOS` | all 13, including the four Modal ones | 143 |
| `CO Header / v4.0 Android` | `responsive-Android` | 9, no Modal styles; adds `Show Bottom Zone`; **44 px compact, 96 px expanded, 48 px as a sheet** | 4 |
| `CO Header / v4.0 IB Ground` | `sm-md-IB`, `lg-IB` | `main page`, `subpage`, `New_main page`, `New_subpage` | 51 |
| `CO Header / v4.0 IB Flow` | `sm-md-IB`, `lg-IB` | `first or last step`, `step` | 30 |
| `CO Header / v4.0 IB Dialog` | `sm-IB`, `md-lg-IB` | `first or last step`, `step` | 33 |
| `CO Header / v4.0 IB Sheet` | `sm-IB`, `md-lg-IB` | title `Left`, `Center`, `No` | 3 |

**The IB ground header is two bands, not one bar.** At `lg-IB` it stacks a utility bar —
`Centrum KB+` with a notification badge, the subject switch (avatar plus `$customerName`),
`Nastavení`, `Odhlásit se` — above a title band holding `‹ $preScreenTitle` and `$title` in
`headings/titleTertiary` 28/36. At `sm-md-IB` the utility bar is gone and only the title band
remains. The `New_` variants add a row of labelled shortcut icons under the title. So the 48 px
figure in the layout pattern is the **iOS** header; budget more vertical space on IB.

**The header has no surface of its own.** Its ground is `background/body`, the same as the rest of
the screen — read out of `CO Header / v4.0 iOS` on three separate screens on 2026-08-12. A white
bar across the top is the most common mistake in a hand-built KB+ screen, and it is the reason this
sentence is here. The `CO Button Bar Bottom` at the other end of the screen behaves the same way:
`background/body` with the panel shadow, not a white tray.

The iOS header is a **44 px navigation zone with `padding/sm` 4 below it** — that is where the 48 px
comes from. The zone is inset `padding/xl` 16 on the leading edge and `padding/md` 8 on the
trailing edge, and its label is `content/bodySecondaryBold` 14/20 in `content/primary`. That label
is not the screen's title: a screen that needs a title puts a `CO Text Heading / v4.0 Page` in the
content, under the header.

Shared slots: `Title`, `PreScreenTitle`, an optional `ES Icon` action (`action = none · icon`).
The iOS and Android headers control title presentation with `$title = no · yes expanded ·
yes center · yes left`; *expanded* is the large title that collapses on scroll.

`CO Header / v4.0 IB Ground` also carries `CustomerName`, `Main navigation?` and `Subject switch?`
— the multi-subject switch for clients acting for a company.

**Deprecated variants:** `ground / ⚠︎entrance` (iOS, Android), `⚠︎entrance` (IB Ground),
`sheet / ⚠︎empty` (iOS). Note the asymmetry: Android's equivalent is called `sheet empty` with no
mark and is fine to use. The deprecation is iOS-only, so do not carry it across platforms. Prefer `New_main page` and `New_subpage` over the unprefixed IB Ground
variants for new screens.

## CO Navigation / 3.0 — main application navigation

`size = sm-iPhone+sm-md-IB+responsive-Android` · `md-lg-iPad+lg-IB`.
`state = Default · Loading`.

The two sizes are two different objects, and this is the detail most often got wrong:

- **`sm`** — a horizontally scrolling **row of pills** placed **under the header and above the
  content**, not at the bottom edge of the screen. Eight destinations do not fit in a bottom tab
  bar, which is why Golem does not use one.

  The pill is **32 px tall, not 48**: `padding/md` 8 above and below a `content/captionPrimaryBold`
  12/16 label, `padding/lg` 12 inline, a 1 px `border/sm` outline, `borderRadius/md` 8, and
  `padding/md` 8 to the next pill. The slot around it is 48 (8 + 32 + 8), which is where the 48 in
  the layout pattern comes from — that is the slot, not the pill. It carries **no icon**. In size
  and weight it is much closer to `CO Tag` than to `CO Button`, and building it button-sized is the
  most visible mistake on a hand-made KB+ ground screen. The current destination is filled
  `interactive/primary` with an `interactive/onPrimary` label.

  This geometry was measured on a 1:1 render of `SCR NDB Home screen - Spoření / MB-SM`, because
  the `Channels HS - Sporeni` library node would not resolve through the connector — weaker
  evidence than the rest of this file, and worth confirming against the component.
- **`md-lg`** — a side panel, **252 px** wide and full height, on `background/body` with **no
  surface, no border and no shadow**. `padding/xl` 16 on the leading edge, none on the trailing
  edge, 60 above the first destination and 30 below the KB mark, which is pinned at the bottom and
  inset 21. Each destination is a full-width row: `padding/lg` 12 by `padding/xl` 16,
  `borderRadius/md` 8, a 24 px icon and a `content/bodyPrimaryBold` 16/24 label 16 apart, rows 8
  apart; the current one is a filled `interactive/primary` row and its icon turns
  `interactive/onPrimary`. Measured on instance 52075:4599 in the IB-LG account detail.

  **The destination icons exist only here.** In order: `Home`, `ExtraServices`, `Card`, `PayMe`,
  `MoneyBox`, `BarChart`, `Insurance`, `Wallet` — one per destination, and the sm pill row shows
  none of them.

**A `Ground / Subpage` on a phone has no navigation at all** — see
[`../patterns/breakpoints-and-platforms.md`](../patterns/breakpoints-and-platforms.md). The pill
row is a `Ground / Main page` object; the side panel from lg is on both.

The destination vocabulary is fixed by `TMP Navigation`: `Přehled`, `Extra`, `Karty`, `Půjčky`,
`Spoření`, `Investice`, `Pojištění`, `Účty`. Adding a destination is a system change, not a screen
change.

There is exactly one published main-navigation component. An earlier extraction from the showcase
recorded both a `CO Navigation` and a `CO Navigation2` and could not say which was preferred;
in Figma the question does not arise.

## CO Tab / v5.0

`Variant = Static · Scrolls Left · Scrolls Right` · `№ of items = 2…10 · more` · `Loaded`.
The scroll variants show the overflow affordance — pick the one matching the scroll position, and
use `more` above ten items.

Tabs switch between sibling views of the same object. They never navigate to another screen; that
is `CO Item Navigation` or the main navigation.

## CO Paginator / v1.0 IB — 145 instances

`Variant = ProductPaginator · TablePaginator`, plus booleans for `Pages?`, `Info?`, `Dropdown?`,
`First&Last?` and the five page items. `✏️ Info` defaults to a real example, `30–40 z 200`.

Two components share this name in the library; the one with 145 instances is the live one.

## CO Segmented Control v3.2

`Items = 2 · 3` · `Selected = Label 1 · Label 2 · Label 3` · `s = responsive`. Two or three
options only — beyond three, use tabs.

The selected thumb is `background/surfaceHighlighted` on the floating shadow, with a 6 px radius
that is the system's one component-level radius exception.

## CO Divider / v3.0 — 387 instances, the most used component in the system

`s = responsive`. A **0.5 px** hairline of `background/divider` (`#adadad80`) — measured in the
component, not the 1 px `border/sm` you would assume. Inside a card or a listbox it is indented by
`padding/xl` 16 on the leading edge so it starts under the text, not under the icon.

A divider separates items in the same group. It is not a section break — that is a
`CO Text Heading / v4.0 Section`, and it is not padding.

## States

Header: no state property; the navigation style is the state. Navigation, Tab and Paginator have
loading forms. Segmented Control and Divider have none.

## Content limits

Not defined in Figma. Two practical constraints follow from the geometry: the navigation pills
carry eight destinations on a 375 px row that has to stay scannable while scrolling, so a
destination label is one short word; and a segmented control divides the content width by two or
three.

## Accessibility

- The header's back affordance is the only guaranteed way out of a Flow or Dialog on touch —
  never hide it and rely on a gesture. Android's back gestures are documented as a pattern
  (`✅ PA Native Back`), not as a substitute.
- Main navigation is a landmark: exactly one per screen, and only on `Ground` styles.
- Tabs need a visible selected state and keyboard arrow navigation; `Scrolls Left/Right` variants
  must not hide the selected tab.
- The 48 px minimum target applies to navigation destinations, tabs and paginator items.

## Do / don't

- Do keep the header's navigation style identical to the template's.
- Do use `New_` header variants on new IB screens.
- Do use a divider inside a group and a section heading between groups.
- Don't put main navigation on a Flow, Dialog or Sheet.
- Don't exceed three segments in a segmented control.
- Don't invent a navigation destination.

## Code

```css
.divider { height: var(--border-sm); background: var(--background-divider); }

.segment--selected {
  border-radius: 6px;                          /* documented exception */
  background: var(--background-surface-highlighted);
  box-shadow: var(--shadow-floating);
}
```

## Sources

- Variant matrices of the eleven components above, read from `💠 CORE Components` on 2026-08-12.
- `TMP Navigation` for the destination list.
- Token values read from the Segmented Control node itself.
- `CO Navigation / 3.0` at `md-lg-Apple+lg-IB` as built into the IB-LG savings account detail, for
  the panel geometry and the destination icons.
- A 1:1 render of the MB-SM savings homescreen, for the pill geometry.

## Open questions

- The sm pill geometry is measured off a render rather than read from the component, because the
  `Channels HS - Sporeni` library node does not resolve through the connector.
- Why do two `CO Paginator / v1.0 IB` components exist? One has 145 instances, the other none.
- The `New_` header variants have no description saying what changed.
- Golem has no breadcrumb component. Deep IB hierarchies are presumably handled by
  `PreScreenTitle`, but nothing says so.
