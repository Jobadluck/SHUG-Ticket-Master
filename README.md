# SHUG Ticket Master

A modern queue ticketing web application built with Nuxt 3, designed for easy deployment on Vercel.

## Features

- **Real-time Ticket Display**: Shows the current ticket being served
- **Ticket Generation**: Users can request a ticket and receive their unique ticket number
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with a gradient background
- **Circular Avatar**: Company branding with a circular profile image

## Color Palette

The application uses a professional color scheme:
- **Primary**: #2563eb (Blue)
- **Secondary**: #64748b (Slate)
- **Accent**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Danger**: #ef4444 (Red)

## Getting Started

### Prerequisites

- Node.js 20.17+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run generate` - Generate static site

## Deployment on Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Deploy via Git (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect the Nuxt 3 project and deploy it

### Configuration

The project includes a `vercel.json` configuration file that specifies:
- Build command: `npm run build`
- Output directory: `.output/public`
- Install command: `npm install`

### Environment Variables (if needed)

Add environment variables in the Vercel dashboard under Project Settings → Environment Variables

## Project Structure

```
project-ticketing-shug/
├── app/
│   └── app.vue              # Main application component
├── assets/
│   └── styles/
│       └── main.css         # Global styles
├── pages/                   # Auto-generated routes (can be added)
├── public/
│   └── avatar.svg          # Company avatar/logo
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── vercel.json             # Vercel deployment configuration
└── package.json            # Project dependencies
```

## Technologies Used

- **Nuxt 3** - Vue 3 framework with server-side rendering
- **Vue 3** - Progressive JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next generation frontend build tool

## Features Explained

### Current Ticket Display
- Shows the ticket number currently being served by SHUG
- Updates automatically every 5 seconds (can be connected to a real API)

### Get Ticket Button
- Users click to request a new ticket
- Assigns a unique ticket number
- Displays the user's ticket number next to the button

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly buttons and interfaces

## Customization

### Changing Colors
Edit `assets/styles/main.css` and update the CSS variables in the `:root` selector:

```css
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --accent: #10b981;
  /* ... */
}
```

### Updating the Avatar
Replace `public/avatar.svg` with your own image. Supported formats:
- SVG (recommended)
- PNG
- JPG
- WebP

### Integrating with a Backend API
Modify the `getTicket()` function in `app/app.vue` to call your backend API:

```typescript
const getTicket = async () => {
  const response = await $fetch('/api/ticket', { method: 'POST' })
  myTicket.value = response.ticketNumber
}
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For questions or issues, please create an issue in the repository.

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
