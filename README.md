# Tottem Arquitectura — Portfolio Website
**Client:** Andrés (Tottem Arquitectura, Medellín)
**Status:** Prototype v1 — ready to show client
**Preview:** `http://100.103.242.31:8765` (run `python3 -m http.server 8765` from this folder)

---

## What this is
A jaw-dropping portfolio site built to replace `tottem.com.co`.
Dark editorial aesthetic. Full-bleed project panels. Built to showcase
Andrés's beautiful photography — not a template.

**Stack:** Pure HTML5 + CSS3 + Vanilla JS. Zero dependencies. Deploys to
GitHub Pages or Netlify with no build step.

---

## File structure
```
andres-site/
├── index.html          # Single page app
├── css/style.css       # All styles
├── js/main.js          # Nav, parallax, lightbox, cursor, scroll reveal
├── images/             # 40 photos scraped from Behance
│   └── behance_*.jpg
├── DESIGN_BRIEF.md     # Original VP of Design brief (full spec)
└── README.md           # This file
```

---

## Design decisions (VP of Design rationale)
- **Hero:** Infinity pool shot (`behance_161726219_01.jpg`) — best image in the set
- **Background:** `#0D0D0D` near-black — photos ARE the color
- **Typography:** Cormorant Garamond (headings) + Inter (body)
- **Projects:** 5 full-bleed 90vh panels, not a grid — each photo earns its moment
- **Parallax:** Project images shift at 28% scroll speed — depth without gimmick
- **Lightbox:** Per-project galleries, cross-fade transitions, hover preload
- **Custom cursor:** Floating ring with lag effect (desktop only)
- **Desktop-first:** Primary experience is 1280px+. Mobile is graceful fallback.

---

## Projects & photo mapping
| # | Name | Cover image | Photos in lightbox |
|---|------|-------------|-------------------|
| 01 | Casa Colinas | behance_161726219_01 | 6 (curated mix) |
| 02 | Casa Laureles | behance_157821753_01 | 8 (full project) |
| 03 | Casa del Bosque | behance_161710953_01 | 10 (full project) |
| 04 | Villa Nogal | behance_161730713_01 | 13 (full project) |
| 05 | Obras & Pabellones | behance_157808365_01 | 5 (curated mix) |

**Note:** Project names are placeholder — the client should confirm real names.
Photos for Casa Colinas and Obras & Pabellones are curated from single-photo
Behance projects. All other projects use their full real photo sets.

---

## What's working
- ✅ Hero with parallax
- ✅ Manifesto section with scroll reveal
- ✅ 5 full-bleed project panels
- ✅ Per-project lightbox with cross-fade transitions
- ✅ Hover preload (eliminates lag on first open)
- ✅ Custom cursor (desktop)
- ✅ Nav hide/show on scroll
- ✅ Mobile responsive (65vh panels, no cursor)
- ✅ About + Contact + Footer sections

## Last session changes (2026-03-04)
1. Rebuilt projects section from broken row-grid → full-bleed editorial panels
2. Added parallax on project images
3. Rewrote lightbox for per-project galleries
4. Added cross-fade transitions with micro-scale (480ms cubic-bezier)
5. Added hover preload to eliminate lag
6. Reduced from 9 to 5 projects, redistributed photos
7. Improved close button UX (ESC hint, rotate on hover)

---

## Next session — recommended tasks
1. Verify final Codex run applied all changes (lightbox cross-fade, 5 projects)
2. Compress images: `mogrify -resize 1920x -quality 82 images/*.jpg`
   (cuts file sizes ~60% with no visible quality loss)
3. Confirm project names with Andrés or use generic "Casa I / Casa II" for pitch
4. Deploy to GitHub Pages (free, zero config for static sites)
5. Add Andrés's real Instagram URL to footer
6. Optional: add a subtle loading screen for first visit

---

## How to start a new dev session
1. Read this README
2. Run the preview server: `cd andres-site && python3 -m http.server 8765`
3. Open `http://100.103.242.31:8765` in browser
4. Review current state, identify what to fix
5. Write Codex prompts — Sam (VP Design) reviews and signs off

**Rule:** Sam writes design briefs and Codex prompts. Codex writes code.
Sam does NOT write code directly (token cost).
