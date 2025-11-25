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
- 🌍 **OpenCage API verification** - All coordinates verified to be in Sweden
- 🎲 **High randomness** - Truly random coordinates across all of Sweden (55-69.5°N, 10.5-24.5°E)
- � **Smart retry logic** - Automatically retries if coordinates fall outside Sweden (up to 10 attempts)
- 🚀 **Async batch processing** - Generates 10 cameras at a time with parallel execution
- 🇸� **100% Swedish locations** - Every coordinate verified via reverse geocoding
- 🦌 **Realistic wildlife data** - Swedish animals with proper MDI icons
- 🎲 **Random detections** - 10-20 detections per camera
- ⏰ **Recent timestamps** - Last 7 days from Nov 25, 2025
- 💪 **High confidence** - Scores between 0.65 and 0.95
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

## OpenCage API Verification

The generator uses **OpenCage Geocoding API** to verify that all generated coordinates are actually within Sweden's borders. This ensures 100% accuracy while maintaining good randomness.

### How It Works

1. **Random Generation**: Generates coordinates within expanded bounds (55-69.5°N, 10.5-24.5°E)
2. **API Verification**: Calls OpenCage API to check if coordinates are in Sweden
3. **Smart Retry**: If not in Sweden, generates new coordinates and retries (up to 10 attempts)
4. **Fallback**: Uses Stockholm area coordinates if all attempts fail (very rare)

### API Details

- **Service**: OpenCage Geocoding API
- **Endpoint**: `https://api.opencagedata.com/geocode/v1/json`
- **Verification**: Checks `country_code` is "SE" (Sweden)
- **Rate Limits**: Free tier allows 2,500 requests/day
- **Batch Size**: Processes 10 cameras simultaneously

### Performance

- **5 cameras**: ~0.5-1 seconds ⚡
- **30 cameras**: ~3-4 seconds 🚀
- **50 cameras**: ~5-7 seconds �
- **100 cameras**: ~10-15 seconds �

Performance depends on:
- Number of retries needed (some coordinates fall outside Sweden)
- API response time
- Network latency

## Requirements

- Node.js (any recent version)
- Bash shell (for the convenience script)
- Internet connection (for OpenCage API verification)
- OpenCage API key (included in script - free tier: 2,500 requests/day)

## Example Output

```bash
$ ./generate-cameras.sh 30 --inject

🎬 Generating 30 cameras with Sweden verification...

🔍 Generating cameras with OpenCage API verification...
🌍 Verifying all coordinates are in Sweden...

✓ Camera 1/30 generated at 58.458,19.047
✓ Camera 2/30 generated at 56.469,13.925
   🔄 Retry 1/10: 68.608,19.712 not in Sweden, trying again...
✓ Camera 3/30 generated at 66.769,16.386
...

✅ Generated 30 cameras in 3.58 seconds!
📍 All coordinates verified to be in Sweden via OpenCage API

✅ Successfully injected 30 cameras into assets/js/data.js
   Total cameras: 30
   Total detections: 435
   📍 All coordinates verified to be in Sweden
```

The retry messages show the generator working to find valid Swedish coordinates!
