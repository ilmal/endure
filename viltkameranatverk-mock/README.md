# ViltKameraNätverk - Mock Dashboard

This is a mock frontend website for the "Nationellt nätverk av jaktkameror" project, demonstrating a wildlife camera network dashboard for Sweden with a bespoke Sweden-outline map and curated wildlife imagery.

## Features

- Custom SVG-outline map of Sweden with animated camera markers
- Detailed sidebar with thumbnails, AI confidence and validation states
- Local photo modal with confirm/deny workflow persisted via `localStorage`
- Hero metrics and statistics view (including validation progress and top animals)
- Enhanced search with instant filtering and suggestions
- Responsive design tuned for desktop/tablet/mobile

## Technologies

- HTML5, CSS3 (glassmorphism-inspired theme) and vanilla JavaScript (ES6+)
- Inline SVG rendering for the Sweden outline map and markers
- Font Awesome 6 for iconography
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
├── about.html
├── stats.html
├── help.html
├── assets/
│   ├── css/styles.css
│   ├── js/
│   │   ├── main.js
│   │   └── data.js
│   └── images/
└── README.md
```

## Usage

- Navigate between map, about, stats and help views via the sticky header
- Hover or click cameras on the Sweden-outline map to inspect detections in the sidebar
- Use the search bar to filter cameras; suggestions highlight matching locations
- Open a detection to view the high-resolution photo and confirm/deny the AI guess
- Refresh the page to verify that confirmations persist locally

This is a static mock prototype with fake data (Unsplash imagery) intended for design discussions and demos.