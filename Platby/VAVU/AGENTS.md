# Pravidla prototypu VAVU

## Nevyplněné hodnoty

- Na všech zobrazovacích obrazovkách (detaily, souhrny, autorizace, aktivní instrumenty a informační karty) nevyplněné hodnoty nezobrazuj.
- Skryj celý řádek včetně popisku, oddělovače a prázdného místa. Nevkládej pomlčky, „Bez zprávy“, vymyšlené symboly ani stavové texty místo skutečně zadaných údajů.
- Prázdná hodnota je null, undefined, prázdný řetězec nebo pouze mezery. Samostatné zástupné pomlčky `—`, `–` a `-` jsou také prázdná hodnota. Číselná nula je platná hodnota.
- Platné nastavení „Nikdy“ / „Neomezeně“ a skutečné stavy instrumentů nejsou chybějící údaje.
- Pravidlo neodstraňuje vstupní pole z formulářů: uživatel musí mít možnost údaje vyplnit. Po doplnění se zobrazovací řádek znovu objeví.
- Ověř prázdný, vyplněný a znovu vyprázdněný stav včetně starších uložených dat.

- Pravidlo platí přímo pro každou komponentu **CO Item Display**, včetně detailu plateb. Společná kontrola `syncItemDisplayVisibility` se provádí při aplikaci design systémových komponent; nestačí filtrovat jen souhrny.
