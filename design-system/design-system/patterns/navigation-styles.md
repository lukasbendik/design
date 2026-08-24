---
id: kb-design-system-2026-0003
title: Navigation styles — the pattern that decides a screen's frame
type: pattern
domain: design-system
status: approved
confidence: high
evidence: strong
owner: "@robert.puschel"
lang: en
valid_from: 2026-08-12
review_by: 2027-08-12
sources:
  - "Figma component sets TMP SCR Layout / iOS App, IB Web Small, IB Web Medium, IB Web Large, IB Web Large wide, iPad App Medium portrait, iPad App Large landscape and the four TMP SCR Layout Login sets, file dbNZdTD169mAZ39fNGlNUg, variant matrices read 2026-08-12"
  - "Figma variant property 'variant (PA Navigation Styles)' on CO Header / v4.0 iOS, Android, IB Ground, IB Flow, IB Dialog and IB Sheet, file LF8w8yzyLqGKOJvZs1qApB, read 2026-08-12"
  - "Figma file '💠 CORE Patterns' overview node 18180:720808, pattern category list, read 2026-08-12"
related: [kb-design-system-2026-0004, kb-design-system-2026-0007, kb-design-system-2026-0010, kb-design-system-2026-0017]
last_correction: "2026-08-12 — Ground / Subpage turned out to drop main navigation on a phone, and the lg Narrow column was measured at 520. Re-approved by @robert.puschel the same day."
tags: [navigation, mobile, desktop, information-architecture]
generated_by: "claude-opus-5"
reviewed_by: "@robert.puschel"
---

# Navigation styles — the pattern that decides a screen's frame

**Summary:** Golem has one navigation-style property that runs through templates, headers and
button bars. Choosing it is the first decision of any screen, because it fixes the header
component, the back affordance, whether main navigation is present, and how the screen is
dismissed. Choose it before anything else.

## Why this is a pattern and not a component

A pattern in Golem is a rule for solving a UI case. It cannot be placed on a screen on its own —
it says how the screen must look and behave. `Navigation Styles` is the pattern with the widest
blast radius: `TMP SCR Layout` exposes it as the top-level variant of every screen template, and
`CO Header` exposes the same list as `variant (PA Navigation Styles)`. The two must always agree.

## The styles

| Style | Purpose | Main navigation | Dismiss |
|---|---|---|---|
| `Ground / Main page` | a top-level destination reached from main navigation | visible | switch destination |
| `Ground / Subpage` | a page below a destination, still inside the app frame | **from lg only** | back |
| `Flow / First or last step` | first or last step of a task that owns the screen | hidden | close |
| `Flow / Step` | a middle step of that task | hidden | back, plus close |
| `Dialog / First or last step` | a short task shown over the current context | hidden | close |
| `Dialog / Step` | a middle step of that short task | hidden | back, plus close |
| `Sheet` | a partial overlay from the bottom edge | hidden | swipe down or close |
| `Native` | a screen owned by the OS, not by us (Apple platforms only) | n/a | OS |
| `FlowModal / …`, `DialogModal / …` | the modal presentation of Flow and Dialog on Apple platforms | hidden | close |

**Flow vs Dialog.** Flow is the task the user came to do; it takes the whole screen and the app
frame goes away. Dialog is a short interruption of something else and stays visually on top of it.
If the user would be annoyed to lose their place, it is a Dialog.

**Narrow vs Wide** exists only on IB Web Large and Large wide: `Flow / Narrow / step`,
`Dialog / Wide / first or last step` and so on. Narrow is a single column of content; Wide is used
when the step genuinely needs the width, such as a table or a side-by-side comparison.

Narrow is **520 px, centred** — measured on `SCR NDB KB Sporeni Sjednejte si sporici ucet / IB-LG`
(node 31400:105074), where the whole content including the header sits at x = 252 of 1024. Every
inset inside it is the one it had at sm; only the column changes. The bottom button bar spans the
screen, but the row of buttons inside it spans that same 520 column and is right-aligned.

## Which styles exist on which breakpoint

| Style | iOS app | Android app | iPad MD/LG | IB SM | IB MD | IB LG | IB LG wide |
|---|---|---|---|---|---|---|---|
| Ground / Main page | yes | yes | yes | yes | yes | yes | yes |
| Ground / Subpage | yes | yes | yes | yes | yes | yes | yes |
| Flow / first-last, step | yes | yes | yes | yes | yes | Narrow + Wide | Narrow + Wide |
| FlowModal / first-last, step | yes | no | yes | no | no | no | no |
| Dialog / first-last, step | yes | yes | yes | yes | yes | Narrow + Wide | Narrow + Wide |
| DialogModal / first-last, step | yes | no | yes | no | no | no | no |
| Sheet | yes | yes | yes | yes | yes | yes | yes |
| Native | yes | no | yes | no | no | no | no |

Login screens are a separate template family with only two styles, `Login / Main page` and
`Login / Subpage`, on the four IB web widths.

Deprecated and not to be used: `⚠︎ Dialog / PDF document` (IB Web Small), `ground / ⚠︎entrance`
(all headers), `sheet / ⚠︎empty` (iOS header).

## Which header goes with which style

| Platform | Header component | Notes |
|---|---|---|
| iOS | `CO Header / v4.0 iOS` | one set, all 13 styles as variants; title `no / yes expanded / yes center / yes left` |
| Android | `CO Header / v4.0 Android` | 9 styles; has a `Show Bottom Zone` boolean |
| IB, ground | `CO Header / v4.0 IB Ground` | prefer the `New_main page` / `New_subpage` variants |
| IB, flow | `CO Header / v4.0 IB Flow` | `first or last step` / `step` |
| IB, dialog | `CO Header / v4.0 IB Dialog` | `first or last step` / `step` |
| IB, sheet | `CO Header / v4.0 IB Sheet` | title `Left / Center / No` |

Every IB header takes `s = sm-md-IB` or `lg-IB` (Dialog: `sm-IB` / `md-lg-IB`). The size property
follows the breakpoint, not the style.

## What the style implies elsewhere on the screen

- **Ground** keeps `CO Navigation / 3.0` on screen — but a `Ground / Subpage` on a phone does not:
  it has the header's back affordance and nothing else, and the navigation reappears as the side
  panel from lg. Measured on `SCR NDB KB Sporeni Detail uctu` at MB-SM against IB-LG; see
  [`breakpoints-and-platforms.md`](breakpoints-and-platforms.md). On phones
  (`size = sm-iPhone+sm-md-IB+responsive-Android`) it is a horizontally scrolling row of pills
  sitting **under the header, above the content** — not a bottom tab bar; that is how eight
  destinations fit on a 375 px screen. From tablet up (`md-lg-iPad+lg-IB`) it is a side panel.
- **Ground / Main page** is the only style that may carry the communication centre block and the
  floating `CO Toolbar / v3.0 Floating`.
- **Flow and Dialog** replace navigation with a bottom action area: `CO Button Bar Bottom / v4.0`
  when the actions are always visible, `CO Button Bar Dynamic / v4.0` when they attach to the end
  of scrolling content.
- **Sheet** has no button bar of its own; the content brings its own actions.
- **Native** is not ours — do not restyle it.

## Do / don't

- Do set the same style on the template and on the header. A `Flow` template with a `Ground`
  header is the most common inconsistency in existing files.
- Do use `Dialog` for a confirmation or a short correction; use `Flow` for a multi-step task.
- Don't nest a Flow inside a Flow. Use steps.
- Don't use `FlowModal` or `DialogModal` on Android or on the web — the variants do not exist.
- Don't hand-build a header. Every state that matters is already a variant.

## Sources

- The variant matrices of all eleven `TMP SCR Layout` component sets in `💠 CORE Templates`,
  read on 2026-08-12; the per-breakpoint availability table above is a direct transcription.
- The `variant (PA Navigation Styles)` property of the six `CO Header` sets in
  `💠 CORE Components`.
- The `💠 CORE Patterns` overview frame, which lists Navigation Styles as one of the ten pattern
  categories.

## Open questions

- The CORE Patterns file documents each pattern on its own Figma page, and those pages hold no
  published components, so they could not be read through the connector. The rules above are
  reconstructed from the template and header variant matrices. The prose rationale on the
  `PA Navigation Styles` page has not been read.
- Android has no modal variants in Figma. Is that a deliberate platform decision or a gap?
