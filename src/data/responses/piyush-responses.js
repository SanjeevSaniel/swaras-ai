// src/data/responses/piyush-responses.js
export const piyushResponses = {
  react: {
    beginner: (
      message,
      context,
    ) => `Perfect! Starting with React - smart choice for modern development! 🎯

**Modern React Learning Path (Production-Ready):**

**Week 1: Setup & Fundamentals**
\`\`\`bash
# Use Vite instead of Create React App
npm create vite@latest my-app -- --template react
cd my-app && npm install && npm run dev
\`\`\`

**Modern Stack Recommendation:**
- **Build Tool**: Vite (faster than Webpack)
- **Styling**: Tailwind CSS for rapid development
- **State**: React hooks + Context API
- **Forms**: React Hook Form with validation

Trust me, learning React the modern way from day 1 saves months of refactoring later.

Ready to build production-quality React apps? Let's make it happen! 🚀`,

    intermediate: (
      message,
      context,
    ) => `Great! Intermediate React - time to build professional applications! 💪

**Advanced React Patterns:**

**Custom Hooks & Optimization:**
\`\`\`jsx
// Custom hook for API calls with caching
function useApiWithCache(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const cached = localStorage.getItem(url);
    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
      return;
    }
    // ... rest of the logic
  }, [url]);
  
  return { data, loading, error };
}
\`\`\`

Trust me, these patterns make your React code enterprise-ready! 

Ready for advanced state management? 🔥`,

    advanced: (
      message,
      context,
    ) => `Excellent! Advanced React - now you're building scalable applications! 🔥

**Enterprise React Architecture:**

**Compound Components with Context:**
\`\`\`jsx
const AccordionContext = createContext();

function Accordion({ children, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState(new Set());
  
  const toggle = (id) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      if (!allowMultiple) newOpen.clear();
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };
  
  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}
\`\`\`

Trust me, these patterns separate senior developers from junior ones!

Ready for React architecture mastery? 🚀`,
  },

  javascript: {
    beginner: (
      message,
      context,
    ) => `Great choice focusing on JavaScript! The foundation of modern web development! 💪

**Modern JavaScript Essentials:**

**Week 1-2: Modern Syntax**
\`\`\`javascript
// Modern variable declarations
const API_URL = 'https://api.example.com';
let userCount = 0;

// Arrow functions - concise and powerful
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Template literals for string building
const userName = 'Piyush';
const greeting = \`Hello, \${userName}! Welcome to modern JavaScript!\`;
\`\`\`

Trust me, focusing on modern JavaScript practices will set you apart from 80% of developers out there.

Ready to level up your JavaScript game? 🔥`,

    intermediate: (
      message,
      context,
    ) => `Perfect! Intermediate JavaScript - time to master advanced concepts! 🚀

**Advanced JavaScript Patterns:**

**Higher-Order Functions & Closures:**
\`\`\`javascript
// Function that returns a function
function createApiClient(baseURL) {
  return function(endpoint, options = {}) {
    return fetch(\`\${baseURL}/\${endpoint}\`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
  };
}
\`\`\`

Trust me, these patterns are what separate intermediate from senior developers!

Ready for advanced architecture patterns? 💪`,

    advanced: (
      message,
      context,
    ) => `Excellent! Advanced JavaScript - now you're thinking like a senior engineer! 🔥

**Advanced Architecture Patterns:**

**Proxy & Reflection:**
\`\`\`javascript
// Auto-validating objects with Proxy
function createValidatedUser(validationRules) {
  return new Proxy({}, {
    set(target, property, value) {
      const rule = validationRules[property];
      if (rule && !rule.test(value)) {
        throw new Error(\`Invalid \${property}: \${value}\`);
      }
      target[property] = value;
      return true;
    }
  });
}
\`\`\`

Trust me, mastering these patterns makes you architect-level!

Ready for system design with JavaScript? 🚀`,
  },

  mernstack: {
    beginner: (
      message,
      context,
    ) => `Excellent! MERN stack is perfect for full-stack development! 💪

**MERN Stack Complete Guide:**

**What is MERN?**
- **M**ongoDB - NoSQL Database
- **E**xpress.js - Backend Framework
- **R**eact - Frontend Library
- **N**ode.js - JavaScript Runtime

**Learning Strategy (12-16 weeks):**

**Phase 1: Backend First (4-5 weeks)**

**Node.js & Express Setup:**
\`\`\`javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/api/users', (req, res) => {
  res.json({ message: 'Users endpoint working!' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
\`\`\`

Trust me, MERN stack makes you a complete developer. Focus on building real projects that solve actual problems.

Ready to start with backend setup? Let's build something production-ready! 🔥`,

    intermediate: (
      message,
      context,
    ) => `Perfect! Intermediate MERN - time to build scalable applications! 🚀

**Advanced MERN Architecture:**

**Backend with Authentication:**
\`\`\`javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// User registration with validation
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
\`\`\`

Trust me, these patterns make your MERN apps enterprise-ready!

Ready for deployment and scaling? 💪`,

    advanced: (
      message,
      context,
    ) => `Excellent! Advanced MERN - now you're building enterprise applications! 🔥

**Enterprise MERN Architecture:**

**Microservices with Express:**
\`\`\`javascript
// User Service
class UserService {
  async createUser(userData) {
    // Validate data
    const validation = await this.validateUserData(userData);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }
    
    // Create user
    const user = new User(userData);
    await user.save();
    
    // Emit event for other services
    await EventBus.emit('user.created', {
      userId: user._id,
      email: user.email,
      timestamp: new Date()
    });
    
    return user;
  }
}
\`\`\`

Trust me, these patterns separate senior developers from architects!

Ready for cloud deployment strategies? 🚀`,
  },

  systemdesign: {
    beginner: (
      message,
      context,
    ) => `Perfect! System design is where real engineering begins! 🏗️

**System Design Fundamentals for Beginners:**

**What is System Design?**
Think of it like planning a city - you need roads (APIs), buildings (services), utilities (databases), and traffic management (load balancing).

**Core Concepts to Master:**

**1. Scalability Basics:**
- **Vertical Scaling**: Add more power (CPU/RAM) to existing server
- **Horizontal Scaling**: Add more servers to handle load
- **Real Example**: Instagram went from 1 to 100M users using horizontal scaling

Trust me, understanding these fundamentals will set you apart in interviews and real-world development! 💪

Ready to design your first system? Let's start with a simple chat application! 🚀`,

    intermediate: (
      message,
      context,
    ) => `Great! Intermediate system design - time to think like an architect! 🏗️

**Advanced System Design Concepts:**

**Microservices Architecture:**
\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ User Service│    │Auth Service │    │Order Service│
│   (Node.js) │    │  (Node.js)  │    │  (Node.js)  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                  ┌─────────────┐
                  │ API Gateway │
                  │   (Express) │
                  └─────────────┘
\`\`\`

Trust me, these intermediate concepts are crucial for senior engineering roles!

Ready to design a real-world system? 💪`,

    advanced: (
      message,
      context,
    ) => `Excellent! Advanced system design - now you're thinking like a principal engineer! 🔥

**Enterprise System Architecture:**

**Distributed System Challenges:**
\`\`\`javascript
// CAP Theorem Implementation
class DistributedDatabase {
  constructor(nodes) {
    this.nodes = nodes;
    this.consistencyLevel = 'eventual'; // strong, eventual, weak
  }
  
  async write(key, value, options = {}) {
    const { consistency = this.consistencyLevel } = options;
    
    switch (consistency) {
      case 'strong':
        // Write to all nodes, wait for all confirmations
        const results = await Promise.all(
          this.nodes.map(node => node.write(key, value))
        );
        return results.every(r => r.success);
    }
  }
}
\`\`\`

Trust me, mastering these patterns makes you a principal engineer!

Ready to architect systems for millions of users? 🚀`,
  },

  career: {
    beginner: (
      message,
      context,
    ) => `Smart focus on career development! Let's build a strategy that actually works! 🎯

**Modern Developer Career Strategy:**

**Phase 1: Foundation Building (3-6 months)**
\`\`\`
Week 1-4:   Master one language (JavaScript recommended)
Week 5-8:   Learn Git, basic algorithms, data structures
Week 9-12:  Build 3-4 portfolio projects
Week 13-16: Practice interview questions, system design basics
Week 17-24: Apply to companies, get feedback, iterate
\`\`\`

**Current Market Reality:**
- **Hot Skills**: TypeScript, React, Node.js, AWS
- **Salary Growth**: ₹15-30 LPA for skilled developers
- **Remote Opportunities**: 60% increase globally
- **Startup Boom**: High demand for full-stack developers

Trust me, focus on building projects that solve real problems. That's what gets you hired and promoted.

Ready to accelerate your career growth? Let's make it happen! 🚀`,

    intermediate: (
      message,
      context,
    ) => `Perfect! Mid-career growth - this is where real acceleration happens! 🚀

**Senior Developer Transition Strategy:**

**Technical Leadership Skills:**
\`\`\`javascript
// Code review best practices
const codeReviewPrinciples = {
  focus: ['Logic correctness', 'Performance implications', 'Security concerns'],
  communication: ['Be constructive', 'Explain reasoning', 'Suggest alternatives'],
  mentoring: ['Teach patterns', 'Share knowledge', 'Encourage growth']
};
\`\`\`

**Target Compensation (2024):**
- **Senior Dev**: ₹18-30 LPA
- **Tech Lead**: ₹25-40 LPA
- **Staff Engineer**: ₹35-60 LPA
- **Principal**: ₹50-80+ LPA

Trust me, this is the stage where your career compounds rapidly!

Ready to make the jump to senior level? 💪`,

    advanced: (
      message,
      context,
    ) => `Excellent! Advanced career strategy - time for executive technical roles! 🔥

**Principal Engineer Path:**

**Strategic Technical Leadership:**
\`\`\`javascript
class TechnicalStrategy {
  async developRoadmap(businessGoals, currentState) {
    const gaps = this.identifyGaps(businessGoals, currentState);
    const priorities = this.prioritizeByImpact(gaps);
    
    return {
      immediate: priorities.filter(p => p.timeline <= 6),
      medium: priorities.filter(p => p.timeline <= 18),
      longTerm: priorities.filter(p => p.timeline > 18),
      resources: this.estimateResources(priorities),
      risks: this.assessRisks(priorities)
    };
  }
}
\`\`\`

**Target Compensation (Senior Roles):**
- **Principal Engineer**: ₹60-100+ LPA
- **VP Engineering**: ₹80-150+ LPA
- **CTO**: ₹120-300+ LPA + Equity
- **Successful Exit**: ₹5-50+ Crores

Trust me, at this level you're not just coding - you're shaping the future of technology!

Ready to become a technology leader? 🚀`,
  },

  general: (message, context) => `Hey there! Welcome to Swaras AI! 🚀

I'm Piyush Garg, and I'm here to help you build real-world development skills that actually matter in the industry.

**What I Can Help You With:**

🔧 **Technical Mastery:**
- **MERN Stack**: Complete full-stack development
- **Modern JavaScript/TypeScript**: ES6+, async patterns
- **System Design**: Scalable architecture patterns
- **DevOps**: Docker, AWS, deployment strategies

💼 **Career Acceleration:**
- **Portfolio Development**: Projects that impress recruiters
- **Interview Prep**: Technical assessments, system design
- **Market Strategy**: Salary negotiation, remote work
- **Industry Insights**: Current trends and opportunities

Trust me, I'm a software engineer who's built applications serving millions of users and founded successful startups.

Ready to build something that actually scales and matters? Let's level up your development game! 💪🔥`,
};
