# 🚀 Deployment Checklist

## Pre-Deployment ✅

Use this checklist before deploying to Vercel.

### Code & Features

- [x] App.vue has all features implemented
- [x] Ticket numbering format (0000-9999)
- [x] Midnight reset functionality
- [x] Konami code admin unlock
- [x] Pass ticket button for admins
- [x] localStorage integration
- [x] No console errors
- [x] Responsive design working

### Configuration Files

- [x] `vercel.json` configured correctly
- [x] `nuxt.config.ts` has build settings
- [x] `package.json` has all dependencies
- [x] `tailwind.config.js` configured
- [x] `.gitignore` set up
- [x] CSS files in place

### Assets

- [x] Avatar image at `public/avatar.svg`
- [x] Favicon exists
- [x] robots.txt present

### Documentation

- [x] README.md created
- [x] DEPLOY.md created
- [x] FEATURES.md created
- [x] QUICKSTART.md created

### Local Testing

```bash
# Run these commands before deploying:

# 1. Install dependencies
npm install

# 2. Build the project
npm run build

# 3. Start dev server
npm run dev

# 4. Test in browser: http://localhost:3002/
# Verify:
# - Title displays
# - Avatar shows
# - Current ticket shows "0000"
# - Get Ticket button works
# - Konami code (↑ ↑ ↓ ↓ ← → ← → B A) unlocks admin
# - Pass ticket button advances number
```

### Git Setup

- [x] Git repository initialized
- [x] Initial commit created
- [x] Ready to push to GitHub

## Deployment Steps

### Option 1: GitHub + Vercel (RECOMMENDED)

#### Step 1: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `project-ticketing-shug`
3. Description: `SHUG Ticket Master - Queue ticketing system`
4. Make it **Public** (required for free Vercel)
5. Click "Create repository"

#### Step 2: Push to GitHub

```bash
# From project directory
cd ~/projects/project-ticketing-shug

# Add GitHub remote (replace USERNAME/REPO)
git remote add origin https://github.com/YOUR-USERNAME/project-ticketing-shug.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

#### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in or create account
3. Click "New Project"
4. Click "Import Git Repository"
5. Find and select `project-ticketing-shug`
6. Click "Import"
7. Settings should auto-fill:
   - **Framework:** Nuxt.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.output/public`
   - **Install Command:** `npm install`
8. Click "Deploy" 🚀

#### Step 4: Monitor Deployment

- Watch build logs
- Wait for "✓ Build completed"
- Get your live URL

**Your app will be live at:** `https://project-ticketing-shug.vercel.app`

---

### Option 2: Vercel CLI (Quick)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
cd ~/projects/project-ticketing-shug
vercel

# Follow interactive prompts
# Select your account
# Choose project name: project-ticketing-shug
# Accept defaults
# Wait for deployment
```

---

## Post-Deployment ✅

After deployment completes:

### Verify Live App

```bash
# Your app is at: https://project-ticketing-shug.vercel.app
# Or check your Vercel dashboard for exact URL
```

### Test All Features

In your live app:
1. ✅ Open homepage
2. ✅ Title displays "SHUG Ticket Master"
3. ✅ Current ticket shows "0000"
4. ✅ Click "Get Ticket" → Get a ticket number
5. ✅ Press Konami code (↑ ↑ ↓ ↓ ← → ← → B A)
6. ✅ Admin panel appears
7. ✅ Click "Pass to Next Ticket" → 0001
8. ✅ Refresh page → Data persists
9. ✅ Click "Logout" → Admin panel disappears

### Share Your App

Your live URL is shareable:
```
https://project-ticketing-shug.vercel.app
```

Send this to anyone to use your app!

### Monitor in Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. View:
   - Deployments history
   - Build logs
   - Performance metrics
   - Environment variables

---

## Future Updates

Every time you push to GitHub:

```bash
# Make changes
# ... edit code ...

# Commit and push
git add .
git commit -m "Your update message"
git push origin main

# Vercel auto-deploys! ✅
```

---

## Troubleshooting

### Build Fails

**Check:**
```bash
# Local build test
npm run build

# Look at error message
# Common issues:
# - Missing dependencies: npm install
# - Wrong file path: check imports
# - Syntax error: check app.vue
```

**View Vercel logs:**
1. Go to Vercel Dashboard
2. Select your project
3. Click on failed deployment
4. Read build logs for errors

### Avatar Not Showing

**Check file exists:**
```bash
ls -la public/avatar.svg
```

**If using different format:**
```bash
# Update app.vue
# Change line: <img src="/avatar.svg" ...
# To: <img src="/avatar.jpg" ...
```

### Data Not Persisting

- Check browser localStorage is enabled
- Clear browser cache
- Check browser console for errors
- Verify localStorage keys in DevTools

### Konami Code Not Working

- Only works with keyboard events
- Try in different browser
- Check browser console (F12)
- Verify sequence: ↑ ↑ ↓ ↓ ← → ← → B A

### Custom Domain Issues

1. Go to Vercel Dashboard
2. Project Settings → Domains
3. Add your domain
4. Update DNS records
5. Wait 24-48 hours for propagation

---

## Environment Variables (Optional)

If you add env vars later:

```bash
# Local .env.local
NUXT_PUBLIC_MY_VAR=value

# Vercel Dashboard
# Project Settings → Environment Variables
# Add each variable
# Redeploy
```

---

## Performance Optimization

### Check Performance Metrics

1. Vercel Dashboard → Analytics
2. View Core Web Vitals
3. Monitor error rates

### Optimize Images

```bash
# Compress avatar image
# Use TinyPNG, ImageOptim, or similar
# Keep file size < 200KB
```

### Enable Caching

Already configured in `vercel.json`

---

## Rollback to Previous Version

If deployment breaks:

1. Vercel Dashboard → Deployments
2. Find previous working version
3. Click "..."
4. Select "Promote to Production"

---

## Success Checklist

- [ ] GitHub account created
- [ ] GitHub repo created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Build completed successfully
- [ ] Live URL obtained
- [ ] All features tested on live app
- [ ] App shared with users/team
- [ ] Monitoring set up

---

## Quick Reference

| Step | Command | Time |
|------|---------|------|
| GitHub setup | `git push` | 2 min |
| Vercel import | Click buttons | 3 min |
| First build | Automatic | 3-5 min |
| Test live | Open URL | 2 min |
| **Total** | | **~12 min** |

---

## Questions?

- See [DEPLOY.md](DEPLOY.md) for detailed instructions
- Check [Vercel Docs](https://vercel.com/docs)
- Review [Nuxt Guide](https://nuxt.com/docs/getting-started/deployment)
- Check [README.md](README.md) for project info

---

## You're Ready! 🎉

Your app is ready to deploy. Follow the steps above and your SHUG Ticket Master will be live in ~12 minutes!

**Good luck! 🚀**
