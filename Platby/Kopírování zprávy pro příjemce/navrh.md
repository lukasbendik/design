# Kopírování zprávy pro příjemce

Návrh z 14. 10. 2026. Mobilní HTML prototyp v sekci Platby.

## Co ukazují podklady

Dodané obrazovky zachycují novou platbu: Přehled → účet, příjemce a částka → doplňující údaje → Souhrn → výsledek. „Zpráva pro příjemce“ a „Popis pro mě“ jsou na stejné obrazovce, oddělené variabilním symbolem. Po otevření klávesnice nebo při delším textu nemusejí být vidět současně. Prototyp zachovává jejich pořadí a používá místní CORE tokeny, komponenty, fonty a ilustraci úspěchu. Mezi souhrn a výsledek přidává demo PIN podle `design-system/screens.md`.

## Ověřené patterny a jejich použití

W3C popisuje opětovné použití údajů: předvyplnění, volbu už zadané hodnoty, kopírování a checkbox „fakturační adresa je stejná jako doručovací“. Údaje doporučuje mít blízko vstupu, kde se využijí. [W3C: Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)

GOV.UK doporučuje už zadané odpovědi předvyplnit nebo nabídnout k výběru; zároveň zachovat stav při návratu zpět. [GOV.UK: Question pages](https://design-system.service.gov.uk/patterns/question-pages/)

To jsou veřejné obecné principy, nikoli důkaz, že tento konkrétní bankovní návrh vyhovuje lidem. Popis pro mě je volitelný a může mít jiný obsah než zpráva; samotná existence obou polí není automaticky porušením WCAG 3.3.7.

| Pattern | Výhoda | Omezení v této situaci |
| --- | --- | --- |
| Systémové označit → kopírovat → vložit | Známé ovládání, lze přenést jen část textu | Více kroků; přepínání focusu, klávesnice a scroll |
| Checkbox „Stejný jako zpráva pro příjemce“ | Jeden krok; známá analogie adres | Může působit jako trvalé propojení; nejasné chování při vlastní úpravě |
| Ikona kopie u zdroje | Kompaktní | Bez textu není zřejmé, zda kopíruje do schránky, nebo do jiného pole |
| Terciální tlačítko pod zdrojovým polem | Aktuální zpráva i akce jsou pohromadě; text pojmenuje vzdálený cíl | Po vložení je třeba viditelně potvrdit výsledek u cíle |

## Zvolený návrh

Pod „Zprávou pro příjemce“ je jediné terciální tlačítko **Kopírovat do popis pro mě** s ikonou kopírování na začátku. Ikona a podtržený text jsou společně vycentrované. Klepnutí přímo zkopíruje aktuální hodnotu do „Popis pro mě“, včetně více řádků a mezer. Zachováno pořadí polí.

Kopie je jednorázová: další změna zprávy nemění popis. Další klepnutí přenese novou aktuální hodnotu a rovnou přepíše případný dosavadní popis. Podle výslovného zadání nejsou hlášky o kopírování, zvýraznění výsledku, vrácení zpět ani potvrzování přepsání. Prázdná zpráva deaktivuje tlačítko.

Levý panel a scénáře byly odstraněny. Nové otevření bez hashe začíná na **Přehledu (#home)**; uživatel pokračuje přes Nová platba → doplňující údaje → Souhrn → demo PIN → výsledek. Refresh na konkrétním hashi zachovává aktuální krok. Zadané hodnoty se ukládají do vlastního klíče localStorage. Původní položky undo a notice se již nenačítají ani neukládají.

Modelové údaje, stávající vstupní guard a absence platebního API či analytiky zůstávají. Guard není serverové zabezpečení. Inspirací byl uživatelem popsaný pattern RB; konkrétní obrazovku RB jsme nezávisle neověřili.

## Hypotéza a následné ověření s lidmi

Hypotéza: lidé pochopí terciální tlačítko pod zprávou jako jednorázové vložení do vlastního popisu. Dosud neproběhl uživatelský výzkum; browser test ověřuje funkčnost, nikoli srozumitelnost lidem.

Navržené úkoly pro mobilní test bez předchozího vysvětlení:

1. „Chcete, aby se vám platba později lépe hledala. Použijte zprávu i jako svůj popis.“ Sledujte nalezení akce, počet klepnutí a potřebu pomoci.
2. Zkopírujte delší zprávu se zobrazenou klávesnicí. Sledujte scroll, viditelnost cíle a jistotu, že se přenesl celý text.
3. Změňte svůj popis a potom znovu zkopírujte zprávu. Ověřte, zda uživatel očekává přepsání dosavadního textu.
4. Upravte po kopii zprávu. Zjistěte, zda uživatel očekává změnu popisu, a ověřte samostatnou úpravu popisu.

Vyhodnotit dokončení bez pomoci, chybná nahrazení, počet kroků a vysvětlení vztahu polí vlastními slovy. Zatím nejsou naměřené výsledky ani baseline.

## Technická a vizuální kontrola

Konkrétní rozsah browser kontrol a vizuálního porovnání je v `design-qa.md`. Chování nativní klávesnice, iOS/Android a asistivních technologií nebylo ověřeno na fyzickém zařízení.

Ikony QR a složky: [Phosphor Core](https://github.com/phosphor-icons/core), balíček 2.1.1 (ověřený současný npm tag při tvorbě), lokální SVG a licence MIT v `icons/`. Ostatní ikony a ilustrace jsou ze sdíleného design systému.
