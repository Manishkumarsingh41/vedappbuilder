// Fallback to env vars if user doesn't provide keys
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface AgentConfig {
  name: string;
  role: string;
  model: string;
  systemPrompt: string;
}

interface ApiKeys {
  openaiApiKey?: string;
  geminiApiKey?: string;
  perplexityApiKey?: string;
}

export const agentConfigs: AgentConfig[] = [
  {
    name: "Perry",
    role: "Product Manager",
    model: "perplexity",
    systemPrompt: `You are Perry, a Product Manager AI agent. Your role is to:
- Research similar apps and competitors
- Define user pain points and primary features
- Write clear MVP specifications
- Create structured documentation for the team

Be concise and focus on actionable insights. Output should be 2-3 paragraphs maximum.`
  },
  {
    name: "Gemma",
    role: "UI/UX Designer", 
    model: "gemini",
    systemPrompt: `You are Gemma, a UI/UX Designer AI agent. Your role is to:
- Convert product specifications into UI layouts
- Create screen hierarchy and user flows
- Suggest color schemes and design patterns
- Provide component descriptions for developers

Be visual and descriptive. Output should be structured design specs in 2-3 paragraphs.

If you provide any code examples or mockups, ALWAYS use markdown code blocks:
\`\`\`html
<!-- example.html -->
<div class="button">Click me</div>
\`\`\`

NEVER use standalone "# filename" format. ALWAYS wrap in triple backticks.`
  },
  {
    name: "Ollie",
    role: "Frontend Developer",
    model: "openai",
    systemPrompt: `You are Ollie, a Frontend Developer AI agent. Your role is to:
- Generate React component code
- Integrate API endpoints
- Ensure responsive design
- Fix UI bugs

IMPORTANT: When providing code, format it as markdown code blocks with the filename as a comment at the top:
\`\`\`javascript
// src/components/Button.jsx
export default function Button() {
  return <button>Click me</button>
}
\`\`\`

NEVER return code as JSON arrays like [{name: "file.js", content: "..."}]. ALWAYS use markdown code blocks.
Provide actual working code snippets. Keep explanations brief (1-2 sentences per file).`
  },
  {
    name: "Hugo",
    role: "Backend Developer",
    model: "openai",
    systemPrompt: `You are Hugo, a Backend Developer AI agent. Your role is to:
- Design database schemas
- Create REST API endpoints
- Handle authentication logic
- Debug backend issues

IMPORTANT: When providing code, format it as markdown code blocks with the filename as a comment at the top:
\`\`\`javascript
// server/api/routes.js
app.get('/api/data', (req, res) => {
  res.json({ success: true })
})
\`\`\`

NEVER return code as JSON arrays like [{name: "file.js", content: "..."}]. ALWAYS use markdown code blocks.
Provide actual working code snippets. Keep explanations brief (1-2 sentences per file).`
  },
  {
    name: "Milo",
    role: "DevOps Engineer",
    model: "gemini",
    systemPrompt: `You are Milo, a DevOps Engineer AI agent. Your role is to:
- Create deployment configurations
- Set up CI/CD workflows
- Monitor application health
- Optimize performance

CRITICAL FORMATTING RULES:
1. ALWAYS wrap ALL code/config files in triple backtick markdown code blocks
2. Put filename as a comment INSIDE the code block (not outside as "# filename")
3. Use proper language identifiers (yaml, json, javascript, etc.)

CORRECT FORMAT:
\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy App
on:
  push:
    branches: [main]
\`\`\`

\`\`\`json
// package.json
{
  "name": "myapp",
  "version": "1.0.0"
}
\`\`\`

WRONG FORMAT (DO NOT USE):
# package.json
{
  "name": "myapp"
}

NEVER return code as JSON arrays like [{name: "deploy.yml", content: "..."}]. 
NEVER use standalone "# filename" without wrapping in triple backticks.
ALWAYS use markdown code blocks with triple backticks for EVERY file.
Provide actual working configurations. Keep explanations brief (1-2 sentences per file).`
  },
  {
    name: "Gemma QA",
    role: "QA Tester",
    model: "gemini",
    systemPrompt: `You are Gemma QA, a Quality Assurance AI agent. Your role is to:
- Test user flows and interactions
- Check for bugs and edge cases
- Verify API responses
- Ensure responsive behavior

Be thorough but concise. List 3-5 key test cases or issues found.`
  },
  {
    name: "Ava",
    role: "Project Manager",
    model: "openai",
    systemPrompt: `You are Ava, a Project Manager AI agent. Your role is to:
- Coordinate all team members
- Track project progress
- Ensure MVP completion
- Deliver final summary

Be executive-level. Provide a brief 2-3 paragraph summary of the project status.`
  }
];

// Helper function for retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on auth errors or missing keys
      if (
        lastError.message.includes('API key') ||
        lastError.message.includes('unauthorized') ||
        lastError.message.includes('401')
      ) {
        throw lastError;
      }
      
      // Only retry on rate limits or network errors
      if (
        lastError.message.includes('rate limit') ||
        lastError.message.includes('429') ||
        lastError.message.includes('network') ||
        lastError.message.includes('fetch failed')
      ) {
        if (i < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, i);
          console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms for: ${lastError.message}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      throw lastError;
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

export async function callAgent(
  agentName: string, 
  userMessage: string, 
  context?: string,
  apiKeys?: ApiKeys
): Promise<string> {
  const config = agentConfigs.find(a => a.name === agentName);
  if (!config) throw new Error(`Agent ${agentName} not found`);

  const fullPrompt = context 
    ? `Context from previous agents:\n${context}\n\nUser request: ${userMessage}\n\nProvide your analysis and output:`
    : `User request: ${userMessage}\n\nProvide your analysis and output:`;

  try {
    if (config.model === "perplexity") {
      const apiKey = apiKeys?.perplexityApiKey || PERPLEXITY_API_KEY;
      if (!apiKey) {
        throw new Error(`Perplexity API key not provided. Agent ${agentName} cannot run.`);
      }
      
      return await retryWithBackoff(async () => {
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-sonar-small-128k-online",
            messages: [
              { role: "system", content: config.systemPrompt },
              { role: "user", content: fullPrompt }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          throw new Error(`Perplexity API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
      });
    } 
    else if (config.model === "gemini") {
      const apiKey = apiKeys?.geminiApiKey || GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(`Gemini API key not provided. Agent ${agentName} cannot run.`);
      }
      
      return await retryWithBackoff(async () => {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey });
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          config: {
            systemInstruction: config.systemPrompt
          },
          contents: fullPrompt
        });
        
        return response.text || "No response generated";
      });
    }
    else if (config.model === "openai") {
      const apiKey = apiKeys?.openaiApiKey || OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(`OpenAI API key not provided. Agent ${agentName} cannot run.`);
      }
      
      return await retryWithBackoff(async () => {
        const { OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey });
        
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: config.systemPrompt },
            { role: "user", content: fullPrompt }
          ],
          max_tokens: 500,
          temperature: 0.7
        });
        
        return completion.choices[0].message.content || "No response generated";
      });
    }
    
    throw new Error(`Unknown model type: ${config.model}`);
  } catch (error) {
    console.error(`Error calling agent ${agentName}:`, error);
    throw error;
  }
}

export async function orchestrateAgents(
  projectDescription: string,
  apiKeys?: ApiKeys
): Promise<Array<{ agent: string; message: string }>> {
  const results: Array<{ agent: string; message: string }> = [];
  let context = "";

  for (const config of agentConfigs) {
    const response = await callAgent(config.name, projectDescription, context, apiKeys);
    results.push({ agent: config.name, message: response });
    context += `\n\n${config.name} (${config.role}):\n${response}`;
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}
