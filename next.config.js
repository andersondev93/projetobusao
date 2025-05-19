/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve(__dirname, 'src');
        return config;
    },
    // Configuração para tratar corretamente o CSS do Leaflet
    transpilePackages: ['leaflet', 'react-leaflet']
}

module.exports = nextConfig 