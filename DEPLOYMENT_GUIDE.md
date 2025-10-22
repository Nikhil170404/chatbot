# 🚀 Deployment Guide - Indian Stock Assistant

## ⚠️ IMPORTANT: Fix Current Error First

### The Problem
You're getting a **401 "User not found"** error because the React dev server hasn't loaded your `.env` file.

### ✅ Solution: Restart Dev Server

**In your terminal:**

1. **Stop the current server:**
   - Press `Ctrl + C` in the terminal running the React app

2. **Start it again:**
   ```bash
   npm start
   ```

3. **Check the console** - You should see:
   ```
   === Environment Variables Debug ===
   OpenRouter Key exists: true
   Alpha Vantage Key exists: true
   ```

4. **If you still see `false`**, verify:
   - `.env` file is in root folder (same level as `package.json`)
   - No quotes around values in `.env`
   - Keys start with `REACT_APP_`

---

## 📋 Current Project Status

✅ **Fixed Issues:**
- API keys now properly read from `.env` file
- Removed hardcoded API keys from code
- Created modular component structure
- Implemented best practices

✅ **New Project Structure:**
```
src/
├── components/       ✅ Modular components
├── services/         ✅ API service layer
├── hooks/            ✅ Custom React hooks
├── utils/            ✅ Utilities & config
└── constants/        ✅ Constants
```

---

## 🌐 Deploy to Vercel

### Step 1: Prepare Your Code

```bash
# Ensure .env is NOT committed
git status

# If .env shows up, it means .gitignore isn't working
# Make sure you have the updated .gitignore
```

### Step 2: Push to GitHub

```bash
# Initialize git if not done
git init

# Add all files (excluding .env due to .gitignore)
git add .

# Commit
git commit -m "Initial commit: Indian Stock Assistant with proper structure"

# Create repo on GitHub, then:
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel

#### Option A: Vercel Dashboard (Easiest)

1. Go to https://vercel.com/
2. Sign in with GitHub
3. Click **"Add New Project"**
4. **Import** your GitHub repository
5. Vercel auto-detects it's a React app
6. Click **"Environment Variables"**
7. Add these variables:

```
Name: REACT_APP_OPENROUTER_API_KEY
Value: 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

Name: REACT_APP_ALPHA_VANTAGE_KEY
Value: ZR7YSO3KW4PQMVDS
```

8. Click **"Deploy"**
9. Wait 2-3 minutes
10. Your app is live! 🎉

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? my-ai-chat-app
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add REACT_APP_OPENROUTER_API_KEY
# Paste: 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

vercel env add REACT_APP_ALPHA_VANTAGE_KEY
# Paste: ZR7YSO3KW4PQMVDS

# Deploy to production
vercel --prod
```

---

## 🔧 Vercel Configuration

The `vercel.json` file is already created with optimal settings:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    { "src": "/static/(.*)", "dest": "/static/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

This ensures:
- React Router works (SPA routing)
- Static assets load correctly
- Proper build configuration

---

## ✅ Post-Deployment Checklist

After deploying, verify:

1. **App loads** at your Vercel URL
2. **No API key errors** in console
3. **Can send messages** to chatbot
4. **Stock data loads** when using ticker symbols
5. **Chat history persists** (localStorage works)

### Common Issues

#### 1. "API keys not configured" on Vercel

**Solution:**
- Go to Vercel Dashboard → Project Settings → Environment Variables
- Ensure both keys are added
- Redeploy: `vercel --prod`

#### 2. Blank page on Vercel

**Solution:**
- Check browser console for errors
- Verify build logs in Vercel dashboard
- Ensure `package.json` has correct `homepage` (or remove it)

#### 3. 404 on page refresh

**Already fixed!** The `vercel.json` routes configuration handles this.

---

## 🎨 Customization

### Change AI Model

Edit [src/services/aiService.js](src/services/aiService.js:20):

```javascript
model: "mistralai/mistral-7b-instruct",  // Change this
```

Options:
- `"openai/gpt-3.5-turbo"` (faster, paid)
- `"anthropic/claude-2"` (better quality, paid)
- `"google/palm-2"` (free tier)

### Add More Stocks

Edit [src/constants/stocks.js](src/constants/stocks.js):

```javascript
export const INDIAN_STOCKS = [
  { symbol: "WIPRO.NS", name: "Wipro" },
  // Add more...
];
```

---

## 📊 Performance Tips

✅ **Already Optimized:**
- React.memo on all components
- Custom hooks for state management
- Service layer pattern
- Minimal re-renders

**Further Optimizations:**
- Add React.lazy for code splitting
- Use service worker for offline support
- Add caching for stock data

---

## 🔐 Security Notes

✅ **Protected:**
- API keys in environment variables
- `.env` in `.gitignore`
- No sensitive data in client code

⚠️ **Important:**
- **Never** commit `.env` to GitHub
- **Never** hardcode API keys
- Rotate keys if exposed

---

## 📝 Maintenance

### Update Dependencies

```bash
npm update
npm audit fix
```

### Monitor API Usage

- **OpenRouter:** Check usage at https://openrouter.ai/activity
- **Alpha Vantage:** Free tier = 500 calls/day

---

## 🆘 Need Help?

1. Check browser console for errors
2. Check Vercel deployment logs
3. Verify environment variables are set
4. Ensure dev server was restarted after editing `.env`

---

**Your app is production-ready! 🚀**

Just restart your dev server now to fix the current error, then deploy to Vercel!
