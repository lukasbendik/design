---
id: kb-design-system-2026-0008
title: CO component catalogue — what exists and how to choose
type: reference-data
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
valid_from: 2026-08-12
review_by: 2027-08-12
sources:
  - "Figma library '💠 CORE Components', file LF8w8yzyLqGKOJvZs1qApB, index of all 150 published components with exhaustive variant options, defaults and instance counts, read via the Figma MCP connector on 2026-08-12"
  - "Figma component descriptions for CO Button, CO Action Stack, CO Button Bar Bottom, CO Button Bar Dynamic, CO Toolbar Static, CO Header iOS, CO InLine Message, CO Content Card, CO Item Display, CO Navigation, CO Detail Transaction and CO InputDatePicker, read 2026-08-12"
related: [kb-design-system-2026-0001, kb-design-system-2026-0002]
tags: [components, catalogue]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# CO component catalogue — what exists and how to choose

**Summary:** `💠 CORE Components` publishes 150 components: 110 usable, 6 deprecated, 34 private
sub-parts. The complete contract — every variant option, every boolean, every default — is in
[`inventory.json`](inventory.json), which is generated from Figma and must not be hand-edited.
This file is the guide to that data: how to pick, and what to avoid.

## Read the JSON, not a copy of it

`inventory.json` holds, per component: `name`, `page`, `status`, `type` (`set` or `component`),
`nodeId`, `instances`, the full `properties` map, and `doNotUse` where a specific variant option is
deprecated. **When you place a component, take the variant names from there verbatim.** A variant
name that is not in the file does not exist, and a screen built on an invented variant cannot be
implemented.

`instances` — how many times the component is used inside the library itself — is a good proxy for
how settled a component is. `CO Divider / v3.0` (387), `CO TableColumn / v1.0 IB` (772) and
`CO Item Display / v5.3` (161) are load-bearing. A stable component at 0 instances is published but
unproven.

## The families

| Family | Components | Spec |
|---|---|---|
| Actions | Button, Action Stack, four Button Bars, two Toolbars | [`co-actions.md`](co-actions.md) |
| Navigation and structure | 6 Headers, Navigation, Tab, Paginator, Segmented Control, Divider | [`co-navigation.md`](co-navigation.md) |
| List items | 11 `CO Item …` components | [`co-items.md`](co-items.md) |
| Inputs | 9 inputs, DatePicker ×4, DigitPicker ×3, Keyboard Secure, File QR Upload | [`co-inputs.md`](co-inputs.md) |
| Surfaces | Content Card ×6, Product ×16, Personalisation, Icon Avatar, Illustration | [`co-surfaces.md`](co-surfaces.md) |
| Feedback | InLine Message, Snackbar, Modal Alert, Modal Biometric, Illustrated Message, Spinner, Tooltip, Tag, Badge, Rating | [`co-feedback.md`](co-feedback.md) |
| Data display | Table, Chart ×16, Detail Transaction, Text Heading ×4, Text Paragraph | [`co-data-display.md`](co-data-display.md) |

## Deprecated — six components, never in new work

| Component | Use instead |
|---|---|
| `CO Content Card / v6.0 ⚠︎PromoRating` | `CO Content Card / v6.2 Promo` |
| `CO Content Card / v6.1 ⚠︎PromoTargeted` | `CO Content Card / v6.2 Promo` |
| `_CO Illustration ⚠︎v4.0` | `CO Illustration v3.0` — the lower number is the live one |
| `CO Item Autocomplete / ⚠︎v5.0` | `CO Input SuperField / v7.1` with `Show Listbox` |
| `_⚠︎CO Item Navigation / v5.2 Payments (IB only)` | `CO Item Navigation / v5.2` |
| `_⚠️CO Item Transaction Batch / v5.2` | `CO Item Transaction / v5.2`, `Columns = Three` |

Beyond these, 21 **individual variant options** are deprecated inside otherwise healthy
components. They are listed per component as `doNotUse` in `inventory.json`; the recurring ones are
the `⚠️IB optional` boolean on every input, `variant = ⚠︎entrance` on the headers, and the three
platform-native `CO Spinner` variants.

## Two traps that apply to every component

**The default icon is deprecated.** Every instance-swap icon slot in the library — on buttons,
items, headers, action stacks, toolbars, avatars — defaults to a component called `⚠︎Placeholder`.
Its own description tells you to replace it. A screen that leaves an icon slot untouched ships a
deprecated placeholder, and it will pass an inventory check because the *component* is stable.

**The chart family's published names are stale.** `inventory.json` records the names the Figma
*file* uses today. The *published library* — the thing code and Code Connect consume — still serves
the previous names for the chart components, because they were renamed and not republished:
`Bar IB` is published as `v1.0 Bar IB`, `Column IB` as `v1.0 Column IB`, `Donut IB` as
`v5.0 Donut IB`, and the library carries a `v4.0 ValuePerformance` that the file index does not
return. No other family shows this mismatch. Details in
[`co-data-display.md`](co-data-display.md).

**Prose lives in Confluence, not in Figma.** Components link to space **KBDS** on
`wiki.kb.cz` — for example
[CO Button](https://wiki.kb.cz/confluence/x/H3AREw),
[CO Items Stack](https://wiki.kb.cz/confluence/display/KBDS/CO+Items+Stack),
[CO SuperField](https://wiki.kb.cz/confluence/display/KBDS/CO+SuperField). Figma is the contract,
Confluence is the reasoning. Where a rule in this repository looks thin, Confluence is the place to
check before assuming the system is silent.

## Private sub-parts — 34 components, never placed directly

Anything beginning `_` or `.` is a part of another component: `_HeaderCell`, `_ListBoxItem`,
`_PaginatorItem`, `_ChartLegend`, `.message`, `.balanceValue` and so on. They are published only
because Figma needs them to be. Placing one directly produces a screen that cannot be built,
because the code component has no such element on its own.

The one to watch is `_CO DatePicker / Android v2.0`: private, but the only Android date picker
alongside the public `CO InputDatePicker / Android` and `CO ModalDatePicker / Android`.

## Choosing between near-duplicates

| Situation | Rule |
|---|---|
| `CO Chart / … IB` vs `CO Chart / v4.0 …` | `IB` set for internet banking, `v4.0` set for the apps. Both current. |
| `CO Toolbar Floating` vs `Static` | Floating for touch; Static for anything primarily driven by keyboard and mouse. |
| `CO Button` vs `CO Action Stack` | One or two actions: Button. Three or more: Action Stack — its own description says so. |
| `CO Item Transaction` vs `… Transaction Select` | Select adds a checkbox for bulk operations. Otherwise identical. |
| `CO Input / v7.0 Basic` vs `SuperField / v7.1` | SuperField when the field has a second value, a caption or a listbox. |
| `CO Content Card / WrapPrimary / WrapSecondary / WrapHighlighted` | Wrappers with no behaviour; pick by visual weight. |
| `CO Modal Alert` vs `CO Snackbar` | Alert blocks and demands a decision; snackbar informs and disappears. |

## Sources

- The full published index of `💠 CORE Components` with variant matrices and instance counts, read
  through the Figma MCP connector on 2026-08-12.
- Figma component descriptions, quoted in the family specs where they exist. Most components have
  none — where a rule below is not attributed to a description, it is inferred from the variant
  matrix and is marked as such in the family spec.

## Open questions

- 12 of 150 components carry a Figma description, and an unknown number carry a Confluence
  documentation link that is only visible through `get_design_context`, one component at a time.
  This ingest read a sample; the full link list is not inventoried.
- No component states a maximum content length, so the copywriter's character limits cannot be
  derived from Figma. This is the biggest single gap in the component data.
- Instance counts are counts inside the library, not usage in products.
