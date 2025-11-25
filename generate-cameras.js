// Camera data generator for ViltKameraNätverk
const fs = require('fs');
const path = require('path');

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

// Function to generate a single camera
let cameraIdCounter = 13;
function generateCamera() {
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const numDetections = 10 + Math.floor(Math.random() * 11); // 10-20
    const detections = [];
    for (let i = 0; i < numDetections; i++) {
        detections.push(generateDetection());
    }
    
    // Generate random coordinates within Sweden bounds (more focused)
    // Sweden's actual bounds: lat 55.3-69.1, lng 11.1-24.2
    // Focus more on central Sweden for better distribution
    const lat = parseFloat((57 + Math.random() * (68 - 57)).toFixed(3));
    const lng = parseFloat((12 + Math.random() * (22 - 12)).toFixed(3));
    
    return {
        id: cameraIdCounter++,
        location: { lat, lng },
        name: `Kamera ${suffix}`,
        detections: detections
    };
}

// Function to generate multiple cameras
function generateMoreCameras(num) {
    const newCameras = [];
    for (let i = 0; i < num; i++) {
        newCameras.push(generateCamera());
    }
    return newCameras;
}

// Main execution
const numToGenerate = parseInt(process.argv[2]) || 50;
const autoInject = process.argv.includes('--inject') || process.argv.includes('-i');

console.log(`Generating ${numToGenerate} cameras...`);

const newCameras = generateMoreCameras(numToGenerate);

if (autoInject) {
    // Auto-inject into data.js
    const dataFilePath = path.join(__dirname, 'assets', 'js', 'data.js');
    
    try {
        const dataFileContent = fs.readFileSync(dataFilePath, 'utf8');
        
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
