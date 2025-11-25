import { fakeData } from './data.js';

const MAP_STYLE_URL = 'https://demotiles.maplibre.org/style.json';
const MAP_BOUNDS = [[10, 54], [26, 70]];

let confirmations = JSON.parse(localStorage.getItem('vilt_confirmations')) || {};
let activeCameraId = null;
let map;
let cameraMarkers = [];

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
        attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }));

    map.on('load', () => {
        map.fitBounds(MAP_BOUNDS, { padding: 40, maxZoom: 6.2 });
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
        el.innerHTML = '<span></span>';
        el.addEventListener('click', () => {
            activeCameraId = camera.id;
            updateSidebar(camera);
            highlightMarkers(id => id === camera.id);
            map.flyTo({ center: [camera.location.lng, camera.location.lat], zoom: 6.2, essential: true });
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat([camera.location.lng, camera.location.lat])
            .addTo(map);
        marker.__cameraId = camera.id;
        cameraMarkers.push(marker);
    });
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
        card.innerHTML = `
            <img src="${detection.thumbnail_url || detection.photo_url}" alt="${detection.animal}">
            <div>
                <h3>${detection.animal}</h3>
                <p>${new Date(detection.timestamp).toLocaleString('sv-SE')}</p>
                <p>AI-förslag: ${(detection.confidence * 100).toFixed(1)}%</p>
            </div>
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
        button.textContent = 'Visa foto';
        button.addEventListener('click', () => openModal(detection.id));

        const rightCol = card.querySelector('div');
        rightCol.appendChild(status);
        rightCol.appendChild(button);
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
            <img src="${detection.photo_url}" alt="${detection.animal}">
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
                map.flyTo({ center: [camera.location.lng, camera.location.lat], zoom: 6.2, essential: true });
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
    document.getElementById('detection-progress').style.width = `${Math.min((totalDetections / 16) * 100, 100)}%`;
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
}

function renderStatsMap() {
    const svg = document.getElementById('stats-sweden-map');
    if (!svg) return;

    const SWEDEN_PATH = 'M180 10 L210 70 L190 110 L215 170 L195 210 L225 270 L205 330 L230 380 L210 450 L240 520 L215 600 L250 690 L220 760 L160 770 L120 720 L100 650 L85 560 L60 500 L80 430 L60 360 L90 300 L70 240 L105 180 L90 140 L120 90 L150 50 Z';
    svg.innerHTML = '';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'stats-gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');

    const stopTop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stopTop.setAttribute('offset', '0%');
    stopTop.setAttribute('stop-color', '#d2f5e5');

    const stopBottom = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stopBottom.setAttribute('offset', '100%');
    stopBottom.setAttribute('stop-color', '#6cb78a');

    gradient.appendChild(stopTop);
    gradient.appendChild(stopBottom);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', SWEDEN_PATH);
    path.setAttribute('fill', 'url(#stats-gradient)');
    path.setAttribute('stroke', 'rgba(255,255,255,0.9)');
    path.setAttribute('stroke-width', '2');
    svg.appendChild(path);

    fakeData.cameras.forEach(camera => {
        const coords = projectToMiniMap(camera.location.lat, camera.location.lng);
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', coords.x);
        dot.setAttribute('cy', coords.y);
        dot.setAttribute('r', 4);
        dot.setAttribute('fill', '#fff');
        dot.setAttribute('stroke', '#1d5b2c');
        svg.appendChild(dot);
    });
}

function projectToMiniMap(lat, lng) {
    const bounds = { latMin: 55, latMax: 69.5, lngMin: 11, lngMax: 24.5 };
    const width = 320;
    const height = 780;
    const xRatio = (lng - bounds.lngMin) / (bounds.lngMax - bounds.lngMin);
    const yRatio = 1 - (lat - bounds.latMin) / (bounds.latMax - bounds.latMin);
    return {
        x: xRatio * width,
        y: yRatio * height
    };
}

const routes = {
    '': 'home',
    '#home': 'home',
    '#about': 'about',
    '#stats': 'stats',
    '#help': 'help'
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
    highlightMarkers(() => true);
});

window.closeModal = closeModal;