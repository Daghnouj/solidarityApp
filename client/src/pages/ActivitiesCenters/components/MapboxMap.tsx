import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { ActivityCenter } from '../types';

// Set your Mapbox token here or use an environment variable
// mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
// For development without env var, you might temporarily hardcode it, 
// but it's best practice to use the environment variable.

interface MapboxMapProps {
    centers: ActivityCenter[];
    focusLocation?: { lng: number; lat: number } | null;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ centers, focusLocation }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [tokenError, setTokenError] = useState(false);

    useEffect(() => {
        const token = import.meta.env.VITE_MAPBOX_TOKEN;

        if (!token) {
            console.warn('Mapbox token not found in environment variables (VITE_MAPBOX_TOKEN)');
            setTokenError(true);
            return;
        }

        mapboxgl.accessToken = token;

        if (map.current) return; // initialize map only once
        if (!mapContainer.current) return;

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [10.1815, 36.8065], // Default center (Tunis)
                zoom: 9,
            });

            // Add navigation controls
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        } catch (error) {
            console.error('Error initializing Mapbox:', error);
            setTokenError(true);
        }

        // Cleanup
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    const markers = useRef<mapboxgl.Marker[]>([]);

    // Handle focus navigation
    useEffect(() => {
        if (!map.current || !focusLocation) return;

        map.current.flyTo({
            center: [focusLocation.lng, focusLocation.lat],
            zoom: 16,
            essential: true,
            duration: 2000
        });

        // Optional: Open the popup for this marker
        const marker = markers.current.find(m => {
            const lngLat = m.getLngLat();
            return Math.abs(lngLat.lng - focusLocation.lng) < 0.0001 &&
                Math.abs(lngLat.lat - focusLocation.lat) < 0.0001;
        });
        if (marker && marker.getPopup() && !marker.getPopup().isOpen()) {
            marker.togglePopup();
        }

    }, [focusLocation]);

    // Update markers when centers change
    useEffect(() => {
        if (!map.current) return;

        // Remove existing markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        if (!centers.length) return;

        const bounds = new mapboxgl.LngLatBounds();
        let hasValidCoordinates = false;

        centers.forEach((center) => {
            if (center.coordinates) {
                const [latStr, lngStr] = center.coordinates.split(',').map(s => s.trim());
                const lat = parseFloat(latStr);
                const lng = parseFloat(lngStr);

                if (!isNaN(lat) && !isNaN(lng)) {
                    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                        // Create popup
                        const popup = new mapboxgl.Popup({
                            offset: 25,
                            closeButton: false, // Cleaner for hover
                            closeOnClick: false
                        }).setHTML(`
                            <div class="p-2">
                                <h3 class="font-bold text-gray-900">${center.name}</h3>
                                <p class="text-sm text-gray-600">${center.address}</p>
                            </div>
                        `);

                        // Create marker
                        const marker = new mapboxgl.Marker({ color: '#3B82F6' })
                            .setLngLat([lng, lat])
                            .setPopup(popup)
                            .addTo(map.current!);

                        // Hover events
                        const markerElem = marker.getElement();

                        markerElem.addEventListener('mouseenter', () => {
                            marker.togglePopup();
                        });

                        markerElem.addEventListener('mouseleave', () => {
                            marker.togglePopup();
                        });

                        markers.current.push(marker);
                        bounds.extend([lng, lat]);
                        hasValidCoordinates = true;
                    }
                }
            }
        });

        // Fit map to bounds if we have valid coordinates AND no specific focus
        if (hasValidCoordinates && !focusLocation) {
            map.current.fitBounds(bounds, {
                padding: 100, // Increased padding
                maxZoom: 15
            });
        }

    }, [centers, focusLocation]);

    if (tokenError) {
        return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl">
                <div className="text-center p-6">
                    <p className="text-gray-500 mb-2">Map cannot be displayed.</p>
                    <p className="text-xs text-gray-400">Missing VITE_MAPBOX_TOKEN in .env or invalid token.</p>
                </div>
            </div>
        );
    }

    return <div ref={mapContainer} className="w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden" />;
};

export default MapboxMap;
