# Render Deployment Instructions

## Step-by-step backend deployment:

1. **Create Web Service**
   - Login to Render: https://dashboard.render.com
   - Click "New" → "Web Service"
   - Connect GitHub repository: `Duydzgithub/foodninja-ai`
   - Choose "Deploy from a Git repository"

2. **Configure Service**
   ```
   Name: foodninja-backend
   Environment: Python 3
   Region: Oregon (US West) or Singapore (Asia)
   Branch: main
   Root Directory: backend
   ```

3. **Build & Deploy Settings**
   ```
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   ```

4. **Environment Variables** (CRITICAL!)
   Add these environment variables in Render dashboard:
   ```
   CLARIFAI_PAT=ee3c204a684349988ab75e29e0b6d71f
   CALORIE_API_KEY=YAUwnJbm2FnEJNxSnCAzDQ==CnSPSycr1OSpeZZw  
   COHERE_API_KEY=MWfoDxQO7eGLx7V3HYIRaSEQAXqJziFK9dMZEd9y
   ALLOWED_ORIGINS=https://foodninja-ai.netlify.app
   MIN_CONFIDENCE=0.4
   PYTHON_VERSION=3.11.0
   ```

   **🔑 Để lấy COHERE_API_KEY:**
   1. Truy cập: https://dashboard.cohere.com
   2. Đăng ký/Đăng nhập tài khoản
   3. Vào Dashboard → API Keys → Create API Key
   4. Copy key (dạng: co_xxxxxxxxxx) và thay vào đây

5. **Health Check**
   - Health Check Path: `/`
   - Auto-Deploy: ON

6. **Custom Domain** (Optional)
   - Settings → Custom Domains
   - Add your domain if you have one
   - Default URL: https://foodninja-backend.onrender.com

## Important Files for Render:
- `requirements.txt` - Python dependencies
- `Procfile` - Process definition
- `app.py` - Main Flask application
