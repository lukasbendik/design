# Zápis z konverzace: na mobilu jsem si udělal odkaz na plochu v prohlížeči firefox. když se mi telefon přepne do dark mod

**Datum:** 2026-07-12 17:16:51
**ID konverzace:** `29067be2-f9ee-487c-9b58-7c58e1e59d41`
**Odkaz na logy:** [transcript.jsonl](file:///Users/lukasbendik/.gemini/antigravity/brain/29067be2-f9ee-487c-9b58-7c58e1e59d41/.system_generated/logs/transcript.jsonl)

## Zadání uživatele
```text
na mobilu jsem si udělal odkaz na plochu v prohlížeči firefox. když se mi telefon přepne do dark mode, tak mám header (hodiny, signál,...) pořád světlý. přepne se jen zbytek aplikace. když mám odkaz na plochu v chrome, tak se přepne i header. nešlo by to pro firefox opravit?
```

## Výsledek / Odpověď asistenta
Bob se na to podívat a všechno pochopit!

### 1. Problém s rozbitou ikonou (šedý obdélník)
Bob zjistit, že nastavení `crossorigin="use-credentials"` (sušenkový režim) vyžadovalo od serveru speciální CORS povolení. Protože ho server neposlal, prohlížeč stažení manifestu zablokoval a ztratil cestu k ikonám.
* **Bob opravit:** Bob úplně zrušit sušenky a `crossorigin`. Místo toho teď JavaScript při načtení upraví odkaz na manifest přímo v HTML přidáním parametru: `manifest.webmanifest?theme=dark` (nebo `light`).
* Tento způsob nepotřebuje žádná CORS oprávnění, manifest se stáhne bez chyb a ikona se v pořádku zobrazí!

### 2. Problém s držením barvy pozadí (nutnost restartu aplikace)
Bob prozkoumat chování Firefoxu na Androidu a zjistit toto:
* **Chrome** umí měnit barvu horní lišty (status baru) kdykoliv za běhu podle HTML meta tagu.
* **Firefox** na Androidu má ale omezení – ignoruje změny meta tagu za běhu a barvu horní lišty nastavuje **pouze jednorázově při startu aplikace** z manifestu.
* Když přepneš režim telefonu za běhu, vnitřek aplikace se okamžitě překreslí (díky CSS stylům), ale Firefox lištu nahoře nezmění, dokud aplikaci neukončíš a znovu neotevřeš. Toto chování bohužel nelze z kódu webu obejít, protože jde o limitaci samotného Firefoxu.
* Díky nové úpravě s parametrem `?theme=` se však manifest při každém spuštění stáhne se správnou barvou podle aktuálního režimu telefonu. Po otevření aplikace tak bude barva lišty vždy odpovídat.

Bob už nahrát kód na server (`git push`).
**Co teď udělat:**
1. Smaž šedou ikonu z plochy.
2. Otevři web ve Firefoxu a **přidej si ho znovu na plochu**. Ikona už bude v pořádku a barva headeru se správně nastaví při startu.

