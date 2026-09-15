# Design QA — Retenční nabídka při nové platbě

## Source visual truth

- Bottom sheet: `/home/lukinab/.codex/attachments/141f147d-01b7-4208-a0b9-eb50bbda542d/codex-clipboard-f29a1a08-96a9-4695-9731-da70dbd5bb3a.png`
- Termínovaný účet: `/home/lukinab/.codex/attachments/3fa58b5e-4ae0-4673-b676-47818f0d732e/codex-clipboard-945d8a85-f4f2-4dfb-bb89-32a862906d2e.png`
- Viewport: 455 × 916 CSS px; mobilní rámec 430 px, scale 1.

## Implemented state

- Retenční nabídka existuje pouze jako bottom sheet po zadání částky nad 250 000 Kč v CZK.
- Odstraněn promo banner z kroku 1.
- Odstraněna promo karta z result obrazovky.
- Odstraněn samostatný detail retenční nabídky.
- Sheet copy odpovídá příloze:
  - `Zhodnocujte 3,5 % p. a.`
  - `Vložte si peníze na termínovaný účet na 6 měsíců.`
  - `Sjednat termínovaný účet`
  - `Pokračovat k platbě`
- Zachována navigace do dalšího kroku platby přes primární CTA.
- Odkaz `Sjednat termínovaný účet` otevírá novou obrazovku termínovaného účtu podle dodané reference.
- Obrazovka obsahuje `Zavřít`, ilustraci `term-accounts-light.png`, tři benefit řádky a CTA `Pokračovat` / `Jak to funguje?`.

## Visual QA

- Sheet výška: 399 px; horní hrana 509 px.
- Handle: 48 × 4 px, centrovaný.
- Close: šedý kruh 28 × 28 px s bílým křížem.
- Ilustrace sheetu: repository asset `savings-offer-light.png`, ukotvená nad sheetem podle reference.
- Text sheetu: titulek 693 px, copy 737 px, odkaz 797 px a CTA 833 px.
- Termínovaný účet: titulkový blok, tři benefit řádky a sticky patička porovnány na stejném viewportu; použita ilustrace `term-accounts-light.png`.
- Fonty a copy: Inter, tokenové barvy a přesné znění z referencí.
- Spacing/layout, barvy, image assety a CTA: bez rozdílů P0/P1/P2.
- Bez rozdílů P0/P1/P2 proti dodané referenci.

## Primary interactions tested

- Částka 250 001 Kč → otevře bottom sheet.
- `Pokračovat k platbě` → pokračuje do kroku 2, souhrnu, PIN a resultu.
- Result neobsahuje retenční nabídku.
- `Sjednat termínovaný účet` → `#term-account`; `Zavřít` → `#step1`.
- Console errors: žádné.

final result: passed
