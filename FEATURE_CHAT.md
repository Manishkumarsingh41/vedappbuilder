# Real-Time Chat Feature 💬

## Overview
The real-time chat feature allows users to provide additional instructions and request modifications while the AI agents are building their application. This enables iterative collaboration and mid-workflow adjustments.

## Architecture

### Frontend Components

#### ProjectChat Component (`client/src/components/ProjectChat.tsx`)
- **Floating Chat Button**: Always accessible in bottom-right corner
- **Message Display**: Shows conversation history with user, system, and agent messages
- **Input Area**: Textarea with Enter to send, Shift+Enter for newlines
- **Notification Dot**: Indicates new messages or pending responses
- **Auto-scroll**: Automatically scrolls to latest message

**Features:**
- Clean, modern UI with glassmorphism styling
- Role-based message styling (user, system, agent)
- Loading states during submission
- Error handling with toast notifications
- Responsive design (collapsible on mobile)

### Backend API

#### Routes (`server/routes.ts`)

**POST /api/projects/:id/instructions**
- Accepts new user instructions during project workflow
- Stores instruction in database with "pending" status
- Triggers agent re-processing in background
- Returns immediately for responsive UI

**GET /api/projects/:id/instructions**
- Retrieves all instructions for a project
- Used for chat history and status tracking

### Data Layer

#### Schema (`shared/schema.ts`)
```typescript
projectInstructions: {
  id: string (UUID)
  projectId: string (foreign key)
  instruction: string (user input)
  response: string (agent response)
  status: "pending" | "processing" | "complete" | "error"
  createdAt: Date
}
```

#### Storage (`server/storage.ts`)
- `getProjectInstructions(projectId)`: Fetch all instructions
- `createProjectInstruction(data)`: Create new instruction
- `updateProjectInstruction(id, updates)`: Update status/response

## How It Works

### 1. User Workflow
1. User creates a project with initial requirements
2. Agents begin building the application
3. User monitors progress via agent messages
4. User clicks floating chat button to provide new instructions
5. User types instruction (e.g., "Add a dark mode toggle", "Use TypeScript instead")
6. User presses Enter to submit

### 2. Processing Flow
```
User Input → POST /api/instructions → Store Instruction
                                      ↓
                        Background Agent Re-processing
                                      ↓
                        - Load existing context
                        - Append new instruction
                        - Run relevant agents
                        - Update agent messages
                                      ↓
                        Update Instruction Status → "complete"
```

### 3. Agent Re-processing
When a new instruction is received:
1. **Context Loading**: Fetch all completed agent messages for context
2. **Prompt Construction**: Create modification prompt with:
   - Previous work context
   - New user instruction
   - Request for updated implementation
3. **Agent Execution**: Run all agents (or intelligently selected agents)
4. **Response Storage**: Store new agent outputs as messages
5. **Status Update**: Mark instruction as "complete"

## Usage Examples

### Example 1: Styling Change
**User Instruction:**
> "Can you make the buttons rounded and add a gradient background?"

**Agent Response:**
- **Gemma (UI/UX Designer)**: Updates design system with rounded corners and gradient
- **Hugo (Frontend Developer)**: Implements CSS changes with Tailwind utilities
- **Ava (QA Tester)**: Verifies visual consistency across components

### Example 2: Feature Addition
**User Instruction:**
> "Add user authentication with email and password"

**Agent Response:**
- **Perry (Project Architect)**: Updates architecture with auth layer
- **Ollie (Backend Developer)**: Implements auth API endpoints
- **Hugo (Frontend Developer)**: Creates login/signup forms
- **Milo (DevOps Engineer)**: Adds JWT token handling
- **Ava (QA Tester)**: Tests auth flow

### Example 3: Technology Switch
**User Instruction:**
> "Use Prisma instead of Drizzle ORM"

**Agent Response:**
- **Perry (Project Architect)**: Reviews ORM migration strategy
- **Ollie (Backend Developer)**: Converts schema and queries to Prisma
- **Milo (DevOps Engineer)**: Updates database configuration
- **Ava (QA Tester)**: Verifies database operations

## Implementation Details

### Message Types
- **User Messages**: Blue background, sent by human
- **System Messages**: Gray background, status updates
- **Agent Messages**: Green background, AI-generated responses

### Status Tracking
Instructions progress through states:
1. `pending` - Instruction received, awaiting processing
2. `processing` - Agents actively working (optional, not currently used)
3. `complete` - Agents finished, responses available
4. `error` - Processing failed, error message in response

### Error Handling
- **Network Errors**: Toast notification, retry option
- **API Errors**: Displayed in chat with error status
- **Agent Failures**: Individual agent errors don't block others

### Performance Considerations
- **Background Processing**: Agents run async, UI remains responsive
- **Polling**: Frontend polls `/api/messages` every 2 seconds for updates
- **Context Size**: Large projects may hit token limits - consider context pruning

## Future Enhancements

### Planned Features
1. **Smart Agent Selection**: Only re-run agents relevant to the instruction
2. **Instruction History**: View/replay previous instructions
3. **Undo Changes**: Rollback to previous state
4. **Instruction Templates**: Quick actions like "Add dark mode", "Make it responsive"
5. **Cost Tracking**: Display API costs for each instruction
6. **WebSocket Support**: Real-time streaming instead of polling

### Optimization Ideas
- **Context Pruning**: Intelligently summarize older messages to reduce tokens
- **Diff-based Updates**: Only show changed code, not entire regeneration
- **Parallel Processing**: Run independent agents simultaneously
- **Caching**: Store common instruction responses

## Testing

### Manual Testing
1. Create a project with simple requirements
2. Wait for agents to complete initial build
3. Open chat and send instruction: "Add a header component"
4. Verify:
   - Instruction appears in chat
   - Agents process instruction
   - New messages appear with updated code
   - Status updates to "complete"

### Edge Cases
- Empty instruction (validation should reject)
- Very long instruction (>1000 chars)
- Conflicting instructions (e.g., "use React" then "use Vue")
- Rapid-fire instructions (rate limiting needed)
- Project not found (404 error)

## Configuration

### Environment Variables
None required - uses same API keys as initial project creation.

### Customization
In `ProjectChat.tsx`:
- `POLLING_INTERVAL`: Default 2000ms, adjust for faster/slower updates
- `MAX_MESSAGE_LENGTH`: Default unlimited, add validation if needed
- `CHAT_HISTORY_LIMIT`: Default all messages, limit for performance

In `server/routes.ts`:
- `AGENT_DELAY`: Default 1500ms between agents
- `RETRY_ATTEMPTS`: Default 3 attempts with backoff
- `CONTEXT_LENGTH`: Default unlimited, prune if hitting token limits

## Troubleshooting

### Chat button not appearing
- Verify `currentProjectId` is set
- Check browser console for errors
- Ensure ProjectChat component imported in `home.tsx`

### Instructions not processing
- Check server logs for errors
- Verify API keys in .env or user form
- Test API endpoint with curl: `POST /api/projects/:id/instructions`

### Agent responses not showing
- Check `/api/projects/:id/messages` endpoint
- Verify polling is active (currentProjectId set)
- Check network tab for 200 responses

### Out of order messages
- This is expected - agents run in parallel
- Messages appear as each agent completes
- Order reflects completion time, not logical sequence

## Code Snippets

### Sending an Instruction
```typescript
const mutation = useMutation({
  mutationFn: async (instruction: string) => {
    const response = await fetch(`/api/projects/${projectId}/instructions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instruction })
    });
    return response.json();
  }
});

mutation.mutate("Add a dark mode toggle");
```

### Retrieving Instructions
```typescript
const { data: instructions } = useQuery({
  queryKey: [`/api/projects/${projectId}/instructions`],
  refetchInterval: 2000
});
```

### Backend: Processing with Context
```typescript
const context = existingMessages
  .filter(m => m.status === "complete")
  .map(m => `${m.agentName}: ${m.message}`)
  .join("\n\n");

const modificationPrompt = `
Previous work:
${context}

NEW INSTRUCTION:
${instruction}

Please update your implementation accordingly.
`;
```

## Security Considerations

- **Input Validation**: Instruction length and content should be sanitized
- **Rate Limiting**: Prevent abuse by limiting instructions per minute
- **API Key Protection**: Never expose API keys in chat responses
- **User Authentication**: Add auth to ensure only project owner can send instructions
- **Cost Controls**: Set max API calls per instruction to prevent runaway costs

## Performance Metrics

- **Average Response Time**: ~30-60 seconds (depends on agents)
- **Token Usage**: ~5,000-15,000 tokens per instruction (varies by complexity)
- **API Calls**: 7 calls (one per agent) + context loading
- **Memory Usage**: Negligible (MemStorage holds strings)

## Summary

The chat feature transforms vedappbuilder from a one-shot generator into an iterative collaboration tool. Users can refine, adjust, and extend their applications in real-time, making the AI agents feel more like a development team than a static script.

**Key Benefits:**
- ✅ Iterative development workflow
- ✅ No need to restart project for changes
- ✅ Natural language instructions (no code required)
- ✅ Context-aware modifications (agents remember previous work)
- ✅ Non-blocking UI (background processing)

**Use Cases:**
- Quick styling tweaks
- Feature additions mid-build
- Technology stack changes
- Bug fixes and improvements
- A/B testing different approaches
