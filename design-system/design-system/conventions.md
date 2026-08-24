---
id: kb-design-system-2026-0002
title: Golem naming, versioning and deprecation marks
type: best-practice
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
valid_from: 2026-08-12
review_by: 2027-08-12
sources:
  - "Figma component and page names across '💠 CORE Components' (150), '💠 CORE Templates' (47), '💠 CORE Patterns' (29), '💠 ES Essentials' (50), read via the Figma MCP connector on 2026-08-12"
  - "Figma sticky note in '💠 ES Essentials' node 905:580: names are fixed, never rename or remove, only mark as deprecated or replaced"
  - "Figma component descriptions on TMP SCR Layout component sets, file dbNZdTD169mAZ39fNGlNUg, read 2026-08-12"
related: [kb-design-system-2026-0001, kb-design-system-2026-0003]
tags: [governance, deprecation, naming]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Golem naming, versioning and deprecation marks

**Summary:** Golem encodes lifecycle in the name, not in a separate register. A model that cannot
read these marks will happily place a deprecated component on a new screen. This file is the
decoder.

## Names are permanent

Golem's own rule, stated on a sticky note in ES Essentials: *names are fixed, never rename or
remove something, only mark it as deprecated or replaced. Naming changes are only additive.*
Content, vectors and colours change with a new version; names do not. This is why the version
number lives in the name and why nothing ever disappears from the library.

## The name grammar

```
CO Item Navigation / v5.2
│  │                 └── version — higher wins, both stay published
│  └── component family
└── layer prefix: ES | CO | PA | TMP
```

Platform and breakpoint appear as a suffix or as a variant property, not as separate components:
`CO Header / v4.0 iOS`, `CO Header / v4.0 IB Ground`, `CO Toolbar / v3.0 Floating`.

## Marks, and what to do about each

| Mark | Where | Means | What you do |
|---|---|---|---|
| `⚠` / `⚠︎` / `⚠️` | component name, page name, **or a single variant option** | deprecated | never use in new work; if you find it in existing work, replace it |
| `- deprecated` | page name | the whole page is dead | ignore everything on it |
| `_` | start of a component name | private sub-part of another component | never place it directly; it arrives with its parent |
| `.` | start of a component name (`.message`, `.balanceValue`) | text-slot helper | same as `_` |
| `❄` / `🙀 Snowflake` | component or page name | a one-off exception approved for exactly one place | do not reuse; see [`patterns/snowflake-policy.md`](patterns/snowflake-policy.md) |
| `✅` | page name, variable name | verified / current | safe |
| `DRAFT` | page name | unfinished proposal | do not build on it |
| `🚨Detach me!` | component description | a template, not a component | detach the instance and rename it `SCR …` |
| `🔥 uprav:` | variant option name (Czech, "edit:") | placeholder copy you must replace | replace before handoff |
| `✏️` | property name | free-text slot | fill it; `$label`-style defaults are placeholders |
| `$name` | default property value | token for real content | never ship a screen with `$` text visible |
| `⚠︎Placeholder` | the **default value of every instance-swap icon slot** | a deprecated stand-in icon | swap it for a real `ES Icon`, or switch the slot off |

The mark can sit on a **single variant option of an otherwise healthy component**. `CO Button Bar
Bottom / v4.0` is stable, but its size `⚠︎ md-lg-IB` and its whole `⚠︎ Buttons` property are not.
`components/inventory.json` records these as `doNotUse` per component; there are 21 of them.

It can also sit on a **default value**. Every instance-swap icon slot in the library defaults to
`⚠︎Placeholder`, so the most common way to ship deprecated design is to place a healthy component
and leave its icon alone. No inventory check catches that — only looking does.

## A file name and a published name can differ

Golem's "names are permanent" rule applies to the Figma file. The **published library** only
changes when someone republishes it, so a rename that has not been published leaves two live names
for the same component. On 2026-08-12 the whole `CO Chart` family was in that state: the file says
`CO Chart / Donut IB`, the library serves `CO Chart / v5.0 Donut IB`.

Which one you need depends on what you are doing. Designing in Figma: the file name. Writing code
or Code Connect: the published name. When they disagree, say which you mean.

## Version pairs that look like duplicates

Where two versions coexist, the higher number is current and the lower stays only so existing
screens keep resolving:

- `CO Content Card / v6.2 Promo` is current; `v6.1 ⚠︎PromoTargeted` and `v6.0 ⚠︎PromoRating` are not.
- `CO Illustration v3.0` is current; `_CO Illustration ⚠︎v4.0` is marked private **and**
  deprecated — a higher number is not automatically newer when it also carries a mark.
- `CO Header / v4.0 IB Ground` offers `New_main page` and `New_subpage` alongside the old ones.
  Use the `New_` variants for new screens.
- The two `CO Chart` generations are **both live on purpose** — the current set for new screens,
  the legacy set kept because production screens still use it and the migration is gradual. Neither
  is marked. See [`components/co-data-display.md`](components/co-data-display.md) for which is
  which and when to use each.

## Status vocabulary used in this repository

`components/inventory.json`, `templates/inventory.json` and the asset inventories carry a
normalised `status` derived from the marks above:

| status | Meaning |
|---|---|
| `stable` | published, unmarked — use it |
| `deprecated` | marked, or living on a marked page — never use in new work |
| `internal` | `_`- or `.`-prefixed private sub-part |
| `snowflake` | approved one-off, not reusable |
| `draft` | on a DRAFT page, or a `_TEST` asset |

Counts on 2026-08-12: components 110 stable / 6 deprecated / 34 internal · templates 36 / 10 / 1 ·
icons 352 / 1 / 11 · illustrations 511 / 35 / 520 internal + 4 draft.

## Sources

- Component, page and variant names across the six Golem Figma libraries, read through the Figma
  MCP connector on 2026-08-12.
- The ES Essentials sticky note stating the additive-naming rule.
- Component descriptions on the TMP SCR Layout sets, which carry the `🚨Detach me!` instruction.

## Open questions

- `⚠︎` is used for "deprecated", "do not use yet" and "known problem" without distinction. Golem
  has no separate mark for each. Confirm with the design-system owner whether a single
  interpretation is safe.
- Does a Figma deprecation mark imply the code component is also deprecated? Unverified.
