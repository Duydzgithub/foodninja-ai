# Netlify Deployment Instructions

## Step-by-step deployment:

1. **Connect Repository**
   - Login to Netlify: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select repository: `Duydzgithub/foodninja-ai`

2. **Configure Build Settings**
   ```
   Build command: npm run diagrams
   Publish directory: .
   ```

3. **Environment Variables** (Optional for frontend)
   - Go to Site settings → Environment variables
   - Add any frontend-specific vars if needed

4. **Custom Domain** (Optional)
   - Site settings → Domain management
   - Add custom domain if you have one
   - Default URL will be: https://fantastic-name-123456.netlify.app

5. **Deploy Settings**
   - Branch: main
   - Auto-deploy: ON (deploy when push to main)
   - Build hooks: Keep default

## Important Files for Netlify:
- `netlify.toml` - Build and header configuration
- `_redirects` - URL redirects (if needed)
- All static files in root directory
