# Prototype kit

The design system as code you can open in a browser. No build step, no dependencies, no network.

This is not a convenience layer on top of Figma. It is written so that **when Figma is gone, this
still is the design system**: every number in it was read from a Figma node or measured on a built
screen, and every one of those reads is recorded next to the value it produced, in the file itself
and in the knowledge documents it twins. Nothing here needs a connector, a token, or a live design
file to keep working.

## The layers

Four layers, in the order they load. Each one only knows about the ones above it.

| File | Layer | What it owns |
|---|---|---|
| `tokens.css` | **foundations** | every Golem token as a custom property, plus dark mode and the internal brand |
| `fonts.css` | foundations | Inter 400 / 500 / 600 from [`../assets/fonts/`](../assets/fonts/) |
| `icons.js` | foundations | every icon in [`../assets/icons/`](../assets/icons/) as one inline sprite |
| `templates.css` | **templates** | the screen frame: slots, breakpoints, platforms, navigation styles |
| `components.css` | **components** | stand-ins for the `CO` components that go inside the frame |
| `shell.css` + `shell.js` | **shell** | the device / breakpoint / mode / language / step harness around a prototype |

`screen.css` links templates + components in one go, for prototypes that want a single stylesheet.

Two skeletons to copy: `screen.html` (the screens) and `shell.html` (the harness around them).
`build-icons.py` regenerates the sprite after an icon is added to `../assets/icons/`.

## How to build a prototype

1. Copy `shell.html` to `workspace/<you>/outputs/<date>-<slug>/index.html` and `screen.html` to
   `screens.html` next to it. Point the shell's `file:` at it and list the steps.
2. Keep the `<link>` and `<script>` paths pointing at this folder. Do not copy the files: a
   prototype that links the kit follows the design system, a prototype that copies it freezes a
   snapshot and drifts.
3. **Pick the navigation style first** and put it on the screen as `data-nav`
   (`ground-main`, `ground-sub`, `flow`, `dialog`, `sheet`). It decides the header, whether main
   navigation is on screen, the width of the content column at every breakpoint, and how the button
   bar behaves. See [`../patterns/navigation-styles.md`](../patterns/navigation-styles.md).
4. Fill slots, never positions: `.scr__header`, `.scr__comms`, `.scr__nav`, `.scr__content` with
   `.scr__main` (and `.scr__tools` from lg), `.buttonbar`, `.toolbar`.
5. Set `data-platform` on `<html>` from the URL. The kit keys the scrollbar, the way out of a
   dialog and the IB header band off it.

## The screen is a box

`.scr` is the design canvas, not the page. The header, the scrolling content and
`CO Button Bar Bottom` are laid out inside it, so the same file behaves identically full-screen and
inside a device frame.

Nothing in the kit is `position: fixed`. A fixed button bar sticks to the browser window: put the
screen in a 375-wide frame on a wide monitor and the bar stretches across the whole window while
the content stays in the frame. Everything that floats — the toolbar, a sheet, an overlay — is
`position: absolute` against `.scr`.

A device frame (rounded corners, a shadow, a notch) belongs to the shell, never to the screen.
Figma draws one on its screen frames for the same reason: it is presentation, not design.

## The template owns the layout, the screen owns the content

This is the rule the kit exists to enforce, and the one most often broken.

A screen does not set widths. It puts blocks in slots, and `templates.css` decides how wide the
column is at 375, 768, 1024 and 1680, on a phone and in a browser. A heading that runs to the
window edge on a wide screen, a button stretched across 1024 px, a pill row on a subpage — all
three are a screen that laid itself out.

The measured contract is in
[`../patterns/breakpoints-and-platforms.md`](../patterns/breakpoints-and-platforms.md); the short
version:

| | sm 375 | lg 1024 |
|---|---|---|
| Ground navigation | 32 px pill row, `Ground / Main page` only | 252 px side panel, both Ground styles |
| Ground content | one column | 452 main + 320 tools rail |
| Flow / Dialog content | full bleed | 520 centred |
| Button bar | stacked, full width | one right-aligned row inside the column |
| Toolbar | floating red pill | static, in the tools rail, still red |
| Scrollbar | none | browser only |

## The shell is shared

`shell.js` builds the whole harness — device, breakpoint, colour mode, language, step list, device
frame, browser chrome — from a few lines of configuration. A prototype should never rebuild it: it
was rebuilt three times before this file existed and had a different bug each time.

The contract between the shell and the screens is in the comment at the top of `shell.js`. One rule
matters more than the rest: **the shell never posts `screen` back in answer to a message from the
screens.** It used to, and that made every sheet close the moment it opened — the symptom being a
prototype that can only be clicked through when the screens file is opened on its own.

## What this is not

These are **prototype stand-ins, not the design system's components**. `.btn`, `.item`, `.card` and
the rest reproduce the look of the corresponding `CO` component closely enough to review a screen;
they do not reproduce the full contract. Before handoff, name the real component and variant from
[`../components/inventory.json`](../components/inventory.json) — a prototype that cannot be mapped
back to real variants is not implementable.

Nothing here invents a value. Every colour, size and shadow is a `var()` from `tokens.css`, itself
a hand-transcription of [`../tokens/`](../tokens/). If the two disagree, the JSON wins.

## Things people get wrong

Corrected in the CSS; worth knowing before you hand-write anything.

- **The header has no surface.** It sits on `background/body` like the rest of the screen. A white
  bar across the top is the most common mistake in a hand-built KB+ screen — and the button bar is
  the same: `background/body` with the panel shadow, not a white tray.
- **Main navigation is not a bottom tab bar,** and at `sm` its pill is 32 px tall with a 12/16
  caption label — nearer a `CO Tag` than a `CO Button`. It carries no icon; the icons belong to the
  side panel from lg.
- **A `Ground / Subpage` on a phone has no navigation.** The back affordance is all of it.
- **A left icon in a list row lives in a 32 × 24 box** even though the icon is 24 wide. That extra
  8 px is what keeps labels aligned down a list. A row's icon takes the row's colour, so the red
  icons on real screens are `interactive/primary` applied to the same black glyph.
- **The secondary button's outline is 1 px.** The 2 px width belongs to the focus ring.
- **A disabled primary button is white on grey** (`content/quaternary` fill,
  `interactive/on-primary` label), not grey on grey.
- **An inline message never colours its text**, and warning shares the grey info surface. Only the
  icon carries severity. There is no yellow message in Golem.
- **The snackbar and the tooltip are dark**, light text on `content/secondary`. They are the only
  two inverted surfaces in the system.
- **The spinner is a square red rounded outline** (`customKBshape`) turning at a constant speed —
  not a circular OS spinner, not a rectangle, and it does not pulse.

## Checks worth doing before you share a prototype

- Resize through 375, 768, 1024 and 1680 — the layout should switch, not stretch. Watch the
  content column, the button bar and the toolbar in particular.
- Switch platform to Android and to the browser: the way out of a dialog moves, and the browser
  grows a second header band and a scrollbar at lg.
- Switch the OS to dark: shadows disappear, surfaces carry the hierarchy, illustrations swap to
  their dark twins.
- Click the whole flow **inside the shell**, not just in the screens file. A sheet must survive a
  colour-mode switch.
- Tab through it: every interactive element shows a 2 px focus outline.
- Nothing shows `$label`, `$value` or a placeholder illustration, and no icon slot is still
  `⚠︎Placeholder`.
- Open it from a fresh clone with the network off. The fonts and every asset must still load —
  that is why they are in the repository.
