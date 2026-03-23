# Tottem - Web Brand Guide (extracted from client files)

## 1) Core identity
- **Primary logo:** diagonal geometric symbol + `TOTTEM` wordmark.
- **Approved color applications shown in the guide:** black on light background and white on dark background.
- **Collateral brand variants:** the guide shows alternate symbol constructions. These should be treated as secondary graphics, not as the default header logo.

## 2) Color
- **Primary brand color:** `#363534`
- **RGB:** `54, 53, 52`
- **CMYK:** `51, 44, 36, 84`
- **Reference:** Pantone Black 7 C

### Suggested website usage
- Main text / logo on light background: `#363534`
- Dark section background: `#363534`
- Light background: `#F7F7F5` or pure white depending on the layout
- Border / hairline suggestion: `rgba(54,53,52,0.16)`

## 3) Typography
Official fonts listed in the guide:
- **Primary:** Gill Sans Bold
- **Secondary:** DIN Alternate Bold

### Practical web note
These are not reliably available as web-safe fonts. For production, use one of these approaches:
1. Upload licensed webfont files (`.woff2`) if the client owns them.
2. Use close fallbacks until licensing is confirmed.

### Recommended fallback stacks
```css
--font-brand-primary: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
--font-brand-secondary: "DIN Alternate", "Arial Narrow", Arial, sans-serif;
```

## 4) Proportions visible in the guide
The proportional page shows:
- Symbol block width: **13X**
- Wordmark width block: **6.5X**
- Vertical subdivisions on the right: **2.8X**, **1X**, **3.8X**

Use these as a visual reference rather than as coded ratios unless the client asks for exact reconstruction.

## 5) Web asset recommendation
Use these files in the website:
- `tottem_logo_horizontal_black.svg` -> default header/footer on light backgrounds
- `tottem_logo_horizontal_white.svg` -> dark hero / dark footer
- `tottem_icon_black.svg` -> favicon/app icon/social avatar on light backgrounds
- `tottem_icon_white.svg` -> icon on dark surfaces

Prefer **SVG** for the site and keep **PNG** as fallback only.

## 6) Implementation snippet
```html
<img src="/assets/brand/tottem_logo_horizontal_black.svg" alt="Tottem" width="220">
```

```css
:root {
  --tottem-ink: #363534;
  --tottem-paper: #ffffff;
  --tottem-soft: #f7f7f5;
  --font-brand-primary: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  --font-brand-secondary: "DIN Alternate", "Arial Narrow", Arial, sans-serif;
}
```

## 7) Caution
The client files do **not** appear to include:
- explicit minimum-size rules
- explicit clear-space rules
- downloadable master exports already prepared for web
- a broader palette beyond the primary dark neutral

So this package is a **clean web extraction**, not a substitute for a full master brand system.
