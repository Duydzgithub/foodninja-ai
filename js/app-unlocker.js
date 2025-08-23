// Emergency App Unlocker
console.log('🚨 Emergency App Unlocker Running...');

function forceShowApp() {
    console.log('🔓 Force showing app...');
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        console.log('✅ Loading screen hidden');
    }
    
    // Show app container
    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.style.display = 'block';
        console.log('✅ App container shown');
    }
    
    // Check if components are loaded
    console.log('📋 Component status:');
    console.log('- Utils loaded:', typeof window.FoodNinjaUtils !== 'undefined');
    console.log('- API loaded:', typeof window.FoodNinjaAPI !== 'undefined');
    console.log('- Camera loaded:', typeof window.CameraManager !== 'undefined');
    console.log('- Chat loaded:', typeof window.ChatManager !== 'undefined');
    console.log('- App loaded:', typeof window.FoodNinjaApp !== 'undefined');
    
    // Try to initialize app if not done
    if (typeof window.FoodNinjaApp !== 'undefined' && !window.app) {
        console.log('🚀 Attempting to initialize app...');
        try {
            window.app = new FoodNinjaApp();
            console.log('✅ App instance created');
        } catch (error) {
            console.error('❌ App initialization failed:', error);
        }
    }
}

// Run immediately
forceShowApp();

// Also provide as global function
window.forceShowApp = forceShowApp;

console.log('💡 App should now be visible. If not, check console for errors.');
console.log('💡 You can also run: forceShowApp() manually');
