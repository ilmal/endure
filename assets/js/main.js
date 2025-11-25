import { fakeData } from '/assets/js/data.js';

const MAP_STYLE_URL = 'https://demotiles.maplibre.org/style.json';
const MAP_BOUNDS = [[10, 54.5], [26, 70.5]];
// Using emoji icons - free, no attribution needed, work everywhere
const animalIconMap = {
    'Fjällräv': '🦊', // Arctic fox
    'Ren': '🦌', // Reindeer
    'Lodjur': '🐆', // Lynx
    'Fjälluggla': '🦉', // Snowy owl
    'Järv': '🦡', // Wolverine
    'Ripa': '🐦', // Ptarmigan
    'Björn': '🐻', // Bear
    'Varg': '🐺', // Wolf
    'Mård': '🦦', // Marten
    'Utter': '🦦', // Otter
    'Bäver': '🦫', // Beaver
    'Älg': '🦌', // Moose
    'Vildsvin': '🐗', // Wild boar
    'Räv': '🦊', // Fox
    'Berguv': '🦉', // Eagle owl
    'Tjäder': '🦅', // Capercaillie
    'Rådjur': '🦌', // Roe deer
    'Grävling': '🦡', // Badger
    'Orre': '🐦', // Black grouse
    'Havsörn': '🦅', // Sea eagle
    'Mink': '🦦', // Mink
    'Trana': '🦢', // Crane
    'Grågås': '🦆', // Greylag goose
    'Hare': '🐇', // Hare
    'Fälthare': '🐇', // Mountain hare
    'Ejder': '🦆', // Eider duck
    default: '🐾'
};

const translations = {
    sv: {
        title: "Hållut - A4 Mock",
        logo: "Hållut - A4 Mock",
        navMap: "Karta",
        navStats: "Statistik",
        searchPlaceholder: "Sök kameror...",
        activeCameras: "Aktiva kameror",
        updatedRealtime: "Uppdaterad i realtid från mock-datan",
        detectionsWeek: "Detektioner senaste veckan",
        aiFiltered: "AI-filtrerade observationer",
        validationRate: "Valideringsgrad",
        confirmedAI: "Människor som bekräftat AI-resultat",
        selectCamera: "Välj en kamera",
        detections: "detektioner",
        detectionsWord: "detektioner",
        clickCamera: "Klicka på en kamera i kartan eller använd söket för att se ikonbaserade observationer.",
        statsTitle: "Statistik & analys",
        statsDesc: "Översikt av mock-datan från kamerorna. Kartan visar antal träffar per plats.",
        totalCameras: "Totalt Kameror",
        totalDetections: "Totalt Detektioner",
        validatedObservations: "Validerade observationer",
        cameraLocations: "Kamera platser",
        dotSize: "Storleken på punkterna motsvarar antalet observationer senaste veckan.",
        legendSmall: "2–4 träffar",
        legendMedium: "5–7 träffar",
        legendLarge: "8+ träffar",
        topAnimals: "Topp djur",
        filterAll: "Alla",
        filterTop: "Topp 5",
        filterAlpha: "A-Ö",
        footer: "<strong>Hållut - A4</strong><br>Mock Prototype - November 2025<br><small>Skapad med stöd från LLMs</small> | <a href=\"https://github.com/ilmal/endure\" target=\"_blank\">GitHub Repo</a>",
        coordinates: "Koordinater",
        noObservations: "Inga registrerade observationer ännu.",
        imagePlaceholder: "Här kommer en faktisk bild från jaktkameran",
        confidence: "Konfidens:",
        timestamp: "Tidsstämpel:",
        confirm: "Bekräfta",
        deny: "Neka",
        close: "Stäng"
    },
    en: {
        title: "Hållut - A4 Mock",
        logo: "Hållut - A4 Mock",
        navMap: "Map",
        navStats: "Statistics",
        searchPlaceholder: "Search cameras...",
        activeCameras: "Active Cameras",
        updatedRealtime: "Updated in real-time from mock data",
        detectionsWeek: "Detections last week",
        aiFiltered: "AI-filtered observations",
        validationRate: "Validation Rate",
        confirmedAI: "People who confirmed AI results",
        selectCamera: "Select a camera",
        detections: "detections",
        detectionsWord: "detections",
        clickCamera: "Click on a camera in the map or use search to see icon-based observations.",
        statsTitle: "Statistics & Analysis",
        statsDesc: "Overview of mock data from the country's cameras. The map shows the number of hits per location.",
        totalCameras: "Total Cameras",
        totalDetections: "Total Detections",
        validatedObservations: "Validated Observations",
        cameraLocations: "Camera Locations",
        dotSize: "The size of the dots corresponds to the number of observations last week.",
        imagePlaceholder: "Here will be an actual trail camera image",
        legendSmall: "2–4 hits",
        legendMedium: "5–7 hits",
        legendLarge: "8+ hits",
        topAnimals: "Top Animals",
        filterAll: "All",
        filterTop: "Top 5",
        filterAlpha: "A-Z",
        footer: "<strong>Hållut - A4</strong><br>Mock Prototype - November 2025<br><small>Created with support from LLMs</small> | <a href=\"https://github.com/ilmal/endure\" target=\"_blank\">GitHub Repo</a>",
        coordinates: "Coordinates",
        noObservations: "No registered observations yet.",
        confidence: "Confidence:",
        timestamp: "Timestamp:",
        confirm: "Confirm",
        deny: "Deny",
        close: "Close"
    }
};

let currentLang = localStorage.getItem('lang') || 'sv';

let confirmations = JSON.parse(localStorage.getItem('vilt_confirmations')) || {};
let activeCameraId = null;
let map;
let cameraMarkers = [];
let statsMap;

function mergeConfirmations() {
    fakeData.cameras.forEach(camera => {
        camera.detections.forEach(detection => {
            if (Object.prototype.hasOwnProperty.call(confirmations, detection.id)) {
                detection.confirmed = confirmations[detection.id];
            }
        });
    });
}

function saveConfirmations() {
    localStorage.setItem('vilt_confirmations', JSON.stringify(confirmations));
}

function initMap() {
    if (typeof maplibregl === 'undefined') {
        console.error('MapLibre GL JS is not loaded.');
        return;
    }

    map = new maplibregl.Map({
        container: 'map',
        style: MAP_STYLE_URL,
        center: [15.5, 62.5],
        zoom: 5.2,
        attributionControl: false,
        pitchWithRotate: false,
        dragRotate: false,
        renderWorldCopies: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }));

    map.on('load', () => {
        map.scrollZoom.enable();
        map.doubleClickZoom.enable();
        renderCameraMarkers();
        renderDetectionLayer();
    });
}

function renderCameraMarkers() {
    cameraMarkers.forEach(marker => marker.remove());
    cameraMarkers = [];

    fakeData.cameras.forEach(camera => {
        const el = document.createElement('button');
        el.className = 'camera-marker';
        el.title = `${camera.name} (${camera.detections.length} detektioner)`;
        el.innerHTML = '<i class="bi bi-geo-alt-fill"></i>';
        el.addEventListener('click', () => {
            activeCameraId = camera.id;
            updateSidebar(camera);
            highlightMarkers(id => id === camera.id);
            flyToCamera(camera);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat([camera.location.lng, camera.location.lat])
            .addTo(map);
        marker.__cameraId = camera.id;
        cameraMarkers.push(marker);
    });

    highlightMarkers(() => true);
}

function flyToCamera(camera, zoom = 6.1) {
    if (!map) return;
    map.jumpTo({ center: [camera.location.lng, camera.location.lat], zoom });
}

function renderDetectionLayer() {
    const data = {
        type: 'FeatureCollection',
        features: fakeData.cameras.flatMap(camera => {
            return camera.detections.map((detection, index) => {
                const jitter = createJitterOffset(index);
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [camera.location.lng + jitter.lng, camera.location.lat + jitter.lat]
                    },
                    properties: {
                        id: detection.id,
                        animal: detection.animal,
                        confidence: detection.confidence
                    }
                };
            });
        })
    };

    if (map.getSource('detections')) {
        map.getSource('detections').setData(data);
        return;
    }

    map.addSource('detections', {
        type: 'geojson',
        data
    });

    map.addLayer({
        id: 'detections-layer',
        type: 'circle',
        source: 'detections',
        paint: {
            'circle-radius': 5,
            'circle-color': '#f6c16b',
            'circle-opacity': 0.8,
            'circle-stroke-width': 1.2,
            'circle-stroke-color': '#ffffff'
        }
    });
}

function createJitterOffset(index) {
    const angle = (index % 6) * (Math.PI / 3);
    const distance = 0.18;
    return {
        lng: Math.cos(angle) * distance * 0.4,
        lat: Math.sin(angle) * distance * 0.25
    };
}

function highlightMarkers(predicate) {
    cameraMarkers.forEach(marker => {
        const matches = predicate(marker.__cameraId);
        marker.getElement().classList.toggle('muted', !matches);
        marker.getElement().classList.toggle('active', matches);
    });
}

function updateSidebar(camera) {
    const title = document.getElementById('sidebar-title');
    const count = document.getElementById('sidebar-count');
    const description = document.getElementById('sidebar-description');
    const list = document.getElementById('detections-list');

    title.textContent = camera.name;
    count.textContent = `${camera.detections.length} ${translations[currentLang].detectionsWord}`;
    description.textContent = `${translations[currentLang].coordinates} ${camera.location.lat.toFixed(2)}, ${camera.location.lng.toFixed(2)}.`;
    list.innerHTML = '';

    if (!camera.detections.length) {
        list.innerHTML = `<p>${translations[currentLang].noObservations}</p>`;
        return;
    }

    camera.detections.forEach(detection => {
        const card = document.createElement('article');
        card.classList.add('detection-card');

        const iconWrapper = document.createElement('div');
        iconWrapper.classList.add('detection-icon');
        iconWrapper.innerHTML = `<span class="emoji-icon">${getDetectionIcon(detection)}</span>`;

        const info = document.createElement('div');
        info.classList.add('detection-info');
        info.innerHTML = `
            <h3>${detection.animal}</h3>
            <p>${new Date(detection.timestamp).toLocaleString('sv-SE')}</p>
            <p>AI-förslag: ${(detection.confidence * 100).toFixed(1)}%</p>
        `;

        const status = document.createElement('span');
        status.classList.add('status-pill');
        if (detection.confirmed === true) {
            status.classList.add('confirmed');
            status.innerHTML = '<i class="fas fa-check"></i> Bekräftad';
        } else if (detection.confirmed === false) {
            status.classList.add('denied');
            status.innerHTML = '<i class="fas fa-xmark"></i> Nekad';
        } else {
            status.classList.add('pending');
            status.innerHTML = '<i class="fas fa-clock"></i> Inväntar svar';
        }

        const button = document.createElement('button');
        button.textContent = 'Visa observation';
        button.addEventListener('click', () => openModal(detection.id));

        info.appendChild(status);
        info.appendChild(button);
        card.appendChild(iconWrapper);
        card.appendChild(info);
        list.appendChild(card);
    });
}

function openModal(detectionId) {
    const detection = fakeData.cameras.flatMap(c => c.detections).find(d => d.id === detectionId);
    if (!detection) return;

    const modal = document.getElementById('photo-modal');
    modal.classList.add('open');
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-image-placeholder">
                <span class="emoji-icon" style="font-size: 64px; margin-bottom: 16px;">${getDetectionIcon(detection)}</span>
                <p style="color: #666; font-style: italic; text-align: center; margin: 0;">
                    ${translations[currentLang].imagePlaceholder}
                </p>
            </div>
            <div class="modal-details">
                <h3>${detection.animal}</h3>
                <p><strong>${translations[currentLang].confidence}</strong> ${(detection.confidence * 100).toFixed(1)}%</p>
                <p><strong>${translations[currentLang].timestamp}</strong> ${new Date(detection.timestamp).toLocaleString(currentLang === 'sv' ? 'sv-SE' : 'en-US')}</p>
                <div class="buttons">
                    <button class="confirm-btn" data-action="confirm" data-id="${detection.id}">${translations[currentLang].confirm}</button>
                    <button class="deny-btn" data-action="deny" data-id="${detection.id}">${translations[currentLang].deny}</button>
                    <button class="close-btn" data-action="close">${translations[currentLang].close}</button>
                </div>
            </div>
        </div>
    `;

    modal.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', handleModalAction);
    });
}

function handleModalAction(event) {
    const action = event.currentTarget.dataset.action;
    const id = Number(event.currentTarget.dataset.id);
    if (action === 'confirm') {
        updateConfirmation(id, true);
    } else if (action === 'deny') {
        updateConfirmation(id, false);
    }
    closeModal();
    if (action === 'close') return;

    if (activeCameraId) {
        const camera = fakeData.cameras.find(c => c.id === activeCameraId);
        if (camera) updateSidebar(camera);
    }

    updateHeroMetrics();
    if (document.getElementById('stats').classList.contains('active')) {
        loadStats();
    }
}

function closeModal() {
    document.getElementById('photo-modal').classList.remove('open');
    document.getElementById('photo-modal').innerHTML = '';
}

function updateConfirmation(id, confirmed) {
    confirmations[id] = confirmed;
    saveConfirmations();
    mergeConfirmations();
}

window.addEventListener('click', (event) => {
    const modal = document.getElementById('photo-modal');
    if (event.target === modal) {
        closeModal();
    }
});

function setupSearch() {
    const input = document.getElementById('search-input');
    const suggestions = document.getElementById('search-suggestions');

    function hideSuggestions() {
        suggestions.classList.remove('visible');
        suggestions.innerHTML = '';
    }

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        if (!query) {
            hideSuggestions();
            highlightMarkers(() => true);
            return;
        }

        const matches = fakeData.cameras.filter(camera => camera.name.toLowerCase().includes(query));
        suggestions.innerHTML = '';

        if (!matches.length) {
            hideSuggestions();
            highlightMarkers(() => false);
            return;
        }

        matches.forEach(camera => {
            const li = document.createElement('li');
            li.textContent = camera.name;
            li.addEventListener('click', () => {
                input.value = camera.name;
                hideSuggestions();
                activeCameraId = camera.id;
                updateSidebar(camera);
                highlightMarkers(id => id === camera.id);
                flyToCamera(camera);
            });
            suggestions.appendChild(li);
        });

        suggestions.classList.add('visible');
        highlightMarkers(id => matches.some(camera => camera.id === id));
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.search')) {
            hideSuggestions();
        }
    });
}

function getDetectionIcon(detection) {
    if (detection.icon) return detection.icon;
    return animalIconMap[detection.animal] || animalIconMap.default;
}

function updateHeroMetrics() {
    const totalCameras = fakeData.cameras.length;
    const totalDetections = fakeData.cameras.reduce((sum, camera) => sum + camera.detections.length, 0);
    const validated = fakeData.cameras
        .flatMap(camera => camera.detections)
        .filter(det => det.confirmed === true).length;

    document.getElementById('hero-cameras').textContent = totalCameras;
    document.getElementById('hero-detections').textContent = totalDetections;
    document.getElementById('hero-validation').textContent = totalDetections ? `${Math.round((validated / totalDetections) * 100)}%` : '0%';
}

function loadStats() {
    const totalCameras = fakeData.cameras.length;
    const totalDetections = fakeData.cameras.reduce((sum, camera) => sum + camera.detections.length, 0);
    const validated = fakeData.cameras
        .flatMap(camera => camera.detections)
        .filter(det => det.confirmed === true).length;
    const reviewed = fakeData.cameras
        .flatMap(camera => camera.detections)
        .filter(det => det.confirmed !== null && det.confirmed !== undefined).length;

    document.getElementById('total-cameras').textContent = totalCameras;
    document.getElementById('total-detections').textContent = totalDetections;
    document.getElementById('validated-count').textContent = validated;
    const detectionGoal = totalCameras * 4;
    document.getElementById('detection-progress').style.width = detectionGoal ? `${Math.min((totalDetections / detectionGoal) * 100, 100)}%` : '0%';
    document.getElementById('validation-progress').style.width = totalDetections ? `${(reviewed / totalDetections) * 100}%` : '0%';

    const animalCounts = {};
    fakeData.cameras.forEach(camera => {
        camera.detections.forEach(detection => {
            animalCounts[detection.animal] = (animalCounts[detection.animal] || 0) + 1;
        });
    });

    renderAnimalStats(animalCounts, 'all');
    setupAnimalFilters(animalCounts);
    renderStatsMap();
    if (statsMap) {
        statsMap.resize();
    }
}

let selectedAnimalInStats = null;

function renderAnimalStats(animalCounts, filter = 'all') {
    const list = document.getElementById('top-animals');
    list.innerHTML = '';
    
    let animals = Object.entries(animalCounts);
    
    if (filter === 'top') {
        animals = animals.sort((a, b) => b[1] - a[1]).slice(0, 5);
    } else if (filter === 'alpha') {
        animals = animals.sort((a, b) => a[0].localeCompare(b[0], 'sv'));
    } else {
        animals = animals.sort((a, b) => b[1] - a[1]);
    }
    
    animals.forEach(([animal, count]) => {
        const li = document.createElement('li');
        const icon = animalIconMap[animal] || animalIconMap.default;
        
        li.innerHTML = `
            <div class="animal-name">
                <span class="animal-icon emoji-icon">${icon}</span>
                <span>${animal}</span>
            </div>
            <span class="animal-count">${count}</span>
        `;
        
        li.dataset.animal = animal;
        
        li.addEventListener('click', () => {
            // Toggle selection
            if (selectedAnimalInStats === animal) {
                selectedAnimalInStats = null;
                li.classList.remove('selected');
                highlightCamerasOnStatsMap(null);
            } else {
                // Remove previous selection
                document.querySelectorAll('#top-animals li').forEach(item => item.classList.remove('selected'));
                selectedAnimalInStats = animal;
                li.classList.add('selected');
                highlightCamerasOnStatsMap(animal);
            }
        });
        
        if (selectedAnimalInStats === animal) {
            li.classList.add('selected');
        }
        
        list.appendChild(li);
    });
    
    if (typeof Iconify !== 'undefined') {
        Iconify.scan();
    }
}

function setupAnimalFilters(animalCounts) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            renderAnimalStats(animalCounts, filter);
        });
    });
}

function filterDetectionsByAnimal(animal) {
    navigateTo('home');
    
    setTimeout(() => {
        const cameras = fakeData.cameras.filter(camera => 
            camera.detections.some(d => d.animal === animal)
        );
        
        if (cameras.length > 0) {
            const firstCamera = cameras[0];
            activeCameraId = firstCamera.id;
            updateSidebar(firstCamera);
            highlightMarkers(id => id === firstCamera.id);
            flyToCamera(firstCamera);
        }
    }, 100);
}

function renderStatsMap() {
    const container = document.getElementById('stats-map-gl');
    if (!container || typeof maplibregl === 'undefined') return;

    const data = buildStatsGeoJson();

    if (!statsMap) {
        statsMap = new maplibregl.Map({
            container: 'stats-map-gl',
            style: MAP_STYLE_URL,
            center: [15.5, 62.5],
            zoom: 5.2,
            interactive: true,
            attributionControl: false,
            renderWorldCopies: false
        });

        statsMap.on('load', () => {
            // Match main map's tight Sweden focus
            statsMap.fitBounds([[10, 54.5], [26, 70.5]], { padding: 40, maxZoom: 5.2 });
            addStatsLayer(data);
            setupStatsMapInteraction();
        });
    } else if (statsMap.isStyleLoaded()) {
        addStatsLayer(data);
    } else {
        statsMap.once('load', () => addStatsLayer(data));
    }
}

function buildStatsGeoJson() {
    return {
        type: 'FeatureCollection',
        features: fakeData.cameras.map(camera => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [camera.location.lng, camera.location.lat]
            },
            properties: {
                detections: camera.detections.length,
                highlighted: false
            }
        }))
    };
}

function addStatsLayer(data) {
    if (!statsMap) return;

    if (!statsMap.getSource('stats-cameras')) {
        statsMap.addSource('stats-cameras', { type: 'geojson', data });
        statsMap.addLayer({
            id: 'stats-circles',
            type: 'circle',
            source: 'stats-cameras',
            paint: {
                'circle-radius': [
                    'interpolate', ['linear'], ['get', 'detections'],
                    2, 6,
                    6, 14,
                    10, 24
                ],
                'circle-color': [
                    'case',
                    ['get', 'highlighted'],
                    'rgba(246, 193, 107, 0.9)', // Highlighted color (gold)
                    'rgba(90,200,160,0.65)' // Default color (green)
                ],
                'circle-stroke-width': [
                    'case',
                    ['get', 'highlighted'],
                    2.5,
                    1.5
                ],
                'circle-stroke-color': [
                    'case',
                    ['get', 'highlighted'],
                    '#f6c16b',
                    '#ffffff'
                ]
            }
        });
        statsMap.addLayer({
            id: 'stats-count-labels',
            type: 'symbol',
            source: 'stats-cameras',
            layout: {
                'text-field': ['to-string', ['get', 'detections']],
                'text-size': 12
            },
            paint: {
                'text-color': [
                    'case',
                    ['get', 'highlighted'],
                    '#8B4513',
                    '#1d5b2c'
                ]
            }
        });
    } else {
        statsMap.getSource('stats-cameras').setData(data);
    }
}

function highlightCamerasOnStatsMap(animal) {
    if (!statsMap || !statsMap.getSource('stats-cameras')) return;
    
    // Build new GeoJSON with highlighted property
    const camerasWithAnimal = animal 
        ? fakeData.cameras.filter(camera => 
            camera.detections.some(d => d.animal === animal)
          ).map(c => c.id)
        : [];
    
    const data = {
        type: 'FeatureCollection',
        features: fakeData.cameras.map(camera => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [camera.location.lng, camera.location.lat]
            },
            properties: {
                detections: camera.detections.length,
                highlighted: animal ? camerasWithAnimal.includes(camera.id) : false
            }
        }))
    };
    
    statsMap.getSource('stats-cameras').setData(data);
}

function setupStatsMapInteraction() {
    if (!statsMap) return;

    // Change cursor on hover
    statsMap.on('mouseenter', 'stats-circles', () => {
        statsMap.getCanvas().style.cursor = 'pointer';
    });

    statsMap.on('mouseleave', 'stats-circles', () => {
        statsMap.getCanvas().style.cursor = '';
    });

    // Click handler for camera markers
    statsMap.on('click', 'stats-circles', (e) => {
        if (!e.features || !e.features.length) return;
        
        const coordinates = e.features[0].geometry.coordinates.slice();
        const detections = e.features[0].properties.detections;
        
        // Find the camera by coordinates
        const camera = fakeData.cameras.find(c => 
            Math.abs(c.location.lng - coordinates[0]) < 0.0001 && 
            Math.abs(c.location.lat - coordinates[1]) < 0.0001
        );
        
        if (!camera) return;

        // Create popup with camera info
        const animalSummary = getAnimalSummaryForCamera(camera);
        
        new maplibregl.Popup({ closeButton: true, closeOnClick: true })
            .setLngLat(coordinates)
            .setHTML(`
                <div style="padding: 8px; min-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 1rem;">${camera.name}</h4>
                    <p style="margin: 4px 0; font-size: 0.9rem;">
                        <strong>${translations[currentLang].detections}:</strong> ${detections}
                    </p>
                    <p style="margin: 4px 0; font-size: 0.9rem;">
                        <strong>${translations[currentLang].coordinates}:</strong><br>
                        ${camera.location.lat.toFixed(4)}°N, ${camera.location.lng.toFixed(4)}°E
                    </p>
                    ${animalSummary ? `
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                            <strong style="font-size: 0.85rem;">Top djur:</strong>
                            <div style="margin-top: 4px;">
                                ${animalSummary}
                            </div>
                        </div>
                    ` : ''}
                    <button 
                        onclick="window.viewCameraFromStats('${camera.id}')" 
                        style="margin-top: 12px; width: 100%; padding: 8px; background: var(--forest); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem;"
                    >
                        ${translations[currentLang].selectCamera}
                    </button>
                </div>
            `)
            .addTo(statsMap);
    });
}

function getAnimalSummaryForCamera(camera) {
    if (!camera.detections || !camera.detections.length) return '';
    
    const animalCounts = {};
    camera.detections.forEach(d => {
        animalCounts[d.animal] = (animalCounts[d.animal] || 0) + 1;
    });
    
    const topAnimals = Object.entries(animalCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    return topAnimals.map(([animal, count]) => 
        `<span style="font-size: 0.85rem; display: inline-block; margin-right: 8px;">
            ${getDetectionIcon(animal)} ${animal} (${count})
        </span>`
    ).join('');
}

// Global function to handle camera view from stats map
window.viewCameraFromStats = function(cameraId) {
    const camera = fakeData.cameras.find(c => c.id === cameraId);
    if (!camera) return;
    
    navigateTo('home');
    
    setTimeout(() => {
        activeCameraId = camera.id;
        updateSidebar(camera);
        highlightMarkers(id => id === camera.id);
        flyToCamera(camera);
    }, 100);
};

const routes = {
    '': 'home',
    '#home': 'home',
    '#stats': 'stats'
};

function navigateTo(page) {
    document.querySelectorAll('.page').forEach(section => section.classList.remove('active'));
    const pageElement = document.getElementById(page);
    if (pageElement) pageElement.classList.add('active');

    document.querySelectorAll('header nav a').forEach(link => link.classList.remove('active'));
    const navLink = document.querySelector(`header nav a[href="#${page}"]`);
    if (navLink) navLink.classList.add('active');

    history.pushState(null, null, `#${page}`);

    if (page === 'stats') {
        loadStats();
    }
}

window.addEventListener('popstate', () => {
    const hash = location.hash || '#home';
    const page = routes[hash] || 'home';
    navigateTo(page);
});

function initNavigation() {
    document.querySelectorAll('header nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const hash = link.getAttribute('href');
            const page = routes[hash] || 'home';
            navigateTo(page);
        });
    });
}

function updateLanguage() {
    document.title = translations[currentLang].title;
    document.documentElement.lang = currentLang;
    
    // Update logo text (changed to direct textContent since HTML structure changed)
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
        logoElement.textContent = translations[currentLang].logo;
    }
    
    document.querySelector('nav a[href="#home"]').textContent = translations[currentLang].navMap;
    document.querySelector('nav a[href="#stats"]').textContent = translations[currentLang].navStats;
    document.getElementById('search-input').placeholder = translations[currentLang].searchPlaceholder;
    document.querySelector('#home-hero article:nth-child(1) h3').textContent = translations[currentLang].activeCameras;
    document.querySelector('#home-hero article:nth-child(1) small').textContent = translations[currentLang].updatedRealtime;
    document.querySelector('#home-hero article:nth-child(2) h3').textContent = translations[currentLang].detectionsWeek;
    document.querySelector('#home-hero article:nth-child(2) small').textContent = translations[currentLang].aiFiltered;
    document.querySelector('#home-hero article:nth-child(3) h3').textContent = translations[currentLang].validationRate;
    document.querySelector('#home-hero article:nth-child(3) small').textContent = translations[currentLang].confirmedAI;
    document.getElementById('sidebar-title').textContent = translations[currentLang].selectCamera;
    document.getElementById('sidebar-description').textContent = translations[currentLang].clickCamera;
    document.querySelector('.stats-header h1').textContent = translations[currentLang].statsTitle;
    document.querySelector('.stats-header p').textContent = translations[currentLang].statsDesc;
    document.querySelector('.stat-card:nth-child(1) h3').textContent = translations[currentLang].totalCameras;
    document.querySelector('.stat-card:nth-child(2) h3').textContent = translations[currentLang].totalDetections;
    document.querySelector('.stat-card:nth-child(3) h3').textContent = translations[currentLang].validatedObservations;
    document.querySelector('.stats-map-headline h2').textContent = translations[currentLang].cameraLocations;
    document.querySelector('.stats-map-headline p').textContent = translations[currentLang].dotSize;
    document.querySelector('.stats-map-legend span:nth-child(1)').textContent = translations[currentLang].legendSmall;
    document.querySelector('.stats-map-legend span:nth-child(2)').textContent = translations[currentLang].legendMedium;
    document.querySelector('.stats-map-legend span:nth-child(3)').textContent = translations[currentLang].legendLarge;
    document.querySelector('.stats-insights h2').textContent = translations[currentLang].topAnimals;
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns[0].textContent = translations[currentLang].filterAll;
        filterBtns[1].textContent = translations[currentLang].filterTop;
        filterBtns[2].textContent = translations[currentLang].filterAlpha;
    }
    
    document.querySelector('footer p').innerHTML = translations[currentLang].footer;
    
    const langToggle = document.getElementById('lang-toggle');
    const flagIcon = langToggle.querySelector('.flag-icon');
    const langText = langToggle.querySelector('.lang-text');
    
    if (currentLang === 'sv') {
        flagIcon.textContent = '🇬🇧';
        langText.textContent = 'EN';
    } else {
        flagIcon.textContent = '🇸🇪';
        langText.textContent = 'SV';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
    document.getElementById('lang-toggle').addEventListener('click', () => {
        currentLang = currentLang === 'sv' ? 'en' : 'sv';
        localStorage.setItem('lang', currentLang);
        updateLanguage();
    });
    mergeConfirmations();
    initMap();
    setupSearch();
    updateHeroMetrics();
    initNavigation();

    const initialHash = location.hash || '#home';
    const initialPage = routes[initialHash] || 'home';
    navigateTo(initialPage);
});

window.closeModal = closeModal;