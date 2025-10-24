# KICKZ - Premium Footwear E-Commerce Platform

A production-ready, Nike-level shoe e-commerce platform built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Supabase, and Stripe.

## 🚀 Features

### Core Functionality
- **Authentication**: Email/password + Google OAuth via Supabase
- **Product Management**: Full CRUD with image galleries, variants, and inventory
- **Shopping Cart**: Guest cart with localStorage sync and user cart merge
- **Wishlist**: Save favorite products for later
- **Checkout**: Multi-step checkout with Stripe integration
- **Order Management**: Complete order tracking and history
- **Admin Dashboard**: Analytics, order management, and product CRUD

### Technical Features
- **Next.js 15**: App Router, Server Actions, and latest features
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and micro-interactions
- **Supabase**: Database, authentication, and real-time features
- **Stripe**: Secure payment processing with webhooks
- **SEO Optimized**: Metadata, sitemap, and structured data
- **Performance**: Image optimization, lazy loading, and error boundaries

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Deployment**: Vercel (recommended)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

### 1. Clone the repository
```bash
git clone <repository-url>
cd shoes-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

#### Create Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Get your service role key from Settings > API (keep this secret!)

#### Run Database Migrations
```bash
# The database schema is already included in supabase/migrations/
# Run this in your Supabase dashboard SQL editor or via CLI
```

#### Seed the Database
```bash
npm run seed
```

This will create:
- Product categories
- Sample products
- Admin user (admin@nike.com / admin123)

### 5. Stripe Setup
1. Create a [Stripe account](https://stripe.com)
2. Get your publishable and secret keys from the dashboard
3. Set up webhooks pointing to `/api/webhooks/stripe`
4. Add the webhook secret to your environment variables

### 6. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles**: User profiles with roles
- **categories**: Product categories
- **products**: Product catalog
- **carts**: Shopping carts
- **cart_items**: Cart line items
- **wishlist**: User wishlists
- **orders**: Customer orders
- **order_items**: Order line items
- **addresses**: User addresses

## 🎨 Design System

The application follows a Nike-inspired design system:

### Colors
- **Primary**: Nike Orange (#FF6B35)
- **Secondary**: Nike Black (#000000)
- **Accent**: Various brand colors
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Display**: Large headings and hero text
- **Body**: Regular text and descriptions
- **Caption**: Small text and labels

### Components
- **Buttons**: Primary, secondary, outline variants
- **Cards**: Product cards, order cards, etc.
- **Forms**: Input fields with validation
- **Navigation**: Header with cart and user menu

## 📱 Pages & Routes

### Public Pages
- `/` - Homepage with hero and featured products
- `/products` - Product listing with filters
- `/products/[slug]` - Product detail page
- `/auth/login` - User login
- `/auth/signup` - User registration
- `/auth/reset-password` - Password reset

### Protected Pages
- `/account/orders` - User order history
- `/account/orders/[id]` - Order details
- `/checkout` - Checkout process
- `/wishlist` - User wishlist

### Admin Pages
- `/admin` - Dashboard overview
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/analytics` - Analytics dashboard

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run test         # Run tests
npm run seed         # Seed database with sample data
```

### Project Structure
```
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Authentication pages
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   └── products/       # Product pages
├── components/         # Reusable components
│   └── ui/            # shadcn/ui components
├── lib/               # Utility functions
│   ├── auth/          # Authentication helpers
│   ├── services/      # Business logic
│   ├── stripe/        # Stripe integration
│   └── supabase/      # Database client
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── scripts/           # Database seeding scripts
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Make sure to set all required environment variables in your deployment platform:

- All Supabase variables
- All Stripe variables (use production keys)
- `NEXT_PUBLIC_APP_URL` set to your production domain

### Database Setup for Production
1. Create a production Supabase project
2. Run migrations in production
3. Seed with production data
4. Update environment variables

## 🧪 Testing

The application includes comprehensive testing:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- Revenue tracking
- Order analytics
- Product performance
- User metrics

### Recommended Integrations
- **Google Analytics**: Add your GA ID to environment variables
- **Sentry**: Error tracking and monitoring
- **Hotjar**: User behavior analytics

## 🔒 Security

### Implemented Security Features
- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Role-based access control
- **Input Validation**: Zod schemas for all forms
- **CSRF Protection**: Built-in Next.js protection
- **Rate Limiting**: On authentication endpoints
- **Environment Variables**: Secure configuration

### Security Best Practices
- Never commit `.env.local` to version control
- Use HTTPS in production
- Regularly update dependencies
- Monitor for security vulnerabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- **Nike**: Design inspiration and brand guidelines
- **Supabase**: Backend-as-a-Service platform
- **Stripe**: Payment processing
- **Vercel**: Deployment platform
- **shadcn/ui**: Component library
- **Framer Motion**: Animation library

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.