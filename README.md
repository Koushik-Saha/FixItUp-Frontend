# 🚀 Max Fix IT - Installation & Setup Guide

## Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm
- Git

## Step 1: Initial Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# or
yarn install

# or
pnpm install
```

## Step 2: Environment Variables

Create a `.env.local` file in the root of the frontend directory:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Feature Flags
NEXT_PUBLIC_ENABLE_3D_PREVIEW=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Payment (Later integration)
# NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Storage (Later integration)
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Step 3: Install Additional Tailwind Plugin

```bash
npm install tailwindcss-animate
```

## Step 4: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Step 5: Build for Production

```bash
# Type check
npm run type-check

# Build
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 15 app directory
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── products/           # Product pages
│   │   ├── cart/               # Cart page
│   │   ├── checkout/           # Checkout page
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # User dashboards
│   │   └── business/           # Business-specific pages
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   ├── layout/             # Layout components
│   │   ├── product/            # Product components
│   │   ├── cart/               # Cart components
│   │   └── dashboard/          # Dashboard components
│   │
│   ├── lib/                    # Utilities & helpers
│   │   └── utils.ts            # Utility functions
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Auth hook
│   │   ├── useCart.ts          # Cart hook
│   │   └── useProducts.ts      # Products hook
│   │
│   ├── store/                  # Zustand stores
│   │   └── index.ts            # Global state
│   │
│   ├── types/                  # TypeScript types
│   │   └── index.ts            # Type definitions
│   │
│   └── styles/                 # Global styles
│       └── globals.css         # Tailwind & global CSS
│
├── public/                     # Static assets
│   ├── images/                 # Images
│   ├── icons/                  # Icons
│   └── fonts/                  # Custom fonts (if any)
│
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Features Implemented

### ✅ Phase 1 (Current)
- [x] Design system with color tokens
- [x] Responsive layout system
- [x] UI component library
- [x] State management (Zustand)
- [x] Type definitions
- [x] Homepage structure (3 user views)
- [x] Product card components
- [x] Navigation system
- [x] Cart functionality
- [x] Animations with Framer Motion

### 🔄 Phase 2 (Next Steps)
- [ ] Product listing & filters
- [ ] Product detail pages
- [ ] Search functionality
- [ ] Device finder
- [ ] Checkout flow
- [ ] Authentication pages

### 📋 Phase 3 (Future)
- [ ] User dashboards
- [ ] Business dashboard
- [ ] Admin panel
- [ ] 3D product previews
- [ ] Order tracking
- [ ] Payment integration

## Key Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion + GSAP
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Data Fetching**: TanStack Query

## Performance Optimizations

1. **Image Optimization**: Next.js Image component with WebP/AVIF
2. **Code Splitting**: Automatic route-based splitting
3. **Tree Shaking**: Optimized imports
4. **Lazy Loading**: Dynamic imports for heavy components
5. **Caching**: React Query for server state
6. **Font Optimization**: Next.js font optimization

## Accessibility Features

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast (WCAG AA)

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Common Issues & Solutions

### Issue: Module not found errors
**Solution**: Run `npm install` again and restart dev server

### Issue: Tailwind classes not applying
**Solution**: Make sure `globals.css` is imported in `layout.tsx`

### Issue: Type errors
**Solution**: Run `npm run type-check` to see all type errors

### Issue: Slow development server
**Solution**: 
- Clear `.next` folder: `rm -rf .next`
- Restart development server

## Next Steps

1. ✅ Complete component library
2. ✅ Build homepage variations
3. 🔄 Create product listing page
4. 🔄 Implement search & filters
5. 🔄 Build product detail page
6. 🔄 Create cart & checkout flow
7. 🔄 Add authentication
8. 🔄 Build dashboards
9. 🔄 Add animations
10. 🔄 Connect to backend API

## Support

For questions or issues, refer to:
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Documentation: https://react.dev

---

**Ready to build?** Start with `npm run dev` and open `http://localhost:3000`
