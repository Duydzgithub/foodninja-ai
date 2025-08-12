# 🔑 Get New Clarifai API Key

## Current Issue:
```
Invalid API key: ee3c204a684349988ab75e29e0b6d71f
```

## Steps to Fix:

### 1. Visit Clarifai
```
🌐 URL: https://clarifai.com
👤 Login/Register with your account
```

### 2. Navigate to API Keys
```
🔑 Go to: https://clarifai.com/settings/keys
⚙️ Or: Dashboard → Settings → API Keys
```

### 3. Create New Personal Access Token
```
🆕 Click "Create a new PAT"
📝 Name: "FoodNinja App"
🔐 Scopes: Select "Predict" and "All"
✅ Click "Confirm"
```

### 4. Copy New API Key
```
📋 Copy the generated key (starts with random characters)
⚠️ Save it securely - you won't see it again!
```

### 5. Update Render Environment Variables
```
🌐 Go to: https://dashboard.render.com
📱 Select your "foodninja-backend" service
⚙️ Environment → Edit
🔄 Update: CLARIFAI_PAT=YOUR_NEW_KEY_HERE
💾 Save Changes
```

### 6. Redeploy
```
🔄 Manual Deploy → Deploy Latest Commit
⏱️ Wait 2-3 minutes for deployment
🧪 Test: https://foodninja-backend.onrender.com/
```

## 🆓 Free Tier Limits:
- 1,000 operations/month free
- Food recognition model included
- No credit card required

## ✅ Test Command:
```bash
curl -X POST https://foodninja-backend.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

Should return: `{"message": "Predict endpoint working"}`
