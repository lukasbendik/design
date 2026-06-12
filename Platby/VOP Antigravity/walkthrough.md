# Walkthrough: Prototyp VOP Antigravity

Vytvořil jsem interaktivní prototyp **VOP Antigravity** v sekci **Platby** a upravil pravidla projektu podle vašich pokynů.

## Provedené změny

### 1. Aktualizace instrukcí projektu
* Upravil jsem soubor [CLAUDE.md](file:///Users/lukasbendik/Documents/Claude/UX/CLAUDE.md):
  * Každý nový prototyp se nyní vytváří do **vlastního podadresáře** (`Sekce/Název prototypu/`) s hlavním souborem `index.html`.
  * Při zahájení práce se na začátku zeptám na **Sekci** (cílovou složku) a **Název prototypu** (název podsložky).

### 2. Implementace prototypu VOP Antigravity
Přesunul a přejmenoval jsem soubor na [Platby/VOP Antigravity/index.html](file:///Users/lukasbendik/Documents/Claude/UX/ux/Platby/VOP%20Antigravity/index.html). HTML kód obsahuje 4 interaktivní varianty odsouhlasení Všeobecných obchodních podmínek (VOP) a testovací nástroje:

* **Zabezpečení:** Na začátek hlavičky `<head>` byl vložen bezpečnostní auth guard s relativním přesměrováním `location.replace('../../')` (o dvě úrovně výš).
* **Varianta A: Inline checkbox v rekapitulaci (krok 2)**
  * V souhrnu platby se zobrazí dashed-border box s informací o nových VOP a checkboxem. Tlačítko *Potvrdit platbu* je zablokované, dokud uživatel checkbox nezaškrtne.
* **Varianta B: Bottom sheet po kliknutí na Potvrdit**
  * Uživatel klikne na *Potvrdit platbu* a zdola se vysune přehledný modal s informací o změnách a tlačítky *Souhlasím a odeslat* a *Nesouhlasím*.
* **Varianta C: Celostránkový mezikrok před PINem**
  * Uživatel klikne na *Potvrdit platbu* a je přesměrován na samostatnou obrazovku s plným textem VOP. Box s textem vyžaduje dorolování až na konec, čímž se teprve odblokuje souhlasový checkbox a tlačítko *Odsouhlasit a pokračovat*.
* **Varianta D: Inline upozornění v 1. kroku platby**
  * Hned v 1. kroku se nahoře zobrazí výrazný žlutý alert. Kliknutím se přejde na plné znění VOP (s nutností scrollu). Po schválení se uživatel vrátí zpět a banner zmizí. Pokud se pokusí pokračovat bez schválení, banner se roztřese.
* **Obrazovka stornování platby**
  * Pokud uživatel odmítne souhlasit s VOP, přejde na obrazovku stornované platby s možnostmi *Zpět na přehled* nebo *Zkusit znovu*.

### 3. Testovací nástroje pro výzkumníky
* **Desktopový panel:** Na stolním počítači se vedle telefonu zobrazuje tmavý ovládací panel pro přepínání variant, sledování stavu schválení a resetování stavu.
* **Mobilní nastavení:** Na reálném mobilním telefonu se v pravém dolním rohu zobrazuje plovoucí ikona ozubeného kolečka ⚙️, která otevírá spodní šuplík se shodnými testovacími funkcemi.

---

## Nasazení na GitHub Pages

Změny byly úspěšně commitnuty a pushnuty do repozitáře.

> [!NOTE]
> GitHub Actions spustí build a aktualizaci rozcestníku. Změny se na odkazu projeví přibližně do 1 minuty.
