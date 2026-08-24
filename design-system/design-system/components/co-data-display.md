---
id: kb-design-system-2026-0015
title: Data display components — Table, Charts, Detail Transaction, Text
type: component-spec
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
valid_from: 2026-08-12
review_by: 2027-08-12
sources:
  - "Figma variant matrices of CO TableColumn / v1.0 IB, Co TableCell and the six private table parts, the 16 CO Chart components, CO Detail Transaction, CO Text Heading / v4.0 Hero, Page, Section, Group and CO Text Paragraph / 4.0, file LF8w8yzyLqGKOJvZs1qApB, read via the Figma MCP connector on 2026-08-12"
  - "Figma component description of CO Detail Transaction ('always on CO ContentCard / WrapPrimary'), read 2026-08-12"
  - "Figma variables read from CO TableColumn node 144137:3095 and CO Chart / Column IB node 53648:7445 on 2026-08-12: background/tableZebra #2121210a, chart/in #267c29, chart/out #212121, chart/cool #888eb1"
  - "Figma variables read from the four CO Text Heading nodes and CO Text Paragraph node on 2026-08-12, giving the headings/* and content/* type tokens"
related: [kb-design-system-2026-0008, kb-design-system-2026-0011]
tags: [components, tables, charts, typography]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Data display components

**Summary:** The table is built one column at a time, charts come in two generations chosen by
channel, and text has exactly four heading levels. `CO TableColumn` is the single most used
component in the library (772 instances) and the one most often misused.

## CO Table — a column-first table

Golem's table is not a grid of cells. You compose it from `CO TableColumn / v1.0 IB`, one instance
per column, and each column declares what kind of data it holds:

`Type = Text Highlighted · Text Regular · Balance · Size number · Checkbox · Avatar · Icon ·
Link · Tag · Button · Status · Caret · Loading`

Choosing the type sets alignment, typography and behaviour together — `Balance` right-aligns and
uses the balance typography, `Size number` right-aligns a plain number, `Caret` is the row-expand
affordance. There is no "generic" column; picking `Text Regular` for a number is the usual mistake.

What each type looks like, as rendered: `Checkbox` a checkbox, `Avatar` a `CO Icon Avatar`,
`Icon` a bare 24 px icon, `Link` underlined text, `Tag` a `CO Tag` chip, `Status` a coloured dot
plus a label, `Button` an inline action, `Balance` a right-aligned amount that takes the
`chart/in` green when positive, `Caret` the expander, `Loading` a skeleton bar. The header label
adopts the column's alignment, so a numeric column's header is right-aligned too — never
hand-align a header.

Private parts you never place directly: `_HeaderCell`, `_Status`, `_Button`, `_Caret`,
`_Cursor / Default`, `_Cursor / Resize Col`. `Co TableCell` exists alongside the column component
with 27 instances and no description — prefer the column.

Zebra striping is `background/tableZebra` (`#2121210a`), applied by the table, not by the row.

The screen-level template is `TMP Table` (`Type = Default · Expandable`, optional paginator), with
`_ExpandedRow` as the expansion. Pagination is `CO Paginator / v1.0 IB`,
`Variant = TablePaginator`.

**Tables are `lg` and up.** Every table component is named `IB`, and the expandable row and column
resize cursor only make sense with a pointer. On `sm` and `md`, show the same data as
`CO Item …` rows.

## CO Chart — two generations, both supported

Golem is mid-migration. The newer chart generation is what new screens use; the older one is still
in production screens and is being replaced gradually, not all at once. **The design system
supports both on purpose.** Neither is marked `⚠︎`, and the older one must not be treated as
forbidden.

### Which one to use

| You are… | Use |
|---|---|
| designing a new screen | the **current** generation |
| adding a chart to a screen that already has one | whatever that screen already uses |
| reconstructing or restyling an existing screen | the **legacy** chart that is already there — do not silently upgrade it |

Swapping a chart generation is a migration decision with a front-end cost. It is never a
side-effect of a visual redesign. If a redesign genuinely should carry the migration, say so
explicitly in the handoff so the front-end team can price it.

### The two sets

| Generation | Members | Last published |
|---|---|---|
| **Current** | `LineBasic IB`, `LineScale`, `LineInterval`, `Stacked Bar IB`, `Bar IB`, `Column IB`, `Donut IB` | LineBasic 2026-08-10, Stacked Bar 2026-07-22 — the set still being extended |
| **Legacy** | `v4.0 HorizontalAccount`, `HorizontalInvestments`, `HorizontalSavings`, `VerticalAccount`, `Donut`, `PlotFundPerformance`, `PlotPortfolioValue`, `PlotTwoValues`, `PlotValueRange`, `ValuePerformance` | mostly 2026-05-18; HorizontalSavings 2026-08-05 |

The split matches the showcase, which exposes the two as separate demo apps — the older
`co-chart-app` and the newer `co-chart-new-app`. The evidence for the assignment above is the
publish dates and which set is still gaining members; Figma nowhere states the words "legacy" and
"current", so treat the *rule* as settled and the *labelling of an individual borderline
component* as worth a check with the design-system owner.

Every chart in both sets has `Loaded = True · False`. `_ChartLegend` (101 instances) is the shared
legend, is private, and works with either generation.

### Published names differ from the file names

Unique to this family, and it will bite anyone wiring up Code Connect: the chart components were
renamed in Figma and **not republished**, so the library still serves the older names.

| Name in the file today | Name the published library serves |
|---|---|
| `CO Chart / Bar IB` | `CO Chart / v1.0 Bar IB` |
| `CO Chart / Column IB` | `CO Chart / v1.0 Column IB` |
| `CO Chart / Donut IB` | `CO Chart / v5.0 Donut IB` |
| — (not in the file index) | `CO Chart / v4.0 ValuePerformance` |

`components/inventory.json` records the **file** names, because that is what the library index
returns. Code and Code Connect consume the **published** names. Until someone republishes the
library, both sets of names are live and they are not the same.

Colour comes from the `chart/*` tokens, never from the general palette:
`chart/in` `#267c29` for money in, `chart/out` `#212121` for money out, `chart/cool` `#888eb1` for
a neutral series, and the named asset-class colours `stocks`, `bonds`, `funds`, `evaluation`,
`neon`, `rustyRed`, `orangish`. The plot background gradients (`chart/plot…BackgroundTop` to
`…Bottom`) are the fill under a line chart.

**The two generations use the palette differently.** `CO Chart / Donut IB` renders its one-to-five
segments as a neutral black-to-grey ramp with a dot legend beneath, not as asset classes. The
named asset-class colours appear on `_ChartLegend`, shared with the investment charts. So:
money-movement and composition charts are neutral, and the asset-class names earn their keep in
investment charts. Both generations draw from the same `chart/*` tokens — the palette is not what
separates them.

The investment templates (`TMP Broker Overview`, `TMP Broker Detail`, `TMP Investment`) carry the
time-period switch: `1D · 5D · 1M · 6M · 1R · 5R · Vše` — a Czech vocabulary fixed by the
template, and `Trend = Positive · Negative` for the direction.

## CO Detail Transaction

> always on CO ContentCard / WrapPrimary — the component's whole description

`s = responsive`, 13 instances. It is the transaction detail body; it always sits inside a primary
wrap card, so do not add a second card around it.

It is the one **centred** layout in the system: a `CO Icon Avatar` with an `ES SubIcon` badge at
the top, then `$label`, `$caption`, the amount, `$secondaryValue` and `$secondaryCaption`, all
centre-aligned in a single column. Everything else in Golem is left-aligned with values on the
right, so do not copy this arrangement into an ordinary list.

## Text

Four heading components and one paragraph, each mapped to one type token:

| Component | Token | Size | Uses |
|---|---|---|---|
| `CO Text Heading / v4.0 Hero` | `headings/titlePrimary` | 42 / 52 | 3 |
| `CO Text Heading / v4.0 Page` | `headings/titleTertiary` | 28 / 36 | 21 |
| `CO Text Heading / v4.0 Section` | `headings/headlineSecondary` | 18 / 24 | 121 |
| `CO Text Heading / Group` | `content/bodySecondaryBold` | 14 / 20 | 14 |
| `CO Text Paragraph / 4.0` | `content/bodyPrimary` (`Basic`) or `bodySecondary` (`Small`) | 16 / 24 or 14 / 20 | 85 |

All of them have `Loaded = yes · no`. The heading levels are a hierarchy, not a size menu: Hero for
a screen that is mostly one statement, Page for the screen title, Section between content blocks,
Group for a label above a short list.

They are as plain as they look: a single left-aligned line of `$text` at the level's type token,
and `Loaded = no` swaps it for one full-width skeleton bar. There is no icon slot, no action, no
container. Anything else you see next to a heading is a separate component sitting beside it.

**`CO Text Heading / v4.0 Page` has a deprecated `⚠︎Caret` property** — a heading is not a
navigation control.

Note the gap: there is no component for `headings/titleSecondary` (32/44) or
`headings/headlinePrimary` (20/28), although both tokens exist and are used inside product cards
and modals.

## States

Loading everywhere (`Loaded`, or column `Type = Loading`). No disabled states.

## Content limits

Not defined. For tables the constraint is real and unwritten: the number of columns that fit at
`lg` (1024) with a side navigation panel.

## Accessibility

- A table needs real headers and a caption or heading that names it; `_HeaderCell` is the header
  cell and must not be faked with a `Text Highlighted` column.
- Charts are not accessible on their own. Every chart needs the same data reachable as text —
  the legend, a summary line, or the underlying list.
- `chart/in` and `chart/out` differ in hue and in lightness, but a series must still be
  distinguishable without colour: use the legend, direct labels or pattern.
- Heading components must map to real heading levels in code; a `Section` heading that renders as
  a `div` breaks navigation for a screen-reader user.
- Do not go below `content/captionPrimary` (12 px) for any data a user must read; the 10 px
  caption is for badges and tags.

## Do / don't

- Do choose the column `Type` that matches the data.
- Do replace tables with item rows below `lg`.
- Do keep one `Page` heading per screen.
- Don't place `_ChartLegend`, `_HeaderCell` or the cursor components directly.
- Don't recolour a chart series outside the `chart/*` tokens.
- Don't upgrade a legacy chart to the current generation as part of a visual redesign. Keep what
  the screen has, or raise the migration explicitly.
- Don't wrap `CO Detail Transaction` in a second card.

## Code

```css
.table__row:nth-child(even) { background: var(--background-tablezebra); }
.table__cell--balance { text-align: right; font: var(--content-body-secondary-bold); }
.chart__series--in  { color: var(--chart-in); }
.chart__series--out { color: var(--chart-out); }
```

## Sources

- Variant matrices of the 16 chart, 8 table and 5 text components.
- The `CO Detail Transaction` description, quoted in full above.
- Rendered screenshots of `CO TableColumn / v1.0 IB` (144137:3095), `CO Chart / Donut IB`
  (53648:7355), `CO Detail Transaction` (128869:6848), `CO Text Heading / v4.0 Hero`
  (58651:253698), `/ v4.0 Section` (58651:253801), `/ Group` (57373:50774) and
  `CO Text Paragraph / 4.0` (58710:258833), read 2026-08-12.
- Token values read from the TableColumn and Column IB chart nodes, and from each text node.

## Open questions

- The generational split above is inferred from publish dates and from the two showcase demo apps.
  Figma does not label either set, so a borderline component's assignment is worth confirming.
- The chart family's published names are stale. Republishing the library would close the gap; until
  then both name sets are live.
- No component uses `headings/titleSecondary` or `headlinePrimary`; are those tokens
  component-internal only?
- `Co TableCell` overlaps `CO TableColumn` and neither has a description.
