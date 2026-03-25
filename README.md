# 🚀 VedAppBuilder – Multi-Agent AI App Builder

VedAppBuilder is a multi-agent AI system that builds complete applications using specialized AI agents. Each agent plays a defined role (Product Manager, UI/UX Designer, Frontend, Backend, DevOps, QA) and collaborates to transform your idea into a working application.

---

## ✨ Key Features

- 🤖 7 Specialized AI Agents working in an orchestrated workflow  
- 🔐 User-Provided API Keys (no server-side storage)  
- 🧠 Multi-LLM Support – OpenAI, Gemini, Perplexity  
- ⚡ Real-time Progress Tracking  
- 💻 Code Preview with Live Rendering  
- 💬 Real-time Chat with Agents  
- 📦 Download Complete Project Code  
- 🚀 In-Memory Storage (no DB required)

---

## 🤖 AI Agent System

| Agent | Role | Model | Responsibility |
|------|------|------|----------------|
| Perry | Product Manager | Perplexity | Feature planning & research |
| Gemma | UI/UX Designer | Gemini | Design systems & layouts |
| Ollie | Frontend Dev | OpenAI | React UI generation |
| Hugo | Backend Dev | OpenAI | APIs & database schemas |
| Milo | DevOps | Gemini | CI/CD & deployment |
| Gemma QA | QA Tester | Gemini | Testing & bug detection |
| Ava | Project Manager | OpenAI | Workflow coordination |

---

## 🛠️ Tech Stack

Frontend: React, TypeScript, Vite, TailwindCSS, shadcn/ui  
Backend: Node.js, Express, TypeScript  
AI Models: GPT-4o-mini, Gemini 2.5 Flash, Perplexity Sonar  
Storage: In-memory (no database required)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

git clone https://github.com/Manishkumarsingh41/vedappbuilder.git  
cd vedappbuilder  
npm install  

(Optional)  
cp .env.example .env  

---

### ▶️ Run the App

Development  
npm run dev  

Production  
npm run build  
npm start  

App runs at: http://localhost:5000

---

## 🧠 How It Works

1. Enter your project idea  
2. Provide API keys (OpenAI, Gemini, Perplexity)  
3. Agents collaborate in real-time  
4. Code is generated step-by-step  
5. Download your complete project  

---

## 🔑 API Requirements

- OpenAI → Frontend, Backend, PM  
- Gemini → UI/UX, DevOps, QA  
- Perplexity → Product Manager  

✔ Keys are never stored  
✔ Sent directly to providers  

---

## 💬 Advanced Features

Code Preview  
- Syntax highlighting  
- Multi-file navigation  
- Live preview  

Real-Time Chat  
- Modify app during generation  
Examples:  
"Add dark mode"  
"Use TypeScript"  
"Add authentication"  

---

## 📁 Project Structure

vedappbuilder/  
├── client/  
├── server/  
├── shared/  
├── .env.example  
└── package.json  

---

# 📌 CONTRIBUTING.md

## 🤝 Contributing Guidelines

We welcome contributions from everyone 🚀  

### Steps:
1. Fork the repository  
2. Create a branch (feature/your-feature)  
3. Make changes  
4. Commit your code  
5. Submit a Pull Request  

### Rules:
- Follow clean code practices  
- Use meaningful commit messages  
- Keep PRs small and focused  
- Test before submitting  

---

# 🗺️ ROADMAP.md

## Future Plans

- Improve agent collaboration  
- Add offline execution mode  
- Mobile app integration  
- Plugin system for custom agents  
- Database support (persistent memory)  

---

# 🐛 SAMPLE ISSUES (Create in GitHub)

1. Add Dark Mode Toggle  
Label: enhancement, good first issue  

2. Optimize API Response Speed  
Label: performance  

3. Improve UI Responsiveness  
Label: UI, enhancement  

4. Add Authentication System (JWT)  
Label: feature  

5. Fix Chat Scroll Bug  
Label: bug  

6. Add Docker Support  
Label: devops  

---

## 🔐 Security

- API keys are never stored  
- Direct communication with providers  
- HTTPS in production  

---

## 📜 License

MIT License  

---

## 💬 Support

Open an issue on GitHub for help  

---

⭐ Star the repo if you like it!