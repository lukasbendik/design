# Tokens

Machine-readable Golem essentials (`ES`). W3C DTCG JSON. **Any agent producing a visual artefact
reads these files and never hard-codes a value.**

| File | Contains |
|---|---|
| `color.tokens.json` | semantic colour, 4 UI modes, 3 brands |
| `typography.tokens.json` | Inter scale, headings and content |
| `spacing.tokens.json` | padding scale, border widths, sizing |
| `radius.tokens.json` | corner radius |
| `elevation.tokens.json` | the three composite shadows |
| `breakpoint.tokens.json` | design canvas widths |

## How to read a token name

Names are the Figma variable names from `💠 ES Essentials`, with `/` flattened to `.`:
`interactive/primary` → `color.interactive.primary`. Keeping the Figma name means a designer and a
model are talking about the same thing without a mapping table.

## Modes and brands

`$value` is always **light / default brand**. Everything else is in
`$extensions.golem.modes` (`dark`, `highContrastLight`, `highContrastDark`) and
`$extensions.golem.brands`.

### How the dark values were checked

Figma resolves a variable in whatever mode the queried node sits in, so a plain read always returns
light. Two components carry a `Dark = yes` variant whose frame switches the mode —
`_Product Card tokens` in CORE Components and `ES SubIcon / Stopwatch` in ES Essentials. Reading
those nodes returns dark-resolved values, and both agreed with the showcase snapshot exactly
(`content/primary` `#f9f9f9`, `background/body` `#0d0d0d`).

So the dark column is **spot-checked against Figma, not fully re-read from it**: two tokens
verified, the rest carried over from the 2026-08-11 snapshot that those two vouch for. The same
trick will verify any other dark value if you need certainty on a specific one — find a node in a
dark-mode frame that uses it. The high-contrast modes have no such node and remain
snapshot-only.

Two rules that are easy to get wrong:

- **Dark mode has no shadows.** Every shadow colour resolves to fully transparent. Depth in dark UI
  comes from `background.surface` against `background.body`, and from borders.
- **The `internal` brand replaces KB red with blue** (`#1374cd`). Nothing else changes. Never
  produce an internal-brand screen with red primary actions.

## What is deliberately not here

- **Motion.** Golem has no published motion tokens; the showcase carries Lottie animations instead.
- **Icon and illustration assets.** They are components, not tokens — see `../assets/`.
- **The 32px and 64px padding names.** The steps exist; the token names are inferred. Marked in the
  file.

Provenance and open questions for the whole design-system domain live in
[`../golem-design-system.md`](../golem-design-system.md).
