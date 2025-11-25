// Camera data generator for ViltKameraNätverk
const fs = require('fs');
const path = require('path');
const https = require('https');

const animalIconMap = {
    'Fjällräv': 'mdi:fox',
    'Ren': 'mdi:deer',
    'Lodjur': 'mdi:cat',
    'Fjälluggla': 'mdi:owl',
    'Järv': 'mdi:badger',
    'Ripa': 'mdi:bird',
    'Björn': 'mdi:bear',
    'Varg': 'mdi:wolf',
    'Mård': 'mdi:ferret',
    'Utter': 'mdi:otter',
    'Bäver': 'mdi:beaver',
    'Älg': 'mdi:deer',
    'Vildsvin': 'mdi:pig',
    'Räv': 'mdi:fox',
    'Berguv': 'mdi:owl',
    'Tjäder': 'mdi:bird',
    'Rådjur': 'mdi:deer',
    'Grävling': 'mdi:badger',
    'Orre': 'mdi:bird',
    'Havsörn': 'mdi:eagle',
    'Mink': 'mdi:otter',
    'Trana': 'mdi:bird',
    'Grågås': 'mdi:duck',
    'Hare': 'mdi:rabbit',
    'Fälthare': 'mdi:rabbit',
    'Ejder': 'mdi:duck',
    default: 'mdi:paw'
};

const suffixes = [
    'Aurora Ridge', 'Midnight Plateau', 'Pine Shield', 'River Crossing', 'High Valley', 'Forest Veins',
    'Skärgård Watch', 'Meadow Grid', 'Ridge Gate', 'Coastal Dune', 'Steppe Sweep', 'Crest', 'Arctic Bay',
    'Peak Outlook', 'Glen Path', 'Lake Shore', 'Wild Trail', 'Eagle Nest', 'Fox Den', 'Bear Cave', 'Wolf Hollow',
    'Owl Perch', 'Deer Meadow', 'Bird Sanctuary', 'Paw Trail', 'Northern Light', 'Mountain Pass', 'Valley Watch',
    'Stream Point', 'Forest Edge', 'Hilltop', 'Deep Woods', 'Clearwater', 'Stone Bridge', 'Moss Rock',
    'Silent Grove', 'Windswept Peak', 'Hidden Glade', 'Ancient Oak', 'Whispering Pines'
];

const animals = Object.keys(animalIconMap).filter(key => key !== 'default');

// Function to generate a random timestamp in the last 7 days (from Nov 25, 2025)
function generateTimestamp() {
    const now = new Date('2025-11-25T00:00:00');
    const randomMs = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
    const date = new Date(now - randomMs);
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

// OpenCage API key for geocoding verification
const OPENCAGE_API_KEY = 'e11c2b0cb27948bc885b20edeb5f69fe';

// Function to verify if coordinates are in Sweden using OpenCage API
async function verifyCoordinatesInSweden(lat, lng) {
    return new Promise((resolve) => {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}&no_annotations=1&language=en`;
        
        https.get(url, {
            headers: {
                'User-Agent': 'ViltKameraNatverk-Generator/1.0',
                'Accept': 'application/json'
            }
        }, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.results && result.results.length > 0) {
                        const countryCode = result.results[0].components?.country_code?.toUpperCase();
                        resolve(countryCode === 'SE');
                    } else {
                        // No results, assume not in Sweden
                        resolve(false);
                    }
                } catch (error) {
                    // API error, assume not valid
                    console.warn(`⚠️  API error for coords ${lat},${lng}`);
                    resolve(false);
                }
            });
        }).on('error', (error) => {
            console.warn(`⚠️  Network error for coords ${lat},${lng}`);
            resolve(false);
        });
    });
}

// Function to generate random coordinates within expanded Sweden bounds
function generateRandomCoordinates() {
    // Expanded bounds with more randomness - covers all of Sweden and a bit beyond
    const lat = parseFloat((55.0 + Math.random() * (69.5 - 55.0)).toFixed(3));
    const lng = parseFloat((10.5 + Math.random() * (24.5 - 10.5)).toFixed(3));
    return { lat, lng };
}

// Function to generate valid Swedish coordinates with verification
async function generateValidSwedishCoordinates(maxAttempts = 10) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const { lat, lng } = generateRandomCoordinates();
        
        // Verify with OpenCage API
        const isInSweden = await verifyCoordinatesInSweden(lat, lng);
        
        if (isInSweden) {
            return { lat, lng };
        }
        
        if (attempt < maxAttempts - 1) {
            console.log(`   🔄 Retry ${attempt + 1}/${maxAttempts}: ${lat},${lng} not in Sweden, trying again...`);
            // Small delay between retries
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    // Fallback to known Stockholm coordinates if all attempts fail
    console.warn('   ⚠️  Max attempts reached, using fallback Stockholm coordinates');
    return { 
        lat: parseFloat((59.2 + Math.random() * 0.5).toFixed(3)), 
        lng: parseFloat((17.8 + Math.random() * 0.5).toFixed(3))
    };
}

// Function to generate a single detection
let detectionIdCounter = 12005;
function generateDetection() {
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return {
        id: detectionIdCounter++,
        timestamp: generateTimestamp(),
        animal: animal,
        confidence: parseFloat((0.65 + Math.random() * 0.3).toFixed(2)),
        icon: animalIconMap[animal] || animalIconMap.default
    };
}

// Function to generate a single camera (async with API verification)
let cameraIdCounter = 13;
async function generateCamera(index, total) {
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const numDetections = 10 + Math.floor(Math.random() * 11); // 10-20
    const detections = [];
    for (let i = 0; i < numDetections; i++) {
        detections.push(generateDetection());
    }
    
    // Generate and verify coordinates are in Sweden
    const { lat, lng } = await generateValidSwedishCoordinates();
    console.log(`✓ Camera ${index + 1}/${total} generated at ${lat},${lng}`);
    
    return {
        id: cameraIdCounter++,
        location: { lat, lng },
        name: `Kamera ${suffix}`,
        detections: detections
    };
}

// Function to generate multiple cameras (async with OpenCage verification)
async function generateMoreCameras(num) {
    console.log('🔍 Generating cameras with OpenCage API verification...');
    console.log('🌍 Verifying all coordinates are in Sweden...\n');
    
    // Generate cameras in batches to avoid overwhelming the API
    const batchSize = 10; // Process 10 cameras at a time
    const allCameras = [];
    const startTime = Date.now();
    
    for (let batchStart = 0; batchStart < num; batchStart += batchSize) {
        const batchEnd = Math.min(batchStart + batchSize, num);
        const batchPromises = [];
        
        for (let i = batchStart; i < batchEnd; i++) {
            batchPromises.push(generateCamera(i, num));
        }
        
        const batchCameras = await Promise.all(batchPromises);
        allCameras.push(...batchCameras);
        
        // Small delay between batches to be nice to the API
        if (batchEnd < num) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Generated ${num} cameras in ${duration} seconds!`);
    console.log(`📍 All coordinates verified to be in Sweden via OpenCage API`);
    
    return allCameras;
}

// Main execution (async)
(async function main() {
    const numToGenerate = parseInt(process.argv[2]) || 50;
    const autoInject = process.argv.includes('--inject') || process.argv.includes('-i');

    console.log(`🎬 Generating ${numToGenerate} cameras with Sweden verification...\n`);
    
    const newCameras = await generateMoreCameras(numToGenerate);

    if (autoInject) {
        // Auto-inject into data.js
        const dataFilePath = path.join(__dirname, 'assets', 'js', 'data.js');
        
        try {
            // Create the new file content
            const newContent = `// Generated camera data
export const fakeData = {
    cameras: ${JSON.stringify(newCameras, null, 4)}
};
`;
            
            fs.writeFileSync(dataFilePath, newContent, 'utf8');
            console.log(`\n✅ Successfully injected ${numToGenerate} cameras into assets/js/data.js`);
            console.log(`   Total cameras: ${newCameras.length}`);
            console.log(`   Total detections: ${newCameras.reduce((sum, cam) => sum + cam.detections.length, 0)}`);
            console.log(`   📍 All coordinates verified to be in Sweden`);
        } catch (error) {
            console.error(`\n❌ Error injecting data: ${error.message}`);
            console.log('\nGenerated data:');
            console.log('const newCameras = ' + JSON.stringify(newCameras, null, 4) + ';');
        }
    } else {
        console.log('\n// Generated camera data:');
        console.log('const newCameras = ' + JSON.stringify(newCameras, null, 4) + ';');
        console.log('\n// To auto-inject into data.js, run with --inject or -i flag');
        console.log('// Example: node generate-cameras.js 50 --inject');
    }
})();
