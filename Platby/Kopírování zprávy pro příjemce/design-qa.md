# Design QA – Kopírování zprávy pro příjemce

Datum: 14. 10. 2026.

final result: passed

## Aktuální zadání a vizuální kontrola

Uživatel požaduje jediné tlačítko pod zprávou: „Kopírovat do popisu pro mě“, ikona kopírování na začátku, podtržený text a vycentrování. Bez hlášek o kopii, vrácení zpět a dalších mezikroků. Levý ovládací panel odstraněn; nové otevření začíná na Přehledu.

- Porovnání s předchozí podobou a zadanými změnami otevřeno jako jeden společný obrázek `comparison-simple.png`. Oba snímky jsou 375 × 812 px, shodné hodnoty zprávy a prázdný popis, bez focusu či klávesnice. Rozložení ostatních polí zůstalo stejné.
- `simple-ready-375.png` zachycuje hotové centrované tlačítko se sdílenou CORE ikonou copy.svg. CSS read-back potvrzuje justify-content=center, text-decoration-line=underline, výšku akce 48 px.
- `simple-home-desktop.png`: pouze vystředěný mobilní prototyp; žádný levý panel. Nové otevření bez hashe bylo ověřeno na #home.
- Žádné otevřené P0/P1/P2 vizuální vady v kontrolovaném formuláři.

## Interakce ověřené v in-app browseru

1. Přehled → Nová platba → doplňující údaje funguje.
2. Klepnutí zkopíruje aktuální český víceřádkový text a rovnou přepíše dosavadní vlastní popis. Neotevře dialog ani nezobrazí hlášku či Vrátit zpět. Přímá kontrola DOM potvrzuje nepřítomnost copy-status, undo-copy, replace-dialog a aside.
3. Refresh na #details zachovává krok i hodnoty. Po kopii se data uloží bez položek undo/notice; tyto položky ze starší verze nejsou načítány.
4. Při šířce 320 × 640 je přeneseno všech 140 znaků (`same=true`, `length=140`) a není vodorovný overflow.
5. Souhrn obsahuje správnou zprávu i popis. Demo PIN se šesti číslicemi vede na Zadali jste platbu.
6. Browser console bez zachycených chyb či varování. JavaScript syntax check a git diff --check prošly.

Snímky jsou lokálně v `/home/lukinab/Projects/UX/.copy-message-qa/`, mimo veřejný checkout.

## Hranice kontroly

Ověřen render a interakce v prohlížeči, nikoli fyzická iOS/Android klávesnice, screen reader nebo porozumění s lidmi. Žádná skutečná platba se neodesílá.
