# 🌟 Swaras AI - Your Personal Coding Mentor

> **Transform your coding journey with AI-powered mentorship from industry experts**

Swaras AI is an intelligent mentoring platform that brings the wisdom of renowned tech educators directly to your development workflow. Chat with AI-powered versions of industry legends like **Hitesh Choudhary** and **Piyush Garg** to accelerate your learning journey.

![Swaras AI](https://img.shields.io/badge/Swaras%20AI-v0.1.0-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Key Features

- **🎭 Expert AI Mentors**: Interactive AI personas based on real industry experts
- **💬 Intelligent Conversations**: Context-aware responses tailored to your skill level
- **🌙 Dark/Light Theme**: Beautiful, responsive design with theme persistence
- **📱 Responsive Design**: Seamless experience across all devices
- **🚀 Real-time Chat**: Instant AI responses with typing indicators
- **💾 Conversation History**: Never lose track of your learning progress
- **🎨 Modern UI**: Built with Tailwind CSS and Framer Motion animations
- **🔍 Smart Context**: AI understands your skill level and adjusts responses
- **⚡ Turbopack**: Lightning-fast development with Next.js Turbopack

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 15.4.6 |
| **React** | UI Library | 19.1.0 |
| **Tailwind CSS** | Styling | v4 |
| **Framer Motion** | Animations | 12.23.12 |
| **Zustand** | State Management | 5.0.7 |
| **Radix UI** | Headless Components | Latest |
| **Lucide React** | Icon Library | 0.539.0 |
| **OpenAI** | AI Integration | 5.12.2 |
| **React Hot Toast** | Notifications | 2.5.2 |
| **Next Themes** | Theme Management | 0.4.6 |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ installed
- **npm**, **yarn**, or **pnpm** package manager
- OpenAI API key or compatible AI service

### Installation

```bash
# Clone the repository
git clone https://github.com/SanjeevSaniel/swaras-ai.git
cd swaras-ai

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Optional: Custom AI Base URL
NEXT_PUBLIC_AI_BASE_URL=https://api.openai.com/v1

# App Configuration
NEXT_PUBLIC_APP_NAME="Swaras AI"
NEXT_PUBLIC_APP_VERSION="0.1.0"

# Optional: Analytics & Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Development Server

```bash
# Start development server with Turbopack
npm run dev

# Alternative package managers
yarn dev
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```Plaintext
swaras-ai/
├── src/
│   ├── app/                    # Next.js App Router (v15.4.6)
│   │   ├── layout.js          # Root layout with theme provider
│   │   ├── page.js            # Main application page
│   │   ├── globals.css        # Global styles and Tailwind v4
│   │   └── favicon.ico        # Application favicon
│   ├── components/            # React Components
│   │   ├── swaras-ai-refactored.jsx    # Main app component
│   │   ├── swaras-ai.jsx               # Alternative main component
│   │   ├── empty-persona-state.jsx     # Empty state when no mentor selected
│   │   ├── sidebar/           # Sidebar Components
│   │   │   ├── app-sidebar.jsx         # Main sidebar container
│   │   │   ├── persona-selector.jsx    # AI mentor selection component
│   │   │   ├── conversation-combobox.jsx # Chat history selector
│   │   │   ├── conversation-list.jsx   # List of recent conversations
│   │   │   └── animated-theme-toggle.jsx # Dark/light mode toggle
│   │   ├── chat/              # Chat Interface Components
│   │   │   ├── chat-header.jsx         # Chat area header
│   │   │   ├── chat-messages.jsx       # Message display area
│   │   │   └── chat-input.jsx          # Message input component
│   │   ├── welcome/           # Welcome/Onboarding
│   │   │   └── welcome-screen.jsx      # First-time user welcome
│   │   └── ui/                # Radix UI Components
│   │       ├── avatar.jsx     # User avatar component (@radix-ui/react-avatar)
│   │       ├── button.jsx     # Custom button variants
│   │       ├── command.jsx    # Command palette (cmdk)
│   │       ├── dialog.jsx     # Modal dialogs (@radix-ui/react-dialog)
│   │       ├── popover.jsx    # Popover menus (@radix-ui/react-popover)
│   │       ├── scroll-area.jsx # Custom scroll areas (@radix-ui/react-scroll-area)
│   │       ├── select.jsx     # Select dropdowns (@radix-ui/react-select)
│   │       ├── separator.jsx  # Visual separators (@radix-ui/react-separator)
│   │       ├── slot.jsx       # Slot component (@radix-ui/react-slot)
│   │       └── tooltip.jsx    # Tooltips (@radix-ui/react-tooltip)
│   ├── store/                 # Zustand State Management
│   │   └── chat-store.js      # Main application state store
│   ├── services/              # External Service Integration
│   │   └── ai-service.js      # OpenAI API integration (v5.12.2)
│   ├── constants/             # Application Constants
│   │   ├── personas.js        # AI mentor persona definitions
│   │   ├── personas-dataset.js # Extended mentor data
│   │   └── llm-prompts.js     # AI prompt templates and patterns
│   ├── lib/                   # Utility Functions
│   │   ├── utils.js           # General utility functions
│   │   ├── date-utils.js      # Date formatting utilities
│   │   └── cn.js              # Tailwind className utilities
│   └── providers/             # React Context Providers
│       └── theme-provider.jsx # Next-themes provider integration
├── public/                    # Static Assets
│   ├── favicon.ico           # Application favicon
│   ├── images/               # Image assets and avatars
│   │   ├── mentors/          # AI mentor avatar images
│   │   └── backgrounds/      # Background images
│   └── icons/                # Icon assets and logo variants
│       ├── logo.svg          # Application logo
│       └── favicon-variants/ # Different favicon sizes
├── config/                    # Configuration Files
│   ├── tailwind.config.js    # Tailwind CSS v4 configuration
│   ├── next.config.js        # Next.js configuration
│   ├── postcss.config.js     # PostCSS configuration
│   └── eslint.config.js      # ESLint v9 configuration
├── docs/                      # Documentation
│   ├── deployment.md         # Deployment guidelines
│   ├── contributing.md       # Contribution guidelines
│   └── api.md                # API documentation
├── .env.local.example        # Environment variables template
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
└── package.json             # Dependencies and scripts (v0.1.0)
```

### 📂 **Key Directory Explanations**

#### **`src/app/`** - Next.js App Router

- Built with Next.js 15.4.6 and React 19.1.0
- Uses the new App Router architecture
- Includes global styling with Tailwind CSS v4

#### **`src/components/`** - Component Architecture

- **Main Components**: Core application logic
- **Sidebar**: Navigation and mentor selection
- **Chat**: Conversation interface components
- **UI**: Reusable Radix UI components with custom styling

#### **`src/store/`** - State Management

- Powered by Zustand 5.0.7 for lightweight state management
- Handles chat state, theme preferences, and conversation history

#### **`src/services/`** - External Integrations

- OpenAI API integration (v5.12.2)
- AI service abstraction layer for easy provider switching

#### **`src/constants/`** - Configuration Data

- AI mentor persona definitions and prompts
- LLM prompt templates for consistent AI responses
- Application constants and configuration

#### **`src/lib/`** - Utility Functions

- Date formatting and manipulation utilities
- Tailwind className merging utilities
- General helper functions

## 🎭 Available AI Mentors

### 👨‍💻 Hitesh Choudhary

- **🎯 Expertise**: JavaScript, React, Node.js, MongoDB, Express, Full-Stack Development
- **🗣️ Teaching Style**: Patient, encouraging, uses Hinglish, practical examples
- **🚀 Specialty**: Beginner-friendly web development education with "Chai aur Code" approach
- **✅ Best For**: Learning modern web development from scratch, JavaScript fundamentals
- **💡 Catchphrases**: "Haanji!", "Chaliye start karte hain", "Samjho?"

### ⚡ Piyush Garg

- **🎯 Expertise**: System Design, Backend Architecture, Microservices, Docker, AWS, Scalability
- **🗣️ Teaching Style**: Confident, production-focused, modern best practices, direct approach
- **🚀 Specialty**: Building scalable systems and production-ready applications
- **✅ Best For**: System design interviews, backend optimization, DevOps practices
- **💡 Catchphrases**: "Trust me", "Production-ready", "Real-world application"

## 🔧 Configuration & Customization

### Adding New AI Mentors

Edit `src/constants/personas.js`:

```javascript
export const personas = {
  // Existing mentors...
  newMentor: {
    id: 'newMentor',
    name: 'New Mentor Name',
    avatar: '🚀',
    title: 'Senior Developer',
    subtitle: 'Specialist in Modern Tech',
    description: 'Expert in cutting-edge development practices...',
    accentColor: 'bg-gradient-to-r from-green-500 to-blue-500',
    bgColor: 'from-green-100 to-blue-100',
    expertise: ['React', 'Node.js', 'TypeScript'],
    teachingStyle: 'Practical and hands-on approach',
    catchphrases: ['Let\'s build!', 'Code first, explain later']
  }
};
```

### Customizing AI Prompts

Modify `src/constants/llm-prompts.js`:

```javascript
export const systemPrompts = {
  newMentor: `
    You are a senior developer mentor with expertise in modern web development.
    Your teaching style is practical and hands-on.
    Always provide working code examples and real-world applications.
    Encourage experimentation and learning through building.
  `
};
```

### Theme Customization

Update `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#your-color-50',
          500: '#your-color-500',
          900: '#your-color-900',
        }
      },
      animation: {
        'custom-bounce': 'bounce 1s infinite',
      }
    }
  }
}
```

## 🎨 Design System

### Color Palette

```css
/* Primary Gradients */
--gradient-purple-pink: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
--gradient-blue-cyan: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
--gradient-orange-red: linear-gradient(135deg, #F97316 0%, #EF4444 100%);

/* Semantic Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Typography Scale

```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Component Styling

```css
/* Card Components */
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700;
}

/* Button Variants */
.btn-primary {
  @apply bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-4 py-2 rounded-lg hover:shadow-lg transition-all;
}
```

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks
npm run lint:fix     # Auto-fix ESLint issues

# Quality Assurance
npm run type-check   # TypeScript type checking
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate test coverage report

# Deployment
npm run export       # Export static site
npm run analyze      # Analyze bundle size
npm run clean        # Clean build artifacts
```

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SanjeevSaniel/swaras-ai)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add OPENAI_API_KEY
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
out/

# Environment variables
OPENAI_API_KEY=your_key_here
NODE_VERSION=18
```

### Docker Deployment

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Railway

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## 🛠️ Development Workflow

### Git Workflow

```bash
# Feature development
git checkout -b feature/new-mentor-persona
git add .
git commit -m "feat: add new AI mentor persona with custom prompts"
git push origin feature/new-mentor-persona

# Create pull request to main branch
# After review and approval, merge to main
```

### Branch Structure

```Plaintext
main                     # Production-ready code
├── development         # Integration branch
│   ├── feature/ui-enhancements
│   ├── feature/ai-improvements
│   ├── feature/new-mentors
│   └── hotfix/critical-fixes
└── staging             # Pre-production testing
```

### Code Quality Standards

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 🔍 Troubleshooting

### Common Issues & Solutions

**🐛 Issue**: Hydration errors in development

```bash
# Solution: Clear Next.js cache and restart
rm -rf .next
npm run dev
```

**🐛 Issue**: Theme not persisting between sessions

```bash
# Check localStorage in browser DevTools
localStorage.getItem('theme')
# Should return 'light' or 'dark'
```

**🐛 Issue**: AI responses not working

```bash
# Verify environment variables
echo $OPENAI_API_KEY
# Check API key permissions and usage limits
```

**🐛 Issue**: Build failures with Tailwind CSS v4

```bash
# Ensure postcss.config.js is properly configured
# Check tailwind.config.js syntax for v4
npm run build -- --debug
```

**🐛 Issue**: Slow development server

```bash
# Use Turbopack for faster builds
npm run dev --turbopack
# Or add to package.json scripts
```

### Performance Optimization

```javascript
// Lazy loading components
const ChatMessages = dynamic(() => import('./chat/chat-messages'), {
  loading: () => <div>Loading messages...</div>
});

// Image optimization
import Image from 'next/image';
<Image 
  src="/mentor-avatar.jpg" 
  alt="Mentor" 
  width={50} 
  height={50}
  priority={true}
/>

// Bundle analysis
npm run analyze
```

## 🧪 Testing

### Unit Testing Setup

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
npm run test:watch
npm run test:coverage
```

### Example Test

```javascript
import { render, screen } from '@testing-library/react';
import { PersonaSelector } from '@/components/sidebar/persona-selector';

describe('PersonaSelector', () => {
  test('renders mentor options correctly', () => {
    render(<PersonaSelector />);
    
    expect(screen.getByText('Hitesh Choudhary')).toBeInTheDocument();
    expect(screen.getByText('Piyush Garg')).toBeInTheDocument();
  });
});
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup for Contributors

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
4. **Add tests if applicable**
5. **Ensure code quality**

   ```bash
   npm run lint
   npm run test
   npm run build
   ```

6. **Commit with conventional commits**

   ```bash
   git commit -m "feat: add amazing new feature"
   ```

7. **Push to your fork**

   ```bash
   git push origin feature/amazing-feature
   ```

8. **Create a Pull Request**

### Code Style Guidelines

- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages using [Conventional Commits](https://conventionalcommits.org/)
- Add JSDoc comments for complex functions
- Maintain component prop-types or TypeScript definitions

### Contribution Areas

- 🎭 **New AI Mentor Personas**: Add more industry experts
- 🎨 **UI/UX Improvements**: Enhance user experience
- 🧠 **AI Prompt Engineering**: Improve mentor responses
- 🚀 **Performance Optimization**: Make the app faster
- 🧪 **Testing**: Increase test coverage
- 📚 **Documentation**: Improve guides and examples
- 🌐 **Internationalization**: Add multi-language support

## 📊 Analytics & Monitoring

### Performance Metrics

```javascript
// Core Web Vitals tracking
export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    // Send to analytics service
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_label: metric.label,
      metric_delta: metric.delta,
    });
  }
}
```

### Error Monitoring

```javascript
// Sentry integration example
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 🔒 Security

### API Key Security

- ✅ Store API keys in environment variables
- ✅ Use server-side API routes for sensitive operations
- ✅ Implement rate limiting for API calls
- ✅ Validate and sanitize user inputs
- ✅ Use HTTPS in production

### Content Security Policy

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```Plaintext
MIT License

Copyright (c) 2024 Sanjeev Saniel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- **[Hitesh Choudhary](https://github.com/hiteshchoudhary)** - Inspiration for JavaScript mentorship and "Chai aur Code" teaching philosophy
- **[Piyush Garg](https://github.com/piyushgarg-dev)** - Inspiration for system design expertise and practical development approach
- **[Vercel](https://vercel.com)** - Hosting platform and Next.js framework
- **[OpenAI](https://openai.com)** - AI technology powering the mentor conversations
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Framer Motion](https://framer.com/motion)** - Animation library for smooth interactions
- **[Radix UI](https://radix-ui.com)** - Headless component library
- **Open Source Community** - All the amazing libraries and tools that make this possible

## 🌟 Support the Project

If Swaras AI has helped you in your coding journey, consider:

- ⭐ **Star the repository** on GitHub
- 🐛 **Report bugs** and suggest features
- 🤝 **Contribute code** or documentation
- 💬 **Share your experience** on social media
- ☕ **Buy us a chai** (support link coming soon!)

---

## 📞 Connect With Us

- **🌐 Website**: [swaras-ai.vercel.app](https://swaras-ai.vercel.app)
- **🐦 Twitter**: [@SanjeevSaniel](https://x.com/SanjeevSaniel)
- **📧 Email**: [Sanjeev Kujur](mailto:sanjeevsanielkujur7@outlook.com)
- **💼 LinkedIn**: [Sanjeev Saniel](https://linkedin.com/in/sanjeevsaniel)

---

<div align="center">

## **Made with ❤️ in Bengaluru, India**

**Happy Coding with Swaras AI!** 🚀✨

*Transform your learning journey, one conversation at a time.*

---

⭐ **Star us on GitHub** • 🐦 **Follow on Twitter** • 📢 **Join Discord Community**

</div>
