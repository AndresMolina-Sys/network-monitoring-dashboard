---
name: Network Monitoring Dashboard
description: A warm, evidence-led workspace for reviewing clearly simulated network health.
colors:
  background: '#17191c'
  surface: '#222426'
  surface-solid: '#24272a'
  surface-raised: '#292b2d'
  foreground: '#eee9df'
  muted-foreground: '#d0cbc2'
  subtle-foreground: '#bcb7af'
  border: 'rgba(188, 183, 175, 0.28)'
  border-soft: 'rgba(188, 183, 175, 0.16)'
  copper: '#c8a57d'
  control-border: '#7a7874'
  range-selected-border: '#947457'
  action-border: 'rgba(232, 176, 126, 0.65)'
  focus: '#e8b07e'
  online: '#8bc5b5'
  degraded: '#e3b85b'
  offline: '#e38f83'
typography:
  display:
    fontFamily: "Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: 'clamp(1.35rem, 2vw, 1.65rem)'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: '-0.025em'
  body:
    fontFamily: "Inter, 'Segoe UI', system-ui, sans-serif"
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'IBM Plex Mono, Cascadia Code, Consolas, ui-monospace, monospace'
    fontSize: '12px'
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: '0.08em'
rounded:
  sm: '6px'
  md: '8px'
  pill: '999px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '12px'
  lg: '16px'
  xl: '24px'
components:
  filter-field:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.sm}'
    padding: '10px 13px'
    height: '44px'
  recovery-button:
    backgroundColor: 'rgba(200, 165, 125, 0.12)'
    textColor: '{colors.foreground}'
    rounded: '{rounded.sm}'
    padding: '11px 16px'
    height: '44px'
  chart-panel:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.md}'
    padding: '24px'
---

# Design System: Network Monitoring Dashboard

## Overview

**Creative North Star: "Applied Research Journal"**

The dashboard treats network health as an evidence review: warm charcoal surfaces, paper-toned type, and restrained copper annotations organize fixture data without dressing it up as live telemetry. Sea-glass, amber, and coral are reserved for the three meaningful node states. The detail view follows “Evidence Margin”: node context stays compact, latency leads, and packet loss is paired with a concise maximum-value annotation.

The interface favors readable operational density over a marketing-style hero. Clear hierarchy, quiet rules, and precise labels keep the inventory and metric evidence scannable on desktop and mobile. Motion is limited to short state transitions; reduced-motion preferences are honored.

**Key Characteristics:**

- Warm charcoal, paper-toned text, and restrained copper accents.
- Status colors communicate node health; chart accents identify measured series.
- Simulated fixture data is identified in the interface.
- Compact inventory rows and an evidence-led detail composition.

## Colors

The palette combines a warm near-black foundation with paper-like neutrals and a single copper family; status hues remain semantic.

### Primary

- **Journal Copper** (`copper`): the main annotation color for section labels, selected metric periods, and evidence accents.
- **Soft Copper Light** (`focus`): keyboard focus, chart series, and active chart points; it remains distinct from status color.

### Secondary

- **Sea-glass** (`online`): reserved for online status.

### Tertiary

- **Signal Amber** (`degraded`): reserved for degraded status.
- **Muted Coral** (`offline`): reserved for offline and danger states.

### Neutral

- **Warm Charcoal** (`background`): the page canvas.
- **Graphite Surface** (`surface`): filter, chart, and table surfaces.
- **Solid Graphite** (`surface-solid`): opaque chart tooltip surface.
- **Raised Graphite** (`surface-raised`): elevated surface where explicitly used.
- **Paper** (`foreground`): primary text.
- **Warm Secondary** (`muted-foreground`): body copy and supporting descriptions.
- **Stone Label** (`subtle-foreground`): metadata, axes, and secondary labels.
- **Quiet Rule** (`border-soft`) and **Tooltip Edge** (`border`): secondary separators and tooltip framing; neither denotes an essential control boundary.
- **Control Stone** (`control-border`): search/filter field boundaries.
- **Selected Copper Edge** (`range-selected-border`): selected time-range boundary.
- **Recovery Copper Edge** (`action-border`): retry and recovery button boundary.

### Measured contrast (WCAG 2.2 AA)

Ratios below are calculated from source CSS colors using WCAG relative luminance. Alpha layers were composited in sRGB over the lightest applicable underlying surface; channel values were rounded to 8-bit sRGB before calculating the ratio. Text requires 4.5:1 (normal) or 3:1 (large); control boundaries, focus indicators, and essential chart marks require 3:1. Each row reports the most demanding checked pairing for that element.

| Element                                          | Foreground / boundary (sRGB)            | Adjacent background (sRGB)                      |   Ratio |            Minimum | Result                                                                                  |
| ------------------------------------------------ | --------------------------------------- | ----------------------------------------------- | ------: | -----------------: | --------------------------------------------------------------------------------------- |
| Primary text                                     | `#eee9df`                               | `#17191c`                                       | 14.56:1 |              4.5:1 | Pass                                                                                    |
| Primary text on surface                          | `#eee9df`                               | `#222426`                                       | 12.87:1 |              4.5:1 | Pass                                                                                    |
| Supporting text                                  | `#d0cbc2`                               | `#222426`                                       |  9.64:1 |              4.5:1 | Pass                                                                                    |
| Metadata and chart-axis labels                   | `#bcb7af`                               | `#222426`                                       |  7.81:1 |              4.5:1 | Pass                                                                                    |
| Search placeholder (effective 80% opacity color) | `#9b9792`                               | `#17191c`                                       |  6.07:1 |              4.5:1 | Pass                                                                                    |
| Copper labels                                    | `#c8a57d`                               | `#222426`                                       |  6.77:1 |              4.5:1 | Pass                                                                                    |
| Simulated-data label                             | `#c8a57d`                               | `#232323` (chip fill composited over page)      |  6.84:1 |              4.5:1 | Pass                                                                                    |
| Online status                                    | `#8bc5b5`                               | `#21282a` (status tint composited over page)    |  7.67:1 |              4.5:1 | Pass                                                                                    |
| Degraded status                                  | `#e3b85b`                               | `#292722` (status tint composited over page)    |  8.01:1 |              4.5:1 | Pass                                                                                    |
| Offline status                                   | `#e38f83`                               | `#292425` (status tint composited over page)    |  6.21:1 |              4.5:1 | Pass                                                                                    |
| Search/filter boundary                           | `#7a7874`                               | `#2b2b2b` (maximum filter-panel tint)           |  3.21:1 |                3:1 | Pass                                                                                    |
| Search/filter boundary, inner edge               | `#7a7874`                               | `#17191c` (field fill)                          |  4.00:1 |                3:1 | Pass                                                                                    |
| Selected-period boundary                         | `#947457`                               | `#2c2a28` (selected fill composited over page)  |  3.33:1 |                3:1 | Pass                                                                                    |
| Selected-period boundary, outer edge             | `#947457`                               | `#17191c`                                       |  4.11:1 |                3:1 | Pass                                                                                    |
| Retry/recovery boundary                          | `#a78261` (65% copper-focus over panel) | `#403b36` (button fill over maximum panel tint) |  3.17:1 |                3:1 | Pass                                                                                    |
| Retry/recovery boundary, outer edge              | `#a78261`                               | `#2e2d2c` (maximum state-panel tint)            |  3.93:1 |                3:1 | Pass                                                                                    |
| Focus ring                                       | `#e8b07e`                               | `#2b2b2b` (maximum filter-panel tint)           |  7.38:1 |                3:1 | Pass                                                                                    |
| Chart axes                                       | `#bcb7af`                               | `#222426`                                       |  7.81:1 |              4.5:1 | Pass                                                                                    |
| Chart line and points                            | `#e8b07e`                               | `#222426`                                       |  8.12:1 |                3:1 | Pass                                                                                    |
| Decorative chart grid                            | `#383939` (14% neutral over surface)    | `#222426`                                       |  1.34:1 | Exempt: decorative | Not an essential mark; exact values remain available in the accessible chart and table. |

The control-boundary corrections are deliberately limited to filters, the selected period, and retry/recovery actions. Other subtle rules divide content but do not communicate an interactive boundary. The browser could not connect to the local Vite page during this task, so the ratios above are source-token and compositing measurements, not browser-computed style samples.

**The Fixture Truth Rule.** Never style simulated measurements or their labels in a way that implies live monitoring.

The measured focus color also clears 3:1 in the other keyboard contexts: on the maximum
state-panel tint (`#2e2d2c`) it measures 7.16:1, on the focused field fill (`#24272a`) 8.12:1,
and on the period selector's page background (`#17191c`) 9.18:1. The existing focus-ring row
records the same color against the maximum filter-panel tint.

## Typography

**Display Font:** Inter, with Segoe UI and system sans-serif fallbacks.
**Body Font:** Inter, with Segoe UI and system sans-serif fallbacks.
**Label/Mono Font:** IBM Plex Mono, with Cascadia Code, Consolas, and system monospace fallbacks.

**Character:** The sans-serif carries clear operational reading; the mono face distinguishes identifiers, timestamps, ranges, and measured values. The CSS declares these stacks but does not bundle font files.

### Hierarchy

- **Display** (600, fluid 21.6–26.4px, 1.2 line-height): compact page title and dashboard identity.
- **Headline** (600, fluid 24–36px, 1.1 line-height): inventory and metric section headings.
- **Title** (560–600, 19–30px, 1.25 line-height): node names and panel titles.
- **Body** (400, 16px, 1.5 line-height): descriptions and supporting content; long descriptions are constrained to approximately 54–58ch.
- **Label** (600, 11–13px, 1.45 line-height, tracked): compact section labels and chart metadata.

**The Measurement Mono Rule.** Reserve monospace for identifiers, addresses, timestamps, ranges, chart metadata, and tabular measurements; use the body face for prose.

## Layout

The application uses a centered content column capped at 1180px, with fluid outer gutters and generous vertical section spacing. Inventory is a three-column node list on wide screens, two columns below 960px, and one column below 640px. Node details keep compact metadata above the metric evidence; at widths below 860px, the paired chart area stacks into one column. Filters and metric-range controls also stack on narrow screens, while the measurements table remains horizontally scrollable rather than clipping values. Spacing is rem-based, with recurring 4px/8px steps and larger 16px, 24px, and 32px group gaps.

**The Evidence Order Rule.** Keep node identity and status before metrics, latency as the leading chart, packet loss and its maximum annotation adjacent, and the exact sample table after the visual evidence.

## Elevation & Depth

Depth comes primarily from tonal surfaces, restrained borders, and a soft panel shadow. Inset highlights are subtle and do not replace keyboard focus. The chart tooltip is the principal use of the shared soft shadow; the application does not rely on floating card stacks.

### Shadow Vocabulary

- **Panel tooltip** (`0 1rem 2rem rgba(0, 0, 0, 0.12)`): use for the chart tooltip, not as a default on every container.

## Shapes

Small controls use gently rounded 6px corners; panels and chart surfaces use 8px corners. Status and simulated-data labels use pill silhouettes. Content rows rely on fine separators rather than enclosing every node in a rounded card. Focus rings remain distinct and are not clipped by decorative borders.

## Components

### Buttons

- **Shape:** compact rounded corners (6px).
- **Recovery:** muted copper fill, paper text, and a copper boundary that remains at least 3:1 against both adjacent surfaces.
- **Hover / Focus:** hover strengthens the accent and shifts upward by 1px; keyboard focus uses a separate, visible focus ring. Motion resolves in 150ms and is reduced when the platform requests reduced motion.
- **Range selection:** the active period has a copper text accent, a measured boundary, and an explicit pressed state.

### Chips

- **Status:** compact mono labels with a semantic sea-glass, amber, or coral dot/color; the text remains readable without relying on the hue alone.
- **Simulated data:** copper-tinted pill with an explicit “Simulated data” label; it is not a live synchronization indicator.

### Cards / Containers

- **Inventory:** open row layout with a 2px semantic status rail, compact identity and metadata, and a quiet bottom divider.
- **Charts and table:** graphite surfaces with 8px corners and restrained copper top accents; the table preserves exact values as the textual alternative to plots.
- **Node state:** loading, error, empty, and not-found states use the same surface family and keep their recovery action visible.

### Inputs / Fields

- **Style:** dark fill, warm-stone boundary, 6px corners, and compact sans-serif input text.
- **Focus:** copper border shift and a visible 3px focus treatment; the field boundary is measured against the panel tint and its inner fill.
- **Error / Disabled:** use existing state semantics and preserve the current selected filter/range; do not imply data where none is available.

### Navigation

- **Breadcrumb:** compact mono text above node details; the dashboard link uses copper emphasis and a visible keyboard focus ring.
- **Inventory navigation:** each node row is a full-link target with a clear focus outline and a restrained hover surface.

### Evidence Margin

The detail view keeps node metadata compact, gives latency the larger visual column on wide screens, and places packet loss with its maximum-value annotation in the adjacent column. At tablet and mobile widths these columns stack without removing the table or simulated-data label.

## Do's and Don'ts

### Do:

- **Do** preserve the Applied Research Journal palette and the Evidence Margin reading order.
- **Do** identify all fixture measurements as simulated and keep the exact sample table available.
- **Do** use the status hues only for their matching node states and retain readable text labels.
- **Do** keep focus outlines visible and preserve the 3:1 measured boundaries for filters, selected periods, and recovery actions.
- **Do** honor reduced-motion preferences and the responsive breakpoints documented above.

### Don't:

- **Don't** claim live telemetry, persistence, uptime, alerting, or synchronization that the product does not provide.
- **Don't** use copper as a node-health status or use status colors as general decoration.
- **Don't** remove the table when changing chart presentation; it is the exact textual measurement alternative.
- **Don't** treat decorative chart grid lines or soft separators as essential data marks or control boundaries.
