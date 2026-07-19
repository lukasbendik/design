# Zápis z konverzace: Walkthrough - Navrácení k fyzickým žaluziím a posílení hlasového ovládání

**Datum:** 2026-07-13 19:54:52
**ID konverzace:** `f0e583df-1d8e-4307-a667-e4c98e29fe2d`
**Odkaz na logy:** [transcript.jsonl](file:///Users/lukasbendik/.gemini/antigravity/brain/f0e583df-1d8e-4307-a667-e4c98e29fe2d/.system_generated/logs/transcript.jsonl)

## Zadání uživatele
```text
mám problém s 

Vyberte preferované převody řeči:
Převod řeči na text (STT): Např. Home Assistant Cloud (pokud máte Nabu Casa) nebo jinou lokální metodu.
Převod textu na řeč (TTS): Např. Google Cloud TTS nebo Home Assistant Cloud pro přirozený český hlas.

nemám tam k dispozici žádnou službu. nejde to dělat přes gpt, aby to bylo kvalitní?
```

## Provedené změny (z walkthrough.md)
# Walkthrough - Navrácení k fyzickým žaluziím a posílení hlasového ovládání

Podle tvého přání jsme kompletně zrušili virtuální šablonové (template) žaluzie v uživatelském rozhraní a vrátili se k původním fyzickým entitám bez posuvníků. Otočenou logiku naklápění jsme ponechali **výhradně pro hlasové ovládání** a výrazně jsme ji posílili v systémovém nastavení ChatGPT.

## Provedené kroky a změny

1. **Odstranění virtuálních žaluzií**:
   - Vymazali jsme všechny definice virtuálních žaluzií a pomocného přepínače z [configuration.yaml](file:///Users/lukasbendik/NextCloud/Projects/HA/configuration.yaml).
   - Odstranili jsme tyto nefunkční entity z registru Home Assistanta přes API, aby nedocházelo k duplicitě.

2. **Obnovení původních fyzických žaluzií**:
   - Přejmenovali jsme všechny fyzické žaluzie zpět na jejich původní Entity ID (odstranili jsme příponu `_fyzicka`).
   - Fyzické žaluzie se nyní jmenují např. `cover.pracovna_lukas`, `cover.cely_dum` atd.
   - Všechny tvé přehledy, dashboardy i automatizace **automaticky načítají tyto původní fyzické žaluzie** a fungují tak jako dříve (bez posuvníků, pouze s nativními krokovými tlačítky pro naklápění v detailu).

3. **Posílení a oprava chování pro Hlasové ovládání**:
   - Zjistili jsme, že jazykový model mohl dřívější instrukci ignorovat a volat služby na základě svého obecného pochopení (tedy že "open" = otevřít/nahoru).
   - **Výrazně jsme zesílili systémový prompt** pro ChatGPT asistenta na serveru a také lokální dokument [chatgpt_voice_control.md](file:///Users/lukasbendik/NextCloud/Projects/HA/chatgpt_voice_control.md).
   - Prompt nyní obsahuje **velmi důrazné a závazné pravidlo**, které ChatGPT zakazuje spoléhat na výchozí názvy služeb a nařizuje přesné mapování:
     - Při požadavku na **naklopení nahoru / pootevření** -> **VŽDY zavolá `cover.close_cover_tilt`** (který fyzicky lamelu naklopí nahoru).
     - Při požadavku na **naklopení dolů / zavření naklápění** -> **VŽDY zavolá `cover.open_cover_tilt`** (který lamelu naklopí dolů).
   - Integraci Extended OpenAI jsme úspěšně restartovali/znovu načetli bez nutnosti celého restartu Home Assistanta.

## Ověření funkčnosti
* Fyzické entity jsou plně online a připravené.
* Systémový prompt v integraci byl aktualizován s novou zvýrazněnou instrukcí. Hlasové příkazy by nyní měly spolehlivě reagovat správným směrem!

