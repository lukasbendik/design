---
id: kb-design-system-2026-0014
title: Feedback components — InLine Message, Snackbar, Modal, Illustrated Message, Spinner, Tooltip, Tag, Badge, Rating
type: component-spec
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
valid_from: 2026-08-12
review_by: 2027-08-12
sources:
  - "Figma component description of CO InLine Message / v6.0, file LF8w8yzyLqGKOJvZs1qApB, read via the Figma MCP connector on 2026-08-12"
  - "Figma variant matrices of CO InLine Message / v6.0, CO Snackbar / v2.0, CO Modal Alert / v4.0, CO Modal Biometric / v4.0, CO Illustrated Message v1.0, CO Spinner / v2.0, CO Tooltip / v1.0, CO Tag / v3.0, CO Badge and CO Rating / v3.0 in the same file, read 2026-08-12"
  - "Figma variables read from CO InLine Message node 56511:224381, CO Snackbar node 26324:190064 and CO Modal Alert node 23088:160898 on 2026-08-12: attention/* colours and surfaces, shadow/floating, borderRadius/xl 16, borderRadius/full 1024"
  - "W3C Web Content Accessibility Guidelines 2.2, https://www.w3.org/TR/WCAG22/, use of colour and status messages"
related: [kb-design-system-2026-0005, kb-design-system-2026-0008]
tags: [components, notifications, accessibility, error-handling]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Feedback components

**Summary:** Golem separates *status* from *event*. A status stays on the screen and is an inline
message; an event passes and is a snackbar; a decision blocks and is a modal. The component
descriptions are unusually explicit about this, and the distinction is worth respecting.

## Purpose, in Golem's own words

> Important message that informs the user about current status or a situation. Uses text, colour
> and icons to signify severity of the situation. **Isn't interactive** — if an action is required,
> add another component. **This component should not display temporary non-status information, such
> as "success messages".** Variant Priority is used for messages concerning whole page or errors
> that bar the user from continuing in the flow. — `CO InLine Message / v6.0`

Two parts of that description are out of date. It names a `Priority` variant the published
component does not expose, and its "isn't interactive" is superseded — interactivity is a choice
the designer makes per instance, see below. The rest holds, in particular the ban on using an
inline message for a temporary success.

## Choosing

| The message … | Component |
|---|---|
| describes a lasting state of the page or a block | `CO InLine Message / v6.0` |
| confirms something that just happened, then goes | `CO Snackbar / v2.0` |
| needs a decision before anything else continues | `CO Modal Alert / v4.0` |
| fills an empty, error or result screen | `CO Illustrated Message v1.0` |
| explains one control on demand | `CO Tooltip / v1.0` |
| labels or filters an object | `CO Tag / v3.0` |
| counts unread items | `CO Badge` |
| asks for a rating | `CO Rating / v3.0` |
| covers a wait | `CO Spinner / v2.0`, or a component's own loading state |

## Contract

| Component | Axes | Notes |
|---|---|---|
| `InLine Message / v6.0` | `MessageType = info · success · error · warning`; `s = responsive-sm · responsive-md-lg`; `interactive` boolean | 27 uses; interactive when the caret is shown |
| `Snackbar / v2.0` | `s = responsive-iOS · responsive-Android · responsive-IB` | **a dark inverted bar**, see below |
| `Modal Alert / v4.0` | `s` per platform; `Buttons = 2 · 1` | 16 px radius, `dialog/surface` on `dialog/overlay` |
| `Modal Biometric / v4.0` | `Technology = Touch ID · Face ID`; `Stage = alert · face scanning · face success · face fail 1st · face fail last` | iOS only, static |
| `Illustrated Message v1.0` | `size = responsive` (`⚠︎md-lg-IB` deprecated) | the empty / error / result screen body |
| `Spinner / v2.0` | `Variant = customKBshape` (three `⚠︎native` variants deprecated) | the KB shape is a small **red rounded-rectangle outline**, not a circular spinner; the three circular forms are the deprecated OS ones |
| `Badge` | red filled circle, white `!` or number; `Inverse color = True` flips it to a white circle with red content | `borderRadius/full`, `content/captionSecondaryBold` |
| `Tooltip / v1.0` | `Position = righ · left · top · bottom` | 87 uses; note the misspelled `righ` — copy it exactly |
| `Tag / v3.0` | `Icon/Flag = Icon · Icon+Outline · Flag+Outline`; `State = Enabled · Hover · Focus · Active · HoverActive · FocusActive · Loading` | 80 uses; the only feedback component with a full interaction state set. **`borderRadius/sm` 4 with a 1 px outline — a tag is not a pill.** `Active` is a filled `interactive/primary`; the leading dot may be a currency icon, a `chart/cool` marker or an `ES Icon Flag` |
| `Badge` variants | `Variant = Exclamation mark · Number`; `Inverse color = True · False` | see the row above for how it renders |
| `Rating / v3.0` | `Stars = 0 / initial · 1…5 · 0 / loading` | five **outlined** stars; rated ones turn `interactive/primary` red, the rest stay `content/quaternary` grey. Nothing is ever filled — the outline is the shape. `0 / initial` is all grey, `0 / loading` is the skeleton tint |

`CO Tag` is interactive because tags are used as filters — `Active` is the selected filter, not a
severity.

**Deprecated inside healthy components:** `CO Tag`'s `⚠︎IB Show Closable Icon`,
`CO Illustrated Message`'s `size = ⚠︎md-lg-IB`, `CO Spinner`'s three platform-native variants.

## The four message types, as the component actually renders them

| Type | Surface | Icon | Message text |
|---|---|---|---|
| `info` | `attention/informationSurface` `#ededed` | `Info`, neutral | `content/primary` |
| `success` | `attention/successSurface` `#e2f5de` | `Checkmark`, green | `content/primary` |
| `error` | `attention/alertSurface` `#ffede8` | `Error`, red | `content/primary` |
| `warning` | `attention/informationSurface` `#ededed` — **grey, not yellow** | `Warning`, neutral outline | `content/primary` |

Three things here are easy to get wrong and all three were wrong in the first version of this file:

- **Warning shares the info surface.** `attention/processing` and its yellow surface exist as tokens
  but `CO InLine Message` does not use them. Warning is distinguished by its icon, not by colour.
- **The message text is always `content/primary`**, never the attention colour. Only the icon
  carries the severity. Colouring the text is not how Golem signals severity.
- **Golem's information colour is neutral grey-black, not blue.** A blue info box is not Golem.

Geometry: `padding/xl` 16 horizontal, `padding/lg` 12 vertical, 16 gap, 48 minimum height, text
`content/bodySecondary` 14/20. The two sizes differ in more than width:

| | `responsive-sm` | `responsive-md-lg` |
|---|---|---|
| Corners | square, full-bleed to the screen edge | `borderRadius/md` 8 |
| Elevation | none | the **panel** shadow |

### Interactive or not is your choice

The component carries an `interactive` boolean that renders a `caretRight` on the trailing edge.
The Figma description says the component "isn't interactive"; that sentence is out of date. The
resolved rule, from the design-system owner:

- **`interactive = true` — the caret is shown.** The whole message is a target and must lead
  somewhere. Use it when the situation has a place to go: a failed payment that opens its detail,
  a document that needs signing.
- **`interactive = false` — no caret.** The message states a status and that is all. Use it when
  there is nothing to open.

The caret is the contract. If it is there, tapping must do something; if there is nothing to open,
turn it off. Never show a caret that leads nowhere, and never make a caret-less message clickable.

## The modal is three different objects

`CO Modal Alert / v4.0`'s `s` property is not a size — each platform gets a genuinely different
dialog, and two of the three do not use Golem buttons at all:

| `s` | Layout | Buttons |
|---|---|---|
| `responsive-iOS` | title and text centred, hairline-divided footer | **platform-native blue text buttons**, side by side for two |
| `responsive-Android` | title and text left-aligned | **platform-native blue text buttons**, bottom-right |
| `responsive-IB` | title left, close ✗ top-right, grey footer band, `borderRadius/xl` 16 | `CO Button` — filled red primary, outlined secondary |

Blue is not in the Golem palette. On Apple and Android the modal deliberately hands the buttons to
the operating system; do not restyle them red to "match the brand".

## Illustrated Message layouts

`responsive` stacks centred: illustration, `headings/headlineSecondary` heading,
`content/bodySecondary` text, then a static red `CO Button`. The deprecated `⚠︎md-lg-IB` variant
puts the illustration beside left-aligned text instead. Use the `M` illustration size (375 × 212)
here; the `S` size belongs to promo cards.

## The two inverted surfaces

Golem inverts exactly twice, and both are in this family. Everything else in the system is dark
content on a light surface.

**`CO Snackbar / v2.0`** is a **dark bar with white text**, not a white card on a shadow:
`content/secondary` `#454545` ground, `background/surface` text. Its three platform forms differ in
shape — iOS a full `borderRadius/full` pill, Android a wide `borderRadius/md` bar, IB the same bar
with a close ✗. It sits on the **floating** shadow.

**`CO Tooltip / v1.0`** uses the same ground: `content/secondary` at `borderRadius/md` 8, text in
`background/body` `#f8f8f8`, header `content/captionPrimaryBold`, value `content/captionPrimary`,
maximum width 240, a 10 × 5 arrow, floating shadow.

If you find yourself drawing a third inverted thing, it is probably one of these two.

## States

Inline Message, Snackbar, Modal and Illustrated Message have no loading state — they *are* the
state. Tag has a full interaction set plus loading. Rating has a loading form.

## Content limits

Not defined. A snackbar is a single line on `sm` and a modal's title is
`headings/headlinePrimary` at 20/28 — both truncate rather than wrap in the observed instances,
which is the strongest argument in the whole ingest for publishing character limits.

## Accessibility

- Severity is never colour alone: each message type has its own icon, and the text must say what
  happened. This is WCAG 2.2 use-of-colour, and the component description says the same thing in
  design terms.
- A snackbar is a status message: announce it politely, and never put the only way to undo an
  action inside something that disappears.
- `CO Modal Alert` traps focus, returns focus to the trigger on close, and is dismissible by
  keyboard. Two buttons means a real choice; one button means acknowledgement.
- `CO Tooltip` must be reachable and dismissible by keyboard, and must not be the only place a
  piece of information exists.
- `CO Badge` with `Variant = Number` needs a text alternative — "3 unread", not "3".
- Do not use an inline message for a transient success. The component description forbids it, and
  a permanent success banner is noise.

## Do / don't

- Do use the component's own loading state instead of a spinner over the whole screen.
- Do give an error a way forward — either turn the caret on so the message itself opens the detail,
  or add a button beside it.
- Do use `CO Illustrated Message` for whole-screen states, with an `ES Illustration` motif.
- Don't use an inline message for "Saved successfully" — that is a snackbar.
- Don't use a modal for information. A modal asks a question.
- Don't use the deprecated platform-native spinners.

## Code

```css
.tag {
  padding: var(--padding-sm) var(--padding-md);
  border: var(--border-sm) solid var(--background-border-highlighted);
  border-radius: var(--border-radius-sm);      /* 4px, not a pill */
  background: var(--background-surface);
  font: var(--content-caption-primary-bold);
}
.tag--active { background: var(--interactive-primary); border-color: var(--interactive-primary);
               color: var(--interactive-on-primary); }

.inline-message {
  display: flex; gap: var(--padding-xl);
  min-height: 48px;
  padding: var(--padding-lg) var(--padding-xl);    /* 12 / 16 */
  font: var(--content-body-secondary);
  color: var(--content-primary);                   /* text is never the severity colour */
  background: var(--attention-information-surface);/* info and warning share this */
}
.inline-message--success { background: var(--attention-success-surface); }
.inline-message--error   { background: var(--attention-alert-surface); }
@media (min-width: 768px) {                        /* responsive-md-lg */
  .inline-message { border-radius: var(--border-radius-md); box-shadow: var(--shadow-panel); }
}
/* The two inverted surfaces: dark ground, light text. */
.snackbar, .tooltip {
  background: var(--content-secondary);
  color: var(--background-surface);
  box-shadow: var(--shadow-floating);
}
.snackbar {
  display: inline-flex; align-items: center; gap: var(--padding-xl);
  padding: var(--padding-lg) var(--padding-xl);
  border-radius: var(--border-radius-full);   /* Android and IB use --border-radius-md */
  font: var(--content-body-secondary-bold);
}
.tooltip {
  max-width: 240px; padding: var(--padding-md);
  border-radius: var(--border-radius-md);
  font: var(--content-caption-primary);
}
```

## Golem's own documentation

`CO InLine Message / v6.0` links to <https://wiki.kb.cz/confluence/x/brTiEw>. The `ES Icon`
components it uses carry their own links into the same Confluence space, **KBDS**.

## Sources

- The `CO InLine Message / v6.0` description, quoted verbatim.
- Variant matrices of the ten components above.
- `get_design_context` on `CO InLine Message / v6.0` (node 56511:224381), read 2026-08-12 — the
  surface, icon and text table and the sm/md-lg difference are transcriptions of the returned
  token-mapped styles.
- Rendered screenshots of `CO Modal Alert / v4.0` (23088:160898),
  `CO Illustrated Message v1.0` (98681:512384), `CO Tag / v3.0` (73918:245457),
  `CO Snackbar / v2.0` (26324:190064), `CO Badge` (66934:10352) and `CO Rating / v3.0`
  (5357:20472), read 2026-08-12 — the platform differences in the modal come from there.
- Tooltip tokens read from the tooltip embedded in `CO Button / v4.0`.
- WCAG 2.2 for the use-of-colour and status-message criteria.

## Open questions

- The InLine Message description names a `Priority` variant that the component does not have. Was
  it removed, or is the description ahead of the component? (The same description's "isn't
  interactive" is resolved: interactivity is a per-instance choice, marked by the caret.)
- `CO Tooltip`'s `Position = righ` is a typo in a name used 87 times. Renaming would break
  instances; it should probably stay and be documented, as here.
- No component defines how long a snackbar stays on screen.
