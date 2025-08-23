// Emergency Cache Clear Script
console.log('🚨 Emergency Cache Clear Starting...');

async function emergencyClearAll() {
    try {
        // 1. Unregister all service workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
                await registration.unregister();
                console.log('✅ Service Worker unregistered');
            }
        }

        // 2. Clear all caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => {
                    console.log('🗑️ Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
            console.log('✅ All caches cleared');
        }

        // 3. Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();
        console.log('✅ Storage cleared');

        // 4. Clear IndexedDB (if any)
        if ('indexedDB' in window) {
            // This would need specific implementation based on your DB names
        }

        console.log('🎉 Emergency clear complete! Reloading in 2 seconds...');
        
        // 5. Hard reload
        setTimeout(() => {
            window.location.href = window.location.href + '?cachebust=' + Date.now();
        }, 2000);
        
    } catch (error) {
        console.error('❌ Emergency clear failed:', error);
    }
}

// Auto-run
emergencyClearAll();
