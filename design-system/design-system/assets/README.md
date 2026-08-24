# Assets — the files, not just the inventory

`icon-inventory.json` and `illustration-inventory.json` say what exists in Figma.
This folder holds the files a prototype can actually use, so nothing has to be downloaded per
deliverable and no two outputs carry different copies of the same icon.

| Folder | What | Format |
|---|---|---|
| `icons/` | `ES Icon` and `ES Interaction Image` exports | SVG, `currentColor` |
| `illustrations/` | `ES Illustration` motifs, light and dark | PNG, transparent, 424 × 424 |
| `fonts/` | Inter 400 / 500 / 600, latin and latin-ext | woff2 + SIL OFL licence |

Use them through the prototype kit rather than by hand:
[`../prototype-kit/icons.js`](../prototype-kit/icons.js) injects every icon as a sprite, and
[`../prototype-kit/fonts.css`](../prototype-kit/fonts.css) loads Inter from `fonts/`.

## Why the files are edited, and how

An SVG straight out of Figma is not usable as an icon. Two mechanical edits, applied by
[`../prototype-kit/build-icons.py`](../prototype-kit/build-icons.py) when it reads them and by hand
when they were saved:

1. **The `#E5E5E5` rectangle goes.** Figma exports the component's frame fill with the glyph; left
   in, every icon carries a grey square.
2. **`fill="black"` becomes `fill="currentColor"`.** Without it an icon cannot take the colour of
   the row it sits in — and the red icons on a KB+ screen are exactly that: an
   `interactive/primary` colour applied to a black glyph, not a red asset.

3. **A cropped export is re-centred, never redrawn.** When an icon is pulled out of a screen rather
   than out of the icon library, Figma returns the vector cropped to its own bounding box — 19.5 ×
   20.86 for `Home`, say, instead of 24 × 24. The crop is put back into a 24 × 24 box by centring
   it: `translate((24 − w) / 2, (24 − h) / 2)`. Every crop measured this way matched the inset
   percentages Figma reports for the layer to four decimals, so this is arithmetic, not judgement.
   The thirteen icons added on 2026-08-12 were made this way and the transform is visible in each
   file's `<g transform="…">`.

Nothing else is touched. No path is redrawn, no viewBox is changed, no icon is invented. If a
motif is missing, that is a gap to raise with the design system, not something to draw.

`logotype-kb.svg` is the one assembled file: `ES Illustration / LogotypeKB` exports as five
separate vectors — the red square, the black square, the white bar, the K and the B — and they were
placed back into the 83 × 31.5 frame using the inset percentages Figma reports for each. The red
keeps the brand red `#E60028`, which is **not** `interactive/primary` `#e00000`; the black parts
take `currentColor` so the mark inverts with the colour mode.

## Illustrations

The artwork is transparent and square. Golem frames it at two sizes — `M` is 375 × 212 with the
art 212 × 212 in the middle, `S` is 125 × 96 with the art 96 × 96 — so one file serves both and the
frame is CSS (`.illustration`, `.illustration--s` in the kit). Exporting the Figma *frame* instead
would bake in the grey canvas fill and lose the transparency, which is why these are the raw
artwork rather than a node export.

Every motif has a dark twin. Screens must swap them with the colour mode; the dark file is not a
darker version of the light one, it is a different render.

## Provenance

Read through the Figma MCP connector on 2026-08-12, from the KB organisation account.

| File | Figma library | File key | Node |
|---|---|---|---|
| `icons/wallet.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3109:699` |
| `icons/chart.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3109:616` |
| `icons/deposit-withdrawal.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3265:280` |
| `icons/listed-items.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3109:700` |
| `icons/moneybox.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3109:692` |
| `icons/send-payment.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3109:695` |
| `icons/delete.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3109:372` |
| `icons/plus.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3109:347` |
| `icons/key.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `4833:91` |
| `icons/bank.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3109:686` |
| `icons/percent.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3111:126` |
| `icons/calendar.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3109:577` |
| `icons/info.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3109:602` |
| `icons/error.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `3109:374` |
| `icons/home.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `49520:2479` |
| `icons/extra-services.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `4521:92` |
| `icons/card.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `49520:2481` |
| `icons/pay-me.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `40683:27200` |
| `icons/bar-chart.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `50306:4435` |
| `icons/insurance.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `40683:27461` |
| `icons/text-file.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `40683:27206` |
| `icons/pdf.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `40683:27413` |
| `icons/person.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `40683:27204` |
| `icons/copy.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `40683:27415` |
| `icons/edit.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `40683:27407` |
| `icons/contracts.svg` | `💠 ES Icon` | `QOUtQjwwGQvhuJv4kUbSTm` | `40683:27467` |
| `icons/logotype-kb.svg` | `💠 ES Illustration` | `R240iYyZkmWZHsVvYLyjDp` | `49520:2507` |
| `icons/caret-right.svg` | `💠 ES Essentials` | `xOURtHkYRN70tbZdQPWlw2` | `225:281` |
| `icons/caret-left.svg` | `💠 ES Essentials` | `xOURtHkYRN70tbZdQPWlw2` | `225:276` |
| `icons/close.svg` | `💠 ES Essentials` | `xOURtHkYRN70tbZdQPWlw2` | `225:272` |
| `illustrations/savings-offer-*.png` | `💠 ES Illustration` | `R240iYyZkmWZHsVvYLyjDp` | `9985:48793` / `9985:48795` |
| `illustrations/savings-for-children-*.png` | `💠 ES Illustration` | `R240iYyZkmWZHsVvYLyjDp` | `17161:123671` / `17161:123673` |
| `illustrations/term-accounts-*.png` | `💠 ES Illustration` | `R240iYyZkmWZHsVvYLyjDp` | `35140:31004` / `35140:31006` |
| `illustrations/building-savings-offer-*.png` | `💠 ES Illustration` | `R240iYyZkmWZHsVvYLyjDp` | `33617:150370` / `33617:150372` |
| `illustrations/pensions-offer-*.png` | `💠 ES Illustration` | `R240iYyZkmWZHsVvYLyjDp` | `6298:25228` / `6298:25230` |
| `illustrations/success-*.png` | `💠 ES Illustration` | `R240iYyZkmWZHsVvYLyjDp` | `803:10996` / `803:11227` |

Fonts are Inter 5.x from `@fontsource/inter`, subsets `latin` and `latin-ext`, weights 400, 500 and
600, under the SIL Open Font Licence 1.1 (`fonts/LICENSE.txt`). Golem uses 400 and 500 everywhere;
600 exists for the one Bold heading token that `CO Content Card / v6.2 Promo` uses.

## What is deliberately not here

- **No photographs.** `CO Icon Avatar` in the Figma files carries a photo of a person. A prototype
  uses the `Initials` style instead — a face is personal data and the repository holds none
  (`AGENTS.md` §2, rule 4).
- **No `Sources` page artwork.** Those are masters, not assets.
- **No icon that a screen does not use.** The inventories list all 364 icons and 1070
  illustrations; this folder grows one file at a time, on demand, with its node id recorded above.
