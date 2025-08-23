# 🍎 Food Ninja - AI Nutrition Analyzer

A Progressive Web App (PWA) that uses AI to analyze food images and provide nutrition information.

## 🚀 Quick Deploy Guide

### 🔧 **Backend Deploy (Render)**

1. **Push to GitHub** → Connect Render → Set root directory: `Nutrition_food`

2. **Environment Variables:**
   ```bash
   COHERE_API_KEY=your_cohere_api_key
   CLARIFAI_PAT=your_clarifai_pat_key  
   CALORIE_API_KEY=your_calorieninjas_api_key
   MIN_CONFIDENCE=0.4
   ALLOWED_ORIGINS=https://your-app.netlify.app
   ```

3. **Build Command:** `pip install --upgrade pip && pip install -r requirements.txt`
4. **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --timeout 300`

### 🌐 **Frontend Deploy (Netlify)**

1. **Push to GitHub** → Connect Netlify → Set publish directory: `Nutrition_food`

2. **Update Backend URL in `app.html`:**
   ```javascript
   // Replace with your Render backend URL
   const API_BASE_URL = 'https://your-backend.onrender.com'
   ```

3. **Update `netlify.toml` and `_redirects`** with your backend URL

4. **Add your Netlify URL to backend CORS settings**

## ✅ **Deploy Checklist**

### Files Created/Updated:
- ✅ `netlify.toml` - Netlify configuration  
- ✅ `render.yaml` - Render configuration
- ✅ `_headers` - Security headers for Netlify
- ✅ `_redirects` - API proxy rules
- ✅ `.env.example` - Environment variables template
- ✅ `app.html` - Updated API URL for production
- ✅ `app.py` - Added health check endpoint & CORS

## Cài đặt

### 1. Clone và cài đặt dependencies

```bash
cd Nutrition_food
pip install -r requirements.txt
```

### 2. Cấu hình environment variables

Sao chép file `.env.example` thành `.env` và điền các API keys:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
# API Keys - Cần đăng ký và lấy từ các dịch vụ
COHERE_API_KEY=your_cohere_api_key_here
CLARIFAI_PAT=your_clarifai_pat_here  
CALORIE_API_KEY=your_calorie_ninjas_api_key_here

# Server Configuration
PORT=5000
FLASK_DEBUG=False

# CORS (các domain được phép gọi API)
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500

# AI Configuration  
MIN_CONFIDENCE=0.4
```

### 3. Lấy API Keys

#### Cohere AI (Cho chatbot và phân tích)
1. Đăng ký tại: https://cohere.ai/
2. Vào Dashboard → API Keys
3. Copy API key vào `COHERE_API_KEY`

#### Clarifai (Cho nhận diện ảnh)
1. Đăng ký tại: https://clarifai.com/
2. Vào Account → Security → Personal Access Tokens
3. Tạo token mới với scope `predict`
4. Copy token vào `CLARIFAI_PAT`

#### CalorieNinjas (Cho thông tin dinh dưỡng)
1. Đăng ký tại: https://calorieninjas.com/api
2. Copy API key vào `CALORIE_API_KEY`

## Chạy ứng dụng

### Development
```bash
python app.py
```

### Production  
```bash
gunicorn --bind 0.0.0.0:5000 app:app
```

## API Endpoints

### 1. Health Check
```http
GET /
```

### 2. Nhận diện thực phẩm
```http
POST /predict
Content-Type: multipart/form-data

Body: image file
```

Response:
```json
{
  "food_name": "cơm",
  "probability": 0.85,
  "nutrition": {...},
  "ai_answer": "Cơm là nguồn carbohydrate chính...",
  "low_confidence": false
}
```

### 3. Chat với AI
```http
POST /chat
Content-Type: application/json

{
  "message": "Ăn chuối có tốt không?"
}
```

### 4. Hỏi AI
```http
POST /ask_ai  
Content-Type: application/json

{
  "prompt": "Lợi ích của vitamin C"
}
```

## Testing

Chạy test script để kiểm tra các endpoint:

```bash
python test_api.py
```

## Cấu trúc thư mục

```
Nutrition_food/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env.example       # Environment template
├── .env              # Your actual config (tạo từ .env.example)
├── test_api.py       # Test script
└── README.md         # Documentation
```

## Troubleshooting

### Lỗi API Keys
- Kiểm tra file `.env` có đúng format không
- Verify API keys còn hiệu lực
- Check quota/limit của các API

### Lỗi CORS
- Thêm domain frontend vào `ALLOWED_ORIGINS`
- Hoặc set `ALLOWED_ORIGINS=*` để test (không nên dùng production)

### Lỗi upload ảnh
- File size tối đa: 10MB
- Formats hỗ trợ: PNG, JPG, JPEG, GIF, BMP, WEBP

### Performance
- Timeout mặc định: 30s cho AI APIs
- Có thể tăng `MIN_CONFIDENCE` nếu muốn kết quả chính xác hơn

## Security

- ✅ CORS protection
- ✅ Security headers  
- ✅ File type validation
- ✅ File size limits
- ✅ Input sanitization
- ✅ Environment variables cho sensitive data

## Tech Stack

- **Framework**: Flask 3.0.3
- **AI Services**: 
  - Cohere (Chat & Analysis)
  - Clarifai (Image Recognition)  
  - CalorieNinjas (Nutrition Data)
- **Deployment**: Gunicorn ready
