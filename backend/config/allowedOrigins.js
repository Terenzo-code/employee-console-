const allowedOrigins = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'https://localhost:3500',
    // React frontend (Vite dev server)
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    // Common CRA / alt dev ports, kept for convenience
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

module.exports = allowedOrigins;
