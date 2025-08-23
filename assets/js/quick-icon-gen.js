// Quick icon generator for console
async function quickGenerateIcons() {
    const iconSizes = [32, 72, 96, 128, 144, 152, 192, 384, 512];
    
    for (const size of iconSizes) {
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
        const radius = size * 0.15;
        ctx.fillStyle = gradient;
        roundedRect(ctx, 0, 0, size, size, radius);
        ctx.fill();

        // Food bowl
        ctx.fillStyle = '#FFE4B5';
        ctx.beginPath();
        ctx.arc(size * 0.5, size * 0.35, size * 0.15, 0, 2 * Math.PI);
        ctx.fill();

        // Bowl content
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(size * 0.5, size * 0.35, size * 0.12, size * 0.04, 0, 0, 2 * Math.PI);
        ctx.fill();

        // AI symbol
        ctx.fillStyle = '#4A90E2';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(size * 0.75, size * 0.25, size * 0.06, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(size * 0.72, size * 0.22, size * 0.015, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size * 0.78, size * 0.22, size * 0.015, 0, 2 * Math.PI);
        ctx.fill();

        // Text
        ctx.fillStyle = 'white';
        ctx.font = `bold ${size * 0.06}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('Food Ninja', size * 0.5, size * 0.85);

        // Download
        canvas.toBlob(blob => {
            const link = document.createElement('a');
            link.download = `icon-${size}x${size}.png`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        }, 'image/png');
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('✅ All icons generated!');
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

// Export to global
window.quickGenerateIcons = quickGenerateIcons;
