// PWA Debug & Icon Generator
class PWADebugger {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.requiredSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    }

    // Generate all required icon sizes
    async generateAllIcons() {
        console.log('🎨 Generating PWA icons...');
        
        // Create base SVG
        const svgContent = this.createBaseSVG(512);
        
        for (const size of this.requiredSizes) {
            await this.generateIcon(svgContent, size);
        }
        
        console.log('✅ All icons generated successfully!');
    }

    // Create base SVG content
    createBaseSVG(size) {
        const scale = size / 144; // Base design is 144px
        const fontSize = Math.max(8, 14 * scale);
        const strokeWidth = Math.max(1, 3 * scale);
        
        return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bg${size}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#FF6B35"/>
                    <stop offset="50%" style="stop-color:#F7931E"/>
                    <stop offset="100%" style="stop-color:#FFD700"/>
                </linearGradient>
            </defs>
            
            <!-- Background -->
            <rect width="${size}" height="${size}" rx="${32 * scale}" fill="url(#bg${size})"/>
            
            <!-- Food Bowl -->
            <circle cx="${72 * scale}" cy="${56 * scale}" r="${30 * scale}" fill="#FFE4B5" stroke="#FF6B35" stroke-width="${strokeWidth}"/>
            <ellipse cx="${72 * scale}" cy="${56 * scale}" rx="${24 * scale}" ry="${9 * scale}" fill="#FFD700"/>
            
            <!-- Fork -->
            <g transform="translate(${50 * scale}, ${88 * scale})">
                <rect x="0" y="0" width="${3 * scale}" height="${24 * scale}" fill="#C0C0C0"/>
                <rect x="${-2 * scale}" y="${-4 * scale}" width="${2 * scale}" height="${8 * scale}" fill="#C0C0C0"/>
                <rect x="${2 * scale}" y="${-4 * scale}" width="${2 * scale}" height="${8 * scale}" fill="#C0C0C0"/>
                <rect x="${5 * scale}" y="${-4 * scale}" width="${2 * scale}" height="${8 * scale}" fill="#C0C0C0"/>
            </g>
            
            <!-- Spoon -->
            <g transform="translate(${92 * scale}, ${88 * scale})">
                <rect x="0" y="0" width="${3 * scale}" height="${24 * scale}" fill="#C0C0C0"/>
                <ellipse cx="${1.5 * scale}" cy="${-4 * scale}" rx="${4 * scale}" ry="${6 * scale}" fill="#C0C0C0"/>
            </g>
            
            <!-- AI Symbol -->
            <circle cx="${108 * scale}" cy="${36 * scale}" r="${10 * scale}" fill="#4A90E2" opacity="0.9"/>
            <circle cx="${103 * scale}" cy="${31 * scale}" r="${2 * scale}" fill="white"/>
            <circle cx="${113 * scale}" cy="${31 * scale}" r="${2 * scale}" fill="white"/>
            <path d="M ${96 * scale} ${42 * scale} Q ${108 * scale} ${48 * scale} ${120 * scale} ${42 * scale}" stroke="white" stroke-width="${2 * scale}" fill="none"/>
            
            ${size >= 144 ? `<text x="${72 * scale}" y="${130 * scale}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="white">Food Ninja</text>` : ''}
        </svg>`;
    }

    // Generate individual icon
    async generateIcon(svgContent, size) {
        return new Promise((resolve) => {
            const img = new Image();
            const svgBlob = new Blob([svgContent], {type: 'image/svg+xml'});
            const svgUrl = URL.createObjectURL(svgBlob);
            
            img.onload = () => {
                this.canvas.width = size;
                this.canvas.height = size;
                this.ctx.clearRect(0, 0, size, size);
                this.ctx.drawImage(img, 0, 0, size, size);
                
                this.canvas.toBlob((blob) => {
                    const link = document.createElement('a');
                    link.download = `icon-${size}x${size}.png`;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    
                    URL.revokeObjectURL(svgUrl);
                    URL.revokeObjectURL(link.href);
                    
                    console.log(`✅ Generated: icon-${size}x${size}.png`);
                    resolve();
                }, 'image/png', 1.0);
            };
            
            img.src = svgUrl;
        });
    }

    // Generate SVG files directly
    async generateSVGIcons() {
        console.log('🎨 Generating SVG icons...');
        
        for (const size of this.requiredSizes) {
            const svgContent = this.createBaseSVG(size);
            const blob = new Blob([svgContent], {type: 'image/svg+xml'});
            const link = document.createElement('a');
            link.download = `icon-${size}x${size}.svg`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
            console.log(`✅ Generated: icon-${size}x${size}.svg`);
        }
        
        console.log('✅ All SVG icons generated successfully!');
    }

    // Check PWA status
    checkPWAStatus() {
        console.log('🔍 PWA Status Check:');
        
        // Check Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration) {
                    console.log('✅ Service Worker: Registered');
                    console.log('📄 SW Scope:', registration.scope);
                    console.log('🔄 SW State:', registration.active?.state);
                } else {
                    console.log('❌ Service Worker: Not registered');
                }
            });
        } else {
            console.log('❌ Service Worker: Not supported');
        }

        // Check Manifest
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink) {
            console.log('✅ Manifest: Found');
            console.log('📄 Manifest URL:', manifestLink.href);
        } else {
            console.log('❌ Manifest: Not found');
        }

        // Check Install Prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('✅ Install Prompt: Available');
        });

        // Check if already installed
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✅ PWA: Already installed');
        } else {
            console.log('⏳ PWA: Not installed');
        }
    }

    // Test icon loading
    testIconLoading() {
        console.log('🖼️ Testing icon loading...');
        
        this.requiredSizes.forEach(size => {
            const img = new Image();
            img.onload = () => console.log(`✅ Icon ${size}x${size}: Loaded`);
            img.onerror = (error) => {
                console.log(`❌ Icon ${size}x${size}: Failed`);
                console.log(`🔍 Trying absolute path...`);
                
                // Try with absolute path
                const img2 = new Image();
                img2.onload = () => console.log(`✅ Icon ${size}x${size}: Loaded (absolute path)`);
                img2.onerror = () => console.log(`❌ Icon ${size}x${size}: Failed (both paths)`);
                img2.src = `/Nutrition_food/assets/icons/icon-${size}x${size}.svg`;
            };
            img.src = `assets/icons/icon-${size}x${size}.svg`;
        });
    }

    // Fix common PWA issues
    async fixPWAIssues() {
        console.log('🔧 Running PWA fixes...');
        
        // Force SW update
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                await registration.update();
                console.log('✅ Service Worker updated');
            }
        }
        
        // Clear caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('✅ Caches cleared');
        }
        
        // Test icons again
        console.log('🔄 Testing icons after cache clear...');
        this.testIconLoading();
        
        // Reload page
        console.log('🔄 Reloading page in 2 seconds...');
        setTimeout(() => window.location.reload(), 2000);
    }
}

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.pwaDebugger = new PWADebugger();
    
    console.log(`
🚀 PWA Debugger Loaded!

Commands available:
- pwaDebugger.generateAllIcons()  // Generate all required PNG icons (for conversion)
- pwaDebugger.generateSVGIcons()  // Generate all required SVG icons
- pwaDebugger.checkPWAStatus()    // Check PWA installation status  
- pwaDebugger.testIconLoading()   // Test if SVG icons load correctly
- pwaDebugger.fixPWAIssues()      // Fix common PWA issues

Quick fix: pwaDebugger.testIconLoading()
    `);
    
    // Auto-check status
    setTimeout(() => {
        window.pwaDebugger.checkPWAStatus();
        window.pwaDebugger.testIconLoading();
    }, 500);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWADebugger;
}
