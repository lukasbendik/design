# Multiautorizace — návrh a zdroje

Ověřeno 2. 10. 2026. Mobilní prototyp podle pěti dodaných obrazovek a lokálního CORE design systému. Veškeré hodnoty jsou ukázkové.

## Jednotlivé obrazovky dodané cesty

1. **Home:** ponechat vstup Autorizace ve spodní liště. Pro další iteraci doporučuji badge s počtem čekajících záznamů; samotný vykřičník neříká množství ani důvod upozornění. Ostatní home funkce nejsou součástí tohoto prototypu.
2. **Výběr subjektu:** zachovat osobu a firmu, firmu odlišit IČO; přidat počet čekajících požadavků. Výběr nikdy nesmí přesáhnout subjekt. V prototypu změna subjektu vymaže rozpracovaný výběr.
3. **Přehled autorizací:** zachovat účty a samostatnou kartu dávek. Přidat globální výběr, výběr účtu a typu. Checkbox vybírá, text/šipka rozbaluje. Částečný výběr zobrazit pomlčkou. Výběr jednoho typu napříč účty je volitelný rozbalovací panel nad kartami.
4. **Seznam instrumentů:** rozbalit jej přímo pod typem, aby se neztratil kontext účtu ani výběr ostatních typů. Checkbox položku označí, řádek otevře detail. Trvalé příkazy, inkasa a příkazy k inkasu zůstávají samostatnými typy. Problémové řádky lze otevřít, jejich checkbox je vypnutý. Přepínače typů jsou v souhrnu výběru; pouze filtrují již vybrané položky.
5. **Detail:** zobrazit částku, příjemce, subjekt, zdrojový účet, datum, VS a podpisovou podmínku. Označení sdílí stav se seznamem a souhrnem. Samostatná akce autorizuje jen tento záznam přes jeho kontrolní souhrn. Destruktivní mazání není pro tento úkol potřeba.

## Co je doložené u konkurence

| Zdroj | Pozorované řešení | Důsledek pro návrh |
|---|---|---|
| [HSBCnet Mobile, oficiální příručka, aktualizace duben 2025](https://www2.secure.hsbcnet.com/pims/static/dtc/cms/content/dam/nett/user-guides/pdf/pdf-guides-on-pws/mobile/using-services/payauth_getrate/payauth_getrate.pdf) | Souhrn počtů podle typu, přechod do seznamu, checkbox a autorizace, přístup k detailu. Get Rate není dostupný při hromadné autorizaci. | Zachovat hierarchii a detail; výběr všech musí respektovat způsobilost operací. |
| [Raiffeisenbank, oficiální návody internetového bankovnictví](https://www.rb.cz/osobni/ucty/sluzby-k-uctum/internetove-bankovnictvi/tipy) | Ručně zadaná hromadná platba obsahuje jednotlivé úhrady certifikované najednou; výběr účtu a typu. | Podpora společného potvrzení, jasný obsah a účet. Zdroj nedokládá výběr napříč typy ani současnou mobilní obrazovku. |
| [NatWest Bankline Mobile, záznam aplikace vydavatele](https://apps.apple.com/gb/app/natwest-bankline-mobile/id1441798359?platform=vision) | Mobilní schvalování plateb; historie verzí popisuje Payment Summary a přehlednější dávky. | Souhrn a srozumitelné dávky jsou relevantní principy. Detailní interakce přihlášené aplikace zde nebyla ověřena. |
| [W3C APG — Checkbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) | Zaškrtnuto, nezaškrtnuto, částečný výběr skupiny. Klávesnice Space. | Nativní checkbox a indeterminate; přístupné popisky určují rozsah. |

Jde o rešerši veřejné dokumentace, ne o test přihlášených bankovních aplikací nebo výzkum s uživateli. Rozbalování v přehledu je vlastní doporučení pro zadanou cestu, nikoli kopie ověřeného konkurenčního layoutu.

## Doporučené chování

- Nic není předem vybrané. Vybrat vše znamená všechny způsobilé položky aktuálního subjektu, včetně položek uvnitř zavřených skupin.
- Kliknutí na částečně vybranou skupinu vybere všechny její způsobilé položky; další kliknutí je odznačí.
- Dávky se do jednotlivých účtů podruhé nezapočítávají. Dvě dávky po třech platbách znamenají dva autorizační záznamy a šest podkladových plateb.
- Spodní lišta počítá všechny vybrané autorizační záznamy. Částka plateb zahrnuje jednorázové a dávkové platby, v každé měně samostatně, bez převodu kurzu.
- Částky trvalých příkazů, limity svolení k inkasu a příkazy k inkasu se v kontrolním souhrnu zobrazují odděleně. Nejde o společnou částku odchozích plateb.
- K autorizaci otevře souhrn celého výběru. Filtr souhrnu výběr neomezuje; finální tlačítko stále uvádí celkový počet.
- Výběr, rozbalení a filtr se ukládají do localStorage. Hash a browser back zachovávají navigaci, refresh obnoví obrazovku. PIN se neukládá.
- Finální potvrzení je pouze simulace šestimístným ukázkovým PIN. Hotové záznamy zmizí z čekajících, dosud neautorizovaný výběr zůstane.

## Předpoklady k potvrzení s produktem

1. Dávka je v této verzi nedělitelná autorizační jednotka. Detail ukazuje tři podkladové platby pouze ke kontrole. Pokud systém umožňuje částečný podpis dávky, bude třeba změnit model počtů, výběru a výsledků.
2. V tomto scénáři stačí jeden podpis. Produkční vícekolové podepisování musí místo hotovo uvést například „Váš podpis byl přidán, čeká se na dalšího oprávněného uživatele“.
3. Způsobilost, aktuální zůstatky, měnové konverze, globální/disponentské limity, příspěvky účtů v dávkách a částečné neúspěchy musí před potvrzením vyhodnotit server. Prototyp pouze demonstruje CZK limit jednorázových plateb na účtu a jeho snížení po podpisu.
4. Při velkých seznamech doplnit vyhledávání a jasné rozlišení „vše za subjekt“ versus „zobrazené výsledky“. Současný model neobsahuje stránkování ani filtry před výběrem.

## Scénáře pro uživatelské ověření

- Vyberte vše za firmu a vysvětlete, proč se dvě položky nevybraly.
- Vyberte vše za druhý účet a přidejte jen jednu platbu prvního účtu.
- Vyberte všechny platby napříč účty, ale bez dávek a trvalých příkazů.
- Odeberte jednu platbu z detailu a zkontrolujte nový součet.
- Vyberte dávku a vysvětlete rozdíl počtu záznamů a počtu plateb.
- Autorizujte pouze jeden instrument z detailu, i když máte vybrané další položky.
- Vraťte se a obnovte stránku; výběr se musí zachovat.

Sledovat chyby v rozsahu výběru, porozumění pomlčce, záměnu měn/limitů a nechtěné podpisy. Doporučení zatím není validované uživatelským testem.
