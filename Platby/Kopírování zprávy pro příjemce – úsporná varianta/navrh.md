# Kopírování zprávy pro příjemce – úsporná varianta

Druhý samostatný prototyp v sekci Platby. Začíná na přehledu účtů a zachovává celý průchod novou platbou. Původní varianta s podtrženým tlačítkem pod polem zůstává zachována.

Kopírovací ikona má dotykovou plochu 48 × 48 px vpravo uvnitř pole Zpráva pro příjemce. Otevře bottom sheet Kopírovat zprávu se dvěma možnostmi: Kopírovat do schránky a Kopírovat do popisu pro mě. Obě pracují s aktuálním textem. Kopie do popisu přepíše existující hodnotu; další úpravy zprávy už popis automaticky nemění.

Po úspěšné volbě se nabídka zavře bez informační hlášky či vrácení zpět. Prázdná zpráva má neaktivní ikonu. Bottom sheet lze zavřít křížkem, klepnutím mimo něj, Escape nebo prohlížečovým zpět. URL #copy obnoví nabídku po refreshi. Data obou variant mají samostatné localStorage.

Oproti první variantě odpadá 48px tlačítko a 4px mezera, tedy 52 px na výšku při stejné jednořádkové zprávě. Přenos do popisu vyžaduje dva kroky a ikona je méně výslovná než textové tlačítko; jde o záměrnou úspornou alternativu pro porovnání.

Schránka používá aktuální Clipboard API writeText při kliknutí. Vyžaduje bezpečný kontext a oprávnění prohlížeče. Při selhání nabídka zůstane otevřená se stručnou chybou; prototyp nepředstírá úspěch. Ověřeno podle [MDN Clipboard.writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) a [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), 14. 10. 2026.

Použity sdílené CORE tokeny, fonty a ikony. Prototyp nemá vedlejší menu ani měřicí skripty. PIN a výsledná platba jsou pouze simulace.
