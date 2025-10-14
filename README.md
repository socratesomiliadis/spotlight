# 🎯 Spotlight

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=flat-square&logo=clerk)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**Spotlight** is a modern platform for celebrating and showcasing the best in design, web development, and motion graphics. It provides creators with a beautiful space to display their work, connect with other professionals, and discover trending projects in the creative industry.

> **⚠️ Under Development**  
> This project is currently in active development. Features may be incomplete, and breaking changes may occur.

## ✨ Features

### 🚀 Core Features

- **User Profiles**: Customizable profiles with avatar, banner, bio, and social links
- **Project Showcase**: Upload and display creative projects with detailed information
- **Social Following**: Follow other creators and build your network
- **Project Discovery**: Browse and discover amazing creative work
- **Responsive Design**: Optimized for all devices with a mobile-first approach

### 🎨 Design & UX

- **Modern Interface**: Clean, minimalist design with smooth animations
- **Custom Typography**: Helvetica Neue font family for premium feel
- **Interactive Elements**: GSAP-powered animations and transitions
- **Mobile Navigation**: Intuitive bottom navigation for mobile users
- **Hero UI Components**: Polished UI components with HeroUI library

### 🔐 Authentication & Security

- **Clerk Integration**: Secure authentication with social login support
- **Protected Routes**: Middleware-based route protection
- **User Management**: Complete user onboarding and profile management

## 🛠 Tech Stack

### Frontend

- **[Next.js 15.3.3](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[HeroUI](https://heroui.com/)** - Modern React UI components
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components

### Backend & Database

- **[Supabase](https://supabase.com/)** - PostgreSQL database with real-time features
- **[Clerk](https://clerk.com/)** - Authentication and user management
- **Server-Side Rendering** - Optimized performance with RSC

### Animations & Interactions

- **[GSAP](https://greensock.com/gsap/)** - Professional-grade animations
- **[Lenis](https://lenis.studiofreight.com/)** - Smooth scrolling
- **[Split Type](https://www.split-type.com/)** - Text animation utilities
- **[Three.js](https://threejs.org/)** - 3D graphics and animations

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Zod](https://zod.dev/)** - Schema validation
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Class Variance Authority](https://cva.style/)** - Component variants

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or later
- **pnpm** (recommended) or npm
- **Supabase** account
- **Clerk** account
- **Google Maps API** key (for location autocomplete)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/spotlight.git
   cd spotlight
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/welcome
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/welcome

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Google Maps API (for location autocomplete)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

   # Webhooks
   CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
   ```

4. **Database Setup**

   The project uses Supabase with the following tables:
   - `profile` - User profiles and metadata
   - `project` - Creative projects and portfolios
   - `socials` - Social media links
   - `follows` - User following relationships

   Run the Supabase migrations:

   ```bash
   npx supabase db reset
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
spotlight/
├── app/                          # Next.js App Router
│   ├── [username]/              # Dynamic user profile pages
│   │   ├── components/          # Profile-specific components
│   │   ├── edit/               # Profile editing interface
│   │   └── page.tsx            # User profile page
│   ├── api/                    # API routes
│   │   └── clerkWebhook/       # Clerk user sync webhook
│   ├── projects/               # Project showcase
│   │   ├── [slug]/            # Individual project pages
│   │   └── new/               # Project creation
│   ├── welcome/               # User onboarding
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Homepage
├── components/                 # Reusable UI components
│   ├── AuthPages/             # Authentication components
│   ├── BottomNav/             # Mobile navigation
│   ├── Forms/                 # Form components
│   ├── Header/                # App header and navigation
│   ├── Home/                  # Homepage components
│   ├── icons/                 # Custom icon components
│   ├── Lanyard/               # Discord Lanyard integration
│   └── ui/                    # Base UI components
├── lib/                       # Utility libraries
│   ├── gsap/                  # Animation utilities
│   ├── supabase/              # Database client and actions
│   └── utils.ts               # Common utilities
├── hooks/                     # Custom React hooks
├── fonts/                     # Custom font files
├── public/                    # Static assets
│   ├── static/images/         # Image assets
│   └── models/                # 3D models
├── supabase/                  # Supabase configuration
└── styles/                    # Global styles
```

## 🎯 Usage

### Creating a Profile

1. Sign up using Clerk authentication
2. Complete the welcome flow
3. Add your profile information, avatar, and social links
4. Start showcasing your creative work

### Uploading Projects

1. Navigate to `/projects/new`
2. Fill in project details (title, description, tools used)
3. Upload project images and banner
4. Publish your project to the community

### Discovering Content

- Browse the homepage for featured projects
- Visit user profiles to see their portfolios
- Use the search functionality to find specific creators or projects
- Follow other creators to stay updated with their work

### Profile Management

- Edit your profile at `/[username]/edit`
- Manage your projects and visibility settings
- Connect social media accounts
- View your follower/following statistics

## 🔧 Configuration

### Custom Fonts

The project uses Helvetica Neue as the primary typeface. Font files are located in `/fonts/` and configured in the root layout.

### Styling

- Tailwind CSS with custom color palette
- HeroUI component library integration
- Custom design tokens for consistent spacing and typography
- Responsive breakpoints optimized for modern devices

### Animations

- GSAP for complex animations and transitions
- Lenis for smooth scrolling experience
- Three.js for 3D elements and interactive graphics

## 🚀 Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms

The app can be deployed to any platform supporting Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write responsive, mobile-first CSS
- Test on multiple devices and browsers

## 🔗 Links

- [Live Demo](https://spotlight-awards.vercel.app)

---

**Built with ❤️ by the Spotlight team**
