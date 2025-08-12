// Configuration for Food Ninja App
// This file handles API endpoints based on environment

// Check if we're in development or production
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// API Configuration
const API_CONFIG = {
    // Development - local Flask server
    development: {
        BASE_URL: 'http://localhost:5000',
        endpoints: {
            predict: '/predict',
            ask_ai: '/ask_ai',
            health: '/'
        }
    },
    
    // Production - Render backend (UPDATE THIS URL AFTER DEPLOY)
    production: {
        BASE_URL: 'https://foodninja-backend.onrender.com',
        endpoints: {
            predict: '/predict',
            ask_ai: '/ask_ai', 
            health: '/'
        }
    }
};

// Export current configuration
const currentConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

// Global API base URL (backwards compatibility)
window.API_BASE = currentConfig.BASE_URL;
window.API_BASE_URL = currentConfig.BASE_URL;
window.API_ENDPOINTS = currentConfig.endpoints;

// Helper function to get full API URL
window.getApiUrl = function(endpoint) {
    return currentConfig.BASE_URL + currentConfig.endpoints[endpoint];
};

// Debug info
console.log('[Config] Environment:', isDevelopment ? 'Development' : 'Production');
console.log('[Config] API Base URL:', window.API_BASE_URL);
console.log('[Config] Available endpoints:', Object.keys(currentConfig.endpoints));
