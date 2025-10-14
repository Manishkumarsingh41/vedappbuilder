# VedAppBuilder - Multi-Agent AI App Builder

# VedAppBuilder 🚀

A multi-agent AI system that builds complete applications using specialized AI agents. Each agent has a specific role (Product Manager, UI/UX Designer, Frontend Dev, Backend Dev, DevOps, QA, Project Manager) and works together to analyze your requirements and generate code.

## ✨ Features

- **7 Specialized AI Agents** working in orchestrated workflow
- **User-Provided API Keys** - Secure, no server-side storage
- **Multiple LLM Support** - OpenAI, Google Gemini, Perplexity
- **Real-time Progress** - Watch agents work in real-time
- **Code Preview** - View generated code with syntax highlighting and live preview
- **Real-time Chat** - Provide instructions and modifications during app building 💬
- **Code Generation** - Download complete project files
- **In-Memory Storage** - Fast, no database setup required

## 🤖 AI Agents

| Agent | Role | Model | Purpose |
|-------|------|-------|---------|
| Perry | Product Manager | Perplexity | Research competitors, define features |
| Gemma | UI/UX Designer | Gemini | Create layouts, design patterns |
| Ollie | Frontend Developer | OpenAI | Generate React components |
| Hugo | Backend Developer | OpenAI | Design APIs, database schemas |
| Milo | DevOps Engineer | Gemini | Deployment configs, CI/CD |
| Gemma QA | QA Tester | Gemini | Test cases, bug detection |
| Ava | Project Manager | OpenAI | Coordinate team, final summary |

## Features

- **Multi-Agent System**: 7 specialized AI agents work together to build your app
  - Perry (Product Manager) - Powered by Perplexity
  - Gemma (UI/UX Designer) - Powered by Gemini
  - Ollie (Frontend Developer) - Powered by OpenAI
  - Hugo (Backend Developer) - Powered by OpenAI
  - Milo (DevOps Engineer) - Powered by Gemini
  - Gemma QA (QA Tester) - Powered by Gemini
  - Ava (Project Manager) - Powered by OpenAI

- **User-Provided API Keys**: Securely provide your own API keys through the web interface
- **Real-time Updates**: Watch agents work in real-time as they build your project
- **Code Generation**: Agents generate actual code for your application
- **Download Projects**: Export generated code and documentation as a ZIP file

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Manishkumarsingh41/vedappbuilder.git
cd vedappbuilder
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file for server-side default API keys:
```bash
cp .env.example .env
# Edit .env and add your API keys (optional - users can provide keys via UI)
```

### Running the Application

#### Development Mode

**Windows PowerShell:**
```powershell
$env:NODE_ENV='development'; npx tsx server/index.ts
```

**Linux/Mac:**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

#### Production Mode

```bash
npm run build
npm start
```

## How to Use

1. **Open the Application**: Navigate to `http://localhost:5000` in your browser

2. **Create a New Project**: Fill in the project form:
   - **Project Name**: Give your app a name
   - **Description**: Describe what your app does and who it's for
   - **Key Requirements**: List the main features and functionality you need

3. **Configure API Keys** (Click "Show API Keys Configuration"):
   - **OpenAI API Key**: Powers Frontend, Backend, and PM agents
     - Get your key from: https://platform.openai.com/api-keys
   - **Gemini API Key**: Powers UI/UX, DevOps, and QA agents
     - Get your key from: https://aistudio.google.com/apikey
   - **Perplexity API Key**: Powers Product Manager agent
     - Get your key from: https://www.perplexity.ai/settings/api

   ⚠️ **Security Note**: Your API keys are sent directly to the AI providers and are **not stored** on our servers.

4. **Start Building**: Click "Start Building with AI" and watch the agents work!

5. **Download Your Project**: Once complete, download the generated code as a ZIP file

## API Key Requirements

To use all agents, you'll need API keys from:

- **OpenAI** (Required for 3 agents): Frontend Dev, Backend Dev, Project Manager
- **Google Gemini** (Required for 3 agents): UI/UX Designer, DevOps, QA Tester  
- **Perplexity** (Required for 1 agent): Product Manager

You can provide API keys in two ways:

1. **Via Web UI** (Recommended): Enter keys when creating a project
2. **Via `.env` file**: Set default keys server-side (optional fallback)

## Project Structure

```
vedappbuilder/
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Express backend (TypeScript)
├── shared/          # Shared types and schemas
├── .env.example     # Example environment variables
└── package.json     # Dependencies and scripts
```

## Technology Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **AI Models**: OpenAI GPT-4o-mini, Google Gemini 2.5 Flash, Perplexity Sonar
- **Storage**: In-memory (MemStorage) - no database required for local dev

## Advanced Features

### Code Preview
- View all generated code files with syntax highlighting
- Multiple file tabs for easy navigation
- Copy individual files to clipboard
- Download files separately
- Live iframe preview for HTML/React code
- See [FEATURE_CODE_PREVIEW.md](./FEATURE_CODE_PREVIEW.md) for details

### Real-Time Chat 💬
- Provide additional instructions while agents are building
- Request modifications mid-workflow (e.g., "Make buttons rounded", "Add dark mode")
- Agents re-process with full context of previous work
- Natural language instructions - no code required
- Floating chat button always accessible
- See [FEATURE_CHAT.md](./FEATURE_CHAT.md) for details

**Example Chat Instructions:**
- "Add a dark mode toggle to the header"
- "Use TypeScript instead of JavaScript"
- "Make the design more modern with gradients"
- "Add user authentication with JWT"

## Scripts

- `npm run dev` - Start development server (Linux/Mac)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema (if using PostgreSQL)

## Security & Privacy

- API keys provided via the UI are **never stored** on the server
- Keys are passed directly to AI providers for each request
- Server-side `.env` keys are optional fallbacks
- All communication happens over HTTPS in production

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
