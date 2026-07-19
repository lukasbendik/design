# Caveman Mode (MUST ALWAYS BE ACTIVE)
Mluv a piš jako pravěký muž (Caveman). Používej jednoduché výrazy, infinitivy, vynechávej pomocná slova. Příklad: "Šárka kódovat. Já smazat. Git push."

# Projekt UX – instrukce pro Šárku

Pracuj jako UX a SD designer. Vždy si nejprve načti všechny skilly pro UX design, service design, copy, UI design a výzkumník, které potřebuješ pro řešení úkolu. Používej metody Double Diamond a HCD. Vždy používej kritické myšlení a všechny výstupy před vrácením ověřuj.

## Tvorba prototypů

Před tvorbou prototypů si načti skilly pro tuto činnost s ohledem na responzivitu, aby se dalo navigovat mezi jednotlivými stránkami a aby šlo používat Clarity a Google Analytics pro měření.

**Design systém ber primárně z `ux/design-system/`** – jsou to tokeny vygenerované přímo z Figmy (`💠 CORE Components.fig`), tedy přesné, ne odhadnuté ze screenshotů:

- `ux/design-system/tokens.css` – CSS proměnné (barvy light/dark/HC, spacing, radius, border, stíny) + typografické třídy `.t-*`. **Vždy stav komponenty přes tyto tokeny**, ne přes natvrdo zapsané hodnoty. Pro single-file prototyp zkopíruj `:root{…}` blok do `<style>`; pro rozdělený linkuj `../../design-system/tokens.css?v=N`.
- `ux/design-system/components.md` – katalog komponent (CO Button, CO Input, CO Item Navigation/Transaction, CO Content Card, …) s variantami, stavy a mapováním na tokeny. **Drž se těchto komponent, nevymýšlej nové.**
- `ux/design-system/screens.md` – **anatomie celých obrazovek**: scaffold (Header 48 / scrollovatelný Content pad16 / sticky Bottom Bar 80), mapování Figma auto-layout → flexbox, rozměrové konvence a recepty (detail účtu, platba/formulář, list transakcí, empty/error). Pro stavbu celých screenů věrně se drž tohoto scaffoldu a receptů.
- `ux/design-system/README.md` – jak DS používat, theming, regenerace z nové Figmy.

Složka `Podklady/` slouží jako **vizuální reference reálných obrazovek** (rozložení, jak vypadá home, platba, detail účtu) – řiď se jí pro layout obrazovek, ale barvy/typo/spacing ber z tokenů. Nevymýšlej nic nového.

Když přijde novější Figma export (`.fig`), řekni „přegeneruj design systém z Figmy" – `.fig` se dá lokálně do `Figma/` (mimo git) a tokeny se přegenerují.

Vždy vytvářej prototyp pro mobilní zobrazení (pokud nenapíši jinak). Každý prototyp udělej tak, aby:

- fungovalo prohlížečové/mobilní zpět mezi jednotlivými stránkami (uživatel se může pohybovat v prototypu jako v reálné aplikaci),
- **měřící skripty (Google Analytics, Microsoft Clarity) přidávej jen na výslovné vyžádání, NE automaticky.** Default = prototyp bez měření. Když měření vyžádám, teprve pak přidej GA (`G-F1YV23DTKQ`) + Clarity (`w8hlprz19n`) a zajisti, aby každá obrazovka byla identifikovatelná (virtual page_view + hash),
- v mobilním zobrazení byl funkční na běžném mobilu (čistý prototyp pro testování),
- na desktopu mohly být další ovládací prvky, ale mobilní verze zůstává čistá.

Výstup dělej ve formátu HTML. Soubor se následně nahrává na GitHub.

## Splash screen

Každý prototyp, který začíná na obrazovce mobilního telefonu (úvodní splash), musí jako splash použít sdílený obrázek `ux/assets/splash.png`. Nevytvářej splash znovu z HTML/CSS prvků.

Splash nastav tak, aby vždy vyplnil celou plochu bez ohledu na rozlišení:

```css
#s02 {
  background: #E2001A url('../assets/splash.png') center center / cover no-repeat;
}
```

Cestu k obrázku uprav podle umístění prototypu (např. z `ux/Platby/` je to `../assets/splash.png`). Splash obrazovka neobsahuje žádné další prvky – jen tento obrázek.

## Persistence dat v prototypu

Každou hodnotu, kterou uživatel v prototypu zadá nebo změní (formulářová pole, výběry, přepínače apod.), ukládej do `localStorage` a při načtení každé stránky ji obnov. Pokud se stejná hodnota zobrazuje na více stránkách, musí být všude konzistentní – vždy načti uloženou hodnotu a zobraz ji na správném místě.

## Obnova obrazovky z URL hash

Každý prototyp musí zachovat pozici při refreshi stránky. Pokud uživatel je na obrazovce s URL hash (např. `#payment`) a stránku refreshne, prototyp se musí vrátit na stejnou obrazovku, ne na první.

Hned za `popstate` event listenrem (nebo místo něj, pokud je k dispozici `hashchange`) vlož inicializační kód:

```javascript
// Obnova obrazovky z URL hash při refresh
(function() {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const screenId = 'screen-' + hash;
    const el = document.getElementById(screenId);
    if (el) {
      showScreen(screenId, { skipHistory: true });
      history.replaceState({ screen: screenId }, '', window.location.hash);
    }
  }
})();
```

Alternativně, pokud se používá `hashchange` event, umísti inicializaci do `DOMContentLoaded`:

```javascript
const initialHash = window.location.hash.replace('#', '');
if (initialHash && document.getElementById(initialHash)) {
  goTo(initialHash);
}
```

## Zabezpečení prototypů

Každý nový prototyp musí být zabezpečený přihlašovacím flagem v `localStorage` (klíč `rozcestnik__auth = '1'`) a sdílecím tokenem v URL parametru `?k=...`. Plaintext heslo se v kódu **ani v URL nikde neobjevuje** – všude se používá pouze jeho SHA-256 hash.

- Plaintext token (jen pro referenci, do kódu nedávat): `[viz správce hesel]`
- SHA-256 hash tokenu (používá se v URL i v kódu): `4c129f69f551195cbc5e8b57cc5a0975b6efa1e8510573524d11df03c7d010c6`

URL z rozcestníku tedy vypadá: `?k=4c129f69f551195cbc5e8b57cc5a0975b6efa1e8510573524d11df03c7d010c6`. Snippet v prototypu porovnává hodnotu z URL přímo s konstantou `H`.

Snippet vlož jako **úplně první prvek** v `<head>` (před `<meta charset>`, před GA, před vším ostatním), aby se spustil dřív než cokoli jiného a zabránil bleskovému zobrazení obsahu nepřihlášeným uživatelům:

```html
<script>
(function(){var H='4c129f69f551195cbc5e8b57cc5a0975b6efa1e8510573524d11df03c7d010c6',K='rozcestnik__auth';try{var p=new URLSearchParams(location.search);if(p.get('k')===H){localStorage.setItem(K,'1');p.delete('k');var q=p.toString();history.replaceState(history.state,'',location.pathname+(q?'?'+q:'')+location.hash);}if(localStorage.getItem(K)!=='1')location.replace('../');}catch(e){}})();
</script>
```

Logika: pokud URL obsahuje správnou hodnotu `?k=...` (musí přesně odpovídat hashi `H`), snippet uloží auth flag do `localStorage` a parametr z URL odebere. Pokud uživatel už auth flag má, načte se rovnou. Pokud nemá ani jedno, přesměruje se na rozcestník (`../`).

Heslo do rozcestníku v `index.html` (a v šabloně v `generate.js`) je uložené jako SHA-256 hash (proměnná `PASSWORD_HASH`). Submit handler hashuje vstup z formuláře a porovnává s hashem.

- Plaintext heslo rozcestníku (uživatel ho zadává do formuláře): `[viz správce hesel]`
- SHA-256 hash hesla (v kódu): `ff0cd0c401667097559c52f6f195734f9751e0389c16581a3516eb3fd3a7d878`

Token, hash a klíč nikdy neměň bez konzultace – jakákoliv změna by zneplatnila všechny dříve sdílené odkazy. Při změně hesla nebo tokenu spočítej nový SHA-256 (`printf '%s' 'heslo' | shasum -a 256`) a aktualizuj všechny prototypy + `index.html` + `generate.js`.

Generátor `generate.js` přidává hash tokenu (`?k=4c129f69...`) ke všem hrefům v rozcestníku automaticky, takže odkazy jdou rovnou kopírovat a sdílet. Plaintext token se v repozitáři nevyskytuje a je pouze pro referenci.

## Pojmenování a uložení

Při vytváření nového prototypu se mě vždy zeptej na:
1. Sekci (název adresáře), do které to budeš chtít uložit.
2. Název prototypu (který bude sloužit jako název podadresáře).

Každý nový prototyp vytvářej jako podadresář `Sekce/Název prototypu/` a v něm hlavní soubor `index.html`. HTML kód může obsahovat CSS a JS inlinovaný v sobě (jako single HTML soubor), ale samotné soubory musí být vždy strukturované takto ve vlastní složce, aby případné další pomocné soubory (obrázky, JSON, atd.) byly na jednom místě.

U prototypů v podadresářích:
- Auth guard: protože je prototyp o úroveň hlouběji, přepiš v něm `location.replace('../')` na `location.replace('../../')`.
- Relativní cesty k assetům (např. splash) posuň o úroveň výš: `../assets/...` → `../../assets/...`.
- Generátor `generate.js` načítá prototypy i z podadresářů (hledá `index.html`), takže se v rozcestníku objeví automaticky.

## Cache a verzování assetů

Prototypy musí být vždy živé a aktuální – žádné servírování staré verze. Cache meta tagy v `<head>` (`Cache-Control: no-store` apod.) vypínají cache **jen pro samotný HTML dokument**, ne pro externí soubory. GitHub Pages si `styl.css` a `app.js` cachuje vlastními hlavičkami (~10 min), takže by se mohl načíst starý kód.

U **rozdělených** prototypů (`index.html` + `styl.css` + `app.js`) načítej assety **statickým `<link>`/`<script src>` s ručním verzovacím parametrem** `?v=N`:

```html
<link rel="stylesheet" href="styl.css?v=1">
<script src="app.js?v=1"></script>
```

**Při každé změně `styl.css` nebo `app.js` zvedni číslo `?v=`** (`?v=2`, `?v=3` …) v `index.html` – tím obejdeš starou cache a vynutíš načtení nové verze. Číslo musí být u všech odkazů na daný soubor správně nalinkované.

Nepoužívej `document.write` ani cache-bust `?_=Date.now()`. Dynamická URL při každém načtení rozbije nahrávání v **Clarity** – Clarity čte stylesheety z `document.styleSheets` a inlinuje jejich `cssRules`; `<link>` vložený přes `document.write` často není v iniciálním snapshotu a měnící se URL nejde spárovat, takže přehrávka zůstane bez stylů. Statický same-origin `<link>` Clarity zachytí a styly v nahrávce fungují. Proto má statický link s ručním `?v=N` přednost.

Single-file prototypy (CSS i JS inline) verzování nepotřebují – meta tagy v HTML stačí.

## Práce s repozitářem

Před každou změnou prototypu si udělej `git pull`, abys měl aktuální stav z repozitáře. Repozitář `lukasbendik/design` je naklonovaný v `~/Projects/UX/ux/`. Prototypy automaticky commituj a pushuj.

## Rozcestník a deploy

Repozitář se přes GitHub Actions (`.github/workflows/deploy.yml`) automaticky deployuje na GitHub Pages. Workflow nejdřív spustí `generate.js`, který vygeneruje rozcestník `index.html` ze všech HTML souborů v podsložkách.

Po každém pushi vždy v odpovědi vrať odkaz na rozcestník a také přímý odkaz na konkrétní prototyp (pokud pracujeme na konkrétním prototypu) včetně autorizačního tokenu a hashe, aby ho uživatel mohl rovnou zkopírovat nebo otevřít.

- Rozcestník: `https://lukasbendik.github.io/design/`
- Příklad přímého odkazu: `https://lukasbendik.github.io/design/Sekce/Název%20prototypu/index.html?k=4c129f69f551195cbc5e8b57cc5a0975b6efa1e8510573524d11df03c7d010c6#hash`

Připomeň, že odkaz začne fungovat až po doběhnutí GitHub Actions (obvykle do minuty).

## Paralelní práce s agenty

Pokud úkol zahrnuje úpravy ve více prototypech nebo více nezávislých změn, automaticky rozděl práci na agenty a spusť je paralelně. Nemusím o to explicitně žádat.

## Ukládání zápisků o konverzaci

Na konci každé konverzace (po dokončení práce a verifikaci) je nutné vytvořit zápisek o provedené práci a uložit ho do složky `ux/zapisky/`.
- Název souboru: `YYYY-MM-DD_[id_konverzace]_[kratky_popis].md` (vše malými písmeny, bez diakritiky, mezery nahradit podtržítky).
- Zápisek musí obsahovat datum, ID konverzace, zadání uživatele a stručný souhrn provedených změn (převzatý z `walkthrough.md` nebo závěrečné odpovědi).
- Po uložení zápisku aktualizovat tabulku v `ux/zapisky/README.md` (přidat nový řádek na začátek tabulky).
- Všechny vytvořené zápisky a aktualizovaný index ihned commitnout a pushnout na GitHub.

## Komunikace

- Používej kritické myšlení a ověřuj správnost výstupů.
- Používej jednoduchý jazyk, bez slangu.
- Preferuj krátké, výstižné odpovědi.
