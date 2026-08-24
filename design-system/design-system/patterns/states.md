---
id: kb-design-system-2026-0005
title: Loading, empty, error and result states
type: pattern
domain: design-system
status: approved
confidence: medium
evidence: moderate
owner: "@robert.puschel"
lang: en
valid_from: 2026-08-12
review_by: 2027-08-12
sources:
  - "Figma component sets TMP Loading 1s-7s / Page and TMP Loading 1s-7s / InLine, file dbNZdTD169mAZ39fNGlNUg, variant matrices read 2026-08-12"
  - "Figma variant matrices of 150 published components in file LF8w8yzyLqGKOJvZs1qApB, read 2026-08-12: the per-component Loading, Loaded and Error options quoted below"
  - "Figma page titles '⚠ Empty State - deprecated' and '⚠ Product detail - deprecated' in file dbNZdTD169mAZ39fNGlNUg, read 2026-08-12"
  - "Figma file '💠 CORE Patterns' overview node 18180:720808, which names 'States: Result, Empty, Wait, Error' as a pattern category, read 2026-08-12"
related: [kb-design-system-2026-0004, kb-design-system-2026-0014]
tags: [states, loading, error-handling, accessibility]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Loading, empty, error and result states

**Summary:** Golem handles waiting at two levels — a whole-screen template for waits over one
second, and a `Loading` variant on almost every component for everything else. Error and result
states are components; the empty-state templates are deprecated and their replacement is not
documented. Never design only the happy path.

## Loading

**Whole screen.** `TMP Loading 1s-7s / Page` covers a wait of one to seven seconds:

| Property | Options |
|---|---|
| `Type` | `SCR (1-7s)` — a full loading screen · `Overlay on SCR (1-3s)` — an overlay on the current screen |
| `Platform` | `MB (iOS)` · `IB` |
| `Show Paragraph` | boolean — add an explanatory line for the longer waits |

`TMP Loading 1s-7s / InLine` is the same idea inside a block, with an optional heading.

Under one second: no loading state at all. Over seven seconds: nothing in Golem covers it — this
is a genuine gap, and today teams fall back to the seven-second screen.

**Per component.** Most components carry their own loading form and you should use it in
preference to hiding content:

| Component | Property and value |
|---|---|
| `CO Button / v4.0`, `CO Tag / v3.0` | `State = Loading` |
| `CO Item Display / v5.3` | `State = Loading` or `LoadingPart` (partial skeleton) |
| `CO Item Navigation`, `Item CheckBox`, `Item RadioButton`, `Item Switch`, `Item Transaction`, `Item Transaction Select`, `Item Account Display` | `State = Loading` |
| `CO Text Heading / *`, `CO Text Paragraph`, `CO Content Card / *`, `CO Tab / v5.0` | `Loaded = no` |
| `CO Icon Avatar / *`, `CO Action Stack / v3.0` | `Loaded = No` |
| `CO Chart / *` | `Loaded = False` |
| `CO Navigation / 3.0`, `CO Personalisation / *` | `state = Loading` |
| `CO Product * / *` | `State = Loading` |
| `CO Rating / v3.0` | `Stars = 0 / loading` |
| `CO Item Chat / v5.0` | `Variant = Loader` |

The skeleton fill is `content/skeletonLoading` (`#adadad80`). Skeletons keep the layout of the
loaded content, so the screen does not jump when data arrives.

`CO Spinner / v2.0` has one usable variant, `customKBshape`. Its three platform-native variants are
deprecated — do not use the OS spinner.

## Error

- **In a field:** the input's own `Error`, `ErrorPlaceholder`, `ErrorFocus` and
  `ErrorFocusPlaceholder` states, plus the field's message slot. Never colour alone —
  `attention/alert` always arrives with an icon and text.
- **In a block:** `CO InLine Message / v6.0`, `MessageType = error`. Sizes `responsive-sm` and
  `responsive-md-lg`.
- **On the whole screen:** `CO Illustrated Message v1.0` with an error illustration, inside the
  in-page error block that `💠 CORE Templates` lists on its cover. The `size = ⚠︎md-lg-IB` variant
  is deprecated; use `responsive`.
- **Transient:** `CO Snackbar / v2.0`, one variant per platform.

`CO InLine Message` covers all four message types with one component: `info`, `success`, `error`,
`warning`. The colours are `attention/information`, `attention/success`, `attention/alert` and
`attention/processing` with their matching surfaces.

## Empty

This is the weakest part of the ingest. The template family `_⚠TMP Empty State / …` — eight
component sets covering `sm-ib`, `sm-iOS-Android`, `md-ib`, `lg-ib` and their subdetail and
loading forms — sits on a page named `⚠ Empty State - deprecated`. Nothing in the libraries
states what replaces it.

What the evidence supports: an empty state today is built from `CO Illustrated Message v1.0`
inside the content slot, with an `ES Illustration` motif and an action from `CO Button`. The
`Empty cards` block type in `TMP Page content blocks` covers the case where only one block is
empty. Treat this as a working reconstruction, not a rule, until the design-system owner confirms
it.

## Result

`💠 CORE Patterns` names `States: Result, Empty, Wait, Error` as one pattern. The result screen —
the confirmation at the end of a Flow — is `CO Illustrated Message v1.0` with a success
illustration plus `CO Button Bar Bottom / v4.0`. The showcase exposes it as a dedicated result
template, so a `TMP` for it may exist on a Figma page that carries no published component.

## Do / don't

- Do use the component's own loading variant instead of a spinner over the whole screen.
- Do keep the skeleton in the shape of the real content.
- Do give an error a way out: a retry action or an explanation of what to change.
- Don't use the deprecated platform-native spinners.
- Don't build an empty state from a deprecated `_⚠TMP Empty State` template even though the
  library still publishes it.
- Don't show a loading state for a wait under one second.

## Sources

- The two `TMP Loading 1s-7s` component sets, whose names encode the one-to-seven-second window.
- The exhaustive variant matrix of all 150 published CO components, from which the per-component
  loading table is a direct transcription.
- The deprecated Figma pages `⚠ Empty State - deprecated` and `⚠ Product detail - deprecated`.

## Open questions

- What replaces the deprecated empty-state templates? Unanswered by the libraries.
- What covers a wait longer than seven seconds?
- The `PA` pages that document Result, Empty, Wait and Error in prose hold no published
  components and could not be read through the connector.
