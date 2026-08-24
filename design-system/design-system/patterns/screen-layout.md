---
id: kb-design-system-2026-0004
title: Screen layout and responsive behaviour
type: pattern
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
valid_from: 2026-08-12
review_by: 2027-08-12
sources:
  - "Figma frame widths and slot geometry of TMP SCR Layout / iOS App variant 'Ground / Main page' (node 289:37762) and of all seven TMP SCR Layout breakpoint sets, file dbNZdTD169mAZ39fNGlNUg, read 2026-08-12"
  - "Figma component set TMP Page content blocks (Detach me), node 30463:69565, 23 block types and 4 content slots, read 2026-08-12"
  - "Figma component set TMP Placeholder, node 5:57665, layout variants, read 2026-08-12"
  - "Figma variables padding/*, border/*, sizing/* read from CO Button, CO Item Display and CO Table nodes in file LF8w8yzyLqGKOJvZs1qApB on 2026-08-12"
related: [kb-design-system-2026-0003, kb-design-system-2026-0007, kb-design-system-2026-0017]
last_correction: "2026-08-12 — the lg content geometry was measured on the built Savings screens and turned out to be three columns, not one; the responsive table and the toolbar row were corrected. Re-approved by @robert.puschel the same day."
tags: [layout, responsive, mobile, desktop]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Screen layout and responsive behaviour

**Summary:** Every Golem screen is the same five stacked slots inside a screen wrap. Responsive
behaviour is not fluid: the design switches template at four fixed widths, and the slots change
count and inset rather than stretching. Build screens by filling slots, not by positioning.

## The four widths

| Breakpoint | Design canvas | Devices |
|---|---|---|
| `sm` | 375 × 812 | phone app (iOS, Android), small web window |
| `md` | 768 × 1024 | tablet portrait, medium web window |
| `lg` | 1024 × 768 | tablet landscape, desktop web |
| `lgWide` | 1680 × 1024 | wide desktop web |

These are the canvas widths Golem designs on, taken from the template frames themselves. They are
not published as CSS media-query cut-offs; confirm the exact code values with the front-end owner
before hard-coding them. Values are in [`../tokens/breakpoint.tokens.json`](../tokens/breakpoint.tokens.json).

## The slots

Measured on `TMP SCR Layout / iOS App`, `Navigation Style = Ground / Main page`, 375 × 812:

| Order | Slot | Height at sm | Optional? | Component |
|---|---|---|---|---|
| 1 | Header | 48 **on iOS** — the IB ground header is two bands and taller | no | `CO Header` for the platform and navigation style |
| 2 | Communication centre | 130 | yes, Ground / Main page only | `CO Content Card / v6.0 NotificationCard`, inset 16 |
| 3 | Navigation | 48 | Ground styles only | `CO Navigation / 3.0`, **above the content, not at the bottom edge** |
| 4 | Content | fills | no | promo slot, main slot, side slot |
| 5 | Floating toolbar | 76, overlaid at the bottom | yes | `CO Toolbar / v3.0 Floating`, centred, 264 wide at sm — a **red pill**, not a white bar |

The content area is three sub-slots, and they do not share an inset:

- **promo** — full-bleed to the screen edge (375 at sm). Promo cards manage their own padding.
- **main** — full-bleed (375). Page content blocks manage their own padding.
- **side** — inset by `padding/xl` (16) on both sides, so 343 at sm.

The 16 px side inset is the standard screen padding at every breakpoint. It does not grow with the
screen; the content column does.

## What changes between breakpoints

| | sm | md | lg / lgWide |
|---|---|---|---|
| Main navigation | scrolling pill row under the header, 32 px pills | same pill row | side panel **252 wide**, with the KB mark at the bottom |
| Content columns | 1 | 1 wide | main **452** plus a **320** tools rail; up to 3 with `2 column card content LG` / `3 column card content LG` |
| Button bar | buttons stacked full width, bar 144 for two | one row | one row inside the content column, buttons at their natural width, right-aligned, bar 80 |
| Toolbar | floating red pill | floating | `CO Toolbar / v3.0 Static` — it moves into the tools rail and **stays red**; static means placed, not restyled |
| Dialog and Flow | full screen 375 | narrow column | Narrow **520 centred**, or Wide |
| Scrollbar | none | none | browser only, explicit scrollbar slot in the template; an app never shows one |

Everything else — type scale, spacing, radius — is identical across breakpoints. Golem essentials
are not responsive by design.

The numbers above were measured on built screens, not read off the templates; the measurements,
the platform differences and the blocks that change parent rather than size are in
[`breakpoints-and-platforms.md`](breakpoints-and-platforms.md), whose code twin is
[`../prototype-kit/templates.css`](../prototype-kit/templates.css).

## Filling the content area

`TMP Page content blocks (Detach me)` is a component set with four content slots and 23 block
types. Use it as the vocabulary for what may sit in the main slot:

`Items` · `Items in cards` · `Items + dividers` · `Items + dividers in cards` · `Inputs` ·
`Inputs in cards` · `Text` · `Text + items in cards` · `Inline message S` · `Inline message MD-LG` ·
`Action stack pile S` · `Action stack pile MD-LG` · `Action stack row` · `Segmented control` ·
`Button` · `Tabs` · `Tags` · `Promo cards` · `Combined content in card` · `Empty cards` ·
`Products in cards` · `2 column card content LG` · `3 column card content LG`

Two of these are breakpoint-specific by name: the `S` and `MD-LG` pairs exist because an inline
message and an action stack change layout, not just size, above `sm`.

`TMP Placeholder` fills a slot that is not designed yet: `Placeholder`, `Vertical list layout`,
`2 Columns layout LG`, `3 Columns layout LG`, `Icon`, `Slot placeholder`. A placeholder in a
handoff is a defect; a placeholder in a work-in-progress file is fine.

## Do / don't

- Do start from `TMP SCR Layout` for the target breakpoint, then detach and rename it to `SCR …`.
  The templates say so in their own descriptions: *🚨Detach me! 🚨Rename me!*
- Do keep the slot order. Header, communication centre, navigation, content, toolbar — nothing is
  reordered, only omitted.
- Do design the same screen once per breakpoint you support. Do not interpolate.
- Don't put the communication centre on anything but a `Ground / Main page`.
- Don't inset the promo or main slots by hand; only the side slot is inset at the layout level.
- Don't use a spacer component for gaps. `ES Spacing` is deprecated — use auto-layout gaps with
  the `padding/*` scale.

## Sources

- Slot geometry read directly from `TMP SCR Layout / iOS App`, variant `Ground / Main page`
  (Figma node 289:37762): header 48, communication centre 130, navigation 48, content 586,
  toolbar 264 × 76.
- Canvas widths from the seven breakpoint template sets in `💠 CORE Templates`.
- Block vocabulary from `TMP Page content blocks (Detach me)` and `TMP Placeholder`.

## Open questions

- Exact CSS breakpoint cut-offs are not published in Figma.
- The `TMP SCR Layout / IB Web Large wide` set is 1680 wide, but whether the content column is
  capped or continues to grow beyond 1680 is not documented.
- Safe-area and status-bar handling on iOS is inside the header component and was not measured.
