# Design Guidelines: LLM Team App Builder - Futuristic Glassmorphism Interface

## Design Approach
**Futuristic Glassmorphism Dashboard** - A cutting-edge multi-agent orchestration interface inspired by sci-fi command centers and modern design systems like Apple's visionOS. This approach combines translucent glass surfaces, depth layering, and holographic accents to create an immersive AI collaboration experience.

## Core Design Elements

### A. Color Palette

**Dark Mode Foundation** (Primary)
- Background Base: 220 25% 8% (deep space blue-black)
- Surface Dark: 220 20% 12% (elevated dark panels)
- Glass Tint: 220 70% 50% with 10-20% opacity (cyan-blue glass overlay)

**Accent Colors**
- Primary Neon: 180 100% 50% (electric cyan - agent activity, CTAs)
- Secondary Glow: 280 100% 60% (violet-purple - highlights, notifications)
- Success State: 160 100% 45% (emerald - completed tasks)
- Warning State: 40 100% 50% (amber - pending actions)

**Agent Identity Colors** (Assign unique hue to each of 7 agents)
- Perry (PM): 200 80% 55% (sky blue)
- Gemma (Designer): 280 75% 60% (vibrant purple)
- Ollie (Frontend): 340 85% 55% (pink-red)
- Hugo (Backend): 120 70% 50% (green)
- Milo (DevOps): 30 90% 55% (orange)
- Gemma QA: 260 80% 60% (deep violet)
- Ava (Coordinator): 180 100% 50% (cyan)

### B. Glassmorphism Effects

**Glass Surface Specifications**
- Primary Glass Cards: `backdrop-blur-xl bg-white/5 border border-white/10`
- Elevated Glass: `backdrop-blur-2xl bg-white/8 border border-white/15 shadow-2xl`
- Interactive Glass: `backdrop-blur-lg bg-cyan-500/10 border border-cyan-400/20`
- Glow Effect: `shadow-[0_0_30px_rgba(0,200,255,0.3)]` for active states

**Depth Layers**
- Layer 1 (Background): Gradient mesh with animated particles
- Layer 2 (Main Content): Glass containers with blur
- Layer 3 (Modals/Popovers): Higher blur, stronger borders
- Layer 4 (Tooltips): Minimal blur, high contrast text

### C. Typography

**Font Stack**
- Primary: 'Inter', -apple-system, system-ui (body text, UI elements)
- Display: 'Space Grotesk', sans-serif (headers, agent names)
- Monospace: 'Fira Code', 'Courier New', monospace (code blocks)

**Type Scale**
- Hero Display: text-6xl font-bold tracking-tight (72px)
- Agent Names: text-3xl font-semibold tracking-wide (30px)
- Section Headers: text-2xl font-semibold (24px)
- Body Text: text-base font-normal (16px)
- Code/Technical: text-sm font-mono (14px)
- Micro Labels: text-xs font-medium uppercase tracking-wider (12px)

### D. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 24 (focused set)
- Component padding: p-6 or p-8
- Section spacing: space-y-8 or space-y-12
- Grid gaps: gap-6
- Margin hierarchy: mb-2, mb-4, mb-8

**Grid Structure**
- Main Dashboard: 12-column grid with sidebar (col-span-3) + content (col-span-9)
- Agent Cards: 3-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Workflow Timeline: Single column with connecting lines
- Max Container: max-w-7xl mx-auto

### E. Component Library

**Navigation**
- Sidebar: Frosted glass fixed panel (w-72) with agent quick-access icons
- Top Bar: Translucent header with project name, status indicator, settings
- Agent Selector: Horizontal pill navigation with glow on active agent

**Agent Cards**
- Glass container with agent color-coded left border (border-l-4)
- Avatar with holographic ring animation when active
- Status indicator (idle/working/complete) with pulsing glow
- Task list with progress bars (glassmorphic fill)
- Output preview area with syntax-highlighted code snippets

**Workflow Visualizer**
- Vertical timeline with connecting lines (gradient from cyan to purple)
- Glassmorphic step cards showing agent handoffs
- Animated pulse effect traveling between agents during execution
- Completion checkmarks with neon glow

**Input Forms**
- Project definition form with glowing focus states
- Multi-step wizard with glassmorphic progress indicator
- Text areas with subtle grid background pattern
- File upload zones with dashed border and hover lift effect

**Code Display**
- Full-screen modal with dark syntax highlighting (VS Code Dark+ theme)
- Glass toolbar with copy, download, expand actions
- Line numbers in muted cyan
- Language badge in top-right corner

**Buttons**
- Primary CTA: Solid neon gradient (cyan to purple) with glow shadow
- Secondary: Glass outline with neon border, blur background on hover
- Ghost: Transparent with neon text, glass background on hover
- Icon Buttons: Circular glass with centered icon, scale on hover

**Data Displays**
- Metrics Dashboard: Glass cards with large numbers, sparkline charts
- Agent Activity Feed: Chat-style bubbles with glass background
- Error/Warning Alerts: Glass banner with colored left accent, glow shadow

**Overlays**
- Modals: Centered glass panel with darker backdrop-blur
- Toasts: Top-right sliding glass notifications with auto-dismiss
- Tooltips: Small glass popovers with arrow, high contrast text

### F. Interactive Elements & Animations

**Micro-interactions** (use sparingly)
- Agent card hover: Gentle lift (translate-y-1) + increased glow
- Button hover: Scale 102% + brightness increase
- Status transitions: Smooth color fade (300ms ease)
- Loading states: Shimmer effect across glass surface

**Workflow Animations**
- Agent activation: Pulse ring expanding from center (1.5s)
- Task completion: Checkmark draw animation (500ms)
- Data transfer: Particle flow between agent cards (2s loop)

**Page Transitions**
- Route changes: Fade + slight slide (200ms)
- Modal entry: Scale from 95% to 100% with fade (300ms)

### G. Unique Visual Elements

**Background Treatment**
- Animated gradient mesh (slow rotation, 60s cycle)
- Floating particle system (subtle, low opacity)
- Radial glow emanating from active agent card

**Holographic Accents**
- Scanline effect overlay on agent avatars
- Prism gradient borders on hero elements
- Lens flare on primary CTA button

**Data Visualization**
- Real-time metrics: Glowing line charts on glass surface
- Progress indicators: Neon-filled glass tubes
- Status badges: Pill-shaped with internal glow

## Images

**Hero Section**
- Large background: Abstract neural network visualization or futuristic command center (1920x800px)
- Treatment: Heavy blur (20px) with overlay gradient (220 25% 8% to transparent)
- Position: Fixed background with parallax scroll

**Agent Avatars**
- Style: Geometric icons or abstract AI representations (128x128px)
- Effect: Holographic ring border, subtle animation when active
- Placement: Top-left of each agent card

**Empty States**
- Illustration: Minimalist line art of connected nodes (512x512px)
- Style: Neon outline on dark background
- Context: "No project started" state

## Layout Structure

**Main Dashboard**
```
┌─────────────────────────────────────────┐
│  Translucent Top Bar (Project Info)     │
├────────┬────────────────────────────────┤
│ Glass  │  Hero: "Multi-Agent AI Builder"│
│ Side   │  with blurred neural network bg │
│ bar    ├────────────────────────────────┤
│        │  Agent Orchestration Grid      │
│ Agent  │  [Perry] [Gemma] [Ollie]       │
│ Nav    │  [Hugo]  [Milo]  [Gemma QA]    │
│        ├────────────────────────────────┤
│        │  Workflow Timeline Visualizer  │
│        │  Step 1 → Step 2 → Step 3...   │
│        ├────────────────────────────────┤
│        │  Live Output & Code Display    │
│        │  (Syntax highlighted panels)   │
└────────┴────────────────────────────────┘
```

**Responsive Behavior**
- Mobile: Stack sidebar navigation as bottom sheet, single column agent grid
- Tablet: 2-column agent grid, collapsible sidebar
- Desktop: Full 3-column layout with persistent sidebar

## Accessibility & Usability

- Maintain 4.5:1 contrast ratio for all text on glass surfaces
- Use solid background overlays for critical text areas
- Provide reduced motion alternative (disable particles/glow)
- Ensure focus indicators visible on glassmorphic surfaces (2px neon outline)
- All interactive elements minimum 44x44px touch target