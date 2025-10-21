# Known Issues and Problems - VedAppBuilder

## Current Status
✅ **Server is running successfully on port 5000**
✅ **No TypeScript compilation errors**
✅ **All dependencies installed correctly**

## Potential Runtime Problems

### 1. **PORT CONFLICT** ⚠️ HIGH PRIORITY
**Problem**: Port 5000 may already be in use by another process
**Symptoms**: 
- Error: `EADDRINUSE: address already in use 0.0.0.0:5000`
- Server fails to start

**Solution**:
```powershell
# Find process using port 5000
netstat -aon | Select-String ":5000"

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force
```

**Prevention**: 
- Change PORT in `.env` to a different value (e.g., 3000, 8080)
- Always check for running processes before starting server

---

### 2. **MISSING API KEYS** ⚠️ HIGH PRIORITY
**Problem**: Users must provide API keys for agents to work
**Symptoms**:
- Agent calls fail with "API key not provided" errors
- Project creates successfully but agents show error status
- Messages show: `Error: OpenAI/Gemini/Perplexity API key not provided`

**Solution**:
Users MUST provide at least one of these API keys via the web form:
- OpenAI API Key (for agents: Ollie, Hugo, Ava)
- Gemini API Key (for agents: Gemma, Milo, Gemma QA)
- Perplexity API Key (for agent: Perry)

**Fallback**: 
- System will use `.env` keys if user doesn't provide them
- But `.env` keys should be removed for production/security

---

### 3. **DATABASE CONFIGURATION** ⚠️ MEDIUM PRIORITY
**Problem**: `drizzle.config.ts` requires `DATABASE_URL` but project uses in-memory storage
**Symptoms**:
- Running `npm run db:push` will fail
- Error: "DATABASE_URL, ensure the database is provisioned"

**Current State**:
- ✅ Project uses `MemStorage` (in-memory) - no database needed for basic functionality
- ❌ Database commands won't work without `DATABASE_URL`

**Solution**:
If you need persistent storage:
1. Set up PostgreSQL database (local or cloud like Neon)
2. Add `DATABASE_URL` to `.env`:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```
3. Uncomment database storage in `server/storage.ts`
4. Run migrations: `npm run db:push`

**Current Workaround**: 
- Use in-memory storage (data lost on restart)
- Good for development/testing

---

### 4. **WINDOWS POWERSHELL COMPATIBILITY** ⚠️ MEDIUM PRIORITY
**Problem**: `npm run dev` doesn't work on Windows PowerShell
**Symptoms**:
- Error: `'NODE_ENV' is not recognized as an internal or external command`

**Solution**:
Use PowerShell-compatible command:
```powershell
$env:NODE_ENV='development'; npx tsx server/index.ts
```

**Better Solution**:
Install cross-env for cross-platform compatibility:
```powershell
npm install -D cross-env
```

Then update `package.json` scripts:
```json
"dev": "cross-env NODE_ENV=development tsx server/index.ts"
```

---

### 5. **API RATE LIMITS** ⚠️ LOW PRIORITY
**Problem**: Multiple agent calls in sequence may hit API rate limits
**Symptoms**:
- Some agents succeed, others fail
- Rate limit errors from OpenAI/Gemini/Perplexity

**Current Mitigation**:
- 500ms delay between agent calls (in `server/routes.ts`)

**Solution if rate limits hit**:
- Increase delay in `server/routes.ts` (line ~61): `setTimeout(resolve, 1000)` or higher
- Use higher tier API keys with better rate limits
- Implement retry logic with exponential backoff

---

### 6. **ERROR HANDLING IN AGENT CALLS** ⚠️ LOW PRIORITY
**Problem**: If one agent fails, others continue but context is missing
**Symptoms**:
- Later agents don't have full context from failed agents
- Project still completes but with gaps

**Current Behavior**:
- Errors are caught and stored as agent messages with "error" status
- Other agents continue to run

**Improvement Needed**:
- Better error messages to users
- Option to retry failed agents
- Better context handling when agents fail

---

### 7. **SECURITY CONCERNS** 🔒 HIGH PRIORITY FOR PRODUCTION
**Problem**: API keys are sent from client to server in plain text
**Current Implementation**: 
- Keys sent via HTTPS (secure in production with SSL)
- Keys NOT stored in database (good!)
- Keys NOT logged (good!)

**Security Risks**:
- Keys visible in browser network tab
- Keys in memory on server during request

**For Production**:
1. Use environment variables on server (not user-provided keys)
2. Implement user authentication
3. Store encrypted keys per user account
4. Add rate limiting per user
5. Use server-side API key management
6. Add CORS protection

---

### 8. **VITE DEV SERVER ISSUES** ⚠️ LOW PRIORITY
**Problem**: Vite might not hot-reload properly on Windows
**Symptoms**:
- Changes to client code don't reflect immediately
- Need to refresh browser manually

**Solution**:
- Full page refresh (Ctrl+R or F5)
- Restart dev server if issues persist
- Check browser console for HMR errors

---

### 9. **MEMORY LEAK WITH IN-MEMORY STORAGE** ⚠️ LOW PRIORITY
**Problem**: All projects and messages stored in RAM
**Symptoms**:
- Memory usage grows over time
- No persistence (data lost on restart)

**Current Limits**:
- No cleanup of old projects
- No maximum storage size

**Solution for Production**:
- Implement database storage (PostgreSQL)
- Add cleanup job for old projects
- Set memory limits

---

### 10. **MISSING HUGGING FACE AGENTS** ⚠️ MEDIUM PRIORITY
**Problem**: Schema shows "HuggingFace" model for Hugo and Milo but implementation uses "openai" and "gemini"
**Location**: `shared/schema.ts` line 50-51

**Current State**:
```typescript
{ name: "Hugo", role: "Backend Developer", model: "HuggingFace", ... },
{ name: "Milo", role: "DevOps Engineer", model: "HuggingFace", ... },
```

**Actual Implementation** (`server/agents.ts`):
```typescript
{ name: "Hugo", role: "Backend Developer", model: "openai", ... },
{ name: "Milo", role: "DevOps Engineer", model: "gemini", ... },
```

**Impact**: Mismatch between UI display and actual model used

**Solution**: Update schema to match actual implementation or add HuggingFace support

---

## Testing Checklist

Before deploying, verify:

- [ ] Server starts without errors
- [ ] Can create project via UI
- [ ] At least one agent completes successfully
- [ ] Can view project history
- [ ] Can download project files
- [ ] Error messages are user-friendly
- [ ] API keys are validated before submission
- [ ] No sensitive data in logs
- [ ] Memory usage is reasonable
- [ ] Works on target deployment platform

---

## Recommended Next Steps

1. **Immediate**:
   - Add cross-env for Windows compatibility
   - Add API key validation in UI
   - Fix HuggingFace model mismatch in schema

2. **Short Term**:
   - Implement proper error messages for failed agents
   - Add retry mechanism for failed API calls
   - Add progress indicators in UI

3. **Long Term**:
   - Implement database storage
   - Add user authentication
   - Implement server-side API key management
   - Add rate limiting
   - Deploy with proper SSL/HTTPS

---

## Quick Start (Verified Working)

```powershell
# 1. Install dependencies (one time)
npm install

# 2. Start server
$env:NODE_ENV='development'; npx tsx server/index.ts

# 3. Open browser
# http://localhost:5000

# 4. Create project with your API keys
# - Fill in project details
# - Add at least one API key (OpenAI, Gemini, or Perplexity)
# - Submit and watch agents work
```

---

**Last Updated**: October 13, 2025
**Server Status**: ✅ Running on port 5000
**TypeScript**: ✅ No compilation errors
**Dependencies**: ✅ All installed
