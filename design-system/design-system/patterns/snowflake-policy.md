---
id: kb-design-system-2026-0006
title: Snowflakes — approved one-off exceptions and how to treat them
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
  - "Figma page '🙀 PA Snowflake ❄️' (page id 6:98129) in file e2shy18VXDr9f8FH2SpaWK, published-component list read via the Figma MCP connector on 2026-08-12; the connector returned 15 of 29 rows and truncated the rest"
  - "Figma page '⚠DRAFT PA Selection' (page id 26258:11919) and '✅ PA Native Back' (page id 13477:334162) in the same file, read 2026-08-12"
  - "Figma file '💠 CORE Patterns' overview node 18180:720808, which lists Snowflake as a pattern category, read 2026-08-12"
related: [kb-design-system-2026-0002, kb-design-system-2026-0003]
tags: [governance, exceptions]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Snowflakes — approved one-off exceptions and how to treat them

**Summary:** A snowflake is a component that exists once, for one place, because the system had no
answer. Golem publishes them so they can be found and eventually removed — not so they can be
reused. Treat a snowflake as a known debt, never as a pattern.

## What a snowflake is

`💠 CORE Patterns` keeps a page called `🙀 PA Snowflake ❄️`. Everything on it is marked `❄` or
`❄️` in its name. The mark says: this solves a real screen, it was approved, and it is deliberately
outside the system. Reusing one spreads the exception; the correct move when you need the same
thing twice is to propose a real component.

Snowflakes are distinct from deprecated components. A deprecated component was right once and is
not any more. A snowflake was never general.

## What is on the page today

At least fifteen components, including:

| Snowflake | Wraps | Why it exists |
|---|---|---|
| `❄ Snowflake / CO Header / Header for Error Pages` | `CO Header / v4.0 iOS` | error pages need a header with no navigation target |
| `❄ Snowflake / CO Text Heading / Heading aligned on center` | `CO Text Heading / v4.0 Page` | the system has no centred page heading |
| `❄ Snowflake / CO Action Stack / Horizontal scrollable action bar` | `CO Action Stack / v3.0` | horizontal scrolling actions are not a system layout |
| `❄ Snowflake / CO Item Display / Alerting Item Display` | `CO Item Display / v5.3` | an item that raises an alert |
| `❄ Snowflake / CO Content Card / v6.2 Promo s externím linkem` | `CO Content Card / v6.2 Promo` | promo card leaving the app |
| `❄️ Snowflake / CO Illustrrated Button / v4.0` | `CO Tooltip / v1.0` | illustrated button, five states, used for BankID |
| `❄ Snowflake / Image editor` | `ES Illustration` | one-off editor UI |
| `❄ Snowflake / Logo KB - O Aplikaci` | `ES Illustration / LogotypeKB` | the about screen |
| `❄️ Snowflake - Fink graph description` | `CO Item Display / v5.3` | one product's chart legend |
| `_CO Item Transaction / Batch Payments` | `CO Icon Avatar` | batch payment rows, three columns |
| `_ListBox`, `_ListBoxItem` | — | list box used by inputs, private |

The connector returned 15 of the 29 published components on this page and truncated the rest, so
this list is incomplete. `components/inventory.json` does not include the patterns library.

Two other pattern pages carry a status in their name and deserve the same caution:
`✅ PA Native Back` (verified: `gestureThreeButtons`, `gestureSwipe` — the Android back gestures)
and `⚠DRAFT PA Selection` (unfinished: two `TMP SCR Layout / AK Large (1024px wide)` drafts).

## Do / don't

- Do read a snowflake to understand how a hard case was solved.
- Do propose a real component when you need the same exception a second time — that is the signal
  the system is missing something.
- Don't place a snowflake on a new screen.
- Don't copy a snowflake into your own file and rename it. That converts a tracked exception into
  an untracked one.
- Don't treat `⚠DRAFT` pattern pages as decided.

## Sources

- The published-component list of `🙀 PA Snowflake ❄️`, read through the Figma MCP connector on
  2026-08-12; each entry's dependency list shows which mainline component it wraps.
- The `✅ PA Native Back` and `⚠DRAFT PA Selection` pages in the same file.

## Open questions

- 14 of the 29 published components in `💠 CORE Patterns` were truncated by the connector and are
  not listed here.
- Golem has no visible expiry or owner on a snowflake. How is one retired?
- Is `❄` ever applied outside the CORE Patterns file? Nothing in the other five libraries carried
  the mark on 2026-08-12.
