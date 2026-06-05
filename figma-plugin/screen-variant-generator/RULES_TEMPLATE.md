# Rules Template for Screen Variant Generator

Pouzij tento template jako jednotny predpis pro mapovani mezi platformami.

## 1) Platforms

- Source platform: iOS
- Target platforms:
  - IB
  - Android

## 2) Variants

| id | label | width |
| --- | --- | --- |
| ib-mobile | IB Mobile | 390 |
| ib-desktop | IB Desktop | 1440 |
| android-mobile | Android Mobile | 412 |

## 3) Component Mapping

Pouzij presne nazvy hlavni komponenty ve Figme.

| source component | target component |
| --- | --- |
| iOS/Button/Primary | IB/Button/Primary |
| iOS/Input/Text | IB/Input/Text |
| iOS/Segmented Control | IB/Segmented Control |

## 4) Layout Rules

- Preserve vertical spacing from source screen.
- Resize root Frame to target width.
- Keep top-level auto-layout direction unchanged.
- If text overflows, allow line wrap before reducing font size.

## 5) Fallback Rules

- If target component does not exist, keep original instance.
- If swap fails due to incompatible properties, keep original instance and log warning.

## 6) Naming

- New screen format: <Source Name> [<Variant Label>]
- Example: Payment Form [IB Desktop]
