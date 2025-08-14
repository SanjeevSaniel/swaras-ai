# **Swaras AI - Code with Legends** 🚀

> **Your Personal AI-Powered Coding Mentorship Platform**

Experience coding mentorship like never before with AI personas of legendary developers. Get personalized guidance, interactive learning, and instant solutions to your programming challenges.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

## **🎭 AI Mentor Personas**

- **Interactive Mentors**: Chat with AI personas of legendary developers
- **Dynamic Selection**: Click to select/deselect mentors with smooth animations
- **Scalable System**: Easily add new mentor personalities
- **Expertise Display**: View each mentor's specializations and skills

## **💬 Advanced Chat System**

- **Real-time Conversations**: Seamless chat interface with typing indicators
- **Message History**: Persistent conversation storage with local persistence
- **Smart Grouping**: Conversations organized by date (Today, Yesterday, This Week)
- **Message Actions**: Copy, like/dislike functionality for AI responses

## **🎨 Beautiful UI/UX**

- **Card-Based Design**: Desktop app-like interface with glassmorphism effects
- **Theme Support**: Smooth dark/light mode toggle with system preference detection
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Micro-Animations**: Engaging hover effects and smooth transitions

## **🔄 State Management**

- **Persistent Storage**: Conversations and preferences saved locally
- **Smart Context**: Maintains conversation context across sessions
- **Toggle Functionality**: Click active mentor again to deselect
- **Empty State Handling**: Beautiful onboarding experience for new users

## **📱 User Experience**

- **Auto-Scroll**: Messages automatically scroll to bottom for new content
- **Search Functionality**: Find specific conversations quickly
- **Quick Actions**: Delete conversations with confirmation
- **Visual Feedback**: Clear indicators for active states and user actions

## **🛠️ Tech Stack**

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 14.x |
| **React** | UI Library | 18.x |
| **Tailwind CSS** | Styling Framework | 3.x |
| **Framer Motion** | Animation Library | 10.x |
| **Zustand** | State Management | 4.x |
| **Lucide React** | Icon Library | Latest |
| **React Hot Toast** | Notifications | Latest |

## **🚀 Quick Start**

### **Prerequisites**

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### **Installation**

```bash
# Clone the repository
git clone https://github.com/your-username/swaras-ai.git
cd swaras-ai

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### **Environment Setup**

Create a `.env.local` file in the root directory:

```env
# AI Service Configuration
NEXT_PUBLIC_AI_API_KEY=your_ai_api_key_here
NEXT_PUBLIC_AI_BASE_URL=https://api.openai.com/v1

# App Configuration
NEXT_PUBLIC_APP_NAME="Swaras AI"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### **Development Server**

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## **📁 Project Structure**

```Plaintext
swaras-ai/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── layout.js          # Root layout with theme provider
│   │   ├── page.js            # Home page component
│   │   └── globals.css        # Global styles and utilities
│   ├── components/            # React components
│   │   ├── swaras-ai-refactored.jsx    # Main app component
│   │   ├── empty-persona-state.jsx     # Empty state component
│   │   ├── sidebar/           # Sidebar components
│   │   │   ├── app-sidebar.jsx
│   │   │   ├── persona-selector.jsx
│   │   │   ├── conversation-combobox.jsx
│   │   │   └── animated-theme-toggle.jsx
│   │   ├── chat/              # Chat components
│   │   │   ├── chat-header.jsx
│   │   │   ├── chat-messages.jsx
│   │   │   └── chat-input.jsx
│   │   └── ui/                # Reusable UI components
│   ├── store/                 # State management
│   │   └── chat-store.js      # Zustand store configuration
│   ├── services/              # API services
│   │   └── ai-service.js      # AI integration service
│   ├── constants/             # App constants
│   │   └── personas.js        # Mentor persona definitions
│   ├── lib/                   # Utility functions
│   │   ├── utils.js           # General utilities
│   │   └── date-utils.js      # Date formatting utilities
│   └── providers/             # Context providers
│       └── theme-provider.jsx # Theme context provider
├── public/                    # Static assets
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
└── package.json               # Project dependencies
```

## **🎭 Available Mentors**

### **👨💻 Hitesh Choudhary**

- **Expertise**: JavaScript, React, Node.js, MongoDB, Express
- **Specialty**: Full-stack web development and YouTube education
- **Best For**: Learning modern web development stack

### **⚡ Piyush Garg**

- **Expertise**: System Design, Backend Architecture, Microservices, Docker, AWS
- **Specialty**: Scalable system architecture and backend development
- **Best For**: Understanding system design and backend optimization

## **🔧 Configuration**

### **Adding New Mentors**

Edit `src/constants/personas.js`:

```javascript
export const personas = {
  // Existing mentors...
  newMentor: {
    id: 'newMentor',
    name: 'New Mentor Name',
    avatar: '🚀',
    title: 'Mentor Title',
    subtitle: 'Mentor Subtitle',
    description: 'Mentor description and background',
    accentColor: 'bg-gradient-to-r from-green-500 to-blue-500',
    bgColor: 'from-green-100 to-blue-100',
    expertise: ['Skill1', 'Skill2', 'Skill3']
  }
};
```

### **Customizing Themes**

Modify theme colors in `src/styles/globals.css`:

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* Add your custom CSS variables */
}
```

### **AI Service Integration**

Update `src/services/ai-service.js` to connect with your preferred AI provider:

```javascript
// Configure your AI service endpoint
const AI_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_AI_API_KEY,
  baseUrl: process.env.NEXT_PUBLIC_AI_BASE_URL,
  model: 'gpt-3.5-turbo' // or your preferred model
};
```

## **🎨 Design System**

### **Color Palette**

- **Primary**: Purple to Pink gradient (`from-purple-500 to-pink-500`)
- **Secondary**: Blue to Cyan gradient (`from-blue-500 to-cyan-500`)
- **Accent**: Orange to Red gradient (`from-orange-500 to-red-500`)
- **Success**: Green shades for online indicators
- **Neutral**: Gray scale for text and backgrounds

### **Typography**

- **Primary Font**: Inter (Google Fonts)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Scale**: Tailwind's default type scale

### **Spacing**

- **Container**: Max-width 7xl with responsive padding
- **Card Padding**: 4-6 on mobile, 6-8 on desktop
- **Element Spacing**: Consistent 2-4 spacing units

## **📝 Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Deployment
npm run export       # Export static site
npm run analyze      # Analyze bundle size
```

## **🔄 Git Workflow**

### **Branch Structure**

```Plaintext
main                 # Production-ready code
├── development      # Integration branch
    ├── feature/ui-enhancements
    ├── feature/ai-integration
    ├── feature/new-mentors
    └── hotfix/critical-fixes
```

### **Development Process**

1. Create feature branch from `development`
2. Implement feature with proper commits
3. Create PR to `development` branch
4. After review, merge to `development`
5. Deploy to production from `main`

## **🚀 Deployment**

### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### **Netlify**

```bash
# Build command
npm run build

# Publish directory
out/
```

### **Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## **🐛 Troubleshooting**

### **Common Issues**

**Issue**: Hydration errors in development

```bash
# Solution: Clear Next.js cache
rm -rf .next
npm run dev
```

**Issue**: Theme not persisting

```bash
# Check localStorage in browser DevTools
localStorage.getItem('swaras-ai-storage')
```

**Issue**: AI responses not working

```bash
# Verify environment variables
echo $NEXT_PUBLIC_AI_API_KEY
```

## **🤝 Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Style**

- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add JSDoc comments for functions

## **📄 License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## **🙏 Acknowledgments**

- **Hitesh Choudhary** - Inspiration for JavaScript mentorship
- **Piyush Garg** - Inspiration for system design guidance
- **Vercel** - Hosting and deployment platform
- **Tailwind CSS** - Amazing utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

---

## **Made with ❤️ in Bengaluru, India**

**Happy Coding with Swaras AI!** 🚀✨

---

*For the latest updates and announcements, follow us on [Twitter](https://x.com/SanjeevSaniel) and star our [GitHub repository](https://github.com/SanjeevSaniel/swaras-ai)!*
