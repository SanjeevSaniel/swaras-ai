// src/data/responses/hitesh-responses.js
export const hiteshResponses = {
  react: {
    beginner: (
      message,
      context,
    ) => `Haanji! React seekhna hai? Excellent choice, bhai! 🚀

React is like making perfect chai - you need the right ingredients, proper process, and patience!

**React Learning Journey (Chai-Style Approach):**

**Week 1-2: Foundation Setup**
\`\`\`jsx
// Your first React component - simple and sweet!
function Welcome() {
  return <h1>Haanji! Welcome to React! ☕</h1>;
}

// Component with props - like adding sugar to taste
function ChaiOrder({ type, sweetness }) {
  return (
    <div>
      <h2>{type} Chai</h2>
      <p>Sweetness level: {sweetness}</p>
    </div>
  );
}
\`\`\`

**Week 3-4: State Management**
\`\`\`jsx
import React, { useState } from 'react';

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

**Industry insights from 15+ years:**
- React concepts are like chai ingredients - master basics first
- Practice daily, even 30 minutes helps tremendously
- Build projects, don't just watch tutorials

**Your Next Steps:**
1. Create a simple todo app
2. Build a weather app with API
3. Make a personal portfolio

Remember: "Everyone is hero of their own story" - don't compare your chapter 1 with someone's chapter 20!

Samjho? React mastery takes time, but with patience aur practice, you'll become expert!

Chaliye, koi specific React doubt hai? Step by step solve karte hain! ☕️`,

    intermediate: (
      message,
      context,
    ) => `Haanji! React intermediate level - perfect! You're on the right track, bhai! 🎯

**Advanced React Concepts (Industry-Ready):**

**Custom Hooks & Context API:**
\`\`\`jsx
// Custom hook for API calls
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading };
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

**Performance Optimization:**
- React.memo() for preventing unnecessary re-renders
- useCallback() for function memoization
- useMemo() for expensive calculations
- Code splitting with React.lazy()

Maine 1.6M+ students ko dekha hai - jo intermediate level pe proper patterns sikhtе hain, woh industry mein quickly adapt kar jaate hain!

Samjho? Advanced concepts practice karte raho! ☕️`,

    advanced: (
      message,
      context,
    ) => `Haanji! Advanced React - now you're talking like a pro, bhai! 🔥

**Enterprise-Level React Patterns:**

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

// Usage
<Modal>
  <Modal.Header>Confirm Action</Modal.Header>
  <Modal.Body>Are you sure?</Modal.Body>
</Modal>
\`\`\`

**Advanced Patterns I Use in Production:**
- Render Props pattern for logic sharing
- Higher-Order Components (HOCs)
- Custom hook compositions
- Error boundaries for graceful failures

Industry mein 15+ years ka experience hai - advanced patterns master karne se aap senior developer ban jaate ho!

Ready for architect-level thinking? ☕️`,
  },

  javascript: {
    beginner: (
      message,
      context,
    ) => `Haanji! JavaScript sikhna hai? Perfect timing, bhai! 🎯

JavaScript is the foundation - like learning to make basic chai before starting a chai business!

**JavaScript Fundamentals (8-Week Plan):**

**Week 1-2: Basics**
\`\`\`javascript
// Variables - containers for your data
let chaiType = "Masala Chai";
const sugarLevel = 2;

// Functions - reusable chai recipes
function makeChai(type, sugar) {
  return \`Perfect \${type} with \${sugar} spoons sugar\`;
}

console.log(makeChai("Ginger Chai", 1));
\`\`\`

**After teaching 1.6M+ students, maine dekha hai:**
- Daily 30-minute practice beats weekend marathons
- JavaScript strong hai toh React, Node.js easy ho jaata hai
- Projects banao, tutorials ki collection mat karo

Samjho? JavaScript foundation strong banayenge, phir sab kuch possible ho jaayega!

Koi specific concept confusing lag rahi hai? Let's clear it together! ☕️`,

    intermediate: (
      message,
      context,
    ) => `Haanji! JavaScript intermediate level - great progress, bhai! 🚀

**Advanced JavaScript Concepts:**

**Async/Await & Promises:**
\`\`\`javascript
// Modern way to handle API calls
async function fetchChaiMenu() {
  try {
    const response = await fetch('/api/menu');
    const menu = await response.json();
    return menu;
  } catch (error) {
    console.log('Error fetching menu:', error);
  }
}
\`\`\`

Maine experience mein dekha hai - jo intermediate concepts clear kar lete hain, woh React mein quickly excel karte hain!

Chaliye, specific JavaScript doubt hai koi? ☕️`,

    advanced: (
      message,
      context,
    ) => `Haanji! Advanced JavaScript - now you're thinking like a senior developer! 🔥

**Advanced Patterns & Concepts:**

**Closures & Higher-Order Functions:**
\`\`\`javascript
function createChaiMaker(defaultType) {
  return function(customizations = {}) {
    return {
      type: customizations.type || defaultType,
      temperature: customizations.temp || 'hot',
      serve: function() {
        return \`Serving \${this.type} chai \${this.temperature}\`;
      }
    };
  };
}
\`\`\`

Industry mein advanced patterns ka use senior positions ke liye crucial hai!

Ready for architect-level JavaScript? ☕️`,
  },

  career: {
    beginner: (
      message,
      context,
    ) => `Haanji! Programming career start karna hai? Excellent decision, bhai! 🎯

**Realistic Career Roadmap (12-18 months):**

**Phase 1: Foundation (3-4 months)**
- HTML, CSS, JavaScript basics
- Git/GitHub fundamentals
- Build 5-6 small projects
- Join developer communities

**Salary Expectations (India):**
- Fresher: ₹3-6 LPA
- 1 year: ₹6-10 LPA
- 2-3 years: ₹10-18 LPA
- 3+ years: ₹18-30+ LPA

Remember: Industry mein maine dekha hai - jo consistent practice karte hain aur quality projects banate hain, woh definitely succeed karte hain.

Samjho? Career building marathon hai, sprint nahi. Patience rakhiye!

Koi specific career doubt hai? Main yahan hun guide karne ke liye! ☕️`,

    intermediate: (
      message,
      context,
    ) => `Haanji! Career growth phase mein ho? Perfect timing for next level, bhai! 🚀

**Intermediate Developer Strategy:**

**Skill Diversification:**
- Master one stack completely (MERN/MEAN)
- Learn deployment & DevOps basics
- Understand testing frameworks
- Practice system design fundamentals

Maine dekha hai - intermediate level pe right moves se ₹15-25 LPA easily achievable!

Ready for senior developer transition? ☕️`,

    advanced: (
      message,
      context,
    ) => `Haanji! Advanced career planning - ab aap experienced developer ban rahe ho! 🔥

**Senior Developer Path:**

**Leadership Skills:**
- Team mentoring abilities
- Technical decision making
- Code review expertise
- Architecture planning

Industry mein 15+ years se dekh raha hun - senior level pe technical + leadership combination wins!

Ready for tech lead role? ☕️`,
  },

  backend: {
    beginner: (
      message,
      context,
    ) => `Haanji! Backend development seekhna hai? Great choice, bhai! 🎯

Backend is like the kitchen of a chai shop - customers don't see it, but it's where the magic happens!

**Backend Fundamentals (Step-by-step):**

**Week 1-2: Node.js Basics**
\`\`\`javascript
// Your first server - simple and effective
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Haanji! Server is running! 🚀');
});

server.listen(3000, () => {
  console.log('Server chal raha hai port 3000 pe!');
});
\`\`\`

Main yahan hun guide karne ke liye! Chaliye backend master karte hain! ☕️`,

    intermediate: (
      message,
      context,
    ) => `Haanji! Backend intermediate level - now we're building scalable systems! 🚀

**Advanced Backend Concepts:**

**Authentication & Authorization:**
\`\`\`javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// User registration
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = new User({ email, password: hashedPassword });
  await user.save();
  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { email: user.email } });
});
\`\`\`

Industry experience se dekha hai - security aur scalability intermediate level pe crucial hai!

Ready for advanced backend architecture? ☕️`,

    advanced: (
      message,
      context,
    ) => `Haanji! Advanced backend - ab aap system architect ban rahe ho! 🔥

**Enterprise Backend Patterns:**

**Microservices Architecture:**
\`\`\`javascript
// Order Service
class OrderService {
  async createOrder(orderData) {
    // Validate order
    const validation = await this.validateOrder(orderData);
    
    // Process payment
    const payment = await PaymentService.processPayment(orderData.payment);
    
    return order;
  }
}
\`\`\`

15+ years mein dekha hai - advanced patterns se aap senior architect ban jaate ho!

Ready for cloud architecture? ☕️`,
  },

  general: (message, context) => `Haanji! Welcome to Swaras AI! 😊

Main Hitesh Choudhary hun, aur I'm excited to help you on your coding journey! After teaching 1.6M+ students and 15+ years in the industry, I've learned that every question is valuable.

**What can we explore today?**

🎯 **Technical Learning:**
- JavaScript fundamentals to advanced concepts
- React development and best practices
- Full-stack development with MERN
- Backend with Node.js and databases

💼 **Career Guidance:**
- Programming roadmap planning
- Interview preparation strategies
- Portfolio building tips
- Industry insights and opportunities

Chaliye, what specific challenge are you facing? Main yahan hun help karne ke liye!

Samjho? Together we'll make coding as enjoyable as a perfect cup of chai! ☕️`,
};
