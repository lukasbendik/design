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

Pod „Zprávou pro příjemce“ je terciální tlačítko **To samé do zprávy pro mě**, bez ikony a opakovaného náhledu. Kopíruje aktuální hodnotu přímo do „Popis pro mě“, bez systémové schránky. Pořadí polí zůstává zachováno. Inspirací je uživatelem popsané ovládání v RB; konkrétní obrazovku RB jsme nezávisle neověřili. Tato úprava nahrazuje původní akci u cílového pole a dříve navrhovaný checkbox.

- Prázdná zpráva: tlačítko zůstává viditelné, ale neaktivní. Nemaže existující popis.
- Prázdný popis: jedno klepnutí vloží celý aktuální text. Cílové pole se podle potřeby posune do zobrazení a pod ním se potvrdí vložení.
- Vlastní popis: zachováno potvrzení nahrazení se současným i novým textem.
- Shodný text: opakované klepnutí nic nepřepisuje ani nepřidá další kopii.
- Vrátit zpět: obnoví přesný původní popis. Možnost přetrvá i po refreshi; po ruční úpravě popisu zmizí.
- Pozdější změna zprávy: popis se automaticky nemění. Další klepnutí přenese novou aktuální hodnotu.
- Obě pole mají v ukázce limit 140 znaků; kopie přenese celý text včetně mezer a nových řádků.

Prototyp používá modelové údaje, vlastní klíč localStorage, hash navigaci a stávající vstupní guard rozcestníku. Guard je projektová brána prototypů, nikoli serverové zabezpečení. Žádné analytické skripty ani platební API nejsou připojené. Scénáře na desktopu přepíší jen data tohoto prototypu. Mobil zůstává bez ovládacího panelu.

## Hypotéza a následné ověření s lidmi

Hypotéza: lidé pochopí terciální tlačítko pod zprávou jako jednorázové vložení do vlastního popisu. Dosud neproběhl uživatelský výzkum; browser test ověřuje funkčnost, nikoli srozumitelnost lidem.

Navržené úkoly pro mobilní test bez předchozího vysvětlení:

1. „Chcete, aby se vám platba později lépe hledala. Použijte zprávu i jako svůj popis.“ Sledujte nalezení akce, počet klepnutí a potřebu pomoci.
2. Zkopírujte delší zprávu se zobrazenou klávesnicí. Sledujte scroll, viditelnost cíle a jistotu, že se přenesl celý text.
3. Ponechte vlastní poznámku při nabídce nahrazení; potom nahraďte a vraťte kopii zpět.
4. Upravte po kopii zprávu. Zjistěte, zda uživatel očekává změnu popisu, a ověřte samostatnou úpravu popisu.

Porovnat lze nové terciální tlačítko pod zdrojem a původní akci u cílového pole. Vyhodnotit dokončení bez pomoci, chybná nahrazení, počet kroků a vysvětlení vztahu polí vlastními slovy. Zatím nejsou naměřené výsledky ani baseline.

## Technická a vizuální kontrola

Konkrétní rozsah browser kontrol a vizuálního porovnání je v `design-qa.md`. Chování nativní klávesnice, iOS/Android a asistivních technologií nebylo ověřeno na fyzickém zařízení.

Ikony QR a složky: [Phosphor Core](https://github.com/phosphor-icons/core), balíček 2.1.1 (ověřený současný npm tag při tvorbě), lokální SVG a licence MIT v `icons/`. Ostatní ikony a ilustrace jsou ze sdíleného design systému.
