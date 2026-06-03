# UX Prototypy

Sbírka interaktivních HTML prototypů pro testování UX návrhů. Prototypy jsou organizované do sekcí podle tématu a přístupné přes rozcestník.

## Jak to funguje

- Každý prototyp je samostatný HTML soubor v pojmenované podsložce.
- Skript `generate.js` prochází všechny podsložky a generuje `index.html` (rozcestník).
- GitHub Actions při každém pushi spustí `generate.js` a výsledek nasadí na GitHub Pages.

## Rozcestník

**URL:** https://lukasbendik.github.io/design/

## Lokální náhled

```bash
node generate.js   # vygeneruje index.html
```

Pak otevři `index.html` v prohlížeči.

## Struktura

```
<sekce>/
  <název prototypu>.html
generate.js          # generátor rozcestníku
versions.json        # záložní timestamps (fallback bez gitu)
.github/workflows/
  deploy.yml         # CI/CD → GitHub Pages
```

## Deploy

Každý push do větve `main` automaticky spustí nasazení. Stav buildu: https://github.com/lukasbendik/design/actions
