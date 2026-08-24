---
id: kb-design-system-2026-0011
title: List item components — the CO Item family
type: component-spec
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
  - "Figma variant matrices of CO Item Display / v5.3, Item Navigation / v5.2, Item CheckBox / v5.1, Item RadioButton / v5.0, Item Switch / v4.1, Item Transaction / v5.2, Item Transaction Select / v5.2, Item Account Display / v1.0 IB and Item Chat / v5.0, file LF8w8yzyLqGKOJvZs1qApB, read via the Figma MCP connector on 2026-08-12"
  - "Figma component description of CO Item Display / v5.3 ('List item for wide range data. Mandatory label with some optional elements like icon, value, interactive behaviour.'), read 2026-08-12"
  - "Figma variables read from CO Item Display node 133908:3940 and CO Item Transaction node 133927:5452 on 2026-08-12"
related: [kb-design-system-2026-0008, kb-design-system-2026-0015]
tags: [components, lists, forms]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# List item components — the CO Item family

**Summary:** Eleven components, one row shape. Every screen in KB+ is mostly made of these:
`CO Item Display` (161 uses), `CO Item Navigation` (151), `CO Item CheckBox` (144),
`CO Item Transaction Select` (143). Choose by what the row *does*, not by what it shows.

## Purpose, in Golem's own words

> List item for wide range data. Mandatory label with some optional elements like icon, value,
> interactive behaviour. — `CO Item Display / v5.3`

## Choosing

| The row … | Component |
|---|---|
| shows a value, may act | `CO Item Display / v5.3` |
| goes somewhere | `CO Item Navigation / v5.2` |
| toggles one of many | `CO Item CheckBox / v5.1` |
| toggles one of a set | `CO Item RadioButton / v5.0` |
| turns a setting on or off, immediately | `CO Item Switch / v4.1` |
| is a money movement | `CO Item Transaction / v5.2` |
| is a money movement you can select in bulk | `CO Item Transaction Select / v5.2` |
| is an account with balances (IB) | `CO Item Account Display / v1.0 IB` |
| is a chat message | `CO Item Chat / v5.0` |

**Checkbox vs switch:** a checkbox is part of a form and takes effect when the form is submitted;
a switch takes effect immediately. Getting this wrong is the most common item mistake.

## The shared anatomy

```
[ left icon 24 or 32 ] Label                      Value      [ action ]
                       Caption                    2nd value
                       Message
```

- `Left Icon size = 24: ES Icon` or `32: Avatar or ES Icon Flag` — 24 for a plain icon, 32 when it
  is an avatar, a merchant logo or a country flag. The 32 form is `CO Icon Avatar / Small` with a
  `borderRadius/sm` (4 px) corner.
- **The left-icon slot is 32 wide and 24 tall even when the icon is 24.** The icon is centred in
  it. Those extra 8 px are what keeps every label in a list aligned, and dropping them is why a
  hand-built list looks subtly wrong next to a real screen. Read from `CO Item Display / v5.3` and
  `CO Item Navigation / v5.2` on 2026-08-12.
- **The icon takes the row's colour.** It is one glyph, not two assets: the red icons on real KB+
  screens — the bin on *Zrušená a ukončená spoření*, the list on *Detail a správa účtu* — are
  `interactive/primary` applied to the same black `ES Icon`. Colour marks the row's kind, never its
  severity on its own.
- `Label` is mandatory everywhere. `Caption`, `Value`, message and action are optional booleans.
- Values are right-aligned; `Variant = ValueHorizontal · ValueVertical` on Item Display puts the
  value beside or under the label.

### Exact geometry and type

Read out of `CO Item Display / v5.3` itself, not inferred:

| Part | Token |
|---|---|
| Row padding | `padding/xl` — **16 on all four sides**, not a 12/16 row |
| Row radius | `borderRadius/md` 8 |
| Gaps | icon to text and text to value `padding/xl` 16; label to caption `padding/xs` 2 |
| Label, `ValueHorizontal` | `content/bodyPrimaryBold` **16/24**, `content/primary` |
| Label, `ValueVertical` | `content/captionPrimaryBold` 12/16 — the vertical form demotes the label and promotes the value |
| Caption | `content/bodySecondary` 14/20, `content/tertiary` |
| Value | `content/bodyPrimaryBold` 16/24, `content/primary`, right-aligned |
| Secondary value (`.secondaryValue`) | `content/bodySecondary` 14/20, `content/tertiary` |
| Message (`.message`) | `content/captionPrimaryBold` 12/16, `attention/information` |
| Action label (`Action = Button`) | `content/bodySecondaryBold` 14/20, `interactive/secondary`, underlined |
| Skeleton | `content/skeletonLoading`, `borderRadius/sm` 4, 16 px tall |
| `BalanceValue` zero case | `content/bodyPrimaryBold` in `content/tertiary` |

The row has no fixed height: 16 px of padding around a 24 px line already gives 56 px, comfortably
over the 48 px touch minimum. Do not force `height: 48px` on it.

**The default icon is a trap.** Every left-icon and action-icon slot defaults to an instance named
`⚠︎Placeholder`, whose own description tells you to replace it. Swap it, or switch the slot off.

## Contract per component

| Component | State | Other axes |
|---|---|---|
| `Item Display / v5.3` | `Enabled · Loading · LoadingPart` | `Variant = ValueHorizontal · ValueVertical`; `Action = No · Icon · Button`; `Left Icon size`; `BalanceValue = False · True` |
| `Item Navigation / v5.2` | `Enabled · Loading` | `Destructive = Off · On`; `Left Icon size` |
| `Item CheckBox / v5.1` | `False · Indeterminate · True · Loading` | `Variant = Normal · TriState · Consent`; `s = responsive` |
| `Item RadioButton / v5.0` | `On · Off · Loading` | `s = responsive` |
| `Item Switch / v4.1` | `On · Off · Loading` | `s = responsive-Android · responsive-iOS-IB · responsive` |
| `Item Transaction / v5.2` | `Enabled · Loading` | `Variant (Situation) = Incoming · Outgoing · Error · Paused · Waiting · Done · Settlement · Inactive · General`; `Columns = Two · Three` |
| `Item Transaction Select / v5.2` | `Enabled · Loading` | `Columns`; instance-swap `Checkbox` |
| `Item Account Display / v1.0 IB` | `Enabled · Loading` | `Size = Narrow · Wide`; balance before/after, currency, owner |
| `Item Chat / v5.0` | — | `Variant = Bank · Client · Loader` |

`Variant (Situation)` on the transaction row is the important one: nine situations, each with its
own icon treatment. `Incoming` uses `chart/in` (`#267c29`), `Outgoing` uses `chart/out`
(`#212121`), `Error` uses `attention/alert`. Do not recolour a transaction row by hand.

`LoadingPart` on Item Display exists for the case where the label is known and only the value is
still loading — prefer it to a full skeleton, the screen stops jumping.

**Deprecated:** `CO Item Autocomplete / ⚠︎v5.0`, `_⚠︎CO Item Navigation / v5.2 Payments (IB only)`,
`_⚠️CO Item Transaction Batch / v5.2`. For batch payments use
`CO Item Transaction / v5.2` with `Columns = Three`.

## States

Every item has a loading state. None has a disabled state: a row that cannot be used is either
absent, or present with `Action = No`. A destructive row is `CO Item Navigation` with
`Destructive = On`.

## Content limits

Not defined in Figma. Observable constraints: at `sm` the row is 343 px wide inside the side slot
minus a 24 or 32 px icon and the value column, so a label has roughly 20–24 characters before it
truncates; the caption line is `content/bodySecondary` at 14/20 and wraps to two lines at most in
every observed instance. **Treat these as observations, not as a published rule.**

## Accessibility

- Row height follows `sizing/buttonHeight` (48) for any interactive row — a tappable row shorter
  than that fails WCAG 2.2 target size.
- Label plus caption must read as one accessible name; the caption is not decorative.
- The situation of a transaction (`Error`, `Waiting`, `Paused`) must be conveyed by the icon and
  by text, never by colour alone. The subicons `ES SubIcon / Warning`, `/ Waiting`, `/ Paused`,
  `/ Blocked`, `/ Done` exist for exactly this.
- Checkbox `Indeterminate` needs `aria-checked="mixed"`.
- The switch is the only item where the change is immediate; announce the resulting state.

## Do / don't

- Do use `Item Navigation` for anything that opens another screen — the chevron is the promise.
- Do use `LoadingPart` when only the value is pending.
- Do keep one action per row.
- Don't nest an interactive control inside an interactive row; a switch row *is* the control.
- Don't use `Item Display` with `Action = Icon` as a navigation row.
- Don't build a bulk-select list from `Item Transaction` plus a loose checkbox — use
  `Item Transaction Select`.

## Code

```css
.item {
  display: flex; align-items: flex-start; gap: var(--padding-xl);  /* 16px */
  padding: var(--padding-xl);                                      /* 16px all round */
  border-radius: var(--border-radius-md);                          /* 8px */
  background: var(--background-surface);
}
.item__text    { display: flex; flex-direction: column; gap: var(--padding-xs); flex: 1; min-width: 0; }
.item__label   { font: var(--content-body-primary-bold); color: var(--content-primary); }
.item__caption { font: var(--content-body-secondary);    color: var(--content-tertiary); }
.item__message { font: var(--content-caption-primary-bold); color: var(--attention-information); }
.item__value   { font: var(--content-body-primary-bold); text-align: right; }
.item--vertical .item__label { font: var(--content-caption-primary-bold); }
.item__value--in  { color: var(--chart-in); }
.item__value--out { color: var(--content-primary); }
```

## Golem's own documentation

`CO Item Display / v5.3` links to
<https://wiki.kb.cz/confluence/display/KBDS/CO+Items+Stack>. The whole item family is documented
there as one page, which is a good sign that Golem also thinks of it as one family.

## Sources

- The nine variant matrices listed in `sources`, transcribed above.
- The `CO Item Display / v5.3` description, quoted verbatim.
- `get_design_context` on `CO Item Display / v5.3` (node 133908:3940), read 2026-08-12 — the
  geometry and type table is a transcription of the returned token-mapped styles.
- Token values read from the Item Display and Item Transaction nodes themselves.

## Open questions

- Character limits are undefined for every slot.
- `Item Chat / v5.0` has no state axis — how is a failed message shown?
- `BalanceValue = True` on Item Display changes the value typography; what exactly it switches to
  was not read.
