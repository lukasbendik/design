# Multiautorizace – nový koncept

Nový koncept, 6. 10. 2026. Samostatná varianta; původní prototyp je zachovaný.

## Návrh

- Výběr subjektu přesně převzatý z aktuálního prototypu včetně obsahu a počtů.
- Společný výběr za subjekt; následně účet / dávky → typ instrumentu → jednotlivé položky.
- Checkbox vybírá celou skupinu dostupných položek. Pomlčka značí částečný výběr. Kliknutí na částečný checkbox doplní celou skupinu; další kliknutí ji odznačí.
- Samostatné rozbalovací tlačítko s názvem a otáčející se šipkou. Výběr skupinu nerozbaluje a sbalení neruší výběr.
- Sbalené účty ukazují typy a počty, označené skupiny navíc počet vybraných. Nedostupné záznamy zůstávají viditelné a vysvětlené.
- Karta vymezuje účet, šedá hlavička typ, bílé řádky jednotlivé položky. Všechna patra mají plnou šířku; žádné stupňující se odsazení.
- Rozbalit vše / Sbalit vše dovoluje obejít postupné otevírání. Dávky přecházejí přímo k dávkám, které se autorizují jako celek.
- Počet vybraných a kontrola zůstávají ve spodní liště. Platební částky jsou oddělené od pravidelných částek a limitů; měny se nesčítají mezi sebou.
- Kontrola výběru se otevře v modálním panelu na stejném #overview. Odebrání upraví výběr. Detaily jednotlivých položek a finální PIN zůstávají dalšími obrazovkami.
- Samostatný localStorage klíč odděluje tuto variantu od původního prototypu. Nativní checkboxy, nadpisy a aria-expanded/aria-controls, focus a reduced motion.

## Ověření

Ověřeno v in-app prohlížeči při 375 × 812 a 320 × 812: všechny úrovně výběru, individuální změna a pomlčka nadřazených checkboxů, 6 dostupných plateb místo 8, účet 9 místo 11, globální 19 místo 21. Dvě blokované položky se nikdy neoznačily. Rozbalit vše/Sbalit vše bez změny hash nebo výběru, refresh, detail/návrat, osobní i firemní subjekt, kontrola/odebrání/zavření a navazující potvrzení/návrat. Bez horizontálního přetékání a chybějících obrázků; JS syntax ověřena node --check.

Jde o návrhovou hypotézu, nikoli výsledek uživatelského testování. S laiky ověřit: výběr všech dostupných, jedné kategorie, jedné položky a rozpoznání částečného výběru. Měřit chyby záměny checkboxu se šipkou a porozumění rozdílu celkových a dostupných počtů.

## Zdroje

- https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ – samostatná rozbalovací tlačítka, nadpisy, aria-expanded a aria-controls.
- https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/ – skupinový checkbox a částečný výběr.
- https://www.nngroup.com/articles/accordions-on-desktop/ – kompromis mezi kratším přehledem a skrytým obsahem; samotný pattern nezaručuje použitelnost.

