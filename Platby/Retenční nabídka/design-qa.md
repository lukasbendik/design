# Design QA — Retenční nabídka při nové platbě

**Source visual truth**

- Krok 1 / banner: `/home/lukinab/.codex/attachments/c1a89f7f-9086-443b-aed8-15b1062f8782/codex-clipboard-9d1d390f-56a3-48d5-b779-6d66928b9085.png`
- Krok 1 / částka a zůstatek: `/home/lukinab/.codex/attachments/05d46105-1bf5-40ed-ae4b-77b7c6f0dd27/codex-clipboard-fa5f601f-2922-41c7-bb75-7a804496caae.png`
- Výsledek: `/home/lukinab/.codex/attachments/60acde5f-9bab-4f68-b6d3-4aee11c0425a/codex-clipboard-0c91f81c-7076-47f4-bb7c-afb6c9028e7c.png`

**Implementation evidence**

- Krok 1 s částkou 250 001 Kč: `/home/lukinab/.codex/visualizations/2026/09/02/01a060b8-b784-7f12-ac29-7599bce254ef/07-step1-final.png`
- Výsledek s promo kartou: `/home/lukinab/.codex/visualizations/2026/09/02/01a060b8-b784-7f12-ac29-7599bce254ef/08-result-final.png`
- Bottom sheet: `/home/lukinab/.codex/visualizations/2026/09/02/01a060b8-b784-7f12-ac29-7599bce254ef/03-bottom-sheet.png`
- Aktualizovaný bottom sheet: `/home/lukinab/.codex/visualizations/2026/09/02/01a060b8-b784-7f12-ac29-7599bce254ef/12-bottom-sheet-final.png`
- Detail nabídky: `/home/lukinab/.codex/visualizations/2026/09/02/01a060b8-b784-7f12-ac29-7599bce254ef/02-detail.png`

**Viewport and normalization**

- CSS viewport: 390 × 844 px, light theme, mobile breakpoint, device scale factor 1.
- Source step 1: 750 × 1624 px; normalized to 390 × 844 px.
- Source result: 782 × 1642 px including source capture edge; normalized with centered fit to 390 × 844 px.
- Implementation captures: 390 × 844 px.
- Full comparisons: `qa-step1-full.png`, `qa-result-full.png`.
- Latest banner comparison: `qa-banner-full-final.png` against the updated supplied screenshot.
- Focused comparisons: `qa-step1-focus.png`, `qa-result-focus.png`.
- Bottom-sheet comparison: `qa-bottom-sheet-final.png` proti dodanému screenshotu bottom sheetu.

**State**

- Standard payment in CZK to an external bank.
- Amount 250 001 Kč: retention eligibility active.
- Source account balance: 748 320 Kč; balance hint dynamically subtracts the entered amount.
- Offer ignored in step 1 and bottom sheet; promo remains visible on result.
- Bottom sheet uses requested hierarchy: primary `Pokračovat`, tertiary `Získat vyšší sazbu` in content, black benefit text.

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
3. Updated source banner comparison found P2 drift in promo height and copy hierarchy: an extra kicker increased the card and did not match the supplied banner. Fixed with standard item-navigation row geometry, no kicker, 102 px card height, 24/16 horizontal padding and 748 320 Kč dynamic balance. Post-fix evidence: `11-banner-final.png` and the supplied banner source.
4. New bottom-sheet request found P2 action hierarchy drift: primary action was retention activation and benefit was green. Fixed by moving activation to a tertiary content action, making `Pokračovat` the only primary action, returning activation to step 1 and using black benefit text. Post-fix evidence: `12-bottom-sheet-final.png`, `qa-bottom-sheet-final.png`. Difference from the attached source is intentional per the explicit request.

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
