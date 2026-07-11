# 🌟 DANN Portfolio

> A modern, full-stack developer portfolio built with Next.js 16, React 19, and Tailwind CSS v4. Features a stunning starfield animation, admin panel with file uploads, and a terminal console.

[![GitHub stars](https://img.shields.io/github/stars/DANN-Network/portfolio-next?style=for-the-badge&logo=github&color=6366f1)](https://github.com/DANN-Network/portfolio-next/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/DANN-Network/portfolio-next?style=for-the-badge&logo=github&color=a855f7)](https://github.com/DANN-Network/portfolio-next/network)
[![GitHub issues](https://img.shields.io/github/issues/DANN-Network/portfolio-next?style=for-the-badge&logo=github&color=ec4899)](https://github.com/DANN-Network/portfolio-next/issues)
[![GitHub license](https://img.shields.io/github/license/DANN-Network/portfolio-next?style=for-the-badge&color=f59e0b)](https://github.com/DANN-Network/portfolio-next/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌌 **Starfield Background** | Interactive 400-star parallax canvas with mouse tracking |
| 🎨 **Modern UI/UX** | Glassmorphism cards, gradient text, smooth animations |
| 📱 **Fully Responsive** | Mobile-first design, works on all devices |
| 🛠 **Admin Panel** | Password-protected CMS for projects, messages, settings |
| 📁 **File Upload** | Drag & drop image uploads (base64 stored in localStorage) |
| 🖼 **Image Gallery** | Curated Unsplash gallery + custom URL support |
| 💻 **Terminal Console** | Built-in terminal with commands (`help`, `projects`, `admin`, etc.) |
| 📝 **Contact Form** | Functional message system with localStorage persistence |
| ⚡ **Performance** | Next.js 16 Turbopack, optimized builds |

---

## 📸 Screenshots

### Hero Section
![Hero](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop)
*Interactive starfield with parallax mouse tracking*

### About Section
![About](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop)
*Profile avatar, editable bio paragraphs, social links*

### Projects Grid
![Projects](https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop)
*Project cards with thumbnails, tags, GitHub/Live links*

### Skills Section
![Skills](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop)
*Animated progress bars with category filters*

### Admin Panel
![Admin](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop)
*Password-protected CMS with project CRUD, media gallery, settings*

### Terminal Console
![Terminal](https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop)
*Built-in terminal with custom commands*

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/DANN-Network/portfolio-next.git
cd portfolio-next

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:2222](http://localhost:2222) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🔐 Admin Access

| Action | Shortcut |
|--------|----------|
| Open Terminal | `Ctrl + \`` |
| Open Admin Panel | Type `admin` in terminal or click ☰ → `☆ Admin` |
| Password | `dann2026` |

### Admin Features
- **Dashboard** - Stats overview
- **Projects** - Add/Edit/Delete with image upload
- **Messages** - View/Delete contact messages
- **Settings** - Update name, tagline, email
- **About** - Edit bio paragraphs + profile image
- **Media** - Hero background + profile image with gallery picker

---

## 🎮 **📁 File Upload**

Images are converted to base64 and stored in `localStorage`. For production, replace with a proper image hosting service (Cloudinary, AWS S3, etc.).

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS v4, CSS Variables |
| **Fonts** | Poppins, JetBrains Mono, Inter |
| **Icons** | Font Awesome 6 |
| **State** | React Context + localStorage |
| **Animations** | CSS Keyframes, IntersectionObserver |
| **Dev Tools** | Turbopack, ESLint, TypeScript |

---

## 📁 Project Structure

```
portfolio-next/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles + Tailwind v4 theme
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Home page (Hero + sections)
│   │   └── providers.tsx        # Context providers
│   ├── components/
│   │   ├── admin-panel.tsx      # Admin CMS (password protected)
│   │   ├── about.tsx            # About section with editable content
│   │   ├── contact.tsx          # Contact form + info
│   │   ├── footer.tsx           # Footer with social links
│   │   ├── hero.tsx             # Hero with starfield canvas
│   │   ├── nav.tsx              # Navigation with mobile menu
│   │   ├── projects.tsx         # Projects grid with thumbnails
│   │   ├── skills.tsx           # Skills with animated progress bars
│   │   ├── terminal-console.tsx # Terminal with commands
│   │   └── footer.tsx
│   └── lib/
│       ├── store.ts             # Zustand-like localStorage store
│       └── types.ts             # TypeScript types
├── public/                      # Static assets
├── next.config.ts               # Next.js config
├── tailwind.config.ts           # Tailwind config (v4 uses CSS)
├── tsconfig.json
└── package.json
```

---

## 🎨 Customization

### Colors
Edit `src/app/globals.css` → `@theme inline` section:
```css
@theme inline {
  --color-primary: 6366f1;    /* Indigo */
  --color-secondary: a855f7;  /* Purple */
  --color-accent: ec4899;     /* Pink */
}
```

### Content
- **Profile**: Admin Panel → Settings / About
- **Projects**: Admin Panel → Projects
- **Skills**: Edit `SKILLS` array in `src/components/skills.tsx`
- **Social Links**: Edit arrays in `about.tsx`, `contact.tsx`, `footer.tsx`

### Starfield
Adjust in `src/components/hero.tsx`:
```tsx
const STAR_COUNT = 400  // Number of stars
```

---

## 📦 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Your production URL |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⭐ Support

If you like this portfolio, please give it a star! It helps others discover it.

[![Star History Chart](https://api.star-history.com/svg?repos=DANN-Network/portfolio-next&type=Date)](https://star-history.com/#DANN-Network/portfolio-next&Date)

### Donate

If you want to support development:

[![Donate](https://files.catbox.moe/71kraj.jpeg)](https://files.catbox.moe/71kraj.jpeg)

---

## 📄 License

MIT License - feel free to use this for your own portfolio!

---

## 👨‍💻 Author

**Danish Ata Mahendra**
- GitHub: [@DANN-Network](https://github.com/DANN-Network)
- LinkedIn: [@gantengdann](https://linkedin.com/in/gantengdann)
- Instagram: [@gantengdann](https://instagram.com/gantengdann)
- Email: [danishata8@gmail.com](mailto:danishata8@gmail.com)

---

<div align="center">
  <sub>Built with ❤️ using Next.js, React, and Tailwind CSS</sub>
</div>