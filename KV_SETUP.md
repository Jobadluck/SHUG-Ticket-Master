# Vercel KV Setup Guide

This app now uses **Vercel KV (Redis)** to sync ticket data across all devices in real-time.

## Setup Instructions

### 1. Go to Vercel Dashboard
- Visit https://vercel.com/dashboard
- Select your project (SHUG-Ticket-Master)

### 2. Enable Vercel KV
- Click **Storage** tab (top navigation)
- Click **Create Database**
- Select **KV** (Redis)
- Name it something like `shug-tickets`
- Select your region (closest to you)
- Click **Create**

### 3. Connect to Your Project
- Once created, you'll see connection details
- Click **Connect Project**
- Select your project
- Vercel automatically adds environment variables

### 4. Environment Variables (Auto-Added)
Vercel automatically sets these, but if you need them manually:
```
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

### 5. Deploy
Simply push your code:
```bash
git push origin main
```

Vercel will automatically:
1. Detect the changes
2. Deploy with KV enabled
3. All API routes will work

## How It Works

**Data Synced Across Devices:**
- ✅ Current ticket being served
- ✅ Ticket queue (all pending tickets)
- ✅ Automatic daily reset at midnight UTC

**API Routes:**
- `GET /api/tickets` - Fetch current state
- `POST /api/tickets/get` - Request a new ticket
- `POST /api/tickets/pass` - Move to next ticket
- `POST /api/tickets/reset` - Reset all tickets

**All devices** visiting the app will see:
- Real-time queue updates
- Same "Now Serving" number
- Completed tickets disappear immediately when passed

## Local Testing (Optional)

If you want to test locally with KV:

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Pull KV credentials
vercel env pull

# Run dev server
npm run dev
```

## Troubleshooting

**"KV not available"?**
- Go to Vercel dashboard → Storage
- Make sure your KV database is created and connected
- Redeploy

**Data not syncing?**
- Check browser console for API errors
- Verify KV database is still active in Vercel
- Check Vercel deployment logs

**Want to clear all data?**
- In Vercel dashboard → KV database → clear or delete keys manually

## Usage

No changes needed! The app works exactly the same:
1. Enter your name and get a ticket
2. Admin (Konami code/triple tap) passes to next ticket
3. All **devices see updates in real-time**

That's it! 🎉
