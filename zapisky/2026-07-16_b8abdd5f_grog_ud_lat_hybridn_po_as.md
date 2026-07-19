# Zápis z konverzace: Grog udělat hybridní počasí!

**Datum:** 2026-07-16 19:52:36
**ID konverzace:** `b8abdd5f-a6b3-42cf-b3c3-2c45d1547cc1`
**Odkaz na logy:** [transcript.jsonl](file:///Users/lukasbendik/.gemini/antigravity/brain/b8abdd5f-a6b3-42cf-b3c3-2c45d1547cc1/.system_generated/logs/transcript.jsonl)

## Zadání uživatele
```text
chtěl bych do pohledu přehled přidat kartu s předpovědí počasí. chtěl bych, aby se zobrazovala aktuální teplota (+ pocitová), aktuální stav a k tomu bych chtěl vidět hodinovou předpověď. dále bych chtěl vidět předpověď na pár následujících dní.
```

## Provedené změny (z walkthrough.md)
# Grog udělat hybridní počasí!

Grog zjistit, že český model ALADIN (ČHMÚ) **nemá** denní předpověď. Umět jenom hodiny (krátký čas dopředu).
Proto Lovelace u denní předpovědi ukazovat jen aktuální teplotu.

Grog to vyřešit chytře! Spojit nejlepší z obou světů.

## Co se změnilo

1. **Aktuální stav a pocitovka (Template karta):** Používá super přesný český ČHMÚ (`weather.chmu_domov_predpoved`).
2. **Hodinová předpověď (Hourly):** Používá ČHMÚ (`weather.chmu_domov_predpoved`) s **24 sloty**. Krásně ukazuje detailní hodiny od českých meteorologů dopředu, scrollování funguje a díry jsou pryč.
3. **Denní předpověď (Daily):** Používá norskou předpověď Met.no / Yr.no (`weather.forecast_domov`) se **7 sloty**. Ta umí ukázat dny na celý týden dopředu!
4. **Záloha a restart:** Grog udělat záloha, zapsat na disk a restartovat.

## Ověření

Uživatel se teď jít podívat na dashboard.
- Nahoře vidět ČHMÚ teplotu a pocitovou teplotu.
- Uprostřed vidět detailní hodinovou předpověď (ČHMÚ) s posouváním.
- Dole vidět denní předpověď na 7 dní dopředu (norské Yr.no).
- Prokliky na detail fungovat všude!

## Checklist úkolů (z task.md)
- [x] Udělat zálohu přes REST API (`hassio.backup_full`)
- [x] Promazat staré zálohy přes SSH (ponechat 5 nejnovějších)
- [x] Nahrát ČHMÚ integraci na SSH
- [x] Zapsat změny (forecast_slots) do `lovelace_muj_domov.json`
- [x] Zkopírovat soubor na SSH do Home Assistanta
- [x] Restartovat Home Assistant Core přes REST API
- [x] Vytvořit walkthrough.md

