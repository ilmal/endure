export const fakeData = {
    "cameras": [
        {
            "id": 1,
            "location": {"lat": 59.3293, "lng": 18.0686},  // Stockholm
            "name": "Stockholm Central",
            "detections": [
                {
                    "id": 101,
                    "timestamp": "2025-11-20 14:30:00",
                    "animal": "Deer",
                    "confidence": 0.95,
                    "photo_url": "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80",
                    "thumbnail_url": "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=300&q=60",
                    "confirmed": null  // null: not reviewed, true: correct, false: incorrect
                },
                {
                    "id": 102,
                    "timestamp": "2025-11-21 09:15:00",
                    "animal": "Fox",
                    "confidence": 0.88,
                    "photo_url": "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=80",
                    "thumbnail_url": "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=300&q=60",
                    "confirmed": null
                }
            ]
        },
        {
            "id": 2,
            "location": {"lat": 57.7089, "lng": 11.9746},  // Gothenburg
            "name": "Gothenburg Forest",
            "detections": [
                {
                    "id": 201,
                    "timestamp": "2025-11-22 16:45:00",
                    "animal": "Boar",
                    "confidence": 0.92,
                    "photo_url": "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&w=1200&q=80",
                    "thumbnail_url": "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&w=300&q=60",
                    "confirmed": null
                }
            ]
        },
        {
            "id": 3,
            "location": {"lat": 55.6074, "lng": 13.0038},  // Malmö
            "name": "Malmö Edge Zone",
            "detections": [
                {
                    "id": 301,
                    "timestamp": "2025-11-23 11:00:00",
                    "animal": "Badger",
                    "confidence": 0.85,
                    "photo_url": "https://images.unsplash.com/photo-1501706362039-c06b2d715385?auto=format&fit=crop&w=1200&q=80",
                    "thumbnail_url": "https://images.unsplash.com/photo-1501706362039-c06b2d715385?auto=format&fit=crop&w=300&q=60",
                    "confirmed": null
                },
                {
                    "id": 302,
                    "timestamp": "2025-11-24 13:20:00",
                    "animal": "Wolf",
                    "confidence": 0.75,
                    "photo_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
                    "thumbnail_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=300&q=60",
                    "confirmed": null
                }
            ]
        },
        {
            "id": 4,
            "location": {"lat": 63.8258, "lng": 20.2630},  // Umeå
            "name": "Umeå River Crossing",
            "detections": []
        },
        {
            "id": 5,
            "location": {"lat": 67.8558, "lng": 20.2252},  // Kiruna
            "name": "Kiruna Wildlife Passage",
            "detections": [
                {
                    "id": 501,
                    "timestamp": "2025-11-25 08:00:00",
                    "animal": "Reindeer",
                    "confidence": 0.98,
                    "photo_url": "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0083?auto=format&fit=crop&w=1200&q=80",
                    "thumbnail_url": "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0083?auto=format&fit=crop&w=300&q=60",
                    "confirmed": null
                }
            ]
        },
        {
            "id": 6,
            "location": {"lat": 63.1792, "lng": 14.6360},  // Östersund
            "name": "Östersund Moose Ridge",
            "detections": [
                {
                    "id": 601,
                    "timestamp": "2025-11-19 06:50:00",
                    "animal": "Moose",
                    "confidence": 0.91,
                    "photo_url": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
                    "thumbnail_url": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=300&q=60",
                    "confirmed": null
                },
                {
                    "id": 602,
                    "timestamp": "2025-11-23 04:20:00",
                    "animal": "Brown Bear",
                    "confidence": 0.73,
                    "photo_url": "https://images.unsplash.com/photo-1469478715127-22a4b9da3bae?auto=format&fit=crop&w=1200&q=80",
                    "thumbnail_url": "https://images.unsplash.com/photo-1469478715127-22a4b9da3bae?auto=format&fit=crop&w=300&q=60",
                    "confirmed": null
                }
            ]
        },
        {
            "id": 7,
            "location": {"lat": 57.6348, "lng": 18.2948},  // Visby, Gotland
            "name": "Visby Coastal Dune",
            "detections": [
                {
                    "id": 701,
                    "timestamp": "2025-11-18 21:05:00",
                    "animal": "Hare",
                    "confidence": 0.82,
                    "photo_url": "https://images.unsplash.com/photo-1470165525439-3cf9e2b2546c?auto=format&fit=crop&w=1200&q=80",
                    "thumbnail_url": "https://images.unsplash.com/photo-1470165525439-3cf9e2b2546c?auto=format&fit=crop&w=300&q=60",
                    "confirmed": null
                }
            ]
        },
        {
            "id": 8,
            "location": {"lat": 59.3780, "lng": 13.5040},  // Karlstad
            "name": "Karlstad River Delta",
            "detections": [
                {
                    "id": 801,
                    "timestamp": "2025-11-21 18:40:00",
                    "animal": "Lynx",
                    "confidence": 0.79,
                    "photo_url": "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80",
                    "thumbnail_url": "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=300&q=60",
                    "confirmed": null
                },
                {
                    "id": 802,
                    "timestamp": "2025-11-24 07:55:00",
                    "animal": "Golden Eagle",
                    "confidence": 0.69,
                    "photo_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
                    "thumbnail_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=60",
                    "confirmed": null
                }
            ]
        }
    ]
};