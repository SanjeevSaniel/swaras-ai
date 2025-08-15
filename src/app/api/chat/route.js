// src/app/api/chat/route.js
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { personas } from '@/constants/personas-dataset';
import { systemPrompts } from '@/constants/llm-prompts';

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export async function POST(request) {
  try {
    const {
      message,
      persona,
      history = [],
      enhancedPrompt,
      context = {},
    } = await request.json();

    console.log('=== API ROUTE DEBUG ===');
    console.log('📝 Received message:', message);
    console.log('👤 Persona:', persona);
    console.log('📊 Context:', context);
    console.log('🎯 Enhanced prompt provided:', !!enhancedPrompt);
    console.log(
      '🔥 Enhanced prompt preview:',
      enhancedPrompt?.substring(0, 200),
    );

    // Enhanced validation
    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required and cannot be empty' },
        { status: 400 },
      );
    }

    if (!persona) {
      return NextResponse.json(
        { error: 'Persona is required' },
        { status: 400 },
      );
    }

    const personaData = personas[persona];
    if (!personaData) {
      return NextResponse.json(
        {
          error: `Invalid persona: ${persona}. Available: ${Object.keys(
            personas,
          ).join(', ')}`,
        },
        { status: 400 },
      );
    }

    // Check if we have system prompt
    const systemPrompt = systemPrompts[persona];
    if (!systemPrompt) {
      console.error('❌ No system prompt found for persona:', persona);
      return NextResponse.json(
        { error: `No system prompt configured for persona: ${persona}` },
        { status: 500 },
      );
    }

    let response;
    const useRealLLM = process.env.ENABLE_REAL_LLM === 'true' && openai;

    if (useRealLLM) {
      try {
        console.log('🤖 Using Real OpenAI API');

        // Use the enhanced prompt that was carefully built by AI Service
        const finalPrompt =
          enhancedPrompt || buildFallbackPrompt(personaData, persona, context);

        console.log(
          '📋 Final prompt preview:',
          finalPrompt.substring(0, 300) + '...',
        );

        // Format conversation history properly
        const conversationMessages = [
          { role: 'system', content: finalPrompt },
          ...formatConversationHistory(history),
          { role: 'user', content: message },
        ];

        console.log('💬 Sending to OpenAI:', {
          messageCount: conversationMessages.length,
          systemPromptLength: finalPrompt.length,
          userMessage: message,
        });

        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4.1',
          messages: conversationMessages,
          temperature: 0.7,
          max_tokens: 1200,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        });

        response =
          completion.choices[0]?.message?.content || 'No response generated';
        console.log(
          '✅ OpenAI Response received:',
          response.length,
          'characters',
        );
      } catch (openaiError) {
        console.error('❌ OpenAI API Error:', openaiError.message);
        console.log('🔄 Falling back to enhanced simulation');
        response = generateAdvancedPersonalizedResponse(
          message,
          persona,
          personaData,
          context,
        );
      }
    } else {
      console.log('🎭 Using Enhanced Simulation Mode');
      response = generateAdvancedPersonalizedResponse(
        message,
        persona,
        personaData,
        context,
      );
    }

    // Validate response
    if (!response || response.trim().length < 20) {
      console.error('❌ Generated response too short:', response);
      throw new Error('Generated response is too short or empty');
    }

    console.log('✅ Final response:', response.length, 'characters');

    return NextResponse.json({
      response: response.trim(),
      persona,
      context,
      timestamp: new Date().toISOString(),
      isSimulated: !useRealLLM,
      debug: {
        messageLength: message.length,
        responseLength: response.length,
        historyCount: history.length,
        topicDetected: context.topic || 'unknown',
        levelDetected: context.level || 'unknown',
      },
    });
  } catch (error) {
    console.error('💥 Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate response',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}

// Helper function to build fallback prompt if enhanced prompt is missing
function buildFallbackPrompt(personaData, personaId, context) {
  const basePrompt = systemPrompts[personaId];

  if (!basePrompt) {
    // Emergency fallback
    return `You are ${personaData.name}, ${personaData.description}
    
Your expertise: ${personaData.expertise.slice(0, 5).join(', ')}

Communication style: ${
      personaId === 'hitesh'
        ? 'Mix Hindi/English, use "Haanji!", "Chaliye", "Samjho?", relate to chai/tea analogies, be encouraging and patient'
        : 'Direct, confident, modern tech focus, use "Trust me", emphasize production-ready solutions'
    }

Always respond in character and provide specific, helpful advice.`;
  }

  // Add context if available
  let contextualPrompt = basePrompt;

  if (context.topic && context.level) {
    contextualPrompt += `\n\nCURRENT CONTEXT:
- User Level: ${context.level}
- Topic: ${context.topic}
- Intent: ${context.intent || 'general'}

Adjust your response complexity for ${context.level} level and focus on ${
      context.topic
    } while maintaining your authentic personality.`;
  }

  return contextualPrompt;
}

// Helper function to format conversation history
function formatConversationHistory(history) {
  return history.slice(-4).map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

// Enhanced personalized response generator with proper topic/level handling
function generateAdvancedPersonalizedResponse(
  message,
  personaId,
  personaData,
  context,
) {
  const lowerMessage = message.toLowerCase();

  // Use context from AI Service if available, otherwise detect
  const topic = context.topic || detectTopic(lowerMessage);
  const level = context.level || detectLevel(lowerMessage);
  const intent = context.intent || detectIntent(lowerMessage);

  console.log('🎯 Response Generation:', {
    persona: personaId,
    topic,
    level,
    intent,
    confidence: context.confidence || 'unknown',
  });

  // Generate response based on persona with enhanced logic
  if (personaId === 'hitesh') {
    return generateAdvancedHiteshResponse(message, topic, level, intent);
  } else if (personaId === 'piyush') {
    return generateAdvancedPiyushResponse(message, topic, level, intent);
  } else {
    return generateGenericResponse(message, personaData);
  }
}

// Advanced Hitesh response generator with proper personality
function generateAdvancedHiteshResponse(message, topic, level, intent) {
  let response = 'Haanji! ';

  // Add personality based on intent
  if (intent === 'question') {
    response += 'Great question! ';
  } else if (intent === 'help') {
    response += 'Main yahan hun help karne ke liye! ';
  } else if (intent === 'career') {
    response += '15+ years ke experience se guide kar sakta hun! ';
  }

  // Topic and level specific responses
  if (topic === 'react') {
    if (level === 'beginner') {
      response += `React seekhna hai? Perfect choice, bhai! 🚀

React is like making perfect chai - you need the right ingredients (components), proper timing (lifecycle), and good mixing (state management).

**Start with these fundamentals:**
1. JavaScript strong karo pehle - ye foundation hai
2. ES6+ features samjho - arrow functions, destructuring
3. JSX syntax sikho - HTML-like but more powerful
4. Components aur props concept
5. useState aur useEffect hooks

**Step-by-step approach:**
\`\`\`jsx
// Your first component - simple and sweet!
function Welcome() {
  return <h1>Haanji! Welcome to React! ☕</h1>;
}

// Component with state - interactive chai counter
function ChaiCounter() {
  const [cups, setCups] = useState(0);
  
  return (
    <div>
      <h3>Chai cups today: {cups}</h3>
      <button onClick={() => setCups(cups + 1)}>
        Add Chai ☕
      </button>
    </div>
  );
}
\`\`\`

**Industry insights from teaching 1.6M+ students:**
- React concepts are like chai ingredients - master basics first
- Practice daily, even 30 minutes helps tremendously
- Build projects, don't just watch tutorials (tutorial hell se niklo!)

**Your next projects:**
1. Simple todo app banao
2. Weather app with API integration  
3. Personal portfolio website

Remember: "Everyone is hero of their own story" - don't compare your chapter 1 with someone's chapter 20!

Samjho? React mastery takes time, but with patience aur consistent practice, you'll become expert!`;
    } else if (level === 'intermediate') {
      response += `React mein comfortable ho gaye? Excellent! Now let's level up! 🎯

**Advanced React concepts for industry readiness:**

**Custom Hooks & Context API:**
\`\`\`jsx
// Custom hook for API calls - reusable logic
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => setError(err));
  }, [url]);
  
  return { data, loading, error };
}

// Context for theme management
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <MainContent />
    </ThemeContext.Provider>
  );
}
\`\`\`

**Performance optimization techniques:**
- React.memo() for preventing unnecessary re-renders
- useCallback() for function memoization
- useMemo() for expensive calculations
- Code splitting with React.lazy()

Maine 1.6M+ students ko dekha hai - jo intermediate level pe proper patterns sikhtey hain, woh industry mein quickly adapt kar jaate hain!

**Real-world projects banao:**
- E-commerce platform with cart management
- Dashboard with charts and data visualization
- Real-time chat application with Socket.io

Production tips from CTO experience:
- Bundle size optimize karo
- Lazy loading implement karo
- SEO ke liye Next.js consider karo
- Testing with React Testing Library`;
    } else {
      // advanced
      response += `Advanced React! Now you're thinking like a senior developer, bhai! 🔥

**Enterprise-level React patterns:**

**Compound Components Pattern:**
\`\`\`jsx
function Modal({ children }) {
  return <div className="modal">{children}</div>;
}

Modal.Header = function ModalHeader({ children }) {
  return <div className="modal-header">{children}</div>;
};

Modal.Body = function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>;
};

// Usage - clean and intuitive
<Modal>
  <Modal.Header>Confirm Action</Modal.Header>
  <Modal.Body>Are you sure you want to proceed?</Modal.Body>
</Modal>
\`\`\`

**Advanced patterns I use in production:**
- Render Props pattern for logic sharing
- Higher-Order Components (HOCs) for cross-cutting concerns
- Custom hook compositions
- Error boundaries for graceful failure handling

**Architecture-level thinking:**
- Component library design
- Micro-frontend architectures
- Server-side rendering strategies
- Progressive Web App implementation

Industry mein 15+ years ka experience hai - advanced patterns master karne se aap senior developer se architect ban jaate ho!

**Next level skills:**
- Leading React teams
- Code review best practices
- Performance monitoring
- Accessibility (a11y) implementation`;
    }
  } else if (topic === 'career') {
    if (level === 'beginner') {
      response += `Programming career start kar rahe ho? Excellent decision, bhai! 🎯

**Realistic career roadmap (12-18 months to job-ready):**

**Phase 1: Foundation (3-4 months)**
- HTML, CSS, JavaScript fundamentals
- Git/GitHub basics - version control essential hai
- Build 5-6 small projects
- Join developer communities (LinkedIn, Discord, Reddit)

**Phase 2: Specialization (4-6 months)**  
- Choose one stack - MERN recommended
- Build 3-4 substantial projects
- Deploy projects live (Netlify, Vercel, Heroku)
- Start contributing to open source

**Phase 3: Job Preparation (2-3 months)**
- Interview preparation - behavioral + technical
- Data structures basics (don't obsess!)
- System design fundamentals
- Network actively

**Salary expectations (India market):**
- Fresher: ₹3-6 LPA (depending on city and company)
- 1 year experience: ₹6-10 LPA
- 2-3 years: ₹10-18 LPA
- 3+ years: ₹18-30+ LPA

**Industry insights from building companies:**
- Consistency beats intensity - daily 2 hours > weekend marathons
- Projects > certificates - employers want to see what you can build
- Soft skills matter - communication, teamwork, problem-solving
- Network actively - 70% jobs come through referrals

Remember: After traveling to 45+ countries, maine samjha hai - everyone is hero of their own story. Don't compare your chapter 1 with someone's chapter 20!

First job mein learning focus karo, salary se zyada growth dekho. Patience rakhiye, consistent effort se success pakki hai!`;
    } else if (level === 'intermediate') {
      response += `Career growth phase mein ho? Perfect timing for next level strategies, bhai! 🚀

**Intermediate to Senior Developer transition:**

**Technical skill expansion:**
- Master your core stack completely (depth over breadth)
- Learn deployment and DevOps basics
- Understand testing frameworks and methodologies
- Practice system design regularly

**Leadership skills development:**
- Start mentoring junior developers
- Lead small projects or features
- Participate in technical decision making
- Improve code review skills

**Business understanding:**
- Learn product thinking - user impact focus
- Understand business metrics and KPIs
- Cost-conscious development
- Performance optimization for real users

**Salary growth strategies (current market):**
- Intermediate developer: ₹8-15 LPA
- Senior developer: ₹15-25 LPA
- Tech lead: ₹20-35 LPA
- Staff engineer: ₹30-50+ LPA

**Career switching tips from CTO experience:**
- Growth opportunities > immediate salary bump
- Culture fit check karo - toxic environment growth kill karta hai
- Learning curve important hai - stagnation se bachna hai
- Build relationships before you need them

Maine industry mein dekha hai - jo intermediate level pe right moves karte hain, woh quickly senior positions reach kar jaate hain!

Network building karo actively - conferences attend karo, LinkedIn pe active raho, content create karo`;
    } else {
      // advanced
      response += `Advanced career planning! Ab aap experienced developer ho, next level thinking required! 🔥

**Senior to Principal Engineer path:**

**Technical leadership:**
- System architecture design and decisions
- Technology evaluation and selection  
- Cross-team collaboration and alignment
- Mentoring and developing other engineers

**Business impact:**
- Revenue-affecting technical decisions
- Product strategy influence
- Cost optimization initiatives
- Risk assessment and mitigation

**Industry influence:**
- Open source contributions at scale
- Conference speaking and thought leadership
- Technical blog writing and knowledge sharing
- Building developer community

**Compensation targets (senior levels):**
- Staff engineer: ₹35-60 LPA
- Principal engineer: ₹50-80+ LPA
- VP Engineering: ₹70-120+ LPA
- CTO: ₹100-200+ LPA + significant equity

**Entrepreneurial opportunities:**
- Technical co-founder roles
- Consulting at premium rates (₹5000-15000/hour)
- Building and selling SaaS products
- Angel investing and advising startups

After building and exiting companies, maine samjha hai - senior level pe technical + business combination wins karta hai!

**Next level moves:**
- Build your personal brand through content
- Start your own tech initiatives
- Mentor the next generation
- Think about creating lasting impact

Remember: Senior engineers solve problems, architects design systems, but leaders create other leaders!`;
    }
  } else if (topic === 'javascript') {
    // JavaScript responses based on level
    if (level === 'beginner') {
      response += `JavaScript! Programming ki soul hai ye, bhai! 🎯

JavaScript is like learning to make basic chai before starting a chai business - foundation strong banane se sab kuch easy ho jaata hai!

**JavaScript fundamentals (8-week roadmap):**

**Week 1-2: Core Basics**
\`\`\`javascript
// Variables - different types ke containers
let chaiType = "Masala Chai";  // can change
const sugarLevel = 2;          // constant value
var oldStyle = "avoid this";   // old way, avoid karo

// Functions - reusable chai recipes
function makeChai(type, sugar) {
  return \`Perfect \${type} with \${sugar} spoons sugar\`;
}

// Modern arrow function
const quickChai = (type) => \`Quick \${type} ready!\`;

console.log(makeChai("Ginger Chai", 1));
\`\`\`

**Week 3-4: Objects & Arrays**
\`\`\`javascript
// Objects - related data ko group karna
const chaiShop = {
  name: "Chai aur Code",
  location: "Delhi",
  menu: ["Masala", "Ginger", "Cardamom"],
  
  // Method inside object
  serve: function(type) {
    return \`Serving \${type} chai from \${this.name}\`;
  }
};

// Array methods - powerful tools
const orders = ["Masala", "Ginger", "Plain"];
const specialOrders = orders.map(chai => chai + " Special");
const masalaOrders = orders.filter(chai => chai.includes("Masala"));
\`\`\`

**After teaching 1.6M+ students, maine dekha hai:**
- Daily 30-minute practice beats weekend marathons
- Console mein experiment karo regularly
- MDN documentation your best friend hai
- Small programs daily banao, portfolio gradually build hoga

**Common beginner mistakes avoid karo:**
- == vs === confusion (always use ===)
- Variable hoisting issues (use let/const)
- Missing semicolons and brackets
- Not understanding 'this' context

**Practice projects for beginners:**
1. Calculator with all operations
2. Todo list with local storage
3. Simple weather app with API
4. Interactive quiz application

JavaScript everywhere hai - frontend, backend, mobile development. Foundation strong banao, opportunities unlimited hain!

Specific JavaScript concept confusing lag rahi hai? Let's clear it step by step!`;
    } else if (level === 'intermediate') {
      response += `JavaScript intermediate level! Great progress, bhai! 🚀

**Advanced JavaScript concepts for real-world development:**

**Asynchronous JavaScript mastery:**
\`\`\`javascript
// Promises - modern way to handle async operations
function fetchChaiMenu() {
  return fetch('/api/menu')
    .then(response => response.json())
    .then(menu => {
      console.log('Menu fetched:', menu);
      return menu;
    })
    .catch(error => {
      console.error('Error fetching menu:', error);
      throw error;
    });
}

// Async/Await - even cleaner syntax
async function getChaiData() {
  try {
    const menu = await fetch('/api/menu');
    const data = await menu.json();
    
    // Multiple async operations
    const reviews = await fetch(\`/api/reviews/\${data.id}\`);
    const reviewData = await reviews.json();
    
    return { menu: data, reviews: reviewData };
  } catch (error) {
    console.log('Error in chai data:', error);
    return null;
  }
}
\`\`\`

**ES6+ features that matter:**
\`\`\`javascript
// Destructuring - clean code
const { name, price, ingredients } = chaiItem;
const [first, second, ...rest] = chaiArray;

// Spread operator - powerful tool
const newChaiMenu = [...oldMenu, ...specialItems];
const updatedChai = { ...chaiItem, price: 25 };

// Template literals with expressions
const orderSummary = \`
  Order: \${chaiType}
  Price: ₹\${price}
  Time: \${new Date().toLocaleTimeString()}
  Total: ₹\${quantity * price}
\`;
\`\`\`

**Functional programming concepts:**
\`\`\`javascript
// Higher-order functions
const applyDiscount = (discount) => (price) => price * (1 - discount);
const tenPercentOff = applyDiscount(0.1);

// Array methods chaining
const discountedMenu = menu
  .filter(item => item.category === 'chai')
  .map(item => ({
    ...item,
    discountedPrice: tenPercentOff(item.price)
  }))
  .sort((a, b) => a.discountedPrice - b.discountedPrice);
\`\`\`

Maine experience mein dekha hai - jo intermediate concepts properly samjh lete hain, woh React aur Node.js mein easily excel kar jaate hain!

**Modern development patterns:**
- Module systems (import/export)
- Error handling strategies
- Performance optimization
- Testing with Jest

Specific advanced JavaScript concept practice karni hai? Let's dive deeper!`;
    } else {
      // advanced
      response += `Advanced JavaScript! Now you're thinking like a senior developer, bhai! 🔥

**Advanced JavaScript patterns and concepts:**

**Closures and Scope Mastery:**
\`\`\`javascript
// Closure for data privacy
function createChaiMaker(defaultType) {
  let orderCount = 0; // private variable
  
  return function(customizations = {}) {
    orderCount++; // access to outer scope
    
    return {
      type: customizations.type || defaultType,
      orderNumber: orderCount,
      temperature: customizations.temp || 'hot',
      serve: function() {
        return \`Order #\${this.orderNumber}: \${this.type} chai \${this.temperature}\`;
      }
    };
  };
}

const masalaMaker = createChaiMaker('Masala');
const order1 = masalaMaker({ temp: 'extra hot' });
\`\`\`

**Prototype and Inheritance:**
\`\`\`javascript
// Constructor function pattern
function ChaiShop(name, location) {
  this.name = name;
  this.location = location;
  this.orders = [];
}

// Adding methods to prototype
ChaiShop.prototype.addOrder = function(order) {
  this.orders.push(order);
  return this;
};

ChaiShop.prototype.getRevenue = function() {
  return this.orders.reduce((total, order) => total + order.price, 0);
};

// Modern class syntax
class ModernChaiShop extends ChaiShop {
  constructor(name, location, specialty) {
    super(name, location);
    this.specialty = specialty;
  }
  
  async processOrder(orderData) {
    // Advanced async processing
    const validation = await this.validateOrder(orderData);
    if (validation.isValid) {
      return this.addOrder(orderData);
    }
    throw new Error(validation.error);
  }
}
\`\`\`

**Advanced Async Patterns:**
\`\`\`javascript
// Promise composition and error handling
class OrderProcessor {
  async processMultipleOrders(orders) {
    // Parallel processing
    const results = await Promise.allSettled(
      orders.map(order => this.processOrder(order))
    );
    
    const successful = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
      
    const failed = results
      .filter(result => result.status === 'rejected')
      .map(result => result.reason);
    
    return { successful, failed };
  }
}
\`\`\`

Industry mein 15+ years ka experience hai - advanced patterns master karne se aap senior developer se architect ban jaate ho!

**Performance and Memory Management:**
- Event delegation for large lists
- Debouncing and throttling
- Memory leak prevention
- Garbage collection understanding

Ready for framework architecture and design patterns? You're on the path to becoming a JavaScript expert!`;
    }
  } else {
    // General response for undetected topics
    response += `Great question! Teaching experience se pata chala hai ki patience aur practice se sab kuch possible hai.

**Step-by-step approach:**
1. Problem ko clearly understand karo
2. Small parts mein divide karo  
3. Research karo - documentation, community
4. Hands-on practice karo
5. Real projects banao

**Industry mein maine dekha hai:**
- Consistent learners succeed karte hain
- Theory kam, practical implementation zyada karo
- Community mein active participation helps
- Continuous learning mindset essential hai

**Based on 15+ years experience:**
- Start with fundamentals strong banao
- Choose one technology, master it completely
- Build projects that solve real problems
- Network actively - LinkedIn, GitHub, communities

Specific doubt ho to detail mein poochiye, main yahan hun guidance ke liye!`;
  }

  // Add signature Hitesh endings
  response += `\n\n**Remember:** "Everyone is hero of their own story" - apna journey focus karo, comparison mat karo!

Questions ho toh poochte rehna, main yahan hun!

**📚 Resource Tip:** Check my YouTube channel 'Chai aur Code' for detailed tutorials and step-by-step guidance!

Chai peete peete code karte rehna! ☕️`;

  return response;
}

// Advanced Piyush response generator
function generateAdvancedPiyushResponse(message, topic, level, intent) {
  let response = 'Hey! ';

  // Add personality based on intent
  if (intent === 'question') {
    response += 'Great question! ';
  } else if (intent === 'help') {
    response += "I'm here to help you build something real! ";
  } else if (intent === 'career') {
    response += 'Career acceleration? My specialty! ';
  }

  // Topic and level specific responses
  if (topic === 'react' || topic === 'fullstack') {
    if (level === 'beginner') {
      response += `MERN stack development? Perfect choice for modern full-stack! 💪

**Here's my production-ready learning strategy:**

**MERN Stack Complete Roadmap:**
- **M**ongoDB - Document database with aggregation
- **E**xpress.js - RESTful API framework
- **R**eact - Modern component-based UI
- **N**ode.js - JavaScript runtime for backend

**Phase 1: Backend Foundation (4-5 weeks)**

**Node.js & Express Setup:**
\`\`\`javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
\`\`\`

**Phase 2: Frontend with React (4-5 weeks)**
\`\`\`jsx
// Modern React with hooks
import React, { useState, useEffect } from 'react';

function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Dashboard</h1>
      {users.map(user => (
        <div key={user._id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
\`\`\`

**Plus Modern Tools:**
- **TypeScript** for type safety and better DX
- **Next.js** for production-ready React apps
- **Prisma ORM** for database management
- **Docker** for consistent deployment

**Build Real Projects:**
1. **Twitter Clone** - Authentication, posts, following
2. **E-commerce Platform** - Products, cart, payments
3. **Chat Application** - Real-time messaging with Socket.io
4. **Task Management** - Team collaboration, deadlines

Trust me, MERN stack makes you a complete developer. Focus on building projects that solve real problems, not just tutorials.

Ready to start with backend setup? Let's build something production-ready! 🔥`;
    } else if (level === 'intermediate') {
      response += `Perfect! Intermediate MERN - time to build scalable, production-quality applications! 🚀

**Advanced MERN Architecture Patterns:**

**Backend with Proper Authentication:**
\`\`\`javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

// Rate limiting middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts'
});

// User registration with validation
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = new User({ 
      name, 
      email: email.toLowerCase(), 
      password: hashedPassword 
    });
    await user.save();
    
    // Generate JWT with proper expiration
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Protected route middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
\`\`\`

**Advanced React Patterns:**
\`\`\`jsx
// Custom hook for API calls with caching
function useApiWithCache(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Check cache first
    const cached = localStorage.getItem(url);
    if (cached) {
      const { data: cachedData, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > 5 * 60 * 1000; // 5 minutes
      
      if (!isExpired) {
        setData(cachedData);
        setLoading(false);
        return;
      }
    }
    
    // Fetch fresh data
    fetch(url, {
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`
      }
    })
    .then(res => res.json())
    .then(data => {
      setData(data);
      setLoading(false);
      
      // Cache the response
      localStorage.setItem(url, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, [url]);
  
  return { data, loading, error };
}

// Error boundary for production apps
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }
    
    return this.props.children;
  }
}
\`\`\`

**Performance Optimization:**
- Implement React.memo for expensive components
- Use useCallback and useMemo strategically
- Code splitting with React.lazy
- Image optimization and lazy loading
- Bundle analysis and optimization

Trust me, these patterns make your MERN applications enterprise-ready and scalable!

**Next Level Projects:**
- **Social Media Platform** with real-time updates
- **E-learning Platform** with video streaming
- **Project Management Tool** with team collaboration

Ready for deployment and scaling strategies? 💪`;
    } else {
      // advanced
      response += `Excellent! Advanced MERN - now you're building enterprise-scale applications! 🔥

**Enterprise MERN Architecture:**

**Microservices with Express:**
\`\`\`javascript
// User Service
class UserService {
  async createUser(userData) {
    // Input validation with Joi
    const schema = Joi.object({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    });
    
    const { error, value } = schema.validate(userData);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    
    // Check business rules
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      throw new ConflictError('User already exists');
    }
    
    // Create user with transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const hashedPassword = await bcrypt.hash(value.password, 12);
      const user = new User({
        ...value,
        password: hashedPassword
      });
      
      await user.save({ session });
      
      // Emit event for other services
      await EventBus.emit('user.created', {
        userId: user._id,
        email: user.email,
        timestamp: new Date()
      });
      
      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

// API Gateway pattern
class APIGateway {
  constructor() {
    this.services = {
      user: new UserService(),
      order: new OrderService(),
      notification: new NotificationService()
    };
  }
  
  async routeRequest(req, res) {
    const { service, method } = this.parseRequest(req);
    
    try {
      // Rate limiting
      await this.checkRateLimit(req);
      
      // Authentication
      await this.authenticate(req);
      
      // Authorization
      await this.authorize(req, service, method);
      
      // Route to service
      const result = await this.services[service][method](req.body);
      
      res.json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }
}
\`\`\`

**Advanced React Architecture:**
\`\`\`jsx
// Context with Reducer for complex state
const AppContext = createContext();

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      throw new Error(\`Unknown action type: \${action.type}\`);
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  const value = {
    ...state,
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    resetState: () => dispatch({ type: 'RESET_STATE' })
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// High-order component for authentication
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useContext(AppContext);
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!loading && !user) {
        navigate('/login');
      }
    }, [user, loading, navigate]);
    
    if (loading) return <LoadingSpinner />;
    if (!user) return null;
    
    return <WrappedComponent {...props} />;
  };
}
\`\`\`

**Production Deployment Strategy:**
- Docker containerization for consistent environments
- Kubernetes orchestration for scaling
- CI/CD pipelines with automated testing
- Monitoring with Prometheus and Grafana
- Log aggregation with ELK stack

Trust me, these patterns separate senior developers from principal engineers!

**Enterprise Features:**
- Multi-tenant architecture
- Real-time collaboration
- Advanced analytics and reporting
- Internationalization (i18n)
- Progressive Web App capabilities

Ready to architect systems that handle millions of users? 🚀`;
    }
  } else if (topic === 'career') {
    // Career responses for Piyush
    if (level === 'beginner') {
      response += `Smart focus on career development! Let's build a strategy that actually gets you hired! 💼

**Modern Developer Career Fast-Track (6-12 months):**

**Phase 1: Foundation & Focus (Months 1-3)**
\`\`\`
Week 1-4:   Choose your stack (MERN recommended)
Week 5-8:   Master Git, basic algorithms, data structures  
Week 9-12:  Build your first 2-3 real projects
Week 13-16: Deploy projects, create portfolio website
\`\`\`

**Phase 2: Skill Depth (Months 4-6)**
- **Master TypeScript** - Industry standard now
- **Learn testing** - Jest, React Testing Library
- **Understand CI/CD** - GitHub Actions basics
- **Practice system design** - Even for junior roles

**Phase 3: Job Market (Months 7-12)**
- **Build advanced projects** - Show real problem-solving
- **Contribute to open source** - Demonstrates collaboration
- **Network actively** - LinkedIn, Twitter, tech communities
- **Practice interviews** - LeetCode, system design, behavioral

**Current Market Reality (2024):**
- **Hot Technologies**: TypeScript, React, Node.js, AWS, Docker
- **Salary Ranges**: ₹8-25 LPA for skilled beginners
- **Remote Opportunities**: 70% increase in remote-first companies
- **Startup Boom**: High demand for full-stack developers

**Portfolio Projects That Get You Hired:**
1. **E-commerce Platform** - Complete with payments, admin panel
2. **Real-time Chat App** - WebSocket implementation, scalable
3. **Task Management System** - Team collaboration features
4. **API-first Application** - RESTful design, documentation

**Interview Strategy:**
\`\`\`javascript
// Be ready to explain your projects in detail
const projectExplanation = {
  problem: "What problem did this solve?",
  solution: "How did you architect the solution?",
  challenges: "What obstacles did you overcome?",
  technologies: "Why did you choose these technologies?",
  future: "How would you scale this application?"
};
\`\`\`

Trust me, focus on building projects that solve real problems. That's what gets you hired and promoted faster than anything else.

**Networking Strategy:**
- **LinkedIn**: Post about your learning journey
- **GitHub**: Contribute to projects, maintain green squares
- **Twitter**: Follow industry leaders, share insights
- **Local Meetups**: Attend tech events, build connections

Ready to accelerate your career trajectory? Let's build something that matters! 🚀`;
    } else if (level === 'intermediate') {
      response += `Perfect timing for career acceleration! Mid-level is where exponential growth happens! 🚀

**Senior Developer Transition Strategy:**

**Technical Leadership Development:**
\`\`\`javascript
// Start leading technical initiatives
const technicalLeadershipSkills = {
  codeReview: {
    focus: ['Logic correctness', 'Performance implications', 'Security concerns'],
    communication: ['Be constructive', 'Explain reasoning', 'Suggest alternatives'],
    mentoring: ['Teach patterns', 'Share knowledge', 'Encourage growth']
  },
  
  architectureDecisions: {
    evaluation: 'Compare multiple solutions with trade-offs',
    documentation: 'Record decisions with reasoning',
    communication: 'Explain technical choices to stakeholders'
  },
  
  teamCollaboration: {
    crossFunctional: 'Work with product, design, DevOps teams',
    knowledgeSharing: 'Conduct tech talks, write documentation',
    mentoring: 'Guide junior developers, code reviews'
  }
};
\`\`\`

**Business Impact Focus:**
- **Performance Optimization**: Reduce load times, improve UX
- **Cost Optimization**: Efficient cloud resource usage
- **Security Implementation**: Protect user data, prevent breaches
- **Scalability Planning**: Handle growth without major rewrites

**Current Market Compensation (2024):**
- **Mid-level Developer**: ₹12-22 LPA
- **Senior Developer**: ₹18-35 LPA  
- **Tech Lead**: ₹25-45 LPA
- **Staff Engineer**: ₹35-60+ LPA

**Advanced Skills Investment:**
- **System Design**: Design Instagram, WhatsApp, Netflix
- **DevOps & Cloud**: AWS/Azure certifications, Docker, Kubernetes
- **Data Engineering**: Understanding data pipelines, analytics
- **Security**: OWASP, penetration testing basics

**Career Switching Strategy:**
\`\`\`javascript
const careerMove = {
  research: {
    company: 'Culture, growth stage, technology stack',
    role: 'Responsibilities, growth path, learning opportunities',
    market: 'Salary benchmarks, industry trends'
  },
  
  negotiation: {
    preparation: 'Know your worth, research market rates',
    leverage: 'Multiple offers, unique skills, proven impact',
    focus: 'Total compensation, growth opportunities, work-life balance'
  },
  
  transition: {
    learning: 'Ramp up on new technologies, domain knowledge',
    networking: 'Build relationships, understand company culture',
    delivery: 'Early wins, establish credibility, add value quickly'
  }
};
\`\`\`

Trust me, this is the stage where your career compounds rapidly. Focus on impact, not just features!

**Leadership Opportunities:**
- **Open Source Maintenance**: Lead projects, manage contributors
- **Tech Community**: Speak at conferences, write technical blogs  
- **Internal Innovation**: Propose and lead new initiatives
- **Cross-team Projects**: Collaborate beyond your immediate team

Ready to make the jump to senior level and beyond? 💪`;
    } else {
      // advanced
      response += `Excellent! Advanced career strategy - time for executive technical leadership! 🔥

**Principal Engineer & Technical Executive Path:**

**Strategic Technical Leadership:**
\`\`\`javascript
class TechnicalStrategy {
  async developTechnologyRoadmap(businessGoals, currentArchitecture) {
    // Assess current state
    const technicalDebt = await this.auditTechnicalDebt(currentArchitecture);
    const scalabilityGaps = await this.identifyScalabilityBottlenecks();
    const securityRisks = await this.assessSecurityPosture();
    
    // Align with business objectives  
    const priorities = this.prioritizeByBusinessImpact(businessGoals, {
      technicalDebt,
      scalabilityGaps,
      securityRisks
    });
    
    return {
      immediate: priorities.filter(p => p.timeline <= 6), // 6 months
      medium: priorities.filter(p => p.timeline <= 18),   // 18 months
      longTerm: priorities.filter(p => p.timeline > 18),  // 18+ months
      resourceRequirements: this.estimateResources(priorities),
      riskAssessment: this.evaluateImplementationRisks(priorities),
      successMetrics: this.defineMeasurableOutcomes(priorities)
    };
  }
  
  async buildHighPerformingTeams(teamSize, skillMatrix) {
    return {
      hiring: this.designHiringProcess(skillMatrix),
      onboarding: this.createTechnicalOnboardingPath(),
      development: this.establishMentorshipPrograms(),
      retention: this.implementCareerGrowthFrameworks()
    };
  }
}
\`\`\`

**Executive Compensation Targets (2024):**
- **Principal Engineer**: ₹50-80+ LPA + Equity
- **VP Engineering**: ₹70-120+ LPA + Significant Equity
- **CTO**: ₹100-200+ LPA + Major Equity Stakes
- **Successful Exit**: ₹5-50+ Crores (depending on company valuation)

**Technical Influence & Thought Leadership:**
- **Industry Speaking**: Major conferences, technical keynotes
- **Open Source Leadership**: Maintainer of widely-used projects
- **Technical Writing**: Influential blog posts, research papers
- **Mentorship at Scale**: Developing next generation of tech leaders

**Business & Product Strategy:**
\`\`\`javascript
const executiveSkills = {
  productStrategy: {
    vision: 'Define technical product vision aligned with business goals',
    roadmap: 'Balance technical debt vs new features vs innovation',
    metrics: 'Establish engineering KPIs that drive business outcomes'
  },
  
  organizationalDesign: {
    structure: 'Design team structures for optimal delivery',
    culture: 'Build engineering culture of excellence and innovation',
    processes: 'Implement development processes that scale'
  },
  
  stakeholderManagement: {
    boardLevel: 'Communicate technical strategy to board and investors',
    crossFunctional: 'Collaborate with sales, marketing, operations',
    external: 'Represent company in technical partnerships'
  }
};
\`\`\`

**Entrepreneurial Opportunities:**
- **Technical Co-founder**: Equity-based compensation, build from ground up
- **Consulting Practice**: ₹10,000-50,000/hour for specialized expertise
- **SaaS Products**: Build and scale your own technical products
- **Angel Investing**: Leverage technical expertise to invest in startups

**Path to Technology Executive:**
1. **Demonstrate Technical Excellence**: Solve complex problems at scale
2. **Build Business Acumen**: Understand P&L, customer acquisition, unit economics
3. **Develop Leadership Skills**: Lead teams, influence without authority
4. **Create Industry Influence**: Thought leadership, technical community building
5. **Drive Measurable Impact**: Revenue growth, cost optimization, innovation

Trust me, at this level you're not just building software - you're shaping the future of technology and creating lasting impact!

**Next Level Moves:**
- **Board Advisory Roles**: Leverage expertise to guide other companies
- **Venture Capital**: Technical expertise valuable in investment decisions
- **Startup Founding**: Use accumulated knowledge to build the next unicorn
- **Academic Partnerships**: Research collaborations, guest professorships

Ready to become a technology leader who shapes industries? 🚀`;
    }
  } else {
    // General response for other topics
    response += `Great question! Let's solve this with a practical, production-focused approach.

**My Engineering Methodology:**
1. **Understand the Problem** - Ask the right clarifying questions
2. **Research Solutions** - Industry best practices, proven patterns
3. **Build Incrementally** - Start with MVP, iterate based on feedback
4. **Deploy and Monitor** - Real users provide real insights
5. **Scale When Needed** - Don't over-engineer early, optimize for actual constraints

**Modern Development Principles:**
- **User-First Thinking**: Build for real user problems, not technical elegance
- **Performance Matters**: Every millisecond affects user experience and business metrics
- **Security by Design**: Build security considerations into architecture from day one
- **Maintainable Code**: Code is read 10x more than it's written
- **Team Collaboration**: Great software is built by great teams, not individual heroes

**Production-Ready Checklist:**
\`\`\`javascript
const productionReadiness = {
  functionality: 'Core features work reliably under load',
  performance: 'Response times meet user expectations',
  security: 'Authentication, authorization, data protection',
  monitoring: 'Logging, metrics, alerting for issues',
  scalability: 'Can handle growth without major rewrites',
  maintainability: 'Code is documented, tested, deployable'
};
\`\`\`

Trust me, this systematic approach works whether you're building a simple API or a complex distributed system!

**Technologies I Recommend:**
- **Frontend**: React + TypeScript + Next.js for production apps
- **Backend**: Node.js + Express + TypeScript for scalable APIs
- **Database**: PostgreSQL for relational, MongoDB for document-based
- **Infrastructure**: Docker + AWS/Vercel for deployment
- **Monitoring**: Sentry for errors, Vercel Analytics for performance

**Key Success Factors:**
- Focus on solving real problems, not just using cool technology
- Build for your current constraints, not imaginary future scale
- Prioritize user experience over technical perfection
- Invest in team productivity and developer experience

Ready to build something that scales and matters in the real world? Let's make it happen!`;
  }

  // Add signature Piyush endings
  response += `\n\n**Trust me, I'm a software engineer** - this approach has worked in multiple production environments and successful startups!

Let's build something that scales! 🚀

Ready to ship some quality code? Let's make it happen! 💪`;

  return response;
}

// Helper functions for topic, level, and intent detection
function detectTopic(message) {
  const topicKeywords = {
    react: [
      'react',
      'jsx',
      'component',
      'hook',
      'state',
      'props',
      'usestate',
      'useeffect',
    ],
    javascript: [
      'javascript',
      'js',
      'function',
      'async',
      'promise',
      'es6',
      'arrow',
      'closure',
    ],
    career: [
      'job',
      'career',
      'interview',
      'salary',
      'company',
      'fresher',
      'experience',
      'growth',
    ],
    backend: [
      'api',
      'server',
      'database',
      'node',
      'express',
      'mongodb',
      'backend',
      'endpoint',
    ],
    fullstack: [
      'mern',
      'fullstack',
      'full stack',
      'complete',
      'frontend backend',
      'end to end',
    ],
    systemdesign: [
      'system design',
      'architecture',
      'scale',
      'distributed',
      'microservice',
      'scalability',
    ],
    typescript: [
      'typescript',
      'ts',
      'type',
      'interface',
      'generic',
      'type safety',
    ],
    nextjs: [
      'next.js',
      'nextjs',
      'ssr',
      'ssg',
      'server side',
      'static generation',
    ],
    devops: [
      'docker',
      'aws',
      'deployment',
      'ci/cd',
      'kubernetes',
      'cloud',
      'devops',
    ],
    database: [
      'database',
      'sql',
      'nosql',
      'mongodb',
      'postgresql',
      'mysql',
      'query',
    ],
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((keyword) => message.includes(keyword))) {
      return topic;
    }
  }
  return 'general';
}

function detectLevel(message) {
  const beginnerWords = [
    'start',
    'begin',
    'new',
    'basic',
    'learn',
    'how to',
    'what is',
    'getting started',
    'beginner',
    'first time',
    'never',
    'intro',
  ];
  const advancedWords = [
    'advanced',
    'scale',
    'optimize',
    'architecture',
    'senior',
    'expert',
    'production',
    'enterprise',
    'performance',
    'complex',
    'distributed',
  ];

  const beginnerMatches = beginnerWords.filter((word) =>
    message.includes(word),
  ).length;
  const advancedMatches = advancedWords.filter((word) =>
    message.includes(word),
  ).length;

  if (beginnerMatches >= 1) return 'beginner';
  if (advancedMatches >= 1) return 'advanced';
  return 'intermediate';
}

function detectIntent(message) {
  const intentPatterns = {
    question: /\?|how|what|why|when|where|which|can you|could you|should i/i,
    help: /help|assist|guide|show|explain|teach|support/i,
    problem: /error|issue|problem|not working|stuck|debug|fix|trouble/i,
    project: /build|create|make|develop|project|application|app/i,
    career: /job|career|interview|salary|company|work|hire|growth/i,
    comparison: /vs|versus|difference|compare|better|best|choose|which/i,
  };

  for (const [intent, pattern] of Object.entries(intentPatterns)) {
    if (pattern.test(message)) return intent;
  }

  return 'general';
}

// Generic response for unknown personas
function generateGenericResponse(message, personaData) {
  return `Hello! I'm ${personaData.name}. 

Thank you for your question about "${message}". While I'd love to help you in detail, it seems there might be a configuration issue.

Here's what I can tell you based on my expertise in ${personaData.expertise
    .slice(0, 3)
    .join(', ')}:

**General Approach:**
1. **Break down the problem** into smaller, manageable parts
2. **Research thoroughly** - documentation, community resources, best practices  
3. **Start with fundamentals** and build up complexity gradually
4. **Practice consistently** - hands-on experience beats theory
5. **Build real projects** that solve actual problems

**Key Principles:**
- Focus on understanding concepts deeply rather than rushing through topics
- Don't hesitate to ask questions - the developer community is very supportive
- Build a strong foundation before moving to advanced topics
- Keep practicing and stay curious about new technologies

**Resources to Explore:**
- Official documentation for the technology you're learning
- GitHub repositories with real-world examples
- Developer communities on Discord, Reddit, and Stack Overflow
- Online courses and tutorials from reputable sources

Feel free to ask more specific questions, and I'll do my best to help guide you in the right direction!

Keep building and learning! 🚀`;
}
