---
id: kb-design-system-2026-0013
title: Surface components — Content Card, Product cards, Icon Avatar, Illustration, Personalisation
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
  - "Figma component descriptions of CO Content Card / v6.0 WrapPrimary, v6.2 Promo, v6.1 ⚠︎PromoTargeted and v6.0 ⚠︎PromoRating, file LF8w8yzyLqGKOJvZs1qApB, read via the Figma MCP connector on 2026-08-12"
  - "Figma variant matrices of the 8 Content Card, 19 Products, 5 Personalisation, 3 Icon Avatar and 2 Illustration components in the same file, read 2026-08-12"
  - "Figma variables read from CO Content Card / v6.0 WrapPrimary node 137272:41497 and CO Product CurrentAccount node 51408:216979 on 2026-08-12: borderRadius/md 8, background/surface #ffffff, shadow/panel composite"
  - "Figma frame sizes of ES Illustration / AccountGeneralS (125×96) and AccountGeneralM (375×212), file R240iYyZkmWZHsVvYLyjDp, read 2026-08-12"
related: [kb-design-system-2026-0008, kb-design-system-2026-0016]
tags: [components, cards, products]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Surface components — cards and the things that sit on them

**Summary:** A card is a container with a radius, a white surface and the panel shadow. Golem has
one generic card in three weights, one promo card, two notification cards, and sixteen
product-specific cards that are not interchangeable with them.

## Purpose, in Golem's own words

> A content card is a visually distinct container that showcases information in an organized and
> concise manner. Has general variants and specific-use variants. This variant wraps any content
> and has no parameters or functionality. — `CO Content Card / v6.0 WrapPrimary`

> This variant displays promo messages within the application, eg. on homescreen. **Use
> illustrations in size 125×96px.** — `CO Content Card / v6.2 Promo`

## CO Content Card — 8 components

| Component | Use | Axes |
|---|---|---|
| `v6.0 WrapPrimary` | the default card; wraps anything | none |
| `v6.0 WrapSecondary` | a lighter card inside another surface | none |
| `v6.0 WrapHighlighted` | a card that must stand out | none |
| `v6.2 Promo` | promotional message | `Loaded`, `Closable = No · yes`, `s = responsive` |
| `v6.0 NotificationCard` | the communication-centre card | `Loaded`, `$title only = no · yes` |
| `v6.0 NotificationItem` | a notification in a list | `Loaded`, `Read = no · yes` |
| `v6.0 ⚠︎PromoRating` | **deprecated** | use `v6.2 Promo` |
| `v6.1 ⚠︎PromoTargeted` | **deprecated** | use `v6.2 Promo` |

The wrappers have no properties at all — they are pure containers. Everything inside is your
content, laid out with the `padding/*` scale. A card is `background/surface`, `borderRadius/md` 8
and the **panel** shadow.

`v6.2 Promo` as rendered: `$title` in **`headings/headlineSecondaryBold` 18/24 weight 600**,
`$caption` in `content/bodySecondaryBold` 14/20 in `content/secondary`, the `S` illustration
(125 × 96) on the trailing edge, and one of two affordances — a `caretRight` when `Closable = No`,
a close ✗ when `Closable = yes`. Never both. `Loaded = no` replaces the text with three skeleton
bars and the illustration with a grey block.

The title style is worth naming: `headlineSecondaryBold` is the **only 600 cut Figma uses on a
screen**, which contradicts the note in `tokens/typography.tokens.json` that the 600 weights are
web-only. Read from the savings homescreen (`SCR NDB Home screen - Spoření`) on 2026-08-12, where
five promo cards use it. An earlier version of this file recorded the title as
`content/bodyPrimaryBold`; that was wrong.

**Cards own their padding.** The retired `⚠ TMP Content Card with outside padding` template exists
because they once did not. Never wrap a card in a spacing frame to fake an inset.

## Product cards — 16 components, one per product, two per placement

`CO Product <Product> / v<n> Homescreen` and `… / Detail`, for: `Card`, `CurrentAccount`,
`Insurance`, `Investment`, `Loan`, `Savings`. Plus `Investment / DetailInvestmentAndWallet`,
`Savings / DetailSavingsEnvelope` and `Savings / ItemSavingsEnvelope`.

Their state axis is unlike anything else in the system, because the sign of the balance is part of
the state:

- `CO Product CurrentAccount / v3.0 Homescreen`:
  `State = EnabledPositive · EnabledNegative · HoverPositive · HoverNegative · FocusPositive ·
  FocusNegative · Loading`
- `CO Product Card / v2.0 Homescreen`:
  `card state = EnabledActive · EnabledOther · HoverActive · HoverOther · FocusActive ·
  FocusOther · Loading`

So a negative balance is not a colour you apply — it is a variant you select. `Homescreen` is the
compact form for the product list; `Detail` is the header of the product's own screen.

What the `Negative` variants actually change, as rendered: the balance switches to
`attention/alert` `#b53022` and carries the minus sign. Everything else stays. The row itself is
`$name` and `$num` in `content/captionPrimaryBold`, the balance in `headings/titleTertiary` 28/36
with the currency in `content/bodySecondary` beside it, then optional `$overdraft`, `$owner`, a
`.message` line with an info icon, and a `CO Tag` for a multi-currency value. `Hover` tints the
whole card, `Focus` puts a 2 px `interactive/secondary` ring around it, `Loading` is skeletons.

Because the colour and the minus always travel together, the sign survives for a colour-blind
user — but do not add your own red to a positive card to mean something else.

`CO Product Investment / v4.0 HomescreenExternal` (42 instances) is for investments held elsewhere.

**The family is not uniform — there are five shapes.** An earlier version of this file said
knowing one card meant knowing all sixteen. Rendering them disproved it, and the differences are
the reason each product has its own component instead of one card with a product property:

| Shape | Cards | What it holds |
|---|---|---|
| Balance | `CurrentAccount`, `Savings`, `Loan` | `$name` / `$num`, a large amount with the currency beside it, `$caption`, `$owner`, `.message`, trailing caret. Red when negative. |
| Payment card | `Card` | a **card thumbnail** with the KB mark and a colour stripe, `$name`, `$num`, `$expiry`, `.message`, caret — and below it a row of **wallet badges** (Apple Pay, G Pay, Garmin, Fitbit). `EnabledOther` mutes the art and drops the wallet row. |
| No amount | `Insurance` | `$name`, `$caption`, `.message`, caret. An insurance policy has no balance, so the card has no number in it at all. |
| External | `Investment / HomescreenExternal` | `$name`, `$caption`, `.message` and an **open-in-new** icon instead of a caret — the holding lives outside the app, and the affordance says so. |
| Goal | `Savings / ItemSavingsEnvelope` | `$name`, the amount, then a **progress bar** with `$maxLabel $maxValue` beneath it. |

The shapes share their state axis, their tokens and their hover, focus and loading behaviour.
They do not share their anatomy. Check which shape you need before assuming a balance exists.

**`Detail` is the same shape minus the caret.** The homescreen form is a row you tap; the detail
form is the header of the screen you land on, so it drops the navigation affordance and keeps
everything else. Verified on CurrentAccount, Card, Insurance and the savings envelope. The
envelope detail goes slightly further and puts `$label $value` under the left end of its progress
bar to pair with `$maxLabel $maxValue` on the right.

## CO Icon Avatar — Small, Medium, Large

`Style = Photo · Logo · Initials · Icon` · `Loaded = Yes · No`. Small is the 32 px avatar used in
list items (`Left Icon size = 32`), a rounded square at `borderRadius/sm` 4 on
`background/surfaceAvatar` (`#21212114`).

The avatar carries an **`ES SubIcon` badge at its bottom-right corner** — that is where a
transaction's `Waiting`, `Blocked` or `Recurring` state is shown. The badge is part of the avatar,
not something you place beside it, which is why the subicon sizes are 14 and 28: one per avatar
size.

## CO Illustration v3.0

`Width = FullWidth`. A container that centres a swapped `ES Illustration` at content width — and
like every other swap slot in the library it ships showing the `⚠︎Placeholder` box, so an
untouched instance is a deprecated placeholder. `_CO Illustration ⚠︎v4.0` is private and
deprecated despite the higher number.

Illustration sizes come from the asset library, not from this component: **S is 125 × 96, M is
375 × 212**, and each has a dark-mode twin. The promo card's own description pins it to the S size.

## CO Personalisation v1.0 — Product and Subject

`State = Enabled · Disabled · Loading`. The only component family with a real disabled state.

This is the "arrange my overview" row, not a decorative tile. As rendered it is: an eye toggle on
the leading edge (open eye = shown, struck-through eye = hidden), `$name` in
`content/captionPrimaryBold`, the value in `headings/titleTertiary` with its currency, and two
arrow buttons on the trailing edge for moving the row up and down. `Disabled` greys the whole row
including the value — that is the hidden state, and it is the reason this family has a disabled
state at all. `Subject` is the same row for switching the acting person or company.

## States

Loading everywhere: `Loaded` on cards, `Loaded` on Icon Avatar, `State = Loading` on products and
Personalisation. Hover and focus exist only on the product cards, because only they are whole
interactive surfaces.

## Content limits

Not defined, with one exception that is: promo illustrations are 125 × 96. For the rest, the card
grows with its content, which is precisely why a character limit matters and why its absence is
worth raising.

## Accessibility

- A card is not a landmark and not a button. If the whole card is clickable — as the product cards
  are — it needs one accessible name and one focus stop, not one per element inside.
- `Focus…` product-card variants exist; use them rather than a browser default outline.
- The negative-balance variants must not rely on colour to signal the sign; the value carries a
  minus.
- Decorative illustrations are `aria-hidden`. An illustration that carries the message — an empty
  or error state — needs a text alternative.
- Dark mode removes every shadow, so a card is distinguished only by `background/surface` against
  `background/body`. Do not reduce that contrast further.

## Do / don't

- Do use `WrapPrimary` unless you have a reason for another weight.
- Do use the product component for the product; a generic card with a balance in it is not the
  same component and will not match production.
- Do use `Closable = yes` on a promo only where dismissal is actually implemented.
- Don't use the two deprecated promo cards.
- Don't nest a `WrapPrimary` inside a `WrapPrimary`.
- Don't add padding around a card.

## Code

```css
.card {
  padding: var(--padding-xl);                  /* 16px */
  border-radius: var(--border-radius-md);      /* 8px */
  background: var(--background-surface);
  box-shadow: var(--shadow-panel);
}
@media (prefers-color-scheme: dark) { .card { box-shadow: none; } }
```

## Sources

- The four Content Card descriptions, quoted verbatim.
- Variant matrices of all 37 components in this family.
- Rendered screenshots of `CO Content Card / v6.2 Promo` (136525:2017),
  `CO Product CurrentAccount / v3.0 Homescreen` (51408:216979) and
  `CO Personalisation / v1.0 Product` (5171:15366), read 2026-08-12 — the described behaviour of
  the promo affordances, the negative-balance colour and the personalisation row comes from there
  rather than from the variant names.
- Rendered screenshots of `CO Product Savings / v3.0 Homescreen` (72411:245681),
  `CO Product Loan / v3.0 Homescreen` (58433:253291),
  `CO Product Insurance / v3.0 Homescreen` (58433:253391),
  `CO Product Card / v2.0 Homescreen` (55638:232541),
  `CO Product Investment / v4.0 HomescreenExternal` (26726:18835),
  `CO Product Savings / v3.0 ItemSavingsEnvelope` (73661:246421),
  `CO Icon Avatar / Small` (79894:293371) and `CO Illustration v3.0` (3721:152981), read
  2026-08-12 — the five product shapes are a transcription of those six cards.
- Token values read from the WrapPrimary and CurrentAccount nodes.
- Illustration frame sizes measured on `ES Illustration / AccountGeneralS` and `…M`.

## Open questions

- `WrapSecondary` and `WrapHighlighted` have 0 in-library instances. Are they live?
- `_Product Card tokens` suggests product cards have their own token layer that this ingest did
  not read.
- Nothing states when a product uses `Homescreen` versus a plain list row.
