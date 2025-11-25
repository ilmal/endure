# Camera Data Generator

This directory contains tools to generate additional camera data for the ViltKameraNätverk mock dashboard.

## Quick Start

### Generate cameras with bash script (recommended):
```bash
# Generate 50 cameras (default) - prints to console
./generate-cameras.sh

# Generate 100 cameras - prints to console
./generate-cameras.sh 100

# Generate 50 cameras and AUTO-INJECT into data.js
./generate-cameras.sh 50 --inject

# Generate 100 cameras and AUTO-INJECT into data.js
./generate-cameras.sh 100 --inject
```

### Generate cameras with Node.js directly:
```bash
# Generate 50 cameras (default) - prints to console
node generate-cameras.js

# Generate 100 cameras - prints to console
node generate-cameras.js 100

# Generate and auto-inject into data.js
node generate-cameras.js 50 --inject
node generate-cameras.js 100 -i
```

## Output Modes

### Auto-Inject Mode (Recommended)
When using `--inject` or `-i` flag, the script will:
- **Automatically replace** all data in `assets/js/data.js`
- Show summary of generated cameras and detections
- No manual copy-paste needed!

```bash
./generate-cameras.sh 100 --inject
```

Example output:
```
Generating 100 cameras...

✅ Successfully injected 100 cameras into assets/js/data.js
   Total cameras: 100
   Total detections: 1450
```

### Console Output Mode
Without the `--inject` flag, the script prints the data to console for manual review:

```bash
./generate-cameras.sh 50
```

Example output:
```javascript
const newCameras = [
    {
        id: 13,
        location: { lat: 62.345, lng: 15.678 },
        name: "Kamera Forest Edge",
        detections: [...]
    },
    // ... more cameras
];
```

## Features

- ✅ **Auto-inject mode** - Automatically updates data.js with `--inject` flag
- 🇸🇪 **Sweden-focused coordinates** - Narrower bounds (lat: 57-68, lng: 12-22)
- 🦌 **Realistic wildlife data** - Swedish animals with proper MDI icons
- 🎲 **Random detections** - 10-20 detections per camera
- ⏰ **Recent timestamps** - Last 7 days from Nov 25, 2025
- 🎯 **High confidence** - Scores between 0.65 and 0.95
- 🏷️ **Thematic names** - "Kamera [Suffix]" format

## Animal Icons

The generator uses accurate Material Design Icons (MDI) mappings:
- Utter (otter) → `mdi:otter`
- Järv (wolverine) → `mdi:badger`
- Lodjur (lynx) → `mdi:cat`
- Mård (marten) → `mdi:ferret`
- Grävling (badger) → `mdi:badger`
- Trana (crane) → `mdi:bird`
- And many more!

## Requirements

- Node.js (any recent version)
- Bash shell (for the convenience script)
