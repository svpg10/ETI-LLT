# ETI-LLT

Retro-science interactive laboratory for the five LLT1 case-study questions in **21ECC205T Electromagnetic Theory and Interference**.

Author: **Srikakulam Venkat Pranav Gupta** · RA2511004011037 · SRM IST ECE.

## What is inside

- Landing page and navigation for Questions 1–5
- Animated browser-based electromagnetic models with sliders and numerical plots
- VS Code-inspired Python reference panels, with copy and `.py` download
- Responsive interface using React, TypeScript and Vite

The live visuals calculate the electromagnetic models in JavaScript. Each Python snippet is a standalone program intended for local Python 3 with NumPy and Matplotlib; the website does not execute arbitrary Python in visitors' browsers.

## Run locally

Install Node.js 22 or newer, then run in this repository directory:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). VS Code is optional.

## Deploy

For Vercel or Netlify, import this GitHub repository, use **Vite** with build command `npm run build`, and publish the `dist` directory. The app uses hash-based question routes (`#/lab/1` through `#/lab/5`), so no custom server rewrite is required. For GitHub Pages, enable deployment from a built `dist` artifact; Vite's relative asset base supports repository subpaths.

## Physics models

1. Gauss's law: external electric field of an 8 µC sphere
2. Biot–Savart law: central magnetic field of a 20-turn coil
3. Displacement current: Ampère–Maxwell law in a charging capacitor
4. Lossless transmission line: reflection coefficient and VSWR
5. Smith chart: normalized impedance and a two-stage matching network

All visualizations are idealized analytical/numerical models, not laboratory measurements.
