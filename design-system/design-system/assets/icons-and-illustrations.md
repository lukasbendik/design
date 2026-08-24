---
id: kb-design-system-2026-0016
title: Icons, subicons, illustrations and brand marks
type: reference-data
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
valid_from: 2026-08-12
last_correction: "2026-08-12 — corrected against the Figma savings screens (offer, interest, result, savings homescreen, account detail); re-approved by @robert.puschel the same day"
review_by: 2027-08-12
sources:
  - "Figma library '💠 ES Icon', file QOUtQjwwGQvhuJv4kUbSTm, index of all 364 published components read via the Figma MCP connector on 2026-08-12"
  - "Figma library '💠 ES Illustration', file R240iYyZkmWZHsVvYLyjDp, index of all 1070 published components read 2026-08-12"
  - "Figma library '💠 ES Essentials', file xOURtHkYRN70tbZdQPWlw2, index of 50 published components (ES Brand, ES SubIcon, ES Interaction Icon) read 2026-08-12"
  - "Figma frame sizes of ES Illustration / AccountGeneralS (125×96, dark-mode twin) and AccountGeneralM (375×212, dark-mode twin), read 2026-08-12"
related: [kb-design-system-2026-0013, kb-design-system-2026-0001]
tags: [icons, illustrations, assets, brand]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Icons, subicons, illustrations and brand marks

**Summary:** Four separate asset libraries, four different naming rules, and one rule that applies
to all of them: never draw a new one. The complete lists are
[`icon-inventory.json`](icon-inventory.json) and
[`illustration-inventory.json`](illustration-inventory.json).

## The files themselves

This file is the map; [`README.md`](README.md) in this folder is the shelf. `icons/`,
`illustrations/` and `fonts/` hold the assets a prototype or a specification can actually use,
each with the node id it was exported from, so nothing is downloaded per deliverable and two
outputs cannot carry different copies of the same glyph.

Two mechanical edits are applied on the way in, and both matter: Figma exports a component's frame
fill as a `#E5E5E5` rectangle behind the glyph, and the glyph's `fill` is black. The rectangle is
removed and the fill becomes `currentColor` — without that an icon cannot take the colour of the
row it sits in, which is how the red icons on KB+ screens are drawn.

Illustrations are stored as the transparent artwork rather than as a frame export, because
exporting the frame bakes in the canvas fill and the illustration then arrives with a grey band
around it.

## ES Icon — 364 components

The general-purpose UI icon set. `PascalCase` names with no prefix: `Card`, `ATMDeposit`,
`BatchPayment`, `Chatbot`, `Wallet`. Drawn at 24 px; list items use `Left Icon size = 24: ES Icon`
and 32 px is reserved for avatars and flags.

| Page | Count | What it is |
|---|---|---|
| `ES Icon` | 341 | the UI icon set |
| `MapPin` | 15 | branch and ATM map markers, `Variant = MapIconBranch · MapIconAtm · MapIconAtmDeposit · …MinTwoHundred · …MinFiveHundred` |
| `Android Adaptive Icons for Shortcuts` | 8 | launcher assets, not UI |

One deprecated icon: `⚠︎Placeholder`. Eleven private `_`-prefixed helpers.

Icons arrive in components through an `ES Icon` instance-swap property — `CO Button`,
`CO Item Display`, `CO Item Navigation`, `CO Action Stack`, `CO Toolbar` and the headers all have
one. Swap the instance; never paste a vector.

## ES SubIcon — the badge on an icon

14 px on a 24 px icon, 28 px on a 32 px avatar. Fourteen meanings, and they are the system's
answer to "how do I show state without colour":

`Blocked` · `CardCanceled` · `Done` · `Inbound` · `Info` · `LockClosed` · `Locked` · `Outbound` ·
`Paused` · `Recurring` · `Search` · `Stopwatch` · `Waiting` · `Warning`

Some carry a `dark = no · yes` variant. `⚠︎Placeholder` and `⚠︎Edit` are deprecated.

## ES Interaction Icon — 21 fixed-meaning icons

Not free choice: these are the affordances the system draws for you — `close`, `closeSheet`,
`arrowLeft`, `caretUp/Down/Left/Right/First/Last`, `checkOn/Off/Intermediate`, `radioOn/Off`,
`home`, `sidebarLeft`, `Search`, `searchAndroid`, `locationPin`, `dragLines`, `OpenInNew`.
Named `ES Interaction Image / <name>`. If a component already draws one of these, do not replace
it with an `ES Icon` of the same shape.

## ES Illustration — 1070 components, 246 motifs

Naming: `ES Illustration / <Motif><Size>`, where size is `S` or `M`.

| Size | Frame | Dark mode | Use |
|---|---|---|---|
| `S` | 125 × 96 | `Dark mode = No · Yes` | promo cards — the Content Card description pins this exactly |
| `M` | 375 × 212 | `Dark mode = No · Yes` | full-screen empty, error and result states |

| Page | Count | Status |
|---|---|---|
| `Standard Sizes` | 494 | the set to use — 244 `S` + 244 `M` |
| `Sources` | 510 | master artwork, `_`-prefixed, never place |
| `Special Sizes` | 60 | one-offs: `SplashScreen`, `Spinner`, `QRPay`, `IDScanOK/NOK/Wait`, `LogotypeKB`, `InvestmentHorizonChartCZ/EN`, and several marked `⚠︎` |
| `Export` | 6 | production leftovers |

35 illustrations are deprecated and 4 are `_TEST`. The Czech and English pairs in Special Sizes
(`QRscanHelp` / `QRscanHelpEN`, `CreditCardGracePeriod` / `…EN`) mean an illustration can contain
text — check the language before placing one.

Motifs cover the product domain closely: `AccountChildren6To15`, `AuthorizationCronto`,
`BuildingSavingsOffer`, `2in1Mortgage`, `SustainabilityWindmill`. Search the inventory before
concluding that something is missing.

## ES Brand

`ES Brand` with `Brand = KB Logotype · KB Logo` and `Dark = no · yes`, plus separate marks for
sub-brands: `Logo KB Dokumenty`, `Logo KB Texter`, `Logo KB Leon`, `Logo KB Webinar`,
`Logo KB Operace Kartago`, `Logo Nadace KB Nablizku`, `Logo SGEF`. Each has a dark variant.
`_Logo KB Otevřené bankovnictví` is private.

## Libraries this ingest did not read

Four more asset libraries are subscribed to the CORE files and were not indexed:
`💠 ES Icon Flag` (country flags, used at 32 px in list items), `💠 ES Icon App` (app icons),
`💠 ES Merchant Logo` (merchant marks on transactions) and `💠 ES News Illustration`.

## Do / don't

- Do swap the instance in a component's icon property.
- Do use `S` illustrations in promo cards and `M` in full-screen states.
- Do check for a dark-mode twin before shipping a dark screen.
- Don't place a `Sources` illustration; it is the master, not the asset.
- Don't draw a new icon. If nothing fits, that is a system gap worth raising.
- Don't use an illustration with baked-in text in the wrong language.

## Sources

- Full published indexes of `💠 ES Icon` (364), `💠 ES Illustration` (1070) and `💠 ES Essentials`
  (50), read through the Figma MCP connector on 2026-08-12.
- Frame sizes measured on `ES Illustration / AccountGeneralS` and `…M`.

## Open questions

- Illustration motifs have no tags, so finding "the right picture for a savings goal" means
  reading 246 names.
- `Special Sizes` mixes live assets with `⚠︎` ones on the same page; the page itself is not marked.
- Icon licensing and export formats for non-Figma consumers are not documented.
