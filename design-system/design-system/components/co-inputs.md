---
id: kb-design-system-2026-0012
title: Input components — the CO Input family and the pickers
type: component-spec
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
source_lang: en
lang_exception: "default property values are quoted verbatim from Figma and are partly Czech"
valid_from: 2026-08-12
review_by: 2027-08-12
sources:
  - "Figma variant matrices of CO Input / v7.0 Basic and Mega, Input SuperField / v7.1, Input Select / v7.0, Input Date / v7.0, Input Search Bar / v7.0, Input TextArea / v7.0, Input Digits / v1.0, Input Dropdown / v1.0, Input Secure / 4.0, the four DatePicker components, the three DigitPicker components, CO Keyboard Secure / v2.0 and CO File QR Upload / v1.0 IB, file LF8w8yzyLqGKOJvZs1qApB, read via the Figma MCP connector on 2026-08-12"
  - "Figma component description of CO InputDatePicker / Android ('Date pickers let users select a date, or a range of dates.'), read 2026-08-12"
  - "Figma variables read from CO Input SuperField node 26306:199092 on 2026-08-12: attention/alert #b53022, background/borderHighlighted #717171, borderRadius/md 8, border/lg 3, padding/lg 12"
related: [kb-design-system-2026-0008, kb-design-system-2026-0014]
tags: [components, forms, accessibility]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Input components — the CO Input family and the pickers

**Summary:** Eight text inputs share one eleven-value state machine. Learn it once and every field
in the system behaves the same. The pickers are platform-specific and must be chosen by platform,
not by preference.

## The shared state machine

Every `CO Input …` component except Dropdown carries the same `State`:

```
Enabled  EnabledPlaceholder  Hover  HoverPlaceholder  Focus  FocusPlaceholder
Error    ErrorPlaceholder    ErrorFocus  ErrorFocusPlaceholder  Loading
```

The `…Placeholder` twin of each state is the empty field. Golem models empty as a state, not as a
value, because the placeholder is styled differently from a real value — so a design that shows
only `Enabled` has not covered the empty field.

`CO Input SuperField / v7.1` adds `EnabledFound` and `HoverFound` for a matched suggestion.

### What each state actually looks like

Read out of `CO Input SuperField / v7.1` itself. The border is the state indicator, and it changes
**colour and width**, not just colour:

| State | Border | Notes |
|---|---|---|
| Enabled | `border/sm` 1 px `background/borderHighlighted` `#717171` | |
| Hover | `border/sm` 1 px `content/primary` `#212121` | |
| Focus | `border/lg` **3 px** `interactive/secondary` | caret shown in the value |
| Error | `border/sm` 1 px `attention/alert` `#b53022` | message turns `attention/alert` |
| ErrorFocus | `border/lg` **3 px** `attention/alert` | |
| Loading | none | the whole 76 px wrap becomes a `content/skeletonLoading` block |

Geometry: the input wrap is **76 px tall**, `borderRadius/md` 8, horizontal padding `padding/lg` 12,
`padding/md` 8 top and `padding/lg` 12 bottom, on `background/surface`. Label
`content/captionPrimaryBold` 12/16, value `content/bodyPrimaryBold` 16/24, placeholder the same
type in `content/tertiary`, message `content/captionPrimaryBold` under the field with a
`padding/sm` 4 gap.

The listbox that `Show Listbox` reveals is a `background/surface` panel on the **panel** shadow at
`borderRadius/md`, filled with `CO Item Display / v5.3` rows separated by `CO Divider / v3.0`.

## Choosing

| Need | Component | Uses |
|---|---|---|
| one line of text or a number | `CO Input / v7.0 Basic` | 33 |
| the same, very large (amount entry) | `CO Input / v7.0 Mega` | 0 |
| a field with a second value, caption or listbox | `CO Input SuperField / v7.1` | 73 |
| choose from a list | `CO Input Select / v7.0` | 44 |
| a date | `CO Input Date / v7.0` | 23 |
| search | `CO Input Search Bar / v7.0` | 25 |
| free text over one line | `CO Input TextArea / v7.0` | 0 |
| digits only (codes) | `CO Input Digits / v1.0` | 0 |
| a compact in-toolbar chooser | `CO Input Dropdown / v1.0` | 40 |
| a PIN or password | `CO Input Secure / 4.0` + `CO Keyboard Secure / v2.0` | 6 |
| upload a file or scan a QR code | `CO File QR Upload / v1.0 IB` | 44 |

## Shared slots

`Label`, `Value`, `Placeholder`, `Message`, and on some fields `Unit`, `Caption`, `Counter`.
Booleans switch each on. `Show Listbox (Web or iPad only)` says exactly what it means: the inline
listbox is not a phone pattern — on a phone the same choice opens a picker.

`CO Input TextArea` is the only field with a `Counter` slot (`$counter/$counterMax`) and an
optional `Show drag-to-resize`.

`CO Input Search Bar` has `Has button = Yes · No` with the action label defaulting to `Zrušit`,
and three platform sizes (`responsive-iOS`, `responsive-Android`, `responsive`).

**Deprecated on every input:** the boolean `⚠️IB optional`. Turning it on renders the Czech string
`(nepovinné)` in `content/captionPrimary` next to the label. Since the property is deprecated and
the string is baked in, mark optional fields another way — in the label itself, or in the message
line — and expect the copy to be your responsibility rather than the component's.

## The pickers

| Platform | Date | Digits |
|---|---|---|
| iOS | `CO DatePicker / iOS v2.0` | `CO DigitPicker / iOS v1.0` |
| Android | `CO InputDatePicker / Android`, `CO ModalDatePicker / Android`, `_CO DatePicker / Android v2.0` | `CO DigitPicker / Android v1.0` |
| IB / web | `CO DatePicker / IB v2.0` | `CO DigitPicker / IB v1.0` |

Android is the awkward one: the only complete Android date picker is `_CO DatePicker / Android v2.0`,
which is marked private, and its `view = ⚠︎year` option is deprecated. Flag this to the
design-system owner rather than working around it.

`CO Keyboard Secure / v2.0` is the on-screen keypad for secure entry; it always accompanies
`CO Input Secure / 4.0` and is never used for ordinary input. It is a 3 × 4 grid of round white
keys on a grey ground: digits 1–9, then a bottom row of *biometric key · 0 · backspace*. The
bottom-left key has four forms — scramble, fingerprint, face, or absent — and that choice is the
only real decision the component offers.

`CO Input Secure / 4.0` is the masked companion: a row of positions, hollow circles for empty and
solid dots for entered, with the **digit just typed shown briefly before it masks**. Two lengths
exist, six and ten.

**`CO DigitPicker` is not a keypad.** Despite the name, `CO DigitPicker / IB v1.0` renders a
1-to-31 grid — it picks a **day of the month**, the way a standing order needs. The iOS and
Android forms are wheels over the same range. If you want digit entry, you want `CO Input Digits`
or the secure keyboard.

**No picker selects in red.** KB red is for actions; selection is neutral. The two platforms do it
differently and both are correct:

- `CO DatePicker / IB v2.0` — three grid views (days, months, years), a `‹ ›` stepper and a header
  that climbs a level. Selected day a filled `interactive/secondary` circle, selected month or
  year a filled black pill, today an outlined circle, unavailable dates `content/quaternary`.
- `CO DatePicker / iOS v2.0` — a platform calendar with a filled **grey** circle on the selected
  day, and a **wheel** for month and year rather than a grid. Localised: the library carries both
  the Czech and the English rendering.
- `CO InputDatePicker / Android` and `CO ModalDatePicker / Android` — plain Material 3 dialogs:
  a supporting label, a large headline, a calendar toggle, an outlined field with a floating
  `Datum` label, and `Zrušit` / `Potvrdit` text buttons. Golem does not restyle them.
  **One defect to watch:** the field's placeholder reads `mm/dd/yyyy` — a US order inside a Czech
  dialog. Do not reproduce it; Czech dates are `dd. mm. yyyy`.

Reaching for `interactive/primary` in any of them is the common mistake.

**`CO DigitPicker` is two different objects sharing a name.** On IB it is the 1-to-31 day grid
described below. On iOS it is a **wheel** — a vertical list with the selected number held in a grey
rounded band. Android matches iOS in kind. Do not assume the IB behaviour on a phone.

## CO File QR Upload / v1.0 IB

Two states, both worth knowing because they are easy to invent badly. Empty: a dashed-border drop
zone with a QR icon and an instruction, plus an underlined text action below it. Filled: a card
with a `borderRadius/md` border holding the QR thumbnail, `$fileName`, and a red trash icon on the
trailing edge. The underlined action stays available so a second file can replace the first.

## States

Covered by the state machine above. Note there is **no disabled state** on any input. A field the
user may not edit is either absent, or shown as a `CO Item Display` row.

## Content limits

Only one is expressed in the system: `CO Input TextArea` carries a counter, and the showcase
demonstrated a 160-character limit with the counter appearing near the threshold. No other field
declares a maximum. Label and message lengths are undefined.

## Accessibility

- Error is never colour alone: the `Error…` states change the border to `attention/alert`
  (`#b53022`) **and** the message line carries the reason. Write the reason, not "Invalid input".
- The message slot must be programmatically associated with the field (`aria-describedby`), and on
  error also `aria-invalid`.
- Focus is a real state with a thicker border (`border/lg`, 3 px) — never suppress it.
- Placeholder text is not a label. Every field has a `Label` slot; use it.
- `content/tertiary` (`#717171`) on `background/surface` is 4.9:1 — acceptable for the message
  line, but never take helper text below 12 px.
- Secure entry with `CO Keyboard Secure` must still be reachable by keyboard on IB.

## Do / don't

- Do design all four of `Enabled`, `EnabledPlaceholder`, `Error` and `Focus` for every field you
  specify.
- Do use SuperField when the field needs a caption or a suggestion list; do not bolt those onto
  Basic.
- Do put the unit in the `Unit` slot, not into the value.
- Don't use `⚠️IB optional`.
- Don't use an inline listbox on a phone.
- Don't disable a field. Remove it or show it as read-only content.

## Code

```css
.field { display: flex; flex-direction: column; gap: var(--padding-sm); }
.field__control {
  display: flex; flex-direction: column; justify-content: center;
  min-height: 76px;                                    /* the wrap, not a 48px control */
  padding: var(--padding-md) var(--padding-lg) var(--padding-lg);
  border: var(--border-sm) solid var(--background-border-highlighted);
  border-radius: var(--border-radius-md);
  background: var(--background-surface);
  font: var(--content-body-primary-bold);
}
.field__label { font: var(--content-caption-primary-bold); color: var(--content-primary); }
.field__control:hover        { border-color: var(--content-primary); }
.field__control:focus-within { border-width: var(--border-lg); border-color: var(--interactive-secondary); }
.field--error .field__control { border-color: var(--attention-alert); }
.field--error .field__control:focus-within { border-width: var(--border-lg); }
.field__control::placeholder { color: var(--content-tertiary); }
.field__message { font: var(--content-caption-primary-bold); color: var(--attention-information); }
.field--error .field__message { color: var(--attention-alert); }
```

## Golem's own documentation

`CO Input SuperField / v7.1` links to <https://wiki.kb.cz/confluence/display/KBDS/CO+SuperField>,
and its Figma description explains the intent:

> Building on CO Input, a distinctive field used when it is the primary action on the page or when
> there are suggested options to choose from (not in Drop 1). Three variants: a simple one showing
> typing on a single line (like CO Input), and a rich variant with an avatar and two lines of text
> (used only for Set and Success states).

Every component's prose lives in Confluence space **KBDS**. Figma carries the contract, Confluence
carries the reasoning.

## Sources

- The variant matrices of all sixteen input and picker components.
- The `CO InputDatePicker / Android` and `CO Input SuperField / v7.1` descriptions.
- `get_design_context` on `CO Input SuperField / v7.1` (node 26306:199092), read 2026-08-12 — the
  per-state border table and the 76 px geometry are transcriptions of the returned token-mapped
  styles.
- Rendered screenshots of `CO DatePicker / IB v2.0` (10559:87078),
  `CO DatePicker / iOS v2.0` (10478:73952), `CO InputDatePicker / Android` (21436:24725),
  `CO DigitPicker / IB v1.0` (6122:8900), `CO DigitPicker / iOS v1.0` (6122:8898),
  `CO Keyboard Secure / v2.0` (1346:38951), `CO Input Secure / 4.0` (54848:229616) and
  `CO File QR Upload / v1.0 IB` (13600:34578), read 2026-08-12.
- Token values read from the `CO Input SuperField / v7.1` node.

## Open questions

- Why is the only complete Android date picker private?
- `CO Input / v7.0 Mega`, `Input TextArea` and `Input Digits` have zero in-library instances —
  published but unproven.
- No maximum lengths, and no rule for how a required field is marked now that `⚠️IB optional`
  is deprecated.
