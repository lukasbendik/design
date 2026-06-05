# Screen Variant Generator (Figma Plugin)

Plugin z jedne vybrane obrazovky vytvori platformni variantu:

- duplikuje vybrany Frame,
- nastavi cilovou sirku varianty,
- prepne instance komponent podle mapovani.

## 1. Instalace ve Figme

1. Otevri Figma Desktop.
2. Plugins > Development > Import plugin from manifest.
3. Vyber soubor manifest.json z teto slozky.

## 2. Pouziti

1. Oznac ve Figme presne jeden Frame (vzorova obrazovka).
2. Spust plugin Screen Variant Generator.
3. Vyber platformu a variantu.
4. Klikni Vytvorit variantu.

## 3. Kde upravit mapovani

Mapovani je v code.js v objektu PRESETS:

- presets (ios, ib, android),
- variants (id, label, width),
- componentMap (source component -> target component).

Aby swap fungoval, nazvy komponent musi sedet na presne jmeno hlavni komponenty ve Figme.

## 4. Omezeni v teto verzi

- Plugin pracuje s lokalne dostupnymi komponentami v souboru.
- Pro rozsahle transformace doporucuji drzet centralni pravidla v RULES_TEMPLATE.md a mapovani pravidelne syncovat do PRESETS.

## 5. Dalsi krok

Pokud chces, lze pridat import mapovani z JSON textu primo v UI, aby ses nemusel vracet do code.js.
