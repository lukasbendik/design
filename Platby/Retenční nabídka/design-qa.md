# Design QA — Retenční nabídka při nové platbě

## Zdrojová vizuální pravda

- Bottom sheet: `/home/lukinab/.codex/attachments/8fae7624-50e6-45e8-a231-592c4d73c87f/codex-clipboard-06d5ee4b-5e8e-4149-a15b-96610958037c.png` (750 × 1624 px, normalizováno na 375 × 812 CSS px, DPR 2 → 1).
- Termínovaný účet: `/home/lukinab/.codex/attachments/7c69fb54-d879-4d34-bbbe-b8cff513ccf7/codex-clipboard-255adcea-e41c-4bce-ab6b-549458be05d8.png` (496 × 920 px, 496 × 920 CSS px, DPR 1) určuje layout; novější pokyn uživatele určuje typografii z `design-system/tokens.css`.

## Implementační důkazy

- Bottom sheet: `/tmp/retention-qa/implementation-sheet.png` (375 × 812 px, viewport 375 × 812 CSS px, DPR 1, `#retention-sheet`).
- Termínovaný účet: `/tmp/retention-qa/implementation-term-account-ds-fonts.png` (496 × 920 px, viewport 496 × 920 CSS px, DPR 1, `#term-account`).
- Společné full-view porovnání: `/tmp/retention-qa/comparison-sheet.png` a `/tmp/retention-qa/comparison-term-ds-fonts.png`.
- Focused region nebyl potřebný: full-view porovnání zobrazuje text, ilustrace, ikonografii, CTA i rozestupy v čitelné velikosti 1:1.

## Kontrola fidelity

- Typografie: Inter. Detail používá přímo DS utility: titul `Title Secondary` 32/44, close/lead/benefity `Body Primary` 16/24 a CTA `Button` 16/24. Vlastní 24/32 a 20/28 styly odstraněny v souladu s novějším pokynem uživatele.
- Rozložení: sheet 364 px, horní hrana 448 px, handle 48 × 4, CTA 16 px od spodní hrany. Detail drží mobilní rám, interní scroll a footer na referenčních souřadnicích.
- Barvy: tokenové body/surface, overlay `rgba(33,33,33,.45)`, primární červená a šedý close odpovídají zdroji.
- Obrázky: použity původní repository assety `savings-offer-light.png` a `term-accounts-light.png`; žádné náhražky nebo CSS kresby.
- Copy: nadpisy, popis, benefity a CTA odpovídají přílohám.
- Vnější horní odsazení desktopového telefonního rámu se mezi referenčním exportem a browser capture liší o 3 px; app-owned obsah uvnitř rámu sedí. Přijato jako rozdíl exportního canvasu, ne produktového UI.

## Historie porovnání

1. P1: ilustrace sheetu měla absolutní souřadnice vůči stránce a nebyla uvnitř sheetu. Oprava: `position:relative` na sheetu a referenční pozice ilustrace.
2. P1: detail narostl na 988 px, CTA zůstala pod viewportem. Oprava: pevná výška mobilního rámu, interní scroll a jediná referenční sticky akce.
3. P2: sheet měl 399 px, příliš velký nadpis a vertikální rozestupy mimo referenci. Oprava: 364 px, 20/28 nadpis, absolutní umístění tertiary a primary CTA.
4. P2: detail měl jiné zalomení benefitů a měřítko ilustrace. Oprava: sloupec textu 330 px, gap 24/45 px a přizpůsobení ilustrace podle společného 1:1 porovnání.
5. Post-fix evidence: obě společná porovnání bez akčních P0/P1/P2 rozdílů.
6. P1: uživatel označil close a benefitové fonty za příliš velké. Oprava: napojení na `t-content-body-primary`, titul na `t-headings-title-secondary`, odstranění ručního letter-spacing. Browser computed styles potvrzují 16/24 a 32/44; post-fix evidence `/tmp/retention-qa/comparison-term-ds-fonts.png`.

## Interakce a runtime

- `Sjednat termínovaný účet` → `#term-account`.
- `Zavřít` → `#step1`.
- `Pokračovat k platbě` → `#step2`.
- Obnova obou stavů z URL hashe ověřena.
- Browser console: bez warningů a errorů.

final result: passed
