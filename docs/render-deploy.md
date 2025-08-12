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
   Root Directory: . (leave blank for root)
   ```

3. **Build & Deploy Settings**
   ```
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   ```

4. **Environment Variables** (CRITICAL!)
   Add these environment variables in Render dashboard:
   ```
   CLARIFAI_PAT=your_clarifai_personal_access_token
   CALORIE_API_KEY=your_calorieninjas_api_key  
   COHERE_API_KEY=your_cohere_api_key
   ALLOWED_ORIGINS=https://your-netlify-domain.netlify.app
   MIN_CONFIDENCE=0.4
   PYTHON_VERSION=3.11.0
   ```

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
