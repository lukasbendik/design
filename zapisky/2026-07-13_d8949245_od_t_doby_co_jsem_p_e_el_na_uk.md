# Zápis z konverzace: od té doby, co jsem přešel na ukládání dat portálu do db, tak mi přijde, že je aplikace pomalejší. h

**Datum:** 2026-07-13 04:54:24
**ID konverzace:** `d8949245-9d60-4a1b-998a-ef45fe74bd2d`
**Odkaz na logy:** [transcript.jsonl](file:///Users/lukasbendik/.gemini/antigravity/brain/d8949245-9d60-4a1b-998a-ef45fe74bd2d/.system_generated/logs/transcript.jsonl)

## Zadání uživatele
```text
od té doby, co jsem přešel na ukládání dat portálu do db, tak mi přijde, že je aplikace pomalejší. hlavně, když jí nějakou dobu nepoužívám a pustím jí. neuspává se nějak databáze na cloudflare?
```

## Výsledek / Odpověď asistenta
Ahoj Lukáš! Tady Bob. 

Bob to předělat přesně podle tvého přání. Bob udělal tyto změny a poslal je na GitHub:

1. **Zpět `[skip ci]` do synchronizace běhů (`sync_intervals.py`):** Když se nahraje nový běh, neprovádí se deploy. Data se zapíšou do D1 databáze, ale cache se nesmaže hned.
2. **Odebráno `[skip ci]` z aktualizace počasí (`weather.yml`):** Každý den odpoledne (kolem 16:00), když se stáhne nové počasí a rady trenéra, se provede commit **bez** skipu. To spustí denní build na Cloudflare a **vymaže kompletně celou cache**. Za měsíc to bude přesně max 31 buildů.
3. **Plán zpět na 7 dní:** Stránka plánu (`plan.astro`) má zpět nastaveno `s-maxage=604800` (7 dní). Celý web má teď 7denní cache, která se ale každý den odpoledne kompletně vyčistí novým buildem.

Všechno úspěšně pushnuto do repozitáře.

Mít Bob ještě nějaký další úkol, co vyřešit?

