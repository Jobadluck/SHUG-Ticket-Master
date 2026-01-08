# Deploy SHUG Ticket Master to Vercel

Complete step-by-step guide to deploy your app to Vercel.

## Prerequisites

✅ Project is ready (all files configured)
✅ `vercel.json` is configured
✅ `nuxt.config.ts` is set up
✅ All dependencies in `package.json`

## Option 1: Deploy via GitHub (Recommended - Auto-Deploys)

### Step 1: Create GitHub Repository

```bash
# Navigate to your project
cd ~/projects/project-ticketing-shug

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SHUG Ticket Master app"

# Add GitHub remote (replace YOUR-USERNAME and YOUR-REPO)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# Create main branch and push
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose authentication method (GitHub, Google, etc.)
4. After logging in, click **"New Project"**
5. Click **"Import Git Repository"**
6. Find and select your `project-ticketing-shug` repository
7. Click **"Import"**

### Step 3: Configure Project Settings

Leave defaults (Vercel auto-detects Nuxt 3):
- **Framework Preset:** Nuxt.js
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** `.output/public`
- **Install Command:** `npm install`

Click **"Deploy"** 🚀

### Step 4: Watch Deployment

- Vercel starts building
- You'll see build logs in real-time
- Once complete, you get a live URL
- Your app is deployed! 🎉

**Your live URL will be:** `https://your-project-name.vercel.app`

### Step 5: Future Updates

Every time you push to GitHub, Vercel auto-deploys:

```bash
# Make changes locally
# ... edit your code ...

# Commit and push to GitHub
git add .
git commit -m "Add new features"
git push origin main

# Vercel automatically deploys!
```

---

## Option 2: Deploy via Vercel CLI (Quick Deploy)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Deploy

```bash
cd ~/projects/project-ticketing-shug
vercel
```

### Step 3: Follow Prompts

```
? Set up and deploy "~/projects/project-ticketing-shug"? [Y/n]
Y

? Which scope do you want to deploy to? 
(Select your account)

? Link to existing project? [y/N]
N

? What's your project's name?
project-ticketing-shug

? In which directory is your code located?
./

? Want to modify these settings?
N
```

### Step 4: Wait for Deployment

Vercel builds and deploys your app. You'll get a live URL.

---

## Option 3: Deploy Multiple Times (Development)

If you need to deploy multiple versions during development:

```bash
# Deploy to preview
vercel --prod false

# Deploy to production
vercel --prod
```

---

## Verify Deployment

### Test Your Live App:

1. Open your Vercel URL in browser
2. Verify features work:
   - ✅ Title shows "SHUG Ticket Master"
   - ✅ Avatar displays
   - ✅ Current ticket shows "0000"
   - ✅ "Get Ticket" button works
   - ✅ Konami code works (↑ ↑ ↓ ↓ ← → ← → B A)
   - ✅ Admin panel appears after Konami code
   - ✅ "Pass to Next Ticket" advances number
   - ✅ Data persists on page reload

### Check Vercel Dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. See deployments history
4. View build logs
5. Monitor real-time traffic

---

## Environment Variables (If Needed)

If you add environment variables later:

### Step 1: Add to `.env.local` locally

```bash
# Create file
echo "NUXT_PUBLIC_MY_VAR=value" > .env.local
```

### Step 2: Add to Vercel Dashboard

1. Go to Project Settings
2. Click "Environment Variables"
3. Add each variable
4. Click "Save"
5. Redeploy

---

## Troubleshooting

### Issue: Build fails

**Check logs:**
```bash
# View build logs in Vercel dashboard
# Or check locally first:
npm run build
```

**Fix:** Make sure all dependencies are installed:
```bash
npm install
```

### Issue: Avatar not showing

**Ensure avatar file exists:**
```bash
ls -la public/avatar.svg
```

**If using JPG:**
```bash
ls -la public/avatar.jpg
```

**Update app.vue if needed:**
Change line in `app.vue`:
```vue
<img src="/avatar.jpg" alt="SHUG" class="avatar" />
```

### Issue: Konami code not working

- Works in browser console
- Check if events are being captured
- Verify keyboard events are firing

### Issue: Data reset at midnight not working

- Depends on browser's localStorage
- Clear browser cache and reload
- Check browser console for errors

---

## Domain Setup (Optional)

### Add Custom Domain:

1. Go to Vercel Project Settings
2. Click "Domains"
3. Enter your domain (e.g., tickets.yourdomain.com)
4. Add DNS records from Vercel
5. Wait for DNS propagation (5-48 hours)

---

## SSL/HTTPS

✅ **Automatic!** Vercel provides free SSL for all projects.

Your app is automatically served over HTTPS (secure).

---

## Rollback to Previous Version

If something goes wrong:

1. Go to Vercel Dashboard
2. Click your project
3. Go to "Deployments"
4. Find the previous working version
5. Click "..."
6. Select "Promote to Production"

---

## Performance Tips

### Optimize Images:
```bash
# Compress avatar image
# Use tools like TinyPNG or ImageOptim
```

### Monitor Performance:
1. Vercel Dashboard → Analytics
2. View page load times
3. Check error rates

---

## Git Commands Cheat Sheet

```bash
# First time setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Update message"
git push origin main

# Check status
git status

# View recent commits
git log --oneline
```

---

## Summary

### Quick Deploy Path:

1. **Create GitHub repo** → Push code
2. **Open vercel.com** → Import repo
3. **Click Deploy** → Wait 2-5 minutes
4. **Get live URL** → Share with users! 🎉

### Time Required:
- GitHub setup: 5 minutes
- Vercel setup: 2 minutes
- First deployment: 3-5 minutes
- **Total: ~10 minutes**

---

## Next Steps

1. Choose deployment method (GitHub recommended)
2. Follow steps above
3. Test live app
4. Share your URL!

Your app will be live at: **`https://your-project-name.vercel.app`** 🚀

---

**Questions?**
- Check [Vercel Docs](https://vercel.com/docs)
- Review [Nuxt Deployment Guide](https://nuxt.com/docs/getting-started/deployment)
- Check our README.md for more info
