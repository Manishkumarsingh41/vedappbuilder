# LLM Team App Builder

## Overview

LLM Team App Builder is a multi-agent AI orchestration system that uses specialized LLM agents to collaboratively build web and mobile applications from concept to MVP deployment. The system coordinates multiple free AI models (Gemini, Perplexity, OpenAI, HuggingFace) where each acts as a specialized team member with specific roles (Product Manager, Designer, Frontend/Backend Developers, DevOps, QA, Coordinator).

The application features a futuristic glassmorphism-themed dashboard that visualizes the agent workflow in real-time, showing each agent's status, outputs, and progress through the development pipeline.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for UI components
- Vite as the build tool and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Tailwind CSS for styling with custom design system

**Design System:**
- Futuristic glassmorphism theme with dark mode as primary
- Custom color palette with agent-specific identity colors
- Shadcn/ui component library (New York variant) with Radix UI primitives
- Typography using Inter (body), Space Grotesk (display), and Fira Code (monospace)
- Particle-based animated backgrounds for visual enhancement

**Key UI Components:**
- `ProjectForm`: Main entry point for creating new projects with validation
- `AgentCard`: Displays individual agent status, role, and output
- `WorkflowTimeline`: Visualizes the sequential agent workflow progress
- `GlassCard`: Reusable glassmorphism container component
- `ParticleBackground`: Animated background effects
- `CodeDisplay`: Syntax-highlighted code output viewer

**State Management:**
- React Query handles all server state with 2-second polling for active projects
- Form state managed by React Hook Form with Zod validation
- Local component state for UI interactions
- Toast notifications for user feedback

### Backend Architecture

**Technology Stack:**
- Node.js with Express server
- TypeScript for type safety
- In-memory storage (MemStorage class) as default data persistence
- Drizzle ORM configured for PostgreSQL (schema defined, ready for database integration)

**API Design:**
- RESTful endpoints under `/api` prefix
- POST `/api/projects` - Creates project and initiates agent orchestration
- GET `/api/projects/:id/messages` - Retrieves agent messages for a project (implied from client usage)

**Agent Orchestration:**
- Sequential agent workflow execution
- Each agent receives context from previous agents
- Real-time status updates ("working" → "complete")
- Background processing with incremental message storage
- Rate limiting delays between agent calls to manage API quotas

**Agent Configuration:**
Seven specialized agents with distinct roles:
1. Perry (Product Manager) - Perplexity API
2. Gemma (UI/UX Designer) - Gemini API
3. Ollie (Frontend Developer) - OpenAI API
4. Hugo (Backend Developer) - HuggingFace API
5. Milo (DevOps Engineer) - HuggingFace API
6. Gemma QA (QA Tester) - Gemini API
7. Ava (Coordinator) - OpenAI API

**Data Models:**
- `Project`: Stores project metadata (name, description, requirements, tech stack, status)
- `AgentMessage`: Stores agent outputs with timestamps and status
- Schema uses Drizzle ORM with PostgreSQL dialect (currently using in-memory fallback)

### Database Strategy

**Current Implementation:**
- In-memory storage using Map data structures
- Suitable for development and demonstration
- No persistence between server restarts

**Designed for PostgreSQL:**
- Drizzle ORM schema fully defined in `shared/schema.ts`
- Configured for Neon Database via `@neondatabase/serverless`
- Migration setup ready via `drizzle-kit`
- UUID primary keys with timestamps
- Foreign key relationships between projects and agent messages

### Development Workflow

**Build Process:**
- Vite handles client-side bundling with React Fast Refresh
- esbuild compiles server code to ESM format
- TypeScript with strict mode for type checking
- Path aliases configured (`@/` for client, `@shared/` for shared code)

**Development Server:**
- Express middleware mode with Vite dev server integration
- Hot Module Replacement (HMR) for instant updates
- Request logging with response time tracking
- Development-only plugins (Replit cartographer and dev banner)

**Error Handling:**
- Centralized error middleware in Express
- Runtime error overlay in development (Replit plugin)
- Zod schema validation for all inputs
- Try-catch blocks around agent orchestration with graceful degradation

## External Dependencies

### AI/LLM Services
- **Google Gemini API** (`@google/genai`) - Powers Gemma (Designer) and Gemma QA agents
- **Perplexity API** - Powers Perry (Product Manager) for research capabilities
- **OpenAI API** - Powers Ollie (Frontend) and Ava (Coordinator) agents
- **HuggingFace Models** - Powers Hugo (Backend) and Milo (DevOps) agents
- All services require API keys via environment variables

### Database & Storage
- **Neon Database** (`@neondatabase/serverless`) - Serverless PostgreSQL provider
- **Drizzle ORM** - Type-safe database ORM with Zod integration
- Currently using in-memory storage, designed to switch to PostgreSQL

### UI Component Libraries
- **Radix UI** - Accessible, unstyled component primitives (15+ components)
- **Shadcn/ui** - Pre-styled component library built on Radix
- **Lucide React** - Icon library
- **CMDK** - Command menu component
- **Recharts** - Charting library (configured, not yet implemented)

### Development Tools
- **Replit Plugins** - Vite integration for runtime errors, cartographer, dev banner
- **Tailwind CSS** - Utility-first CSS framework with custom configuration
- **PostCSS & Autoprefixer** - CSS processing pipeline
- **React Hook Form** - Form state management with Zod validation

### Session & Security
- **connect-pg-simple** - PostgreSQL session store for Express sessions (configured but not yet active)