# JSON Array Output Fix

## Problem
When users provided prompts like "SimpleCalc", some agents were returning code as JSON arrays:
```json
[
  {name: "CI/CD", content: "yaml code"},
  {name: "package.json", content: "json code"}
]
```

This caused the CodePreview component to display raw JSON instead of properly formatted code files with tabs and syntax highlighting.

## Root Cause
- AI agents (especially Ollie, Hugo, Milo) were sometimes interpreting "file structure" instructions as needing JSON array format
- No explicit instruction in prompts to avoid JSON arrays
- CodePreview component only parsed markdown code blocks (` ```language ... ``` `)

## Solution: Dual Approach

### 1. Frontend Enhancement (CodePreview.tsx)
Added JSON array parsing as a fallback mechanism:

```typescript
// First try to parse as JSON array
try {
  const jsonMatch = msg.message.match(/\[{.*}\]/s);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]);
    if (Array.isArray(parsed)) {
      // Extract {name, ...otherProps} and create files
      parsed.forEach(item => {
        if (item.name) {
          // String properties become file content
          Object.entries(item).forEach(([key, value]) => {
            if (key !== 'name' && typeof value === 'string') {
              const filename = item.name;
              const content = value;
              // Auto-detect language from filename
              const ext = filename.split('.').pop()?.toLowerCase();
              const languageMap = {
                js: 'javascript', ts: 'typescript', jsx: 'javascript',
                tsx: 'typescript', py: 'python', yml: 'yaml',
                yaml: 'yaml', json: 'json', html: 'html',
                css: 'css', md: 'markdown'
              };
              files.push({
                filename,
                content,
                language: languageMap[ext] || 'plaintext'
              });
            }
          });
        }
      });
    }
  }
} catch (e) {
  // Fall back to markdown parsing
}
```

**Benefits**:
- Handles existing JSON array outputs (backward compatibility)
- Extracts filename from `name` property
- Auto-detects language from file extension
- Creates proper file objects for CodePreview tabs

### 2. Backend Prevention (server/agents.ts)
Enhanced system prompts for all code-generating agents (Ollie, Hugo, Milo):

**Added to each prompt**:
```
NEVER return code as JSON arrays like [{name: "file.js", content: "..."}]. 
ALWAYS use markdown code blocks with proper formatting.
```

**Full prompt structure**:
```markdown
IMPORTANT: Format your entire response using markdown code blocks:

\`\`\`filename.js
// Your code here
\`\`\`

NEVER return code as JSON arrays like [{name: "file.js", content: "..."}]. 
ALWAYS use markdown code blocks.
```

**Affected Agents**:
- ✅ **Ollie** (Fullstack Developer) - Updated
- ✅ **Hugo** (Frontend Developer) - Updated
- ✅ **Milo** (Backend Developer) - Updated

**Not needed** (non-coding agents):
- Perry (Product Manager) - Planning only
- Gemma (Senior Developer) - Review only
- Ava (DevOps) - Configuration/deployment
- Gemma QA (Quality Assurance) - Testing/validation

## Testing Verification
After restart with updated prompts:
1. Create new project with "SimpleCalc" prompt
2. Verify all code outputs use markdown format
3. If JSON arrays still appear (cached responses), CodePreview parses them
4. All code files should display with proper tabs and syntax highlighting

## Files Modified
1. `client/src/components/CodePreview.tsx` - Added JSON array parsing
2. `server/agents.ts` - Updated Ollie, Hugo, Milo prompts with explicit warnings

## Expected Outcome
- **Preferred**: Agents return markdown code blocks (clean format)
- **Fallback**: If JSON arrays appear, CodePreview parses them correctly
- **Result**: Users always see properly formatted code with tabs and preview

## Implementation Status
✅ CodePreview JSON parsing added
✅ Ollie prompt updated
✅ Hugo prompt updated
✅ Milo prompt updated
⏳ Server restart needed to load new prompts
⏳ Testing with SimpleCalc prompt needed
