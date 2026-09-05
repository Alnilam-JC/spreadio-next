# Spreadio — style lock

Surface classification: **transactional form** (single-purpose FX-spread calculator), not a marketing narrative page. No macrostructure/narrative-arc diversification applies — there is one screen: hero blurb + calculator card + result card + footer, and the user wants that structure kept, not replaced.

This is a **refinement pass on an existing, user-approved palette**, not a cold start. The dark navy direction (Revolut Business-inspired) was already iterated on and accepted across prior sessions; tokens below are recorded (not regenerated) and validated for contrast.

## Color contract

Tokens: `bg #05070f` · `surface #10142a` · `text #f4f5f7` · `primary #2f56d9` · `accent #7b95f2` · `border ~#1c2032` (rgba(255,255,255,.1) over bg) · `on-primary #ffffff`

Contrast matrix run via `check_contrast.py --matrix` (2026-09-05):

- **Text-safe (>=4.5):** bg/on-primary, text/bg, surface/on-primary, text/surface, border/on-primary, text/border, bg/accent, surface/accent, primary/on-primary, accent/border, text/primary
- **UI-safe (>=3.0):** bg/primary
- **Decorative only (<3.0):** surface/primary, accent/on-primary, primary/border, text/accent, primary/accent, bg/border, surface/border, bg/surface, text/on-primary

Rule going forward: accent (`#7b95f2`) as text only against `bg` or `surface` directly (7.11 / 6.42) — never as a text color on `primary` fills.

## Type

- **UI/body/numerals:** Geist (already locked from prior pass) — tabular numerics, clean at small sizes.
- **Display headline (new):** Hanken Grotesk 800 — added specifically because Geist's default width made "Know your real exchange rate." wrap awkwardly on both desktop and mobile at the sizes tested. Hanken Grotesk is measurably narrower per-character at the same weight/size, and reads as distinctly "display" against Geist's UI role, which is a legitimate two-family pairing rather than a random swap.

## Density & spacing

Unchanged from prior pass: card padding 30px desktop / 22px mobile, `--radius-lg: 24px`, `--radius-md: 14px`.

## Assets

No photography/illustration cast — not applicable to a compact calculator tool with no marketing sections. Icons: real flag PNGs via flagcdn (already in place, kept as-is per explicit prior user feedback preferring real flags). No new icon set needed.

## Motion track

Classified as **transactional form**, closer to the App-shell motion track than a scroll-narrative marketing page (nothing to scroll-tell here). Applied: GSAP entrance choreography (staggered header -> headline -> card), interaction polish (button/select states), and one signature ambient motion (a slow light sheen crossing the card's 3D border) — not a scroll-scrubbed story, which has nothing to attach to on a single-viewport tool.

## Honesty note

No photo/illustration sourcing steps ran (Openverse/unDraw/Iconify) — this screen has no sections that call for them. Full macrostructure/narrative-arc diversification was skipped for the same reason (single transactional screen, not a multi-section marketing page). Scope was adapted from tastemaker's marketing-page defaults to fit an existing small utility app; see reasoning above.
