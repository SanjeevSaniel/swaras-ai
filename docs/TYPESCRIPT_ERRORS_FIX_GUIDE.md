# TypeScript Errors Fix Guide

This document lists all TypeScript errors found in the component files and provides guidance on how to fix them systematically.

## Summary

Total Errors: ~100+ across multiple component files

## Errors by Category

### 1. Missing Interface/Type Definitions (Props)

**Files Affected:**
- `src/components/chat/chat-input.tsx`
- `src/components/chat/chat-messages.tsx`
- `src/components/empty-persona-state.tsx`
- `src/components/sidebar/app-sidebar.tsx`
- `src/components/sidebar/conversation-list.tsx`
- `src/components/sidebar/persona-selector.tsx`
- `src/components/swaras-ai.tsx`
- `src/components/welcome/welcome-screen.tsx`
- `src/components/usage-quota.tsx`

**Fix Pattern:**
```typescript
// Before
const Component = ({ prop1, prop2 }) => {

// After
interface ComponentProps {
  prop1: string;
  prop2: number;
  // ... other props
}

const Component = ({ prop1, prop2 }: ComponentProps) => {
```

**Status:** ✅ Fixed error-boundary.tsx, chat-header.tsx

### 2. EventTarget Type Assertions

**Files Affected:**
- `src/components/chat/chat-header.tsx` ✅ FIXED
- `src/components/chat/chat-messages.tsx` (multiple instances)
- `src/components/sidebar/app-sidebar.tsx`
- `src/components/welcome/welcome-screen.tsx`

**Fix Pattern:**
```typescript
// Before
onError={(e) => {
  e.target.style.display = 'none';
  e.target.nextElementSibling.style.display = 'flex';
}}

// After
onError={(e) => {
  const target = e.target as HTMLImageElement;
  const nextEl = target.nextElementSibling as HTMLElement;
  target.style.display = 'none';
  if (nextEl) nextEl.style.display = 'flex';
}}
```

### 3. Window API Extensions (Speech Recognition)

**File:** `src/components/chat/chat-input.tsx`

**Error:**
```
Property 'SpeechRecognition' does not exist on type 'Window & typeof globalThis'
Property 'webkitSpeechRecognition' does not exist on type 'Window & typeof globalThis'
```

**Fix:**
```typescript
// Add to src/global.d.ts or at top of file
interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

// Then use with type assertion
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
```

### 4. UI Component Props (Missing Required Props)

**Files Affected:**
- `src/components/ui/command.tsx` - missing className
- `src/components/ui/dialog.tsx` - missing className
- `src/components/ui/dropdown-menu.tsx` - missing value
- `src/components/ui/lamp.tsx` - missing className
- `src/components/ui/scroll-area.tsx` - missing className
- `src/components/ui/select.tsx` - missing className, value
- `src/components/ui/separator.tsx` - type mismatches
- `src/components/ui/sheet.tsx` - missing className
- `src/components/ui/sidebar.tsx` - missing className, type
- `src/components/ui/textarea.tsx` - missing className
- `src/components/ui/tooltip.tsx` - missing children
- `src/components/ui/popover.tsx` - type mismatches

**Fix Pattern:**
Add default or required props with proper types. Example:
```typescript
// Before
<Component>content</Component>

// After
<Component className="">content</Component>

// Or fix the component definition to make className optional
interface ComponentProps {
  className?: string; // Made optional
  children: React.ReactNode;
}
```

### 5. AI SDK Type Errors

**File:** `src/components/swaras-ai.tsx`

**Errors:**
- `api` does not exist in type `UseChatOptions`
- Properties `input`, `handleInputChange`, `handleSubmit`, `isLoading` missing from `UseChatHelpers`
- Type mismatches with `UIMessage` structure

**Fix:**
Update to match the latest AI SDK API. Check the version of `ai` package and update usage accordingly:

```typescript
// Check current version
// npm list ai

// Update if needed
// npm install ai@latest

// Then update usage to match current API
```

### 6. Zustand Store Type Errors

**Files:** Multiple components using `useChatStore()`

**Error:** Properties don't exist on type `{}`

**Fix:** Add proper TypeScript types to the Zustand store definition in `src/store/chat-store.ts`:

```typescript
interface ChatStore {
  darkMode: boolean;
  mentorsOnline: any; // Replace with proper type
  mentorsLoading: boolean;
  personaConversations: any; // Replace with proper type
  currentConversation: any; // Replace with proper type
  selectedPersona: string | null;
  toggleDarkMode: () => void;
  setCurrentConversation: (conv: any) => void;
  setSelectedPersona: (persona: string) => void;
  updateConversation: (id: string, data: any) => void;
  addConversation: (conv: any) => void;
  deleteConversation: (id: string) => void;
  initializeTheme: () => void;
  initializeMentorStatus: () => void;
  getConversations: () => any[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // ... implementation
}));
```

### 7. React Markdown Props

**File:** `src/components/chat/chat-messages.tsx`

**Error:** Property 'inline' does not exist

**Fix:**
```typescript
// Check react-markdown version and update to latest
// Or use proper component prop name based on version

// For react-markdown v9+
components={{
  code({ node, className, children, ...props }) {
    // component content
  }
}}
```

### 8. Type Assertions for Unknown Types

**Files:** Multiple sidebar and persona selector files

**Errors:** Property 'X' does not exist on type 'unknown'

**Fix Pattern:**
```typescript
// Before
personas.map((p) => p.avatarUrl)

// After - Define proper type
interface Persona {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
  // ... other properties
}

const personas: Persona[] = ...
personas.map((p: Persona) => p.avatarUrl)
```

## Priority Fix Order

1. ✅ **High Priority - Fixed:**
   - error-boundary.tsx
   - chat-header.tsx (partial)

2. **High Priority - TODO:**
   - Fix Zustand store types (chat-store.ts)
   - Fix all prop interface definitions in main components
   - Fix EventTarget type assertions

3. **Medium Priority:**
   - UI component prop fixes
   - Type assertions for unknown types

4. **Low Priority:**
   - AI SDK type updates (may require package updates)
   - React Markdown compatibility

## Quick Fix Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check only component files
npx tsc --noEmit 2>&1 | grep "src/components"

# Count total errors
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l
```

## Recommended Approach

1. Fix the Zustand store types first - this will resolve ~30+ errors
2. Add prop interfaces to all main components
3. Fix EventTarget type assertions with proper casts
4. Fix UI component props one by one
5. Update AI SDK usage if version mismatch
6. Run final type check

## Notes

- These errors don't prevent the app from running in development
- They should be fixed for production builds
- Some errors may be due to package version mismatches
- Consider updating to latest versions of dependencies if needed

---

**Created:** 2025-11-26
**Status:** In Progress
**Fixed:** 2/100+ errors
