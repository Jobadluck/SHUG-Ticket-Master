# Quick Start Guide

## Welcome to SHUG Ticket Master!

This is a modern queue ticketing system built with Nuxt 3 and ready to deploy on Vercel.

### What You Have

✅ **Nuxt 3 Web Application** - Latest Vue 3 framework  
✅ **Responsive Design** - Works on all devices  
✅ **Vercel Ready** - Configured and tested for deployment  
✅ **Professional UI** - Modern colors and clean layout  
✅ **Ticket System** - Real-time current ticket and user ticket generation  

### Quick Start

1. **Development Mode**
   ```bash
   npm run dev
   ```
   Opens on `http://localhost:3000`

2. **Production Build**
   ```bash
   npm run build
   npm run preview
   ```

3. **Deploy to Vercel**
   
   **Option A - Via Git:**
   - Push to GitHub
   - Connect repo to Vercel dashboard
   - Auto-deploys!
   
   **Option B - Via CLI:**
   ```bash
   npm i -g vercel
   vercel
   ```

### Files to Customize

| File | Purpose | What to Change |
|------|---------|-----------------|
| `public/avatar.svg` | Company logo | Replace with your image |
| `assets/styles/main.css` | Colors | Update CSS variables |
| `app/app.vue` | Main page | Add features/modify layout |

### Feature Highlights

- **Current Ticket**: Updates every 5 seconds (simulated)
- **Get Ticket**: Users can request unique ticket numbers
- **Responsive**: Perfect on mobile, tablet, and desktop
- **Professional Colors**: Blue, Green, Slate, Amber, Red palette

### API Integration

To connect a real backend, modify `app/app.vue`:

```typescript
// Replace the getTicket function
const getTicket = async () => {
  const response = await $fetch('/api/ticket', { method: 'POST' })
  myTicket.value = response.ticketNumber
}
```

### Troubleshooting

**Port already in use?**
```bash
npm run dev -- -p 3001
```

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Need Help?

- Check [Nuxt docs](https://nuxt.com)
- Review `README.md` for detailed info
- Check `.github/copilot-instructions.md` for setup notes

Good luck with your deployment! 🚀
