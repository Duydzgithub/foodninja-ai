/* ========================================
   Food Ninja - Utility Functions
   ======================================== */

/* ========================================
   Local Storage Management
   ======================================== */

class LocalStorageManager {
    constructor() {
        this.prefix = 'food_ninja_';
    }
    
    set(key, value) {
        try {
            const prefixedKey = this.prefix + key;
            localStorage.setItem(prefixedKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }
    
    get(key, defaultValue = null) {
        try {
            const prefixedKey = this.prefix + key;
            const item = localStorage.getItem(prefixedKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }
    
    remove(key) {
        try {
            const prefixedKey = this.prefix + key;
            localStorage.removeItem(prefixedKey);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
    
    clear() {
        try {
            const keys = Object.keys(localStorage).filter(key => 
                key.startsWith(this.prefix)
            );
            keys.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
    
    getAll() {
        try {
            const data = {};
            const keys = Object.keys(localStorage).filter(key => 
                key.startsWith(this.prefix)
            );
            
            keys.forEach(key => {
                const cleanKey = key.replace(this.prefix, '');
                data[cleanKey] = this.get(cleanKey);
            });
            
            return data;
        } catch (error) {
            console.error('Error getting all data:', error);
            return {};
        }
    }
}

const storage = new LocalStorageManager();

/* ========================================
   Theme Management
   ======================================== */

class ThemeManager {
    constructor() {
        this.currentTheme = storage.get('theme', 'light');
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.updateThemeIcon();
    }
    
    toggleTheme() {
        const themes = ['light', 'dark'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.setTheme(themes[nextIndex]);
    }
    
    setTheme(theme) {
        if (['light', 'dark', 'auto'].includes(theme)) {
            this.currentTheme = theme;
            this.applyTheme(theme);
            this.updateThemeIcon();
            storage.set('theme', theme);
            
            // Dispatch theme change event
            window.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme } 
            }));
        }
    }
    
    applyTheme(theme) {
        document.body.classList.add('theme-changing');
        document.body.setAttribute('data-theme', theme);
        
        // Remove the changing class after transition
        setTimeout(() => {
            document.body.classList.remove('theme-changing');
        }, 300);
    }
    
    updateThemeIcon() {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            const icons = {
                light: 'fas fa-moon',
                dark: 'fas fa-sun',
                auto: 'fas fa-adjust'
            };
            themeIcon.className = icons[this.currentTheme] || icons.light;
        }
    }
    
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}

const themeManager = new ThemeManager();

/* ========================================
   Notification System
   ======================================== */

class NotificationManager {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        // Create notification container if it doesn't exist
        this.container = document.querySelector('.toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(this.container);
        }
    }
    
    show(message, type = 'info', duration = 5000) {
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        
        // Initialize Bootstrap toast
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: duration
        });
        
        bsToast.show();
        
        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
        
        return toast;
    }
    
    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'alert');
        
        const icons = {
            success: 'fas fa-check-circle text-success',
            error: 'fas fa-exclamation-triangle text-danger',
            warning: 'fas fa-exclamation-circle text-warning',
            info: 'fas fa-info-circle text-info'
        };
        
        const titles = {
            success: 'Thành công',
            error: 'Lỗi',
            warning: 'Cảnh báo',
            info: 'Thông báo'
        };
        
        toast.innerHTML = `
            <div class="toast-header">
                <i class="${icons[type] || icons.info} me-2"></i>
                <strong class="me-auto">${titles[type] || titles.info}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        return toast;
    }
    
    success(message, duration) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }
    
    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

const notifications = new NotificationManager();

/* ========================================
   Loading Manager
   ======================================== */

class LoadingManager {
    constructor() {
        this.loadingCount = 0;
        this.loadingScreen = document.getElementById('loadingScreen');
    }
    
    show(message = 'Đang tải...') {
        this.loadingCount++;
        
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
            const loadingText = this.loadingScreen.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = message;
            }
        }
    }
    
    hide() {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        
        if (this.loadingCount === 0 && this.loadingScreen) {
            // Immediate hide without delay to prevent flash
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                this.loadingScreen.style.opacity = '1';
            }, 200);
        }
    }
    
    setProgress(percent, message) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        
        if (progressText && message) {
            progressText.textContent = message;
        }
    }
}

const loading = new LoadingManager();

/* ========================================
   Form Validation
   ======================================== */

class FormValidator {
    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    static validatePhone(phone) {
        const regex = /^[+]?[\d\s\-\(\)]{10,}$/;
        return regex.test(phone);
    }
    
    static validateRequired(value) {
        return value && value.toString().trim().length > 0;
    }
    
    static validateMinLength(value, minLength) {
        return value && value.toString().length >= minLength;
    }
    
    static validateMaxLength(value, maxLength) {
        return value && value.toString().length <= maxLength;
    }
    
    static validateFileSize(file, maxSizeMB) {
        return file && file.size <= maxSizeMB * 1024 * 1024;
    }
    
    static validateFileType(file, allowedTypes) {
        return file && allowedTypes.includes(file.type);
    }
}

/* ========================================
   Image Processing
   ======================================== */

class ImageProcessor {
    static resizeImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                // Calculate new dimensions
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = height * (maxWidth / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = width * (maxHeight / height);
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }
    
    static createImagePreview(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            
            reader.onerror = function() {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    static validateImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 10; // MB
        
        if (!FormValidator.validateFileType(file, allowedTypes)) {
            throw new Error('Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG, GIF, WEBP.');
        }
        
        if (!FormValidator.validateFileSize(file, maxSize)) {
            throw new Error(`File quá lớn. Kích thước tối đa là ${maxSize}MB.`);
        }
        
        return true;
    }
}

/* ========================================
   Date and Time Utilities
   ======================================== */

class DateUtils {
    static formatDate(date, format = 'dd/mm/yyyy') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        const formats = {
            'dd/mm/yyyy': `${day}/${month}/${year}`,
            'yyyy-mm-dd': `${year}-${month}-${day}`,
            'dd/mm/yyyy hh:mm': `${day}/${month}/${year} ${hours}:${minutes}`,
            'relative': this.getRelativeTime(date)
        };
        
        return formats[format] || formats['dd/mm/yyyy'];
    }
    
    static getRelativeTime(date) {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        
        return this.formatDate(date, 'dd/mm/yyyy');
    }
    
    static isToday(date) {
        const today = new Date();
        const checkDate = new Date(date);
        
        return today.toDateString() === checkDate.toDateString();
    }
}

/* ========================================
   Array and Object Utilities
   ======================================== */

class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    static formatNumber(num, decimals = 0) {
        return num.toLocaleString('vi-VN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }
    
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    
    static isEmpty(value) {
        if (value == null) return true;
        if (typeof value === 'string') return value.trim().length === 0;
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    }
    
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    
    static truncateText(text, maxLength, suffix = '...') {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength - suffix.length) + suffix;
    }
}

/* ========================================
   Network and Connectivity
   ======================================== */

class NetworkManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.listeners = [];
        this.init();
    }
    
    init() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.notifyListeners('online');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.notifyListeners('offline');
        });
    }
    
    onStatusChange(callback) {
        this.listeners.push(callback);
    }
    
    notifyListeners(status) {
        this.listeners.forEach(callback => callback(status, this.isOnline));
    }
    
    checkConnection() {
        return fetch('/api/health', { 
            method: 'HEAD',
            cache: 'no-cache' 
        })
        .then(() => true)
        .catch(() => false);
    }
}

const network = new NetworkManager();

/* ========================================
   Performance Monitor
   ======================================== */

class PerformanceMonitor {
    static measureFunction(func, name) {
        return function(...args) {
            const start = performance.now();
            const result = func.apply(this, args);
            const end = performance.now();
            console.log(`${name} took ${end - start} milliseconds`);
            return result;
        };
    }
    
    static measurePromise(promise, name) {
        const start = performance.now();
        return promise.finally(() => {
            const end = performance.now();
            console.log(`${name} took ${end - start} milliseconds`);
        });
    }
    
    static getMemoryUsage() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }
}

/* ========================================
   Export for use in other modules
   ======================================== */

window.FoodNinjaUtils = {
    storage,
    themeManager,
    notifications,
    loading,
    FormValidator,
    ImageProcessor,
    DateUtils,
    Utils,
    network,
    PerformanceMonitor
};

// Global functions for easy access
window.toggleTheme = () => themeManager.toggleTheme();
window.showNotification = (message, type, duration) => notifications.show(message, type, duration);
window.showLoading = (message) => loading.show(message);
window.hideLoading = () => loading.hide();

console.log('🔧 Food Ninja Utilities loaded successfully!');
