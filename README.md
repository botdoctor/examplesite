# Onerverse

A modern website built with Astro, featuring a liquid glass theme and interactive 3D visualizations.

## 🚀 Features

- **Liquid Glass Design**: Glassmorphism effects throughout the site
- **3D Visualization**: Interactive Three.js scene with red scanning effect
- **Responsive Design**: Fully responsive across all devices
- **Partners Section**: Showcase of influencers and collaborators
- **Cloudflare Deployment**: Optimized for Cloudflare Pages

## 🛠️ Tech Stack

- [Astro](https://astro.build) - Static Site Generator
- [React](https://react.dev) - For interactive components
- [Three.js](https://threejs.org) - 3D graphics
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org) - Type safety

## 🏃‍♂️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌍 Deployment

### Cloudflare Pages

This site is configured for automatic deployment to Cloudflare Pages.

#### Manual Setup:

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Set Node.js version: `20`

#### GitHub Actions Setup:

Add these secrets to your GitHub repository:
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

The site will automatically deploy on push to the `main` branch.

## 📝 Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── About.astro
│   │   ├── Contact.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── HeroSimple.tsx
│   │   ├── Navigation.astro
│   │   └── Partners.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## 🎨 Customization

### Colors
The liquid glass theme uses custom CSS variables defined in `src/styles/global.css`:
- Primary gradient: Purple to pink
- Glass effects: White with low opacity
- Background: Black

### Components
All components are modular and can be easily customized in their respective files.

## 📄 License

MIT