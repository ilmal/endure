# ViltKameraNätverk - Mock Dashboard

This is a mock frontend website for the "Nationellt nätverk av jaktkameror" project, demonstrating a wildlife camera network dashboard for Sweden powered by an interactive MapLibre map, iconography-only detections and dense mock telemetry.

## Features

- Interactive MapLibre GL map clipped to Sweden with Bootstrap-icon camera pins and clustered detection dots
- Detailed sidebar with Iconify-powered animal glyphs, AI confidence and validation states
- Local modal workflow for confirming/denying detections (no real photos stored) persisted via `localStorage`
- Hero metrics and statistics view (including validation progress and top animals)
- Enhanced search with instant filtering and suggestions
- Responsive design tuned for desktop/tablet/mobile

## Technologies

- HTML5, CSS3 (glassmorphism-inspired theme) and vanilla JavaScript (ES6+)
- MapLibre GL JS + GeoJSON overlays for the interactive Sweden map (both hero and stats views)
- Font Awesome 6 + Bootstrap Icons for UI chrome and camera pins
- Iconify (Material Design Icons set) for animal glyphs instead of real images
- Google Fonts (Roboto + Georgia)
- Browser `localStorage` for persisting confirmations

## Setup

1. Clone the repository
2. Open `index.html` in a web browser
3. For GitHub Pages, enable Pages in repository settings and set source to main branch (no build step required)

## Project Structure

```
viltkameranatverk-mock/
├── index.html
├── stats.html
├── assets/
│   ├── css/styles.css
│   ├── js/
│   │   ├── main.js
│   │   └── data.js
│   └── images/
│       └── sweden-mask.svg
└── README.md
```

## Usage

- Navigate between kartan och statistiken via den klibbiga navigationen
- Hovera eller klicka kameror på MapLibre-kartan (pins + heat dots) för att se detaljer i sidopanelen
- Use the search bar to filter cameras; suggestions highlight matching locations
- Open a detection to view the icon-based observation metadata and confirm/deny AI-förslaget
- Refresh the page to verify that confirmations persist locally

This is a static mock prototype with helt fiktiv ikondata (inga riktiga foton) avsett för design- och konceptdiskussioner.