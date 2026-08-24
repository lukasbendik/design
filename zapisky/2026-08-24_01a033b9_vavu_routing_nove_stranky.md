# VAVU — oprava routingu nových obrazovek

- Datum: 2026-08-24
- ID konverzace: `01a033b9...`
- Zadání: Levé odkazy na nové obrazovky nereagovaly; kliknutí na Karty skončilo bez zobrazení nové stránky.
- Změna: Do seznamu povolených rout `SCREENS` v `Platby/VAVU/index.html` přidány obrazovky `extra`, `karty`, `pujcky`, `sporeni`, `investice` a `pojisteni`. Stávající routing a aktivní stav menu tak tyto hashe akceptují.
- Ověření: Po nasazení GitHub Actions ověřeno přihlášení a navigace na všech šesti routách. Každá zobrazí odpovídající obrazovku a označí příslušnou položku menu jako aktivní.
- Commit: `cae22f7` (`fix: register overview routes`)
