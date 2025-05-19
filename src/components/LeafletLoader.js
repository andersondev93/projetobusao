'use client';

import { useEffect } from 'react';

export default function LeafletLoader() {
    useEffect(() => {
        // Importa o CSS do Leaflet apenas no lado do cliente
        import('leaflet/dist/leaflet.css');
    }, []);

    return null;
} 