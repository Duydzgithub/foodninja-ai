/* ========================================
   Food Ninja - PWA Setup & Installation
   ======================================== */

class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isStandalone = false;
        this.installButton = null;
        
        this.init();
    }
    
    init() {
        this.checkInstallStatus();
        this.setupEventListeners();
        this.setupInstallButton();
        this.registerServiceWorker();
    }
    
    /* ========================================
       Installation Status Check
       ======================================== */
    
    checkInstallStatus() {
        // Check if app is installed
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone === true ||
                           document.referrer.includes('android-app://');
        
        // Check if PWA is installable
        this.isInstallable = 'serviceWorker' in navigator && 
                            'PushManager' in window &&
                            'Notification' in window;
        
        console.log('📱 PWA Status:', {
            installed: this.isStandalone,
            installable: this.isInstallable
        });
        
        if (this.isStandalone) {
            this.handlePostInstall();
        }
    }
    
    /* ========================================
       Event Listeners Setup
       ======================================== */
    
    setupEventListeners() {
        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('💾 Install prompt available');
            e.preventDefault(); // Prevent default mini-infobar from appearing
            this.deferredPrompt = e;
            this.showInstallOption();
            
            // Custom install prompt will be shown via button/banner
            console.log('🎯 Custom install prompt ready - user can click install button');
        });
        
        // Listen for app installed
        window.addEventListener('appinstalled', (e) => {
            console.log('✅ PWA installed successfully');
            this.handlePostInstall();
            this.hideInstallOption();
            this.deferredPrompt = null;
        });
        
        // Listen for standalone mode changes
        window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
            this.isStandalone = e.matches;
            if (this.isStandalone) {
                this.handlePostInstall();
            }
        });
        
        // Handle install shortcut actions
        this.handleShortcutActions();
    }
    
    /* ========================================
       Install Button Setup
       ======================================== */
    
    setupInstallButton() {
        // Create install button if not exists
        if (!document.getElementById('pwa-install-btn')) {
            this.createInstallButton();
        }
        
        this.installButton = document.getElementById('pwa-install-btn');
        
        if (this.installButton) {
            this.installButton.addEventListener('click', () => {
                this.promptInstall();
            });
        }
        
        // Hide install button if already installed
        if (this.isStandalone) {
            this.hideInstallOption();
        }
    }
    
    createInstallButton() {
        const button = document.createElement('button');
        button.id = 'pwa-install-btn';
        button.className = 'btn btn-primary install-btn';
        button.innerHTML = `
            <i class="fas fa-download me-2"></i>
            Cài đặt ứng dụng
        `;
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            border-radius: 25px;
            padding: 12px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            background: linear-gradient(135deg, #FF6B35, #F7931E);
            border: none;
            color: white;
            font-weight: 600;
            display: none;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(button);
    }
    
    /* ========================================
       Installation Functions
       ======================================== */
    
    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('⚠️ No deferred install prompt available');
            this.showManualInstallInstructions();
            return;
        }
        
        try {
            console.log('🚀 Showing PWA install prompt...');
            
            // Show install prompt
            this.deferredPrompt.prompt();
            
            // Wait for user choice
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`👤 User choice: ${outcome}`);
            
            if (outcome === 'accepted') {
                console.log('✅ User accepted install');
                this.showSuccessMessage();
            } else {
                console.log('❌ User dismissed install');
                this.showInstallLaterMessage();
            }
            
            this.deferredPrompt = null;
            
        } catch (error) {
            console.error('❌ Install prompt error:', error);
            this.showManualInstallInstructions();
        }
    }
    
    showInstallOption() {
        if (this.installButton && !this.isStandalone) {
            this.installButton.style.display = 'block';
            
            // Show install banner after delay
            setTimeout(() => {
                this.showInstallBanner();
            }, 5000);
        }
    }
    
    hideInstallOption() {
        if (this.installButton) {
            this.installButton.style.display = 'none';
        }
        this.hideInstallBanner();
    }
    
    /* ========================================
       Install Banner
       ======================================== */
    
    showInstallBanner() {
        // Check if banner was already dismissed
        if (localStorage.getItem('installBannerDismissed') === 'true') {
            return;
        }
        
        const banner = document.createElement('div');
        banner.id = 'install-banner';
        banner.className = 'install-banner';
        banner.innerHTML = `
            <div class="install-banner-content">
                <div class="install-banner-icon">
                    <i class="fas fa-mobile-alt"></i>
                </div>
                <div class="install-banner-text">
                    <h6>Cài đặt Food Ninja</h6>
                    <p>Trải nghiệm tốt hơn với ứng dụng</p>
                </div>
                <div class="install-banner-actions">
                    <button class="btn btn-sm btn-primary" onclick="pwaInstaller.promptInstall()">
                        Cài đặt
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="pwaInstaller.dismissInstallBanner()">
                        Để sau
                    </button>
                </div>
            </div>
        `;
        
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 12px;
            z-index: 1001;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            animation: slideInDown 0.3s ease;
        `;
        
        document.body.appendChild(banner);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.hideInstallBanner();
        }, 10000);
    }
    
    hideInstallBanner() {
        const banner = document.getElementById('install-banner');
        if (banner) {
            banner.remove();
        }
    }
    
    dismissInstallBanner() {
        localStorage.setItem('installBannerDismissed', 'true');
        this.hideInstallBanner();
    }
    
    /* ========================================
       Manual Install Instructions
       ======================================== */
    
    showManualInstallInstructions() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Cài đặt Food Ninja</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="install-instructions">
                            <div class="browser-instructions">
                                <h6><i class="fab fa-chrome"></i> Chrome/Edge:</h6>
                                <ol>
                                    <li>Nhấp vào menu <i class="fas fa-ellipsis-v"></i></li>
                                    <li>Chọn "Cài đặt Food Ninja"</li>
                                    <li>Nhấp "Cài đặt"</li>
                                </ol>
                            </div>
                            <div class="browser-instructions">
                                <h6><i class="fab fa-safari"></i> Safari (iOS):</h6>
                                <ol>
                                    <li>Nhấp vào nút Chia sẻ <i class="fas fa-share"></i></li>
                                    <li>Chọn "Thêm vào Màn hình chính"</li>
                                    <li>Nhấp "Thêm"</li>
                                </ol>
                            </div>
                            <div class="browser-instructions">
                                <h6><i class="fab fa-firefox"></i> Firefox:</h6>
                                <ol>
                                    <li>Nhấp vào menu <i class="fas fa-bars"></i></li>
                                    <li>Chọn "Cài đặt"</li>
                                    <li>Nhấp "Thêm vào màn hình chính"</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }
    
    /* ========================================
       Service Worker Registration
       ======================================== */
    
    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('⚠️ Service Worker not supported');
            return;
        }
        
        try {
            const registration = await navigator.serviceWorker.register('./service-worker.js', {
                scope: './'
            });
            
            console.log('✅ Service Worker registered:', registration.scope);
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
                console.log('🔄 Service Worker update found');
                this.handleServiceWorkerUpdate(registration);
            });
            
            // Check for updates
            if (registration.waiting) {
                this.showUpdateAvailable();
            }
            
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    }
    
    handleServiceWorkerUpdate(registration) {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                    this.showUpdateAvailable();
                }
            }
        });
    }
    
    showUpdateAvailable() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'update-banner';
        updateBanner.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>Có bản cập nhật mới</span>
                <button class="btn btn-sm btn-light" onclick="pwaInstaller.updateApp()">
                    Cập nhật
                </button>
            </div>
        `;
        
        updateBanner.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            right: 20px;
            background: #17a2b8;
            color: white;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            z-index: 1000;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(updateBanner);
    }
    
    async updateApp() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        }
    }
    
    /* ========================================
       Post-Install Handling
       ======================================== */
    
    handlePostInstall() {
        // Hide install UI
        this.hideInstallOption();
        
        // Show welcome message
        this.showWelcomeMessage();
        
        // Setup standalone features
        this.setupStandaloneFeatures();
        
        // Track installation
        this.trackInstallation();
    }
    
    showWelcomeMessage() {
        if (window.Utils && window.Utils.NotificationManager) {
            const notificationManager = new window.Utils.NotificationManager();
            notificationManager.show('Chào mừng đến với Food Ninja! 🎉', 'success');
        }
    }
    
    setupStandaloneFeatures() {
        // Add standalone-specific styles
        document.body.classList.add('standalone');
        
        // Setup navigation handling
        this.setupStandaloneNavigation();
        
        // Setup share API
        this.setupNativeSharing();
    }
    
    setupStandaloneNavigation() {
        // Handle back button for standalone
        window.addEventListener('popstate', (e) => {
            // Custom back button handling
            console.log('📱 Standalone navigation:', e.state);
        });
    }
    
    setupNativeSharing() {
        // Enable native sharing if available
        if (navigator.share) {
            console.log('📤 Native sharing available');
            
            // Add share buttons
            document.querySelectorAll('[data-share]').forEach(btn => {
                btn.style.display = 'block';
            });
        }
    }
    
    /* ========================================
       Shortcut Actions
       ======================================== */
    
    handleShortcutActions() {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        
        if (action) {
            console.log('🔗 Shortcut action:', action);
            
            switch (action) {
                case 'camera':
                    this.navigateToCamera();
                    break;
                case 'chat':
                    this.navigateToChat();
                    break;
                case 'history':
                    this.navigateToHistory();
                    break;
            }
        }
    }
    
    navigateToCamera() {
        if (window.FoodNinjaApp) {
            window.FoodNinjaApp.navigateTo('camera');
        }
    }
    
    navigateToChat() {
        if (window.FoodNinjaApp) {
            window.FoodNinjaApp.navigateTo('chat');
        }
    }
    
    navigateToHistory() {
        if (window.FoodNinjaApp) {
            window.FoodNinjaApp.navigateTo('history');
        }
    }
    
    /* ========================================
       Utility Functions
       ======================================== */
    
    showSuccessMessage() {
        console.log('🎉 Installation successful!');
    }
    
    showInstallLaterMessage() {
        console.log('⏰ Install prompt dismissed');
    }
    
    trackInstallation() {
        // Track installation for analytics
        console.log('📊 PWA installation tracked');
        
        // Store installation date
        localStorage.setItem('pwaInstallDate', new Date().toISOString());
    }
    
    /* ========================================
       Public API
       ======================================== */
    
    isAppInstalled() {
        return this.isStandalone;
    }
    
    canInstall() {
        return this.deferredPrompt !== null;
    }
    
    forceShowInstallPrompt() {
        this.showInstallOption();
        this.showInstallBanner();
    }
}

/* ========================================
   Initialize PWA Installer
   ======================================== */

const pwaInstaller = new PWAInstaller();

// Export for global access
window.PWAInstaller = pwaInstaller;

console.log('📱 PWA Installer initialized successfully!');
