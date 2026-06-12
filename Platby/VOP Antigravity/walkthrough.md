# Průvodce: Prototyp VOP Antigravity (Věrná replika z Figma podkladů)

Tento prototyp byl kompletně přepracován a postaven přímo na základě vyexportovaných Figma pláten a screenů z adresáře `Podklady`. Nahradil starší zkopírované šablony a implementuje věrný vzhled, textace a chování.

## Nově implementované obrazovky a funkce

1. **Detail účtu (s04b):**
   - Zpřístupněn klepnutím na `Běžný účet 2` (48 490,20 Kč) na hlavní obrazovce.
   - Obsahuje sub-klientské filtry a záložky (`Vše`, `40 000,00 Kč`, `334,26 EUR`).
   - Zobrazuje transakční historii odpovídající podkladovému obrázku:
     - **Tesco** (`-2 430,30 Kč`)
     - **Karel Kropáček** (`+2 000,00 Kč`)
     - **Josef Pokorný** (`-12 000,00 Kč`) s jasným označením červeného stavu **Platba neodešla**.

2. **Nová platba - Krok 2 (s06):**
   - Nový mezikrok platebního formuláře.
   - Umožňuje zadat detaily: `Zpráva pro příjemce`, `Variabilní symbol`, `Popis pro mě`, `Konstantní symbol`, `Specifický symbol`.
   - Obsahuje přepínač rychlosti zpracování/odeslání platby (`Co nejdříve` / `Později`).

3. **Vizuální design systému KB+:**
   - Červená barva KB (`#E2001A`), zakulacené rohy (`16px`), moderní písmo `Outfit`.
   - **Solidní červený spodní tab bar** s bílými ikonami (místo původního šedobílého).
   - Čisté vstupní formulářové bloky (např. ohraničený box `Komu` s integrovaným popiskem).

4. **Duální scénáře plateb (Tuzemská CZK vs. SEPA EUR):**
   Prototyp automaticky přizpůsobuje zobrazení v rekapitulaci (`s08`) a detailu autorizace (`s09`) na základě toho, co uživatel zadá jako příjemce:
   - **Tuzemský scénář (30 000 Kč):** Pokud je zadáno tuzemské číslo (např. `129000/0100`), zobrazí se rekapitulace s detaily (VS, KS, SS, zpráva). Detail k autorizaci pak přesně odpovídá souboru `Detail platby k autorizaci.png`.
   - **SEPA scénář (100 EUR):** Pokud je zadán německý IBAN (např. `DE89...`) nebo zvoleno EUR, rekapitulace odpovídá souboru `Souhrn platby.png` včetně **Přesného názvu příjemce** (`Jan Novak`) a stavu **Ověření názvu** (`✓ Název odpovídá číslu účtu`).

5. **Rychlé scénáře v testovacím panelu:**
   Do desktopového panelu i mobilního ozubeného kolečka (⚙️) byly přidány tlačítka pro předvyplnění obou testovacích scénářů jedním kliknutím. Výzkumník tak může uživateli okamžitě spustit test tuzemské nebo SEPA platby.

---

## Verifikace a spuštění

Tento prototyp je nasazen a k dispozici.

- Rozcestník: `https://lukasbendik.github.io/design/`

> [!NOTE]
> Změny se na odkazu projeví do 1 minuty od pushnutí změn.
