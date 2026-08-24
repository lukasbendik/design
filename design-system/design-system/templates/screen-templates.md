---
id: kb-design-system-2026-0007
title: Screen templates (TMP) — what exists and what is retired
type: reference-data
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
source_lang: en
lang_exception: "variant option names are quoted verbatim from Figma and are partly Czech"
valid_from: 2026-08-12
review_by: 2027-08-12
sources:
  - "Figma library '💠 CORE Templates', file dbNZdTD169mAZ39fNGlNUg, index of all 47 published components with their full variant matrices, read via the Figma MCP connector on 2026-08-12"
  - "Figma component descriptions on the seven TMP SCR Layout sets ('Basic template for your … screen. 🚨Detach me! 🚨Rename me! (to SCR something)'), read 2026-08-12"
  - "Figma frame widths of the TMP SCR Layout sets, read 2026-08-12"
related: [kb-design-system-2026-0003, kb-design-system-2026-0004]
tags: [templates, layout, sales, product-detail]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Screen templates (TMP) — what exists and what is retired

**Summary:** `💠 CORE Templates` publishes 47 components: 36 usable, 10 deprecated, 1 private.
A template is a ready-made screen you detach, rename and fill — not a component you keep linked.
The complete machine-readable list with every variant is
[`inventory.json`](inventory.json); this file is the map and the warnings.

## How a template is used

Every `TMP SCR Layout` set carries the same instruction in its Figma description:

> Basic template for your mobile screen. 🚨Detach me! 🚨Rename me! (to SCR something)

So: place the template, detach the instance, rename it `SCR <what the screen is>`. A screen that
stays linked to a template will change under you when the template changes, and that is not what a
template is for. Components are the opposite — those stay linked.

## What is published

| Family | Templates | Use for |
|---|---|---|
| Layout (`TMP SCR`) | 7 breakpoint sets + 4 login sets | the frame of any screen — see [`../patterns/screen-layout.md`](../patterns/screen-layout.md) |
| Page content blocks | `TMP Page content blocks (Detach me)` | 23 block types for the content slot |
| Placeholders | `TMP Placeholder` | a slot that is not designed yet |
| Navigation | `TMP Navigation` | the main navigation bar, 8 destinations |
| AK Header | `TMP Header Assisted` | assisted (call-centre) channel header |
| Loading | `TMP Loading 1s-7s / Page`, `/ InLine` | waits of 1–7 s |
| Financial summary | `TMP Financial summary` | balance summary block, `Size` × `State` |
| Charts | `TMP Broker Overview`, `TMP Broker Detail`, `TMP Investment` | investment screens with time-period switches |
| Product detail | `TMP Product detail / IB`, `/ iOS` | product detail screen, `Breakpoint = SM/MD/LG` |
| Sales process | `/ sm-iOS`, `/ sm-IB`, `/ md-IB`, `/ lg-IB`, `/ Guidelines` | the offer-to-contract flow |
| Sales Summary | `TMP Sales Summary / IB`, `/ iOS` | the summary step, `Breakpoint = SM/MD/LG(/LG Wide)` |
| Table | `TMP Table` | table screen, `Type = Default/Expandable`, optional paginator |
| Withdrawal from the contract | `/ IB`, `/ iOS` | contract withdrawal |
| Call | `TMP Call` | call screen |
| Open In New | `TMP Open in New` | leaving the app, `co otevře = web/video` |
| Support | `TMP Support` | support screen |

`TMP Navigation` fixes the destination vocabulary: `Přehled`, `Extra`, `Karty`, `Půjčky`,
`Spoření`, `Investice`, `Pojištění`, `Účty`, in two sizes — `sm-Apple+sm-md-IB+responsive-Android`
and `md-lg-Apple+lg-IB`.

## Retired — do not use

| Template | Page | Replaced by |
|---|---|---|
| `_⚠TMP Empty State / SCR Empty Page` and its seven breakpoint siblings | `⚠ Empty State - deprecated` | not documented — see [`../patterns/states.md`](../patterns/states.md) |
| `_⚠TMP SCR Detail produktu` | `⚠ Product detail - deprecated` | `TMP Product detail / IB` and `/ iOS` |
| `_⚠TMP Sales Summary / MB-SM, MB-MD, MB-LG, IB-SM, IB-MD, IB-LG` | `⚠ Sales Summary - deprecated` | `TMP Sales Summary / iOS` and `/ IB` |
| `⚠ TMP Content Card with outside padding` | `⚠ Content Card with outside padding` | `CO Content Card / v6.x`, which owns its padding |
| `⚠ TMP Stack` | `⚠ Stack` | `CO Action Stack / v3.0` |

The Sales Summary and Product detail retirements share one shape: **a separate template per
breakpoint was replaced by one template with a `Breakpoint` variant property.** If you find a
design system component whose name ends in a breakpoint, check whether a variant-based successor
exists before copying it.

## Traps inside otherwise healthy templates

- `TMP SCR Layout / IB Web Small` still offers `Navigation Style = ⚠︎ Dialog / PDF document`.
- `⚠ TMP Content Card outside padding` offers `Card = ⚠PromoTargeted`, matching the deprecated
  `CO Content Card / v6.1`.
- `TMP Sales process / *` variant names contain `🔥 uprav:` (Czech for "edit:") — placeholder copy
  that must be replaced, for example
  `🔥 uprav: SCR NDB Nabídka - doplň název produktu`.
- The page `Support - PREDELAT DODELAT` ("rework, finish") is not marked deprecated but its own
  title says it is unfinished. Treat `TMP Support` as provisional.

## Sources

- The full published index of `💠 CORE Templates` with variant matrices, read on 2026-08-12; the
  tables above are a transcription, and `inventory.json` is the raw form.
- The `🚨Detach me!` instruction in the TMP SCR Layout descriptions.

## Open questions

- No template carries a version number the way components do, so there is no way to tell from the
  name whether a template has been revised.
- `TMP Support`'s page title says the template is unfinished; nobody has marked it.
- The template file's cover lists an `In page error block` category that has no published
  component; it may live on a page with local-only components.
