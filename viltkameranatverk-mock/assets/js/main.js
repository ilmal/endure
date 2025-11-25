import { fakeData } from './data.js';

const MAP_STYLE_URL = 'https://demotiles.maplibre.org/style.json';
const MAP_BOUNDS = [[10, 54.5], [26, 70.5]];
const animalIconMap = {
    'Fjällräv': 'mdi:fox',
    'Ren': 'mdi:deer',
    'Lodjur': 'mdi:tiger',
    'Fjälluggla': 'mdi:owl',
    'Järv': 'mdi:paw',
    'Ripa': 'mdi:bird',
    'Björn': 'mdi:bear',
    'Varg': 'mdi:wolf',
    'Mård': 'mdi:raccoon',
    'Utter': 'mdi:fish',
    'Bäver': 'mdi:beaver',
    'Älg': 'mdi:deer',
    'Vildsvin': 'mdi:pig',
    'Räv': 'mdi:fox',
    'Berguv': 'mdi:owl',
    'Tjäder': 'mdi:bird',
    'Rådjur': 'mdi:deer',
    'Grävling': 'mdi:raccoon',
    'Orre': 'mdi:bird',
    'Havsörn': 'mdi:eagle',
    'Mink': 'mdi:otter',
    'Trana': 'mdi:crane',
    'Grågås': 'mdi:duck',
    'Hare': 'mdi:rabbit',
    'Fälthare': 'mdi:rabbit',
    'Ejder': 'mdi:duck',
    default: 'mdi:paw'
};

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
        center: [15.5, 63],
        zoom: 4.6,
        attributionControl: false,
        pitchWithRotate: false,
        dragRotate: false,
        renderWorldCopies: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }));

    map.on('load', () => {
        map.fitBounds(MAP_BOUNDS, { padding: 30, maxZoom: 6.3 });
        map.setMaxBounds(MAP_BOUNDS);
        map.scrollZoom.disable();
        map.doubleClickZoom.disable();
        map.keyboard.disable();
        map.touchZoomRotate.disableRotation();
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
    map.flyTo({ center: [camera.location.lng, camera.location.lat], zoom, essential: true });
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
    count.textContent = `${camera.detections.length} detektioner`;
    description.textContent = `Koordinater ${camera.location.lat.toFixed(2)}, ${camera.location.lng.toFixed(2)}.`;
    list.innerHTML = '';

    if (!camera.detections.length) {
        list.innerHTML = '<p>Inga registrerade observationer ännu.</p>';
        return;
    }

    camera.detections.forEach(detection => {
        const card = document.createElement('article');
        card.classList.add('detection-card');

        const iconWrapper = document.createElement('div');
        iconWrapper.classList.add('detection-icon');
        iconWrapper.innerHTML = `<span class="iconify" data-icon="${getDetectionIcon(detection)}" data-width="52" data-height="52"></span>`;

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

    refreshIcons();
}

function openModal(detectionId) {
    const detection = fakeData.cameras.flatMap(c => c.detections).find(d => d.id === detectionId);
    if (!detection) return;

    const modal = document.getElementById('photo-modal');
    modal.classList.add('open');
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">
                <span class="iconify" data-icon="${getDetectionIcon(detection)}" data-width="96" data-height="96"></span>
            </div>
            <h3>${detection.animal}</h3>
            <p><strong>Konfidens:</strong> ${(detection.confidence * 100).toFixed(1)}%</p>
            <p><strong>Tidsstämpel:</strong> ${new Date(detection.timestamp).toLocaleString('sv-SE')}</p>
            <div class="buttons">
                <button class="confirm-btn" data-action="confirm" data-id="${detection.id}">Bekräfta</button>
                <button class="deny-btn" data-action="deny" data-id="${detection.id}">Neka</button>
                <button class="close-btn" data-action="close">Stäng</button>
            </div>
        </div>
    `;

    modal.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', handleModalAction);
    });
    refreshIcons();
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

function refreshIcons() {
    if (window.Iconify && typeof window.Iconify.scan === 'function') {
        window.Iconify.scan();
    }
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
    const topAnimals = Object.entries(animalCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const list = document.getElementById('top-animals');
    list.innerHTML = '';
    topAnimals.forEach(([animal, count]) => {
        const li = document.createElement('li');
        li.textContent = `${animal}: ${count}`;
        list.appendChild(li);
    });

    renderStatsMap();
    if (statsMap) {
        statsMap.resize();
    }
}
function renderStatsMap() {
    const container = document.getElementById('stats-map-gl');
    if (!container || typeof maplibregl === 'undefined') return;

    const data = buildStatsGeoJson();

    if (!statsMap) {
        statsMap = new maplibregl.Map({
            container: 'stats-map-gl',
            style: MAP_STYLE_URL,
            center: [15.5, 63],
            zoom: 4.7,
            interactive: false,
            attributionControl: false,
            renderWorldCopies: false
        });

        statsMap.on('load', () => {
            statsMap.fitBounds(MAP_BOUNDS, { padding: 30, maxZoom: 5.6 });
            addStatsLayer(data);
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
                detections: camera.detections.length
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
                'circle-color': 'rgba(90,200,160,0.65)',
                'circle-stroke-width': 1.5,
                'circle-stroke-color': '#ffffff'
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
                'text-color': '#1d5b2c'
            }
        });
    } else {
        statsMap.getSource('stats-cameras').setData(data);
    }
}

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

document.addEventListener('DOMContentLoaded', () => {
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