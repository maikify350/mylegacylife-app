# MyLegacyLife.AI - Next.js Application

![MyLegacyLife.AI](https://img.shields.io/badge/Next.js-16.1.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Connected-3ecf8e)

Voice-first storytelling platform for preserving family memories. Built with accessibility-first design for adults 50+ years old.

## 🎯 Features

- ✅ **Voice-First Recording**: Real-time speech-to-text using Web Speech API
- ✅ **60 Curated Questions**: Thoughtfully designed prompts across 7 life themes
- ✅ **Accessibility-First**: WCAG AA compliant, 18px+ fonts, 48px+ touch targets
- ✅ **Responsive Design**: Works on mobile, tablet, and desktop
- ✅ **Supabase Integration**: PostgreSQL database with Row Level Security
- ✅ **Beautiful UI**: Mocha Mousse theme with warm, inviting design

## 🚀 Live Demo

- **Homepage**: [View Demo](https://mylegacylife-app.vercel.app)
- **Voice Recorder**: [Try Recording](https://mylegacylife-app.vercel.app/demo)
- **Questions**: [Browse Questions](https://mylegacylife-app.vercel.app/questions)

## 📦 Tech Stack

- **Framework**: Next.js 16.1.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (planned)
- **Deployment**: Vercel
- **Voice**: Web Speech API

## 🛠️ Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/maikify350/mylegacylife-app.git
cd mylegacylife-app

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your Supabase credentials to .env.local
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
mylegacylife-app/
├── app/                    # Next.js App Router
│   ├── demo/              # Voice recorder demo page
│   ├── questions/         # Questions browse page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles (accessibility-first)
├── components/            # React components
│   ├── ui/               # UI component library
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   └── voice-recorder.tsx # Voice recording component
├── lib/                   # Utilities
│   ├── supabase/         # Supabase clients
│   │   ├── client.ts     # Browser client
│   │   ├── server.ts     # Server client
│   │   └── middleware.ts # Auth middleware
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
└── public/               # Static assets
```

## 🎨 Design System

### Colors (Mocha Mousse Theme)
- **Background**: #FAF7F2 (warm cream)
- **Primary**: #6B4E3D (mocha brown)
- **Accent**: #2D5F5D (deep teal)
- **Text**: #1F2937 (dark gray, high contrast)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Base Size**: 18px (not 16px - accessibility!)

### Accessibility
- ✅ WCAG AA compliant
- ✅ Minimum 4.5:1 contrast ratio
- ✅ 48px minimum touch targets
- ✅ Keyboard navigation
- ✅ Screen reader friendly

## 🗄️ Database Schema

Key tables:
- `questions` - Master question catalog (60 questions)
- `answers` - User story answers
- `subscriber_profiles` - User profiles
- `artifacts` - Photos, voice recordings
- `ancestry_trees` - Family trees (3 generations)
- `ancestry_members` - Family members

See `db/` folder for full schema.

## 🔐 Environment Variables

Required:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Optional (for future features):
```bash
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_key
GOOGLE_GEOCODING_API_KEY=your_google_key
```

## 📱 Browser Support

Voice recording works on:
- ✅ Chrome (Desktop & Android)
- ✅ Safari (Mac, iPhone, iPad)
- ✅ Microsoft Edge
- ❌ Firefox (limited support)

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel deployment instructions.

Quick deploy:
```bash
# Push to GitHub
git push origin main

# Vercel will auto-deploy
# Add environment variables in Vercel dashboard
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Git Commits

We follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance
- `a11y:` Accessibility improvements

## 🗺️ Roadmap

### ✅ Phase 1 - MVP (Complete)
- [x] Project setup
- [x] Database schema
- [x] Voice recorder component
- [x] Questions page
- [x] Homepage
- [x] UI component library

### 🚧 Phase 2 - Core Features (In Progress)
- [ ] Authentication (magic links)
- [ ] User dashboard
- [ ] Answer submission flow
- [ ] Photo upload
- [ ] AI writing assistance

### 📋 Phase 3 - Advanced Features
- [ ] Family tree builder
- [ ] Book preview
- [ ] Sharing & permissions
- [ ] Book ordering
- [ ] Stripe billing

## 🤝 Contributing

This is a private project. For questions or suggestions, contact the development team.

## 📄 License

Proprietary - All rights reserved

## 👥 Team

- **Developer**: Antigravity AI
- **Product Owner**: maikify350
- **Database**: Supabase (zuklmhukxmycheahxmcr)

## 📞 Support

For issues or questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review [docs/History.md](../docs/History.md) for project timeline
- Check [docs/FAQs.md](../docs/FAQs.md) for common questions

---

**Built with ❤️ for preserving family memories**
