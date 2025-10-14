# Code Formatting Improvements

## Problem
When agents generated code, it was displayed with file paths and markdown markers mixed in with the actual code, making it hard to read and use. For example:

```
.github/workflows/deploy.yml
# This GitHub Actions workflow...
name: Deploy SmartCalc Pro Frontend
...
```

The file path `.github/workflows/deploy.yml` was appearing as part of the text instead of being extracted as a filename.

## Solution

### 1. Updated Agent System Prompts

Modified the system prompts for code-generating agents (Ollie, Hugo, Milo) to explicitly format their responses as markdown code blocks with filenames in comments:

**Before:**
```
Provide code examples when relevant.
```

**After:**
```
IMPORTANT: When providing code, format it as markdown code blocks with the filename as a comment at the top:
```javascript
// src/components/Button.jsx
export default function Button() {
  return <button>Click me</button>
}
```

Provide actual working code snippets. Keep explanations brief (1-2 sentences per file).
```

### 2. Enhanced Code Extraction Logic

Updated `CodePreview.tsx` to intelligently extract filenames from comment lines:

**New Features:**
- Detects file paths in first-line comments (both `//` and `#` style)
- Supports multiple comment formats:
  - JavaScript/TypeScript: `// src/App.tsx`
  - YAML/Shell: `# .github/workflows/deploy.yml`
  - Python: `# src/main.py`
- Removes the filename comment from displayed code
- Falls back to generated filenames if no comment found
- Preserves original code formatting

**Code Logic:**
```typescript
// Check for filename in comment (e.g., // src/App.jsx or # config.yml)
const filePathMatch = firstLine.match(/^(?:\/\/|#)\s*(.+\.\w+)/);
if (filePathMatch) {
  fileName = filePathMatch[1].trim();
  // Remove the filename comment from code
  code = code.split('\n').slice(1).join('\n').trim();
}
```

### 3. Supported File Types

The code preview now correctly handles:
- **JavaScript/JSX** - `.js`, `.jsx`
- **TypeScript/TSX** - `.ts`, `.tsx`
- **Python** - `.py`
- **HTML** - `.html`
- **CSS** - `.css`
- **YAML** - `.yml`, `.yaml`
- **JSON** - `.json`
- **Plain text** - `.txt`

## Benefits

### Before Fix
```
Agent Messages:
Milo • DevOps Engineer
.github/workflows/deploy.yml
# This GitHub Actions workflow...
name: Deploy SmartCalc Pro Frontend
on:
  push:
    branches:
      - main
```

### After Fix
```
Code Preview Tabs:
📄 .github/workflows/deploy.yml  ✅

# Preview shows clean code:
name: Deploy SmartCalc Pro Frontend
on:
  push:
    branches:
      - main
```

## User Experience Improvements

1. **Clean File Tabs**: Filenames appear as clickable tabs, not in code
2. **Accurate Paths**: Real file paths extracted from agent outputs (e.g., `.github/workflows/deploy.yml`)
3. **Copy-Ready Code**: Code copied to clipboard is clean, without filename comments
4. **Download Preserves Structure**: Downloaded files maintain correct paths
5. **Better Organization**: Multiple files clearly separated with proper names

## Example Agent Output

### Milo (DevOps Engineer)
**Prompt:** "Create a deployment workflow"

**Output:**
````markdown
Here's a GitHub Actions workflow for automated deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy Application
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        run: npm run deploy
```

This workflow will automatically deploy when you push to the main branch.
````

**CodePreview Result:**
- Tab: `.github/workflows/deploy.yml`
- Language: YAML
- Code: (clean, without comment line)

## Technical Details

### Regex Pattern
```typescript
/^(?:\/\/|#)\s*(.+\.\w+)/
```

**Breakdown:**
- `^` - Start of line
- `(?:\/\/|#)` - Non-capturing group for `//` or `#`
- `\s*` - Optional whitespace
- `(.+\.\w+)` - Capture group: any characters + dot + file extension
- Example matches:
  - `// src/App.jsx` → `src/App.jsx`
  - `# config/database.yml` → `config/database.yml`
  - `// ./components/Button.tsx` → `./components/Button.tsx`

### File Extension Detection
- Checks markdown language tag first (e.g., ` ```yaml`)
- Falls back to common mappings:
  - `typescript` or `tsx` → `.tsx`
  - `javascript` or `jsx` → `.jsx`
  - `yaml` or `yml` → `.yml`
  - etc.

## Testing

### Test Case 1: YAML Config
**Input:**
````
```yaml
# .github/workflows/test.yml
name: Test
on: [push]
```
````

**Expected:** Tab shows `.github/workflows/test.yml`, code shows `name: Test\non: [push]`

### Test Case 2: Multiple Files
**Input:**
````
```jsx
// src/Button.jsx
export default () => <button>Click</button>
```

```css
// src/Button.css
button { color: blue; }
```
````

**Expected:** Two tabs - `src/Button.jsx` and `src/Button.css`

### Test Case 3: No Filename Comment
**Input:**
````
```javascript
console.log("Hello");
```
````

**Expected:** Tab shows `DevOps_Engineer_0.jsx` (auto-generated)

## Future Enhancements

1. **Folder Structure View**: Show files in a tree structure
2. **Full Path Extraction**: Support multi-level paths (e.g., `src/components/ui/Button.tsx`)
3. **Smart Grouping**: Group related files (e.g., `Button.jsx` + `Button.css` + `Button.test.js`)
4. **Syntax Themes**: Allow users to choose syntax highlighting theme
5. **Diff View**: Show before/after when code is updated via chat
6. **File Icons**: Display icons based on file type (React, TypeScript, etc.)

## Summary

The code formatting improvements make vedappbuilder's code preview feature significantly more professional and user-friendly:

- ✅ **Clean Presentation**: No more file paths mixed with code
- ✅ **Accurate Filenames**: Real paths from agents, not generic names
- ✅ **Copy-Ready**: Code is clean and ready to use
- ✅ **Professional UI**: Tab-based file navigation
- ✅ **Agent Guidance**: System prompts enforce consistent formatting

Users can now trust that the code they see, copy, and download matches industry standards and is ready for immediate use in their projects.
