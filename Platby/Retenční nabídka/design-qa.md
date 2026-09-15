# Design QA — Retenční nabídka při nové platbě

## Source visual truth

- Bottom sheet: `/home/lukinab/.codex/attachments/38c4e353-cc6e-4c8f-8683-7510a9df5b6a/codex-clipboard-0d1f3909-514e-40cb-b9f2-8301400e961f.png`
- Viewport reference: 375 × 812 CSS px, light sheet over darkened payment screen.

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

- Sheet výška: 364 px.
- Handle: 48 × 4 px, centrovaný.
- Close: šedý kruh 28 × 28 px s bílým křížem.
- Ilustrace: repository asset `savings-offer-light.png`, zvětšený podle reference.
- Bez rozdílů P0/P1/P2 proti dodané referenci.

## Primary interactions tested

- Částka 250 001 Kč → otevře bottom sheet.
- `Pokračovat k platbě` → pokračuje do kroku 2, souhrnu, PIN a resultu.
- Result neobsahuje retenční nabídku.
- `Sjednat termínovaný účet` → `#term-account`; `Zavřít` → `#step1`.
- Console errors: žádné.

final result: passed
