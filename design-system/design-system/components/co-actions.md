---
id: kb-design-system-2026-0009
title: Action components — Button, Action Stack, Button Bars, Toolbar
type: component-spec
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
valid_from: 2026-08-12
last_correction: "2026-08-12 — corrected against the Figma savings screens (offer, interest, result, savings homescreen, account detail); re-approved by @robert.puschel the same day"
review_by: 2027-08-12
sources:
  - "Figma component descriptions of CO Button / v4.0, CO Action Stack / v3.0, CO Button Bar Bottom / v4.0, CO Button Bar Dynamic / v4.0 and CO Toolbar / v3.0 Static, file LF8w8yzyLqGKOJvZs1qApB, read via the Figma MCP connector on 2026-08-12"
  - "Figma variant matrices of the eight action components in the same file, read 2026-08-12"
  - "Figma variables read from CO Button / v4.0 node 32529:185995 on 2026-08-12: interactive/primary #e00000, interactive/primaryAction #be0000, interactive/onPrimary #ffffff, sizing/buttonHeight 48, borderRadius/md 8, border/md 2, padding/xl 16, content/button 16/24/500"
  - "W3C Web Content Accessibility Guidelines 2.2, https://www.w3.org/TR/WCAG22/, target size and focus appearance criteria"
related: [kb-design-system-2026-0008, kb-design-system-2026-0003]
tags: [components, buttons, accessibility]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Action components — Button, Action Stack, Button Bars, Toolbar

**Summary:** Eight components share one job: giving the user something to do. Which one you use is
decided by how many actions there are and where on the screen they live, not by how they look.

## Purpose, in Golem's own words

> An interactive button is a graphical element that provides visual feedback and triggers an action
> or event upon user interaction, following established design guidelines and behaviors. **Labels
> should be verbs and succinctly express what will happen.** — `CO Button / v4.0`

> An action stack is a group of buttons … Primary action is placed at the top or on the left,
> followed by secondary actions in descending order of priority. Action buttons can do destructive
> actions. **If you need only 1 or 2 actions, use CO Button instead.** — `CO Action Stack / v3.0`

> A button bar is a group of buttons arranged vertically or horizontally to provide a consolidated
> action area on the bottom of the screen. **Any content scrolls under it.** Aka BuBaBo —
> `CO Button Bar Bottom / v4.0`

> Floating or static toolbar for most used calls-to-action. **Use Static for any device that's
> primarily used with keyboard and mouse.** — `CO Toolbar / v3.0 Static`

## Choosing

| Actions | Where | Component |
|---|---|---|
| 1–2 | inline in content | `CO Button / v4.0` |
| 1–2 | pinned to the bottom of the screen | `CO Button Bar Bottom / v4.0` |
| 1–2 | at the end of scrolling content | `CO Button Bar Dynamic / v4.0` |
| 1 + a summary value | bottom, in a purchase or transfer | `CO Button Bar Summary / v1.0` |
| 3–7 | inline | `CO Action Stack / v3.0` |
| 1–4 shortcuts | above content, always reachable | `CO Toolbar / v3.0 Floating` or `Static` |
| chat compose | bottom of a chat | `CO Button Bar Chat v1.0` |

## Anatomy and contract

### CO Button / v4.0 — 97 instances

| Property | Options |
|---|---|
| `Variant` | `Primary` · `Secondary` · `Tertiary` |
| `State` | `Enabled` · `Hover` · `Focus` · `Disabled` · `Loading` |
| `s` | `responsive (fullwidth)` · `static (inline)` |
| `Label` | text, default `$label` |
| `Icon?` + `ES Icon` | optional leading icon, instance-swap |
| `Tooltip?` | boolean |

All five states exist as real variants — there is no excuse for a design that shows only
`Enabled`. `responsive (fullwidth)` fills its container; `static (inline)` hugs its label.

Exact appearance, read out of the component itself rather than eyeballed:

| | Fill | Label | Border |
|---|---|---|---|
| Primary | `interactive/primary` | `interactive/onPrimary` | none |
| Primary hover | `interactive/primaryAction` | `interactive/onPrimary` | none |
| Primary disabled | `content/quaternary` `#adadad` | `interactive/onPrimary` — **white on grey, not grey on grey** | none |
| Secondary | none | `interactive/secondary` | `border/sm` **1 px** `interactive/secondary` |
| Tertiary | none | `interactive/secondary` | none |
| Focus (any) | as its variant | as its variant | 2 px `interactive/secondary` ring outside the button |
| Loading | `content/skeletonLoading` | none | none |

The secondary button's outline is 1 px. The 2 px `border/md` in the button's token set is the
focus ring, not the resting border — a mistake worth naming because both tokens appear on the
same component.

Geometry: height `sizing/buttonHeight` 48, radius `borderRadius/md` 8, horizontal padding
`padding/xl` 16, icon-to-label gap `padding/md` 8, label `content/button` 16/24/500 at
-0.24 px tracking.

**The default icon is a trap.** Every icon slot in Golem defaults to an instance named
`⚠︎Placeholder`, whose own description says to find a real icon to replace it with. A button that
ships with `Icon? = true` and an untouched swap slot ships a deprecated placeholder.

### CO Action Stack / v3.0

`Variant = Pile SM · Pile MD-LG · Row` · `Actions = Multiple · Single · Single destructive` ·
`Loaded = Yes · No`, plus `Action 1?`…`Action 6?`, `Action destructive?`, seven label and icon
slots. Pile is vertical, Row is horizontal; the SM/MD-LG split is a breakpoint, not a size choice.

### CO Button Bar Bottom / v4.0 — 58 instances

`s = sm · md-iPad · md-IB · lg-narrow-IB · lg-wide-IB` — one size per breakpoint and channel —
plus `Primary button?` and `Secondary button?`.

**Its ground is `background/body`, not a white tray**, with the **panel** shadow lifting it off the
content that scrolls under it: `padding/xl` 16 all round, `padding/xl` 16 between two buttons, each
button full width. Read from `CO Button Bar Bottom / v4.0` on the savings screens on 2026-08-12.
The bar belongs to the bottom of the *screen*; in code that means the screen is a box with a
definite height, not a page with a fixed element, or the bar attaches to the browser window instead.

**Deprecated inside this component:** size `⚠︎ md-lg-IB` and the entire `⚠︎ Buttons` property. Use
the two booleans to decide which buttons appear, not the old enum.

### CO Button Bar Dynamic / v4.0

`s = sm · md-iPad · md-lg-IB` · `Buttons = Primary+Secondary · Primary · Secondary`.
**`Buttons = ⚠︎Primary+Tertiary` is deprecated.**

### CO Button Bar Summary / v1.0 — 46 instances

`Size` as for Button Bar Bottom · `Button = Primary · Secondary`. Carries a value next to the
action — use it where the user is confirming an amount.

### CO Toolbar / v3.0 Floating and Static

`items = 1 · 2 · 3 · 4`, each item a label plus an instance-swap icon. Floating is
`static-iOS-Android + static-sm-IB`; Static is `responsive-md-lg-IB`. At `sm` the floating toolbar
is 264 × 76, centred, overlaid on the content.

The floating toolbar is a **filled `interactive/primary` pill with `borderRadius/xl` (16 px)** and
white `content/captionPrimaryBold` labels under the icons. It is not a white surface on a shadow —
that is the snackbar. The static toolbar is the neutral one.

### CO Button Bar Chat v1.0

`State = Enabled · EnabledPlaceholder · Focus`.

## States

Every component above has a loading form (`State = Loading`, or `Loaded = No` on Action Stack).
Disabled exists only on `CO Button`; a button bar is hidden or its button is disabled, never
greyed as a whole.

## Content limits

**Not defined in Figma.** No action component declares a maximum label length. Until the design
system publishes one, the working rule is what the component geometry allows: an inline button
label that wraps is a defect, and `CO Toolbar` labels sit under a 24 px icon in a quarter of the
screen width. This is the gap the copywriter feels most.

## Accessibility

- Minimum target 48 × 48 (`sizing/buttonHeight`), which also satisfies WCAG 2.2 target size (2.5.8).
- `Focus` is a real variant on Button, Tag, inputs and the chat bar — a 2 px outline
  (`border/md`) in `interactive/secondary`. Never remove it in a prototype.
- Label text is `content/button` at 16/24 weight 500; primary text on `interactive/primary`
  (`#ffffff` on `#e00000`) is 4.5:1, so never reduce the label below 16 px on a primary button.
- Destructive actions are marked by the `Action destructive?` property, not by colour alone.
- Loading must keep the label in the accessibility tree, otherwise the control disappears for a
  screen reader mid-task.

## Do / don't

- Do write labels as verbs: *Odeslat platbu*, not *Platba*.
- Do use `CO Button` for one or two actions; the Action Stack description says so explicitly.
- Do keep primary actions first — top in a Pile, left in a Row.
- Don't put two primary buttons in one bar.
- Don't build a bottom bar out of loose buttons; content must scroll under a real button bar.
- Don't use the deprecated `⚠︎ Buttons` property or `⚠︎Primary+Tertiary`.

## Code

```css
/* Primary and secondary button, from prototype-kit/tokens.css */
.btn {
  min-height: var(--sizing-button-height);   /* 48px */
  padding: 0 var(--padding-xl);              /* 16px */
  gap: var(--padding-md);                    /* 8px icon to label */
  border-radius: var(--border-radius-md);    /* 8px */
  font: var(--content-button);               /* Inter 500 16/24 */
  letter-spacing: var(--tracking-body-primary);
}
.btn--primary   { border: none; background: var(--interactive-primary); color: var(--interactive-on-primary); }
.btn--primary:hover { background: var(--interactive-primary-action); }
.btn--secondary { background: transparent; color: var(--interactive-secondary);
                  border: var(--border-sm) solid var(--interactive-secondary); }  /* 1px, not 2 */
.btn:focus-visible { outline: var(--border-md) solid var(--interactive-secondary); outline-offset: 2px; }
.btn[disabled]  { background: var(--content-quaternary); color: var(--interactive-on-primary); }
```

## Golem's own documentation

`CO Button / v4.0` links to <https://wiki.kb.cz/confluence/x/H3AREw>. Confluence space **KBDS** is
where Golem keeps the prose for every component; Figma carries the contract, Confluence carries
the reasoning. Read both before specifying an unusual case.

## Sources

- Figma component descriptions, quoted verbatim above, for Button, Action Stack, Button Bar Bottom,
  Button Bar Dynamic and Toolbar Static.
- The variant matrices of all eight components.
- `get_design_context` on `CO Button / v4.0` variants `Secondary / Enabled` (34358:187416) and
  `Primary / Disabled` (14540:63106), read 2026-08-12 — the fill, border and label table above is
  a transcription of the returned token-mapped styles, not an inference from a screenshot.
- Token values read from the `CO Button / v4.0` node itself.
- WCAG 2.2 for the target-size and focus criteria.

## Open questions

- Maximum label lengths are undefined.
- `CO Button` has no destructive variant, but `CO Action Stack` does. How is a single destructive
  action styled?
- `CO Button Bar Summary` has no Figma description; its intended use is inferred from its name and
  its 46 in-library instances.
