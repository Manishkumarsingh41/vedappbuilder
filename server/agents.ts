const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface AgentConfig {
  name: string;
  role: string;
  model: string;
  systemPrompt: string;
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

Be visual and descriptive. Output should be structured design specs in 2-3 paragraphs.`
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

Provide actual code snippets when relevant. Keep responses to 2-3 paragraphs or code blocks.`
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

Provide code examples when relevant. Keep responses to 2-3 paragraphs or code blocks.`
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

Be practical and specific. Output should be 2-3 paragraphs with deployment steps.`
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

export async function callAgent(agentName: string, userMessage: string, context?: string): Promise<string> {
  const config = agentConfigs.find(a => a.name === agentName);
  if (!config) throw new Error(`Agent ${agentName} not found`);

  const fullPrompt = context 
    ? `Context from previous agents:\n${context}\n\nUser request: ${userMessage}\n\nProvide your analysis and output:`
    : `User request: ${userMessage}\n\nProvide your analysis and output:`;

  try {
    if (config.model === "perplexity") {
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
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
    } 
    else if (config.model === "gemini") {
      const genai = await import("@google/genai");
      const genAI = new genai.GoogleGenerativeAI(GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: config.systemPrompt,
      });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text() || "No response generated";
    }
    else if (config.model === "openai") {
      const { OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
      
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
    }
    
    throw new Error(`Unknown model type: ${config.model}`);
  } catch (error) {
    console.error(`Error calling agent ${agentName}:`, error);
    throw error;
  }
}

