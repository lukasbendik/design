---
id: kb-design-system-2026-0017
title: Breakpoints and platforms — what actually changes, measured
type: pattern
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
source_lang: en
lang_exception: "screen and component names are quoted verbatim from Figma and are partly Czech"
valid_from: 2026-08-12
review_by: 2027-08-12
sources:
  - "Figma file 'Savings' (67HAfngTySwIA0PZKCUnN6), page '↳ 📄 Savings Account servicing': SCR NDB KB Sporeni Detail uctu MB-SM 4060:36395 and IB-LG 31589:24748, SCR NDB KB Sporeni Informace o uctu MB-SM 53899:54662 and IB-LG 31834:52651, SCR NDB BS Nastaveni sporiciho uctu MB-SM 46217:80397 — frame geometry read through the Figma MCP connector on 2026-08-12"
  - "Figma file 'Savings' (67HAfngTySwIA0PZKCUnN6), page '↳ 📄 Savings Adult activation': SCR NDB KB Sporeni Sjednejte si sporici ucet MB-SM 26671:8411 and IB-LG 26681:4793, including CO Button Bar Bottom instances 26671:4936 and 26681:4626, read 2026-08-12"
  - "Figma component CO Navigation / 3.0, variant md-lg-Apple+lg-IB, as instantiated at 52075:4599 in the IB-LG account detail — padding, item geometry, icon names and the KB mark, read 2026-08-12"
  - "Pixel measurement of the sm pill row on a 1:1 render of SCR NDB Home screen - Spoření / MB-SM (F457yhuR3zuIy5fdWEZrB6, 4018:23865), 2026-08-12 — see 'How the sm pill was measured' below"
related: [kb-design-system-2026-0003, kb-design-system-2026-0004, kb-design-system-2026-0007, kb-design-system-2026-0010]
tags: [layout, responsive, breakpoints, platform, mobile, desktop]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Breakpoints and platforms — what actually changes, measured

**Summary:** Golem designs on four canvas widths and three platforms, and the combination decides
more than size: the navigation becomes a different object, the content column changes width, the
button bar changes axis, the toolbar changes place, and one screen turns into a sheet. This file is
the measured version of those switches, taken off the built Savings screens rather than inferred
from the templates. Its code twin is
[`../prototype-kit/templates.css`](../prototype-kit/templates.css), and the two must agree.

[`../patterns/screen-layout.md`](screen-layout.md) says which slots a screen has;
[`navigation-styles.md`](navigation-styles.md) says which style a screen is. This says what those
two produce at each width, on each platform.

## The three platforms

`data-platform` in the prototype kit; `MB` / `IB` in Figma screen names.

| Platform | Figma prefix | Header | Way out of a dialog | Scrollbar |
|---|---|---|---|---|
| iOS app | `MB-SM`, `State=Default` | `CO Header / v4.0 iOS`, 48 | a text button, leading edge | never |
| Android app | `MB-SM`, `State=Android` | `CO Header / v4.0 Android`, 44 / 96 / 48 | ✗, leading edge | never |
| Browser (IB) | `IB-SM`, `IB-MD`, `IB-LG` | `CO Header / v4.0 IB *`; Ground is two bands, 96, at lg only | ✗, trailing edge | from lg only |

The platform is not the breakpoint. `MB-SM` and `IB-SM` are the same 375 px canvas drawn twice,
and the difference between them is only the header and the way out. That is why a screen is
designed as `MB-SM` + `IB-SM` + `IB-LG` and not as "mobile" and "desktop".

## What each canvas does

Measured on the savings account, which exists at MB-SM and IB-LG:

| | sm 375 | lg 1024 |
|---|---|---|
| Ground: navigation | pill row under the header, slot 48 | side panel **252**, full height |
| Ground: body | 375 | **772** = 1024 − 252 |
| Ground: header | 48 (iOS) | **96** (IB, two bands) |
| Ground: content | one column | main **452** + tools rail **320** |
| Flow, Dialog: content | 375, full bleed | one column **520**, centred |
| Button bar | buttons stacked, full width, bar 144 for two | one row, auto width, right-aligned, bar 80 |
| Toolbar | floating red pill over the content | static, first block of the tools rail, 304 × 76 |
| Settings list | a Sheet | a card in the tools rail |

`md` 768 and `lgWide` 1680 are published canvases with no Savings screen designed on them. The kit
treats md as the first width where a Flow or Dialog takes the 520 column and the button bar becomes
a row, and lgWide as lg with a wider main column. **Both are assumptions**, marked as such in
`templates.css`, and they are the open question at the end of this file.

## Ground at lg is three columns, not one

```
| 252 navigation | 452 main content | 320 tools |
```

The tools rail is where a phone's scattered affordances collect. On the savings account detail it
holds, in order: `CO Toolbar / v3.0 Static` (Vložit, Vybrat), the `Nová obálka` button, and the
settings card. On a phone those three are a floating toolbar, a button under the envelopes, and a
Sheet. Same screen, same information architecture, three different places — and that is the point
of designing per breakpoint instead of interpolating.

Two details that are easy to get wrong:

- **The static toolbar is still red.** "Static" means it stops floating and fills the rail; each
  item becomes a `borderRadius/md` button 76 tall. It does not become a white bar.
- **The panel has no surface.** `CO Navigation / 3.0` at `md-lg-Apple+lg-IB` sits on
  `background/body` with no border and no shadow. It is part of the page, not a card.

## Ground / Subpage drops the pill row on a phone

`SCR NDB KB Sporeni Detail uctu / MB-SM` has a header with `‹ Přehled` and then content — no pill
row. The same screen at IB-LG has the full side panel. So main navigation on a `Ground / Subpage`
is present from lg and absent below it; on a phone the back affordance is the whole navigation.

This corrects the flat "Main navigation: visible" reading of the Ground styles in
[`navigation-styles.md`](navigation-styles.md).

## The content column is what keeps text inside the screen

At lg a Flow or a Dialog is **not** full width. `SCR NDB KB Sporeni Sjednejte si sporici ucet /
IB-LG` puts its whole content — header included — in a 520 px frame at x = 252 of 1024, which is
dead centre. Everything inside it keeps exactly the insets it had at sm: the heading and the
paragraph are inset `padding/xl` 16, cards are inset 16, the illustration is full-bleed to the
column.

So the 375 → 1024 change is one number: the column goes from 375 to 520. Nothing inside re-lays
itself out. A heading that stretches to the window edge at lg is a screen that set its own width
instead of sitting in the column.

## The button bar has two forms and the width picks one

Measured on the same screen at both widths:

| | sm (26671:4936) | lg (26681:4626) |
|---|---|---|
| Bar | 375 × 144 | 1024 × 80 |
| Buttons | 343 wide, stacked, 16 apart, 16 inset | natural width, one row, 16 apart |
| Alignment | full width | right-aligned, ending 16 before the column's trailing edge |
| Order | primary on top | primary leads the row |

The bar spans the whole screen at lg; the **row inside it** spans the content column. That is why
the buttons line up with the content above them rather than with the window.

## The same content, in two places

Some blocks do not resize between breakpoints — they move. CSS cannot move a node between two
parents, so a prototype has to carry this out in script; the rule still belongs to the template.

| Block | Below lg | From lg |
|---|---|---|
| Account settings list | Sheet, opened from `Detail a správa účtu` | card in the tools rail |
| `CO Toolbar` | floating over the content | first block of the tools rail |
| `Nová obálka` | under the envelopes | second block of the tools rail |
| Second card column on `O účtu` | continues the single stack | the side column |

## How the sm pill was measured

The sm navigation pill is the most-often-wrong object on a KB+ ground screen, and it is smaller
than people expect — closer to `CO Tag` than to `CO Button`.

The Figma connector would not resolve the `Channels HS - Sporeni` library node, so the pill was
measured off a 1:1 render of `SCR NDB Home screen - Spoření / MB-SM` instead: the screen is 283
render px for 375 design px, giving a scale of 0.7547, and the pill borders were read at that
scale. Pill height 24 render → **32**; gap 6 render → **8**; leading inset 11.5 render → **16**;
label widths back-solve to 12 px Inter Medium with **12** px inline padding on each side.

| | value | token |
|---|---|---|
| Slot height | 48 | `padding/md` 8 + pill 32 + `padding/md` 8 |
| Pill height | 32 | |
| Pill padding | 8 / 12 | `padding/md`, `padding/lg` |
| Gap between pills | 8 | `padding/md` |
| Radius | 8 | `borderRadius/md` |
| Border | 1 | `border/sm` |
| Label | 12/16 | `content/captionPrimaryBold` |
| Icons | none at sm | drawn in the side panel only |

Evidence for this row is a measured render rather than a read node, so it is weaker than the rest
of this file. Confirm it against the component before anyone builds it in production.

## Do / don't

- Do design a screen once per breakpoint you support, per platform that differs. Three artboards
  (`MB-SM`, `IB-SM`, `IB-LG`) is the norm in the Savings file, not an excess.
- Do let the template own the column width. A screen sets slots, never widths.
- Do check both the phone and lg for anything you add to a Ground screen: it probably has a
  different home in the tools rail.
- Don't put the pill row on a subpage on a phone.
- Don't stretch a button to the full width of a wide window. Full width is the sm form.
- Don't turn the static toolbar white.

## Sources

- Frame geometry of the eight Savings screens listed in the front matter, read on 2026-08-12.
- `CO Navigation / 3.0` at `md-lg-Apple+lg-IB` for the panel; a 1:1 render for the sm pill.

## Open questions

- **md 768 is not designed.** No Savings screen exists at md, so the exact md forms of the button
  bar, the navigation and the Flow column are unverified. The kit assumes md behaves like lg minus
  the side panel.
- **lgWide 1680 is not designed either.** Whether the main column keeps growing, the rail widens,
  or a third column appears is unknown.
- **iPad.** `md-lg-iPad` shares the side-panel navigation with `lg-IB`, but no iPad screen was
  measured; whether an iPad Ground screen also gets a tools rail is unknown.
- The sm pill geometry is measured from a render, not read from the component.
