# Design QA — Retenční nabídka při nové platbě

**Source visual truth**

- Krok 1: `/home/lukinab/.codex/attachments/c1c963b8-c5b0-4329-9a15-606d15a83c79/codex-clipboard-f23ad8d4-599d-4fbc-9584-ce9159e3e5f7.png`
- Výsledek: `/home/lukinab/.codex/attachments/60acde5f-9bab-4f68-b6d3-4aee11c0425a/codex-clipboard-0c91f81c-7076-47f4-bb7c-afb6c9028e7c.png`

**Implementation evidence**

- Krok 1 s částkou 250 001 Kč: `/home/lukinab/.codex/visualizations/2026/09/02/01a060b8-b784-7f12-ac29-7599bce254ef/07-step1-final.png`
- Výsledek s promo kartou: `/home/lukinab/.codex/visualizations/2026/09/02/01a060b8-b784-7f12-ac29-7599bce254ef/08-result-final.png`
- Bottom sheet: `/home/lukinab/.codex/visualizations/2026/09/02/01a060b8-b784-7f12-ac29-7599bce254ef/03-bottom-sheet.png`
- Detail nabídky: `/home/lukinab/.codex/visualizations/2026/09/02/01a060b8-b784-7f12-ac29-7599bce254ef/02-detail.png`

**Viewport and normalization**

- CSS viewport: 390 × 844 px, light theme, mobile breakpoint, device scale factor 1.
- Source step 1: 750 × 1624 px; normalized to 390 × 844 px.
- Source result: 782 × 1642 px including source capture edge; normalized with centered fit to 390 × 844 px.
- Implementation captures: 390 × 844 px.
- Full comparisons: `qa-step1-full.png`, `qa-result-full.png`.
- Focused comparisons: `qa-step1-focus.png`, `qa-result-focus.png`.

**State**

- Standard payment in CZK to an external bank.
- Amount 250 001 Kč: retention eligibility active.
- Offer ignored in step 1 and bottom sheet; promo remains visible on result.

**Findings**

- No actionable P0/P1/P2 differences remain.
- Fonts and typography: Inter, token weights, sizes and hierarchy match the existing flow; two-line promo wrapping is intentional at 390 px.
- Spacing and layout rhythm: header, fields, bottom action bar, result composition, radii and card elevation follow the reference and DS tokens.
- Colors and tokens: body/surface, KB red, text hierarchy, border and shadow tokens match the repository design system.
- Image quality and asset fidelity: only repository ES Illustration and ES Icon assets are used for new retention surfaces; no placeholder artwork remains.
- Copy and content: base payment copy follows the supplied flow; retention copy is contextual, amount-aware and consistent across item, detail, sheet and result.

**Comparison history**

1. First pass found P2 drift in step 1: close icon instead of `Zavřít`, bordered account selector and elevated contact row. Fixed with reference-faithful header text, transparent account selector and flat contact navigation. Post-fix evidence: `07-step1-final.png`, `qa-step1-full.png`, `qa-step1-focus.png`.
2. First result pass found P2 illustration scale drift: success motif appeared too small. Fixed by using the repository `success-light.png` asset in a centered 212 × 142 crop slot. Post-fix evidence: `08-result-final.png`, `qa-result-full.png`, `qa-result-focus.png`.

**Primary interactions tested**

- 250 000 Kč: offer hidden.
- 250 001 Kč: CO Item Navigation visible.
- Item opens detail; `Zpět`/`Teď ne` returns to origin.
- Continue opens retention bottom sheet.
- Browser/mobile back closes the sheet and keeps step 1.
- Ignore continues to step 2, summary, authorization and result.
- Result promo opens detail and returns to result.
- Console errors and warnings: none.

**Implementation Checklist**

- [x] Eligibility threshold and currency condition.
- [x] CO Item Navigation on primary card.
- [x] Informative offer detail.
- [x] Bottom sheet on step transition.
- [x] CO Content Card / v6.2 Promo on result.
- [x] Hash navigation and localStorage persistence.
- [x] Mobile browser interaction and visual QA.

**Follow-up Polish**

- P3: replace prototype activation with the real savings-product activation contract when backend behavior is defined.

final result: passed
