---
id: kb-design-system-2026-0001
title: Golem — KB design system, source of truth and how it is organised
type: reference-data
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
source_lang: en
valid_from: 2026-08-12
review_by: 2027-08-12
sources:
  - "Figma library '💠 CORE Components', file LF8w8yzyLqGKOJvZs1qApB, published-component index read via the Figma MCP connector on 2026-08-12, 150 published components"
  - "Figma library '💠 CORE Templates', file dbNZdTD169mAZ39fNGlNUg, published-component index read 2026-08-12, 47 published templates"
  - "Figma library '💠 CORE Patterns', file e2shy18VXDr9f8FH2SpaWK, published-component index read 2026-08-12, 29 published components"
  - "Figma library '💠 ES Essentials', file xOURtHkYRN70tbZdQPWlw2, published-component index and variable values read 2026-08-12"
  - "Figma library '💠 ES Icon', file QOUtQjwwGQvhuJv4kUbSTm, 364 published components read 2026-08-12"
  - "Figma library '💠 ES Illustration', file R240iYyZkmWZHsVvYLyjDp, 1070 published components read 2026-08-12"
  - "'intro to golem' shared documentation frame, rendered from CORE Patterns node 24512:26933 on 2026-08-12"
  - "Golem showcase snapshot, https://plus-test.kb.cz/showcase/, browser walk of 95 routes on 2026-08-11 (used only to cross-check colour modes and the type scale)"
related: [kb-design-system-2026-0002, kb-design-system-2026-0003]
supersedes: null
superseded_by: null
tags: [navigation, forms, mobile, desktop, accessibility]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Golem — KB design system, source of truth and how it is organised

**Summary:** Golem is KB's design system, delivered as Figma libraries plus front-end packages.
This file says which Figma library is authoritative for what, how the layers fit together, and
what this repository has normalised out of them. Read it before any other design-system file.

## What Golem is

Golem is an internal design system for KB Group, built primarily for KB+ (the NDB programme) and
expanding to other internal and external apps. It has five parts: design templates in Figma,
documentation in Confluence, code (iOS, Android, Angular), governance processes, and the people
who maintain it. It is not distributable outside KB Group.

Golem does not treat the design language as separate from the system. Older, less complete design
systems exist alongside it — IDS for ZOOM, DS for old mobile banking, CEXI for old internet
banking — and are expected to merge into Golem or disappear.

## The four layers and their prefixes

| Prefix | Layer | Figma library | What it decides |
|---|---|---|---|
| `ES` | Essentials | `💠 ES Essentials`, `💠 ES Icon`, `💠 ES Illustration`, `💠 ES Icon Flag` | colour, type, spacing, radius, shadow, icons, illustrations |
| `CO` | Mainline components | `💠 CORE Components` | reusable elements implemented in code and Figma |
| `PA` | Patterns | `💠 CORE Patterns` | rules for solving a UI case; never placed on a screen as-is |
| `TMP` | Templates / standardised screens | `💠 CORE Templates` | whole ready-made screens to bootstrap a design |

The fifth part of Golem is not in Figma at all: **Confluence space `KBDS` on `wiki.kb.cz` holds the
prose.** Components carry a link to their own page — Figma is the contract, Confluence is the
reasoning. When something in this repository is marked as a gap, check Confluence before concluding
that Golem is silent about it.

Essentials are **atomic and not responsive**. A button that needs a different radius on a wide
screen switches to another radius token; the token itself never scales. Golem does not support
component-level essentials, with one legacy exception noted in `tokens/radius.tokens.json`.

## What this repository holds

| Path | Contains | Generated from |
|---|---|---|
| [`tokens/`](tokens/) | 6 DTCG token files | Figma variables, read node by node |
| [`components/inventory.json`](components/inventory.json) | all 150 published CO components with their full variant contract | Figma library index |
| [`components/`](components/) | seven family specs, one per component family | Figma variant data + Figma component descriptions |
| [`patterns/`](patterns/) | navigation styles, screen layout, states, snowflake policy | CORE Patterns + CORE Templates |
| [`templates/`](templates/) | the TMP SCR Layout matrix and the rest of the template inventory | CORE Templates |
| [`assets/`](assets/) | icon and illustration inventories | ES Icon, ES Illustration |
| [`prototype-kit/`](prototype-kit/) | CSS that turns the tokens and the layout rules into a working responsive shell | this repository |

The inventories are **generated, not typed**. When Figma changes, regenerate rather than edit.

## Reading order for an agent building a screen

1. [`patterns/screen-layout.md`](patterns/screen-layout.md) — pick the breakpoint and the layout slots.
2. [`patterns/navigation-styles.md`](patterns/navigation-styles.md) — pick the navigation style; it decides the header, the back affordance and the button bar.
3. [`templates/screen-templates.md`](templates/screen-templates.md) — is there already a template for this screen?
4. [`components/inventory.json`](components/inventory.json) — pick components and the exact variant names. Never invent a variant.
5. [`tokens/`](tokens/) — every value comes from here.

## Status of this ingest

`status: approved` as of 2026-08-12, signed by `@robert.puschel`, who also owns the domain.

Read that scope precisely: **what is approved is that these files faithfully record the Golem Figma
libraries as they stood on 2026-08-12.** It is not a statement that Figma matches the shipped
front-end packages — nothing in Figma says which library version corresponds to which package.
Two things a human still has to confirm with the Golem team: that mapping, and whether a
deprecation mark in Figma also deprecates the code component.

Three sections rest on reconstruction rather than on something Figma states outright, and each
says so in its own text: the empty-state guidance in
[`patterns/states.md`](patterns/states.md), the pattern rules reconstructed from template and
header variant matrices, and the `highlighted` shadow geometry in
`tokens/elevation.tokens.json`. Cite those with the qualifier the file itself carries.

## Corrections this ingest makes to earlier material

An earlier extraction from the Golem showcase test environment
(`workspace/owner-lukas-b/outputs/2026-08-11-kb-plus-design-system/`, `status: draft`, left in
place) was written from a scraped test showcase. Where Figma and that snapshot disagree, Figma
wins. The differences that matter:

| Topic | Earlier snapshot | Figma, 2026-08-12 |
|---|---|---|
| Repository tokens | `knowledge/design-system/tokens/` still held placeholder values (`#1B4DFF` blue) unrelated to KB | replaced with the real Golem palette (`interactive/primary` `#e00000`) |
| Border widths | `sm: 1px`, `25: 2px` | `border/sm 1px`, `border/md 2px`, `border/lg 3px` |
| Radius | `xs, sm, md, round` | adds `borderRadius/xl 16px`; `round` is named `full` |
| Navigation | "Navigation vs Navigation2 — which is preferred is unknown" | only `CO Navigation / 3.0` is published; the question is resolved |
| Chart palette | 13 chart colours | adds `chart/cool #888eb1` |
| Deprecation | "no official list of deprecated components exists" | Figma marks deprecation in names and page titles; the full list is in this repository |
| Component states | "showcase examples do not cover every state" | the exhaustive variant matrix is now in `components/inventory.json` |

## Sources

- Figma libraries `💠 CORE Components`, `💠 CORE Templates`, `💠 CORE Patterns`,
  `💠 ES Essentials`, `💠 ES Icon`, `💠 ES Illustration`, read through the Figma MCP connector on
  2026-08-12 with the KB organisation account (Societe Generale Group tenant).
- `intro to golem`, the shared Golem introduction frame embedded in every CORE file.
- Golem showcase snapshot of 2026-08-11, used only where Figma could not be read directly: the
  dark and high-contrast colour modes, and the px letter-spacing values.

## Open questions

- Which published Figma library version corresponds to which front-end package version? Nothing in
  Figma states it.
- Is a `⚠︎` mark in Figma also a deprecation in code, or only in design? The Spinner's three
  `⚠︎native` variants suggest the two lifecycles differ.
- The chart family's published names are stale relative to the file. Republishing the library
  would close it; until then both name sets are live.
- `@robert.puschel` holds the domain as an interim owner; a permanent owner from the Golem team is
  still to be named.
- Golem publishes no motion tokens. Is motion defined anywhere, or is it per-platform default?
- Confluence space `KBDS` was not read in this ingest — only the links surfaced by Figma. Ingesting
  it would close most of the remaining gaps, including content limits.
- The `corporate` brand has no observed overrides. Is it identical to `default` by design?
