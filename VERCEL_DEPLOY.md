# 🚀 Vercel Deployment Commands

## ✅ Simplified: Only 1 API Key Needed!

Your app now uses DuckDuckGo for stock data (no API key required).
You only need the OpenRouter API key for AI responses.

---

## Step 1: Add Environment Variable

Run this command in PowerShell:

```powershell
# Add OpenRouter API Key
vercel env add REACT_APP_OPENROUTER_API_KEY production
```

When prompted, paste: `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`

## Step 2: Deploy to Production

```powershell
npx vercel --prod
```

---

## ✅ Quick One-Liner

```powershell
echo "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" | vercel env add REACT_APP_OPENROUTER_API_KEY production && npx vercel --prod
```

---

## 🎯 Alternative: Use Vercel Dashboard (Easier)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add this ONE variable:

   **Variable:**
   - Key: `REACT_APP_OPENROUTER_API_KEY`
   - Value: `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`
   - Environment: Production, Preview, Development

5. Click **Save**
6. Go back to terminal and run:
   ```powershell
   npx vercel --prod
   ```

---

## 📝 What Changed

✅ Removed Alpha Vantage dependency
✅ Stock data now from DuckDuckGo web search (free, unlimited)
✅ Only OpenRouter API key required
✅ No more rate limits on stock data
✅ Simpler deployment!

---

## 🎉 After Deployment

Your app will be live at: `https://your-project-name.vercel.app`

Features:
- 🤖 AI-powered stock chat (OpenRouter)
- 🦆 Real-time stock data (DuckDuckGo web search)
- 📊 Latest market information
- 🆓 No API limits on stock data!
