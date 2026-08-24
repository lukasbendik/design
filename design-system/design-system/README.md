---
domain: design-system
owner: "@robert.puschel"
default_ttl_months: 12
updated: 2026-08-12
---

# Design system

The machine-readable definition of how the product looks and behaves. It is the **input** for
prototypes, PDFs, presentations and specifications — not a picture of them.

The system is **Golem, the KB design system**. Start at
[`golem-design-system.md`](golem-design-system.md): it says which Figma library is authoritative
for what, and what was normalised into this folder.

## Structure

| Path | Contains | Format |
|---|---|---|
| `tokens/` | colour, typography, spacing, radius, elevation, breakpoints | W3C DTCG JSON |
| `components/` | `inventory.json` (all 150 published `CO` components) + one spec per family | JSON + Markdown |
| `patterns/` | navigation styles, screen layout, states, snowflake policy | Markdown |
| `templates/` | `inventory.json` + the `TMP` screen-template map | JSON + Markdown |
| `assets/` | icon and illustration inventories | JSON + Markdown |
| `prototype-kit/` | CSS and an HTML skeleton that agents assemble prototypes from | CSS/HTML |
| `conventions.md` | naming, versioning and the deprecation marks | Markdown |

## Read this before using anything here

**Golem encodes lifecycle in the name.** `⚠` means deprecated — on a component, on a whole page,
or on a single variant option of an otherwise healthy component. `_` and `.` mark private
sub-parts that must never be placed directly. `❄` marks an approved one-off that must never be
reused. [`conventions.md`](conventions.md) is the full decoder, and every inventory carries a
normalised `status` field so a model does not have to parse emoji.

## Why tokens are JSON and not prose

One source generates: CSS custom properties for prototypes · styles for PDF and deck generation ·
values quoted in specifications. Prose cannot do that, and prose drifts. **Any agent producing a
visual artefact reads `tokens/` and never hard-codes a value.**

## Why the inventories are JSON and generated

`components/inventory.json`, `templates/inventory.json` and the two asset inventories are machine
transcriptions of the Figma library indexes, including every variant option and default. They are
regenerated, never hand-edited. When you place a component, **take the variant name from there
verbatim** — a variant that is not in the file does not exist, and a design built on an invented
variant cannot be implemented.

## Component file contract

Every component spec states: purpose · when to use and when not · anatomy · **all states**
(default, hover, focus, active, disabled, loading, error, empty) · content limits (max characters
per slot — the copywriter depends on this) · accessibility requirements · do / don't ·
a code snippet using token variables.

Golem publishes no content limits. Every spec here says so in its own `Content limits` section
rather than inventing one; that is the single largest gap in the current ingest.

## Adding to the system

Never extend the system inside a deliverable. Mark it `NEW COMPONENT PROPOSAL`, write a promotion
candidate, and let the domain owner decide. Silent extension is how design systems die. Golem's
own version of this rule is stricter still: names are permanent, changes are additive, and nothing
is ever renamed or deleted — only marked.
