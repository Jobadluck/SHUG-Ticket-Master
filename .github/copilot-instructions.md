# SHUG Ticket Master - Project Configuration

This is a Nuxt 3 queue ticketing application optimized for Vercel deployment.

## Project Setup Status

- [x] Nuxt 3.17.7 initialized with minimal template
- [x] Dependencies installed and configured
- [x] Vercel deployment configuration created
- [x] Styling with custom CSS and Tailwind support
- [x] Ticket management UI implemented
- [x] Build process verified and working

## Key Configurations

### Build & Deployment
- **Framework**: Nuxt 3 (Vue 3)
- **Build Tool**: Vite
- **CSS**: Custom CSS with Tailwind CSS support
- **Output**: Server-side rendered application
- **Deployment**: Configured for Vercel with `vercel.json`

### Application Features
- Real-time current ticket display
- Ticket request functionality
- Responsive design for all devices
- Professional color palette (Blue, Green, Slate, Amber, Red)
- Circular avatar with SVG support

## Development Commands

```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Deployment Instructions

### Deploy to Vercel

1. **Via GitHub Integration (Recommended)**:
   - Push code to GitHub
   - Connect repository to Vercel dashboard
   - Vercel auto-detects Nuxt and deploys

2. **Via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Via Git Push** (if configured):
   - Push to main branch
   - Automatic deployment triggers

### Environment Setup
- Node.js 20.17+ required
- All dependencies in `package.json`
- No additional environment variables needed for basic setup

## File Structure

- `app/app.vue` - Main application component
- `assets/styles/main.css` - Global styling and color palette
- `public/avatar.svg` - Company avatar/logo
- `nuxt.config.ts` - Nuxt configuration with prerender settings
- `vercel.json` - Vercel deployment configuration
- `tailwind.config.js` - Tailwind CSS custom configuration
- `postcss.config.js` - PostCSS setup for CSS processing

## Customization Notes

- Colors defined in `assets/styles/main.css` CSS variables
- Avatar image at `public/avatar.svg` (replace with your image)
- Ticket numbers can be connected to backend API
- Current ticket updates every 5 seconds (simulation mode)

## Troubleshooting

- **Build fails**: Run `npm install` to ensure dependencies are installed
- **Node version**: Ensure Node.js 20.17 or higher is installed
- **Deployment issues**: Check Vercel logs in dashboard

## Next Steps

1. Customize company branding (update avatar, colors)
2. Connect to backend API for real ticket management
3. Add authentication if needed
4. Deploy to Vercel when ready
