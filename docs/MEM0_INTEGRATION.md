# Mem0 Long-Term Memory Integration

## Overview

SwarAI uses **Mem0** (Memory Layer for AI) to provide long-term memory across conversations. This allows AI mentors to remember user preferences, past topics, and context even after the sliding window (10 messages) expires.

## Architecture

### Memory Flow

```
User Message
    ↓
1. Search Mem0 for relevant memories
    ↓
2. Inject memories into System Prompt
    ↓
3. Send to LLM (with sliding window + memories)
    ↓
4. Stream response to user
    ↓
5. Store conversation turn in Mem0
```

### Memory Isolation

Memories are scoped by **`userId` + `personaId`**:
- Each user has separate memories
- Each persona (Hitesh, Piyush, etc.) maintains distinct memories about the same user
- Example: Hitesh remembers you prefer React, Piyush remembers you're learning system design

## Configuration

### Environment Variables

Add to `.env.local`:

```bash
# Mem0 Platform API Key
MEM0_API_KEY=your-api-key-here
```

Get your API key from [mem0.ai](https://app.mem0.ai)

## Implementation Details

### Service Layer: `memory-service.ts`

**Key Functions:**

1. **`addMemory(userId, personaId, messages)`**
   - Stores conversation turns in Mem0
   - Automatically extracts facts and preferences
   - Non-blocking (doesn't slow down responses)

2. **`searchMemories(userId, personaId, query, limit)`**
   - Retrieves relevant memories based on semantic search
   - Filters by user + persona
   - Returns top N most relevant memories

3. **`getMemoryContext(userId, personaId, query)`**
   - Wrapper that formats memories for LLM injection
   - Returns formatted string for system prompt

### API Integration: `chat-ai/route.ts`

**Before LLM Call:**
```typescript
const memoryContext = await getMemoryContext(userId, persona, lastMessage.content);
const systemPrompt = baseSystemPrompt + memoryContext;
```

**After Response:**
```typescript
addMemory(userId, persona, [{ role: 'user', content: lastMessage.content }]);
```

## How It Works

### Example Scenario

**Turn 1:**
```
User: "I prefer React over Vue"
Mem0: Stores → "User prefers React framework over Vue"
```

**Turn 15 (outside sliding window):**
```
User: "What framework should I use?"
Mem0: Retrieves → "User prefers React framework over Vue"
LLM receives: System Prompt + Memory Context + Recent 10 messages
AI: "Based on your preference, I'd recommend React!"
```

### Duplicate Question Handling

Mem0 automatically handles repeated questions:
- Semantic search finds similar past queries
- Retrieved memories include previous answers
- LLM can reference past responses: "As I mentioned before..."

## Cost Optimization

### Sliding Window + Mem0 = Best of Both Worlds

| Component | Purpose | Cost |
|-----------|---------|------|
| **Sliding Window (10 msgs)** | Immediate context | Low (bounded) |
| **Mem0 Memories** | Long-term facts | Very low (embeddings only) |
| **System Prompt** | Persona definition | Cached by OpenAI |

**Total tokens per request:**
- System Prompt: ~500 tokens (cached)
- Sliding Window: ~2000 tokens (bounded)
- Memory Context: ~200 tokens (top 5 memories)
- **Total: ~2700 tokens** (regardless of conversation length)

## Testing

### Manual Test Flow

1. **Store a preference:**
   ```
   User: "I'm learning TypeScript and I love it"
   ```

2. **Chat for 15+ messages** (clear the sliding window)

3. **Ask a related question:**
   ```
   User: "What language am I learning?"
   AI: "You're learning TypeScript!" ✅
   ```

4. **Test persona isolation:**
   - Switch to a different persona
   - Ask the same question
   - Verify separate memory context

## Troubleshooting

### Memory Not Retrieved

**Check:**
1. `MEM0_API_KEY` is set in `.env.local`
2. Dev server was restarted after adding the key
3. Check console logs for `🔍 Searching memories...` and `✅ Found X memories`

### Duplicate Answers

**Solution:** Mem0's semantic search will find similar past queries. The LLM should naturally say "As I mentioned before..." if it sees the same question in memory context.

## Future Enhancements

- [ ] Store AI responses (currently only user messages)
- [ ] Add memory management UI (view/delete memories)
- [ ] Implement memory expiration (auto-delete old memories)
- [ ] Add memory analytics (most retrieved topics)

## API Reference

See [memory-service.ts](file:///d:/1A-Personal/D-Learnings/1-Projects/2-swaras-ai/src/services/memory-service.ts) for full implementation details.
