// FoodNinja - Modern Culinary Logic
// API base configuration now handled by config.js
// Wait for config.js to load, then use the configured API base
const API_BASE = (() => {
    // If config.js loaded and set API_BASE, use it
    if (window.API_BASE !== undefined) {
        return String(window.API_BASE);
    }
    
    // Fallback for backward compatibility
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        return 'http://127.0.0.1:5000';
    }
    
    // Production fallback - try relative paths
    return '';
})();

// Debug: xem frontend đang gọi API ở đâu
try { 
    console.log('[FoodNinja] API_BASE =', API_BASE || '(relative / same-origin)'); 
    console.log('[FoodNinja] Config loaded:', !!window.API_BASE);
} catch (e) {}
const imageInput = document.getElementById('imageInput');
const uploadBtn = document.getElementById('uploadBtn');
const cameraBtn = document.getElementById('cameraBtn');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const resultDiv = document.getElementById('result');
const imagePreview = document.getElementById('imagePreview');
const mediaWrapper = document.querySelector('.media-frame-wrapper');
let imageBlob = null;
// PWA install hooks and AI Assistant state
let deferredPrompt = null;
let fabMenuOpen = false;
let assistantOpen = false;
const installBanner = document.getElementById('installBanner');
const installBtn = document.getElementById('installBtn');
const installText = document.getElementById('installText');

// AI Assistant Functions
function openAssistant() {
    const assistant = document.getElementById('aiAssistant');
    if (assistant) {
        assistant.classList.add('open');
        assistantOpen = true;
        closeFabMenu();
    }
}

function closeAssistant() {
    const assistant = document.getElementById('aiAssistant');
    if (assistant) {
        assistant.classList.remove('open');
        assistantOpen = false;
    }
}

function toggleFabMenu() {
    const fabContainer = document.getElementById('fabContainer');
    const fabIcon = document.querySelector('.fab i');
    
    if (fabMenuOpen) {
        closeFabMenu();
    } else {
        openFabMenu();
    }
}

function openFabMenu() {
    const fabContainer = document.getElementById('fabContainer');
    const fabIcon = document.querySelector('.fab i');
    
    if (fabContainer) {
        fabContainer.classList.add('open');
        if (fabIcon) {
            fabIcon.className = 'fas fa-times';
        }
        fabMenuOpen = true;
    }
}

function closeFabMenu() {
    const fabContainer = document.getElementById('fabContainer');
    const fabIcon = document.querySelector('.fab i');
    
    if (fabContainer) {
        fabContainer.classList.remove('open');
        if (fabIcon) {
            fabIcon.className = 'fas fa-plus';
        }
        fabMenuOpen = false;
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage(aiResponse, 'ai');
    }, 1000);
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = message;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function quickQuestion(type) {
    const questions = {
        calories: 'Thực phẩm này có bao nhiêu calories?',
        protein: 'Hàm lượng protein trong thực phẩm này là bao nhiêu?',
        vitamins: 'Thực phẩm này chứa vitamin gì?',
        diet: 'Thực phẩm này có phù hợp với chế độ ăn kiêng không?'
    };
    
    const question = questions[type];
    if (question) {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.value = question;
            sendMessage();
        }
    }
}

function generateAIResponse(message) {
    // Simple AI response simulation (replace with actual AI integration)
    const responses = {
        default: "Tôi đang phân tích yêu cầu của bạn. Hãy gửi ảnh thực phẩm để tôi có thể đưa ra phân tích chính xác nhất!",
        calories: "Để tính toán chính xác calories, tôi cần phân tích ảnh thực phẩm. Hãy chụp ảnh hoặc tải lên một bức ảnh nhé!",
        protein: "Hàm lượng protein phụ thuộc vào loại thực phẩm và khối lượng. Gửi ảnh để tôi phân tích chi tiết!",
        vitamins: "Mỗi loại thực phẩm có thành phần vitamin khác nhau. Hãy cho tôi xem ảnh thực phẩm để phân tích cụ thể!",
        diet: "Tôi có thể tư vấn về tính phù hợp với chế độ ăn khi biết cụ thể thực phẩm nào. Gửi ảnh nhé!"
    };
    
    // Simple keyword matching
    for (const [key, response] of Object.entries(responses)) {
        if (key !== 'default' && message.toLowerCase().includes(key)) {
            return response;
        }
    }
    
    return responses.default;
}

function shareResults() {
    if (navigator.share && imageBlob) {
        navigator.share({
            title: 'Food Ninja - Phân tích dinh dưỡng',
            text: 'Xem kết quả phân tích dinh dưỡng thực phẩm từ Food Ninja AI',
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Đã sao chép link chia sẻ!');
        }).catch(() => {
            showToast('Không thể chia sẻ lúc này');
        });
    }
    closeFabMenu();
}

function downloadReport() {
    // Generate and download nutrition report
    if (!imageBlob) {
        showToast('Chưa có kết quả để tải xuống');
        return;
    }
    
    // Simple implementation - create a text report
    const report = generateNutritionReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrition-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    closeFabMenu();
}

function openHelp() {
    showToast('Tính năng trợ giúp sẽ có trong phiên bản tiếp theo!');
    closeFabMenu();
}

function generateNutritionReport() {
    return `FOOD NINJA - BÁO CÁO DINH DƯỠNG
======================================
Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}
Thời gian: ${new Date().toLocaleTimeString('vi-VN')}

Thông tin phân tích:
- Ứng dụng: Food Ninja AI
- Công nghệ: AI nhận diện thực phẩm
- Độ chính xác: Cao

Ghi chú:
Báo cáo này được tạo tự động bởi AI.
Để có thông tin chi tiết, vui lòng sử dụng ứng dụng.

© 2024 Food Ninja - AI Nutrition Analysis`;
}

function showToast(message) {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        z-index: 10000;
        font-size: 14px;
        animation: slideUp 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
}

// Add event listeners for chat input
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Close assistant when clicking outside
    document.addEventListener('click', (e) => {
        const assistant = document.getElementById('aiAssistant');
        const fabContainer = document.getElementById('fabContainer');
        
        if (assistantOpen && assistant && !assistant.contains(e.target)) {
            closeAssistant();
        }
        
        if (fabMenuOpen && fabContainer && !fabContainer.contains(e.target)) {
            closeFabMenu();
        }
    });
});

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBanner) installBanner.classList.remove('hidden');
});
// Fallback: nếu không có beforeinstallprompt (iOS Safari), gợi ý Add to Home Screen
window.addEventListener('load', () => {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (installBanner && !isStandalone) {
    if (!deferredPrompt && isIOS) {
      installBanner.classList.remove('hidden');
      if (installText) installText.textContent = 'Trên iPhone, chọn Chia sẻ → Add to Home Screen để cài đặt ứng dụng';
      if (installBtn) installBtn.style.display = 'none';
    }
  }
});
if (installBtn) {
  installBtn.onclick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (installBanner) installBanner.classList.add('hidden');
    console.log('[FoodNinja] install outcome:', outcome);
  };
}

// Hiển thị preview ảnh khi chọn file
imageInput.onchange = () => {
    if (imageInput.files[0]) {
        const url = URL.createObjectURL(imageInput.files[0]);
        imagePreview.innerHTML = `<img src="${url}" alt="Ảnh món ăn">`;
    }
};

// Upload ảnh từ file
uploadBtn.onclick = async () => {
    if (!imageInput.files[0]) {
        alert('Vui lòng chọn ảnh!');
        return;
    }
    imageBlob = imageInput.files[0];
    await sendImage(imageBlob);
};

// Camera capture for mobile & desktop (responsive frames)
if (cameraBtn) {
  cameraBtn.onclick = async () => {
    try {
      const constraints = { video: { facingMode: { ideal: 'environment' } }, audio: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      await video.play();

      // Hiện wrapper + video, ẩn canvas
      if (mediaWrapper) mediaWrapper.classList.remove('hidden');
      video.classList.remove('hidden');
      captureBtn.classList.remove('hidden');
      canvas.classList.add('hidden');
      imagePreview.innerHTML = '';
    } catch (err) {
      alert('Không thể truy cập camera: ' + err.message);
    }
  };
}

if (captureBtn) {
  captureBtn.onclick = async () => {
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);

    const tracks = (video.srcObject && video.srcObject.getTracks()) || [];
    tracks.forEach(t => t.stop());
    video.srcObject = null;

    video.classList.add('hidden');
    captureBtn.classList.add('hidden');
    canvas.classList.remove('hidden');

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      imageBlob = blob;
      const url = URL.createObjectURL(blob);
      imagePreview.innerHTML = `<img src="${url}" alt="Ảnh món ăn">`;
      // Ẩn toàn bộ khung media sau khi đã chụp
      if (mediaWrapper) mediaWrapper.classList.add('hidden');
      await sendImage(imageBlob);
    }, 'image/jpeg', 0.9);
  };
}

// Helper: escape HTML để tránh lỗi hiển thị/XSS nhẹ
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendImage(blob) {
  resultDiv.innerHTML = '<span class="spinner"></span> <span style="color:#4CAF50;">Đang nhận diện...</span>';
  const formData = new FormData();
  formData.append('image', blob);
  try {
  const url = API_BASE ? `${API_BASE}/predict` : '/predict';
  const res = await fetch(url, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.error) {
      resultDiv.innerHTML = '<span style="color:#FF6347;">Lỗi: ' + escapeHtml(data.error) + '</span>';
    } else {
      const prob = Number(data.probability || 0);
      const minConf = (typeof data.min_confidence === 'number') ? data.min_confidence : 0.4;
      // Nhánh báo cáo độ tin cậy thấp từ backend
      if (data.low_confidence === true || prob < minConf) {
        const alts = Array.isArray(data.alternatives) ? data.alternatives : [];
        const tips = escapeHtml(data.message || `Nhận diện có độ tin cậy thấp (${(prob*100).toFixed(0)}% < ${(minConf*100).toFixed(0)}%). Hãy chụp ảnh rõ hơn hoặc thử lại.`).replace(/\n/g,'<br>');
        const altsHtml = alts.length
          ? `<div style="margin-top:8px"><b>Có thể là:</b> ${alts.map(a => `
              <button class="alt-chip" data-name="${escapeHtml(a.name)}" style="margin:4px 6px 0 0; padding:6px 10px; border-radius:16px; border:1px solid #ccc; background:#f7f7f7; cursor:pointer;">
                ${escapeHtml(a.name)} (${((Number(a.probability)||0)*100).toFixed(0)}%)
              </button>
            `).join('')}</div>`
          : '';
        const firstAlt = alts[0]?.name || data.food_name || '';
        resultDiv.innerHTML = `
          <div class="ai-answer-card" style="border-left:4px solid #FF9800;">
            <div class="ai-answer-title">⚠️ Độ tin cậy thấp</div>
            <div class="ai-answer-content">${tips}</div>
            ${altsHtml}
            <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
              ${firstAlt ? `<button id="askAIAltBtn" style="background:#4CAF50;color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;">Hỏi AI về món “${escapeHtml(firstAlt)}”</button>` : ''}
              <button id="retryBtn" style="background:#1976D2;color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;">Chụp/Upload ảnh khác</button>
            </div>
            <div id="aiLowConfAnswer" style="margin-top:10px;"></div>
          </div>
        `;
        // Lưu lịch sử
        const altText = alts.map(a => `${a.name} (${((Number(a.probability)||0)*100).toFixed(0)}%)`).join(', ');
        pushGlobalHistory({
          title: `Độ tin cậy thấp (${(prob*100).toFixed(0)}% < ${(minConf*100).toFixed(0)}%)`,
          body: altText ? `Gợi ý: ${altText}` : 'Hãy chụp lại ảnh rõ hơn.',
        });
        // Sự kiện: chọn alternative
        resultDiv.querySelectorAll('.alt-chip').forEach(btn => {
          btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name') || '';
            if (name) askAIFor(name);
          });
        });
        // Sự kiện: hỏi AI cho firstAlt
        const askBtn = document.getElementById('askAIAltBtn');
        if (askBtn && firstAlt) {
          askBtn.onclick = () => askAIFor(firstAlt);
        }
        // Sự kiện: retry
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
          retryBtn.onclick = () => {
            // Focus vào input file nếu có
            try { imageInput && imageInput.click(); } catch {}
            // Hoặc mở camera nếu người dùng muốn
            // cameraBtn?.click(); // để người dùng chủ động bấm
          };
        }
        return;
      }
      let html = `<b><span class=\"food-icon\">🍎</span> Món ăn:</b> <span style=\"color:#388E3C;\">${escapeHtml(data.food_name || '')}</span> <span style=\"font-size:0.95em;\">(Xác suất: ${(prob*100).toFixed(2)}%)</span><br>`;
      if (data.nutrition && data.nutrition.items && data.nutrition.items.length > 0) {
        html += '<b>🥗 Thông tin dinh dưỡng:</b><ul>';
        for (const [key, value] of Object.entries(data.nutrition.items[0])) {
          html += `<li><b>${escapeHtml(key)}:</b> ${escapeHtml(String(value))}</li>`;
        }
        html += '</ul>';
      } else {
        html += '<span style="color:#888;">Không tìm thấy thông tin dinh dưỡng.</span>';
      }
      // Thêm khối hiển thị trả lời AI ở dưới
      if (data.ai_answer) {
        const aiText = escapeHtml(String(data.ai_answer)).replace(/\n/g, '<br>');
        html += `
          <div class="ai-answer-card">
            <div class="ai-answer-title">🤖 Phân tích & gợi ý từ AI</div>
            <div class="ai-answer-content">${aiText}</div>
          </div>
        `;
      }
      resultDiv.innerHTML = html;
      // lưu lịch sử nhận diện toàn cục
      pushGlobalHistory({
        title: `Món: ${data.food_name || ''} (${(prob*100).toFixed(2)}%)`,
        body: data.ai_answer ? String(data.ai_answer) : 'Không có phân tích AI',
      });
    }
  } catch (e) {
    resultDiv.innerHTML = '<span style="color:#FF6347;">Lỗi kết nối server!</span>';
  }
}

// Hỏi AI khi người dùng chọn một gợi ý trong trường hợp độ tin cậy thấp
async function askAIFor(foodName) {
  const container = document.getElementById('aiLowConfAnswer');
  if (container) container.innerHTML = '<span class="spinner"></span> <span style="color:#4CAF50;">Đang hỏi AI...</span>';
  try {
    const url = API_BASE ? `${API_BASE}/ask_ai` : '/ask_ai';
    const prompt = `Hãy phân tích ngắn gọn về giá trị dinh dưỡng, lợi ích và rủi ro (nếu có) của món ăn "${foodName}". Đưa lời khuyên ăn uống lành mạnh, hướng tới người tiêu dùng. (Không có dữ liệu định lượng, chỉ phân tích tổng quan)`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    const text = (data && (data.result || data.error)) ? String(data.result || `Lỗi: ${data.error}`) : 'Không có trả lời.';
    const html = escapeHtml(text).replace(/\n/g,'<br>');
    if (container) container.innerHTML = `<div class="ai-answer-card"><div class="ai-answer-title">🤖 Gợi ý từ AI</div><div class="ai-answer-content">${html}</div></div>`;
  } catch (e) {
    if (container) container.innerHTML = '<span style="color:#FF6347;">Lỗi kết nối AI!</span>';
  }
}

// ===== Chatbot Floating UI Logic =====
const openChatbotBtn = document.getElementById('openChatbot');
const chatbotBox = document.getElementById('chatbotBox');
const closeChatbotBtn = document.getElementById('closeChatbot');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatHistoryPanel = document.getElementById('chatHistoryPanel');
const toggleHistoryBtn = document.getElementById('toggleHistory');
const clearHistoryBtn = document.getElementById('clearHistory');
const globalHistoryPanel = document.getElementById('globalHistoryPanel');
const toggleGlobalHistoryBtn = document.getElementById('toggleGlobalHistory');
const clearGlobalHistoryBtn = document.getElementById('clearGlobalHistory');

// Chat history persistence in localStorage
const CHAT_HISTORY_KEY = 'foodninja_chat_history_v1';
const GLOBAL_HISTORY_KEY = 'foodninja_recognition_history_v1';
function loadHistory() {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveHistory(items) {
  try { localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(items.slice(-100))); } catch {}
}
function renderHistoryPanel() {
  if (!chatHistoryPanel) return;
  const items = loadHistory();
  if (items.length === 0) {
    chatHistoryPanel.innerHTML = '<div style="color:#888;">Chưa có lịch sử.</div>';
    return;
  }
  chatHistoryPanel.innerHTML = items.map(it => `<div class="chatbot-msg ${it.role==='user'?'chatbot-msg-user':'chatbot-msg-ai'}">${escapeHtml(it.text)}</div>`).join('');
}
function loadGlobalHistory() {
  try { const raw = localStorage.getItem(GLOBAL_HISTORY_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveGlobalHistory(items) {
  try { localStorage.setItem(GLOBAL_HISTORY_KEY, JSON.stringify(items.slice(-100))); } catch {}
}
function renderGlobalHistory() {
  if (!globalHistoryPanel) return;
  const items = loadGlobalHistory();
  if (items.length === 0) {
    globalHistoryPanel.innerHTML = '<div style="color:#888;">Chưa có lịch sử nhận diện.</div>';
    return;
  }
  globalHistoryPanel.innerHTML = items.map(it => `
    <div class="history-item">
      <div class="history-title">${escapeHtml(it.title || '')}</div>
      <div class="history-body">${escapeHtml(String(it.body || '')).replace(/\n/g,'<br>')}</div>
    </div>
  `).join('');
}
function pushGlobalHistory(item) {
  const items = loadGlobalHistory();
  items.push({ ...item, time: Date.now() });
  saveGlobalHistory(items);
  if (globalHistoryPanel && !globalHistoryPanel.classList.contains('hidden')) renderGlobalHistory();
}
if (toggleHistoryBtn && chatHistoryPanel) {
  toggleHistoryBtn.onclick = () => {
    const hidden = chatHistoryPanel.classList.toggle('hidden');
    chatHistoryPanel.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    if (!hidden) renderHistoryPanel();
  };
}
if (clearHistoryBtn) {
  clearHistoryBtn.onclick = () => {
    saveHistory([]);
    renderHistoryPanel();
    // cũng dọn vùng chat hiện tại nếu muốn
    // chatbotMessages.innerHTML = '';
  };
}
if (toggleGlobalHistoryBtn && globalHistoryPanel) {
  toggleGlobalHistoryBtn.onclick = () => {
    const hidden = globalHistoryPanel.classList.toggle('hidden');
    globalHistoryPanel.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    if (!hidden) renderGlobalHistory();
  };
}
if (clearGlobalHistoryBtn) {
  clearGlobalHistoryBtn.onclick = () => {
    saveGlobalHistory([]);
    renderGlobalHistory();
  };
}

function appendMessage(text, role = 'ai') {
  const div = document.createElement('div');
  div.className = `chatbot-msg ${role === 'user' ? 'chatbot-msg-user' : 'chatbot-msg-ai'}`;
  div.textContent = text;
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  // lưu lịch sử
  const hist = loadHistory();
  hist.push({ role, text });
  saveHistory(hist);
}

if (openChatbotBtn && chatbotBox) {
  openChatbotBtn.onclick = () => {
    chatbotBox.style.display = 'flex';
    chatbotInput && chatbotInput.focus();
  };
}
if (closeChatbotBtn && chatbotBox) {
  closeChatbotBtn.onclick = () => {
    chatbotBox.style.display = 'none';
  };
}

if (chatbotForm) {
  chatbotForm.onsubmit = async (e) => {
    e.preventDefault();
    const msg = chatbotInput.value.trim();
    if (!msg) return;
    appendMessage(msg, 'user');
    chatbotInput.value = '';
    appendMessage('Đang soạn trả lời...', 'ai');
    try {
  const url = API_BASE ? `${API_BASE}/chat` : '/chat';
  const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      // thay thế tin nhắn "Đang soạn trả lời..."
      chatbotMessages.lastChild.remove();
      appendMessage(data.error ? `Lỗi: ${data.error}` : (data.response || 'Không có câu trả lời.'), 'ai');
    } catch (err) {
      chatbotMessages.lastChild.remove();
      appendMessage('Lỗi kết nối server!', 'ai');
    }
  };
}

// ===== Drag & Drop Upload Enhancements =====
const uploadBoxEl = document.getElementById('uploadBox');
const imageInputEl = document.getElementById('imageInput');
if (uploadBoxEl && imageInputEl) {
  uploadBoxEl.addEventListener('click', (e) => {
    if (e.target === uploadBoxEl || e.target.classList.contains('upload-icon')) {
      imageInputEl.click();
    }
  });
  uploadBoxEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBoxEl.classList.add('dragover');
  });
  uploadBoxEl.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadBoxEl.classList.remove('dragover');
  });
  uploadBoxEl.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBoxEl.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      imageInputEl.files = e.dataTransfer.files;
      const event = new Event('change');
      imageInputEl.dispatchEvent(event);
    }
  });
}
