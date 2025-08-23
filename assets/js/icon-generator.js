/* ========================================
   PWA Icon Generator
   ======================================== */

// Generate PWA icons from SVG
function generatePWAIcons() {
    const iconSizes = [
        { size: 72, name: 'icon-72x72.png' },
        { size: 96, name: 'icon-96x96.png' },
        { size: 128, name: 'icon-128x128.png' },
        { size: 144, name: 'icon-144x144.png' },
        { size: 152, name: 'icon-152x152.png' },
        { size: 192, name: 'icon-192x192.png' },
        { size: 384, name: 'icon-384x384.png' },
        { size: 512, name: 'icon-512x512.png' }
    ];

    // Load SVG
    fetch('./assets/icons/icon-base.svg')
        .then(response => response.text())
        .then(svgData => {
            iconSizes.forEach(({ size, name }) => {
                generateIcon(svgData, size, name);
            });
        })
        .catch(error => {
            console.error('Error loading SVG:', error);
            // Fallback to placeholder icons
            generatePlaceholderIcons();
        });
}

function generateIcon(svgData, size, filename) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function() {
        ctx.drawImage(img, 0, 0, size, size);
        
        canvas.toBlob(blob => {
            const link = document.createElement('a');
            link.download = filename;
            link.href = URL.createObjectURL(blob);
            link.click();
            
            URL.revokeObjectURL(link.href);
            URL.revokeObjectURL(url);
        }, 'image/png');
    };

    img.src = url;
}

function generatePlaceholderIcons() {
    const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    
    iconSizes.forEach(size => {
        generatePlaceholderIcon(size);
    });
}

function generatePlaceholderIcon(size) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#FF6B35');
    gradient.addColorStop(0.5, '#F7931E');
    gradient.addColorStop(1, '#FFD700');
    
    // Rounded rectangle
    const radius = size * 0.2;
    ctx.fillStyle = gradient;
    roundedRect(ctx, 0, 0, size, size, radius);
    ctx.fill();

    // Food symbol
    ctx.fillStyle = '#FFE4B5';
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.4, size * 0.2, 0, 2 * Math.PI);
    ctx.fill();

    // Text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.1}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Food', size / 2, size * 0.8);
    ctx.fillText('Ninja', size / 2, size * 0.9);

    // Download
    canvas.toBlob(blob => {
        const link = document.createElement('a');
        link.download = `icon-${size}x${size}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    }, 'image/png');
}

function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Auto-generate on load (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🎨 PWA Icon generator loaded. Call generatePWAIcons() to create icons.');
}

// Export for manual use
window.generatePWAIcons = generatePWAIcons;
