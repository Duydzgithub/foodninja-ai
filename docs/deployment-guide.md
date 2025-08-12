# Complete Deployment Checklist

## Phase 1: Backend Deployment (Render)

### ✅ Pre-deployment checklist:
- [ ] GitHub repository pushed: `Duydzgithub/foodninja-ai` ✓
- [ ] requirements.txt present ✓  
- [ ] Procfile configured ✓
- [ ] app.py has proper Flask configuration ✓

### 🚀 Deploy Steps:

1. **Access Render Dashboard**
   ```
   URL: https://dashboard.render.com
   Login with GitHub account: Duydzgithub
   ```

2. **Create New Web Service**
   - Click "+ New" → "Web Service"
   - Connect repository: `foodninja-ai`
   - Branch: `main`

3. **Service Configuration**
   ```
   Service Name: foodninja-backend
   Environment: Python 3
   Region: Oregon (US West)
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
   ```

4. **Environment Variables** (CRITICAL!)
   Add in Render Environment tab:
   ```
   CLARIFAI_PAT=<your-clarifai-token>
   CALORIE_API_KEY=<your-calorieninjas-key>
   COHERE_API_KEY=<your-cohere-key>
   ALLOWED_ORIGINS=https://*.netlify.app
   ```

5. **Deploy & Get URL**
   - Click "Create Web Service"
   - Wait 3-5 minutes for build
   - Copy deployment URL: `https://foodninja-backend.onrender.com`

---

## Phase 2: Frontend Deployment (Netlify)

### ✅ Pre-deployment checklist:
- [ ] Backend URL from Render ready
- [ ] netlify.toml configured ✓
- [ ] Static files optimized ✓

### 🚀 Deploy Steps:

1. **Access Netlify Dashboard**
   ```
   URL: https://app.netlify.com
   Login with GitHub account: Duydzgithub
   ```

2. **Import Repository**
   - "Add new site" → "Import an existing project"
   - Choose GitHub → `foodninja-ai`
   - Deploy settings:
     ```
     Build command: (leave empty)
     Publish directory: . (root)
     ```

3. **Update API URLs**
   - Note your Netlify URL: `https://unique-name.netlify.app`
   - Go back to Render → Environment Variables
   - Update `ALLOWED_ORIGINS=https://unique-name.netlify.app`
   - Redeploy Render service

4. **Custom Domain** (Optional)
   - Netlify: Site settings → Domain management
   - Add custom domain if available

---

## Phase 3: Testing & Validation

### 🧪 Test Checklist:
- [ ] Backend health check: `https://foodninja-backend.onrender.com/`
- [ ] Frontend loads: `https://unique-name.netlify.app`
- [ ] Upload image functionality works
- [ ] API responses are received
- [ ] PWA install prompt appears
- [ ] Offline functionality works

### 🔧 Troubleshooting:
- **CORS errors**: Check ALLOWED_ORIGINS in Render
- **API not loading**: Verify Render service is running
- **Build failures**: Check logs in respective dashboards
- **Slow responses**: Render free tier has cold starts (normal)

---

## 📝 Final URLs:
```
Backend API: https://foodninja-backend.onrender.com
Frontend PWA: https://unique-name.netlify.app
GitHub Repo: https://github.com/Duydzgithub/foodninja-ai
```

## 🚨 Important Notes:
1. Render free tier sleeps after 15 min inactivity
2. First request after sleep takes 30-60 seconds
3. Netlify offers 100GB bandwidth/month free
4. Keep API keys secure in environment variables
5. Monitor usage limits on all APIs
