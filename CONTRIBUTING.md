# Contributing to Swaras AI 🚀

Thank you for your interest in contributing to **Swaras AI**! We're excited to have you as part of our community building the future of AI-powered coding mentorship.

## 📋 Table of Contents

- [Code of Conduct](#🤝-code-of-conduct)
- [Getting Started](#🚀-getting-started)
- [Development Setup](#🛠️-development-setup)
- [How to Contribute](#🤝-how-to-contribute)
- [Coding Standards](#📏-coding-standards)
- [Commit Guidelines](#📝-commit-guidelines)
- [Pull Request Process](#🔄-pull-request-process)
- [Issue Guidelines](#🐛-issue-guidelines)
- [Community Guidelines](#👥-community-guidelines)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

- **Be Respectful**: Treat all community members with respect
- **Be Inclusive**: Welcome newcomers and help them get started
- **Be Constructive**: Provide helpful feedback and suggestions
- **Be Professional**: Maintain a professional tone in all interactions

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- Node.js 18+ installed
- Git configured with your GitHub account
- Basic knowledge of React, Next.js, and Tailwind CSS
- Understanding of modern JavaScript/TypeScript

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/your-username/swaras-ai.git
   cd swaras-ai
   ```

3. Add the original repository as upstream:

```bash
git remote add upstream https://github.com/original-owner/swaras-ai.git
```

## 🛠️ Development Setup

### Install Dependencies

```bash
# Install project dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Configure your environment variables:

```env
# Add your API keys and configuration
NEXT_PUBLIC_AI_API_KEY=your_api_key_here
```

### Verify Setup

1. Open [http://localhost:3000](http://localhost:3000)
2. Test basic functionality
3. Run the test suite:

```bash
npm run test
```

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Reports**: Help us identify and fix issues
- **✨ Feature Requests**: Suggest new features or improvements
- **📝 Documentation**: Improve our docs and guides
- **🎨 UI/UX Improvements**: Enhance the user experience
- **🧪 Testing**: Add or improve test coverage
- **🔧 Code Contributions**: Fix bugs or implement features

### Contribution Workflow

1. **Check existing issues** to avoid duplicates
2. **Create an issue** for new bugs or features
3. **Wait for approval** before starting work on large features
4. **Create a branch** for your contribution
5. **Make your changes** following our coding standards
6. **Test thoroughly** and add tests if needed
7. **Submit a pull request** with clear description

## 📏 Coding Standards

### Code Style

We use **ESLint** and **Prettier** for consistent code formatting:

```bash
# Check code style
npm run lint

# Fix formatting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### File Naming Conventions

- **Components**: PascalCase (`PersonaSelector.jsx`)
- **Utilities**: camelCase (`dateUtils.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)
- **Hooks**: camelCase with `use` prefix (`usePersonaStore.js`)

### Component Structure

```jsx
// 1. Imports (external libraries first, then internal)
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// 2. Component definition with JSDoc
/**
 * PersonaSelector component for choosing AI mentors
 * @param {Object} props - Component props
 * @param {Array} props.personas - Available personas
 * @param {Function} props.onSelect - Selection callback
 */
const PersonaSelector = ({ personas, onSelect }) => {
  // 3. State and hooks
  const [selectedPersona, setSelectedPersona] = useState(null);

  // 4. Event handlers
  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    onSelect(persona);
  };

  // 5. Render
  return <div className='persona-selector'>{/* Component JSX */}</div>;
};

export default PersonaSelector;
```

### CSS Guidelines

- Use **Tailwind CSS** utility classes
- Create custom classes only when necessary
- Follow mobile-first responsive design
- Use semantic class names for custom CSS

```jsx
// ✅ Good - Tailwind utilities
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">

// ❌ Avoid - Inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

## 📝 Commit Guidelines

### Commit Message Format

We follow the **Conventional Commits** specification:

```Plaintext
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature addition
git commit -m "feat(personas): add new mentor selection animation"

# Bug fix
git commit -m "fix(chat): resolve message ordering issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api)!: change persona response format

BREAKING CHANGE: persona.response is now persona.messages array"
```

## 🔄 Pull Request Process

### Before Submitting

1. **Sync with upstream**:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Test your changes**:

   ```bash
   npm run test
   npm run build
   ```

### PR Checklist

- [ ] Code follows our style guidelines
- [ ] Self-review completed
- [ ] Tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No merge conflicts
- [ ] All CI checks passing

### PR Template

When creating a PR, include:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing

- [ ] Manual testing completed
- [ ] Unit tests added/updated
- [ ] Integration tests passing

## Screenshots (if applicable)

Add screenshots for UI changes

## Additional Notes

Any additional context or notes
```

## 🐛 Issue Guidelines

### Bug Reports

Use our bug report template and include:

- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (OS, browser, Node version)
- **Screenshots or recordings** if applicable

### Feature Requests

For feature requests, provide:

- **Clear problem statement**
- **Proposed solution**
- **Alternative solutions considered**
- **Use cases and benefits**
- **Implementation ideas** (if any)

### Issue Labels

We use labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation related
- `good first issue` - Great for newcomers
- `help wanted` - Extra attention needed
- `priority: high/medium/low` - Priority levels

## 👥 Community Guidelines

### Getting Help

- **GitHub Discussions**: For questions and general discussion
- **Issues**: For bug reports and feature requests
- **Discord** (if available): For real-time chat
- **Email**: For private concerns

### Code Review Process

1. **All submissions** require review before merging
2. **Core maintainers** have final approval authority
3. **Constructive feedback** is encouraged
4. **Be patient** - reviews take time

### Recognition

We believe in recognizing contributors:

- **Contributors list** in README
- **Release notes** mention significant contributions
- **Special badges** for regular contributors
- **Mentorship opportunities** for experienced contributors

### Mentorship Program

We offer mentorship for new contributors:

- **Pair programming** sessions
- **Code review** guidance
- **Architecture** discussions
- **Career advice** and networking

## 🎯 Areas for Contribution

### High Priority

- **AI Response Quality**: Improving persona authenticity
- **Performance**: Optimizing load times and responsiveness
- **Accessibility**: Making the app usable for everyone
- **Mobile Experience**: Enhancing mobile responsiveness

### Medium Priority

- **Testing**: Increasing test coverage
- **Documentation**: Improving guides and examples
- **Internationalization**: Adding multi-language support
- **Analytics**: Adding usage insights

### Future Features

- **Voice Integration**: Speech-to-text and text-to-speech
- **Code Execution**: In-browser code playground
- **Collaborative Coding**: Multi-user sessions
- **Learning Paths**: Structured learning curricula

## 📚 Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Project Architecture Guide](./docs/ARCHITECTURE.md)

### Learning Resources

- [React Patterns](https://reactpatterns.com/)
- [JavaScript Best Practices](https://github.com/ryanmcdermott/clean-code-javascript)
- [Git Workflow Guide](https://www.atlassian.com/git/tutorials/comparing-workflows)

## 🙏 Thank You

Thank you for taking the time to contribute to **Swaras AI**! Every contribution, no matter how small, helps make our project better for everyone.

**Questions?** Feel free to reach out through any of our community channels. We're here to help!

---

**Happy Coding!** 🚀✨
