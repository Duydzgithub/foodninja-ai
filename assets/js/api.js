/* ========================================
   Food Ninja - API Communication
   ======================================== */

class FoodNinjaAPI {
    constructor() {
        this.baseURL = this.getBaseURL();
        this.timeout = 30000; // 30 seconds
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
    }
    
    getBaseURL() {
        // Auto-detect base URL based on environment
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://127.0.0.1:5000';
        }
        // For production, use same origin
        return window.location.origin;
    }
    
    /* ========================================
       Generic Request Method
       ======================================== */
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: this.timeout
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        // Remove Content-Type for FormData
        if (finalOptions.body instanceof FormData) {
            delete finalOptions.headers['Content-Type'];
        }
        
        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                console.log(`🌐 API Request (attempt ${attempt}): ${endpoint}`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                
                const response = await fetch(url, {
                    ...finalOptions,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log(`✅ API Success: ${endpoint}`, data);
                
                return {
                    success: true,
                    data: data,
                    status: response.status
                };
                
            } catch (error) {
                console.error(`❌ API Error (attempt ${attempt}): ${endpoint}`, error);
                lastError = error;
                
                // Don't retry on certain errors
                if (error.name === 'AbortError' || 
                    error.message.includes('400') || 
                    error.message.includes('401') || 
                    error.message.includes('403')) {
                    break;
                }
                
                // Wait before retry
                if (attempt < this.retryAttempts) {
                    await this.delay(this.retryDelay * attempt);
                }
            }
        }
        
        return {
            success: false,
            error: lastError.message || 'Network error',
            status: 0
        };
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /* ========================================
       Health Check
       ======================================== */
    
    async healthCheck() {
        try {
            const result = await this.request('/', {
                method: 'GET'
            });
            
            if (result.success) {
                return {
                    success: true,
                    status: 'healthy',
                    service: result.data.service || 'Food Ninja API',
                    endpoints: result.data.endpoints || []
                };
            }
            
            return {
                success: false,
                status: 'unhealthy',
                error: result.error
            };
            
        } catch (error) {
            return {
                success: false,
                status: 'error',
                error: error.message
            };
        }
    }
    
    /* ========================================
       Food Recognition
       ======================================== */
    
    async analyzeFood(imageFile, options = {}) {
        try {
            // Validate image file
            if (!imageFile) {
                throw new Error('No image file provided');
            }
            
            // Check file size (10MB limit)
            const maxSize = 10 * 1024 * 1024;
            if (imageFile.size > maxSize) {
                throw new Error('File too large. Maximum size is 10MB.');
            }
            
            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
            if (!allowedTypes.includes(imageFile.type)) {
                throw new Error('Invalid file type. Please upload JPG, PNG, GIF, WEBP, or BMP files only.');
            }
            
            const formData = new FormData();
            formData.append('image', imageFile);
            
            const result = await this.request('/predict', {
                method: 'POST',
                body: formData
            });
            
            // Request method wraps response in {success, data}, extract the actual data
            if (result.success) {
                const data = result.data;
                
                // Check if backend returned an error
                if (data.error) {
                    return {
                        success: false,
                        error: data.error
                    };
                }
                
                return {
                    success: true,
                    foodName: data.food_name,
                    confidence: data.probability,
                    nutrition: data.nutrition,
                    aiAdvice: data.ai_answer,
                    lowConfidence: data.low_confidence || false,
                    alternatives: data.alternatives || [],
                    minConfidence: data.min_confidence || 0.4,
                    message: data.message
                };
            }
            
            return {
                success: false,
                error: result.error || 'Failed to analyze food'
            };
            
        } catch (error) {
            console.error('Food analysis error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /* ========================================
       AI Chat
       ======================================== */
    
    async sendChatMessage(message) {
        try {
            if (!message || message.trim().length === 0) {
                throw new Error('Message cannot be empty');
            }
            
            const result = await this.request('/chat', {
                method: 'POST',
                body: JSON.stringify({
                    message: message.trim()
                })
            });
            
            if (result.success) {
                const data = result.data;
                
                // Check if backend returned an error
                if (data.error) {
                    return {
                        success: false,
                        error: data.error
                    };
                }
                
                return {
                    success: true,
                    response: data.response,
                    timestamp: new Date().toISOString()
                };
            }
            
            return {
                success: false,
                error: result.error || 'Failed to get AI response'
            };
            
        } catch (error) {
            console.error('Chat error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /* ========================================
       Ask AI (General questions)
       ======================================== */
    
    async askAI(prompt) {
        try {
            if (!prompt || prompt.trim().length === 0) {
                throw new Error('Prompt cannot be empty');
            }
            
            const result = await this.request('/ask_ai', {
                method: 'POST',
                body: JSON.stringify({
                    prompt: prompt.trim()
                })
            });
            
            if (result.success) {
                return {
                    success: true,
                    result: result.data.result,
                    timestamp: new Date().toISOString()
                };
            }
            
            return {
                success: false,
                error: result.error || 'Failed to get AI response'
            };
            
        } catch (error) {
            console.error('Ask AI error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /* ========================================
       Batch Operations
       ======================================== */
    
    async analyzeFoodBatch(imageFiles) {
        const results = [];
        
        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            try {
                const result = await this.analyzeFood(file);
                results.push({
                    file: file.name,
                    index: i,
                    ...result
                });
            } catch (error) {
                results.push({
                    file: file.name,
                    index: i,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }
    
    /* ========================================
       Error Handling and Retry Logic
       ======================================== */
    
    isRetryableError(error) {
        // Network errors, timeouts, and 5xx server errors are retryable
        return error.name === 'TypeError' || 
               error.name === 'AbortError' ||
               error.message.includes('500') ||
               error.message.includes('502') ||
               error.message.includes('503') ||
               error.message.includes('504');
    }
    
    handleAPIError(error, context = '') {
        console.error(`API Error ${context}:`, error);
        
        const errorMessages = {
            'Network error': 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.',
            'Timeout': 'Yêu cầu bị timeout. Vui lòng thử lại.',
            'HTTP 400': 'Dữ liệu gửi lên không hợp lệ.',
            'HTTP 401': 'Không có quyền truy cập.',
            'HTTP 403': 'Truy cập bị từ chối.',
            'HTTP 404': 'Không tìm thấy endpoint.',
            'HTTP 413': 'File quá lớn.',
            'HTTP 429': 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
            'HTTP 500': 'Lỗi server. Vui lòng thử lại sau.',
            'HTTP 502': 'Lỗi gateway. Vui lòng thử lại sau.',
            'HTTP 503': 'Dịch vụ tạm thời không khả dụng.',
            'HTTP 504': 'Gateway timeout.'
        };
        
        for (const [key, message] of Object.entries(errorMessages)) {
            if (error.includes(key)) {
                return message;
            }
        }
        
        return 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
    }
    
    /* ========================================
       Connection Monitoring
       ======================================== */
    
    async checkConnection() {
        try {
            const result = await this.healthCheck();
            return result.success;
        } catch (error) {
            return false;
        }
    }
    
    startConnectionMonitor(callback, interval = 30000) {
        return setInterval(async () => {
            const isConnected = await this.checkConnection();
            callback(isConnected);
        }, interval);
    }
    
    stopConnectionMonitor(monitorId) {
        clearInterval(monitorId);
    }
    
    /* ========================================
       Performance Monitoring
       ======================================== */
    
    logPerformance(endpoint, startTime) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`📊 API Performance - ${endpoint}: ${duration.toFixed(2)}ms`);
        
        // Log slow requests
        if (duration > 5000) {
            console.warn(`⚠️ Slow API request: ${endpoint} took ${duration.toFixed(2)}ms`);
        }
    }
    
    /* ========================================
       Caching (Simple implementation)
       ======================================== */
    
    cache = new Map();
    cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    getCacheKey(endpoint, params = {}) {
        return `${endpoint}_${JSON.stringify(params)}`;
    }
    
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    
    getCache(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            console.log(`📦 Cache hit: ${key}`);
            return cached.data;
        }
        return null;
    }
    
    clearCache() {
        this.cache.clear();
    }
    
    /* ========================================
       Request Queue (for rate limiting)
       ======================================== */
    
    requestQueue = [];
    isProcessingQueue = false;
    maxConcurrentRequests = 3;
    activeRequests = 0;
    
    async queueRequest(requestFn) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ requestFn, resolve, reject });
            this.processQueue();
        });
    }
    
    async processQueue() {
        if (this.isProcessingQueue || this.activeRequests >= this.maxConcurrentRequests) {
            return;
        }
        
        this.isProcessingQueue = true;
        
        while (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
            const { requestFn, resolve, reject } = this.requestQueue.shift();
            this.activeRequests++;
            
            try {
                const result = await requestFn();
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                this.activeRequests--;
            }
        }
        
        this.isProcessingQueue = false;
    }
}

/* ========================================
   Export API instance
   ======================================== */

const api = new FoodNinjaAPI();

// Global functions for easy access
window.FoodNinjaAPI = {
    api,
    analyzeFood: (imageFile, options) => api.analyzeFood(imageFile, options),
    sendChatMessage: (message) => api.sendChatMessage(message),
    askAI: (prompt) => api.askAI(prompt),
    healthCheck: () => api.healthCheck(),
    checkConnection: () => api.checkConnection()
};

console.log('🌐 Food Ninja API module loaded successfully!');
