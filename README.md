# sjtroxel's First Time Using Claude Code

This repository documents my first experience learning and building with Claude Code, completing a series of exercises designed to understand how AI-powered coding assistants work.

## About This Project

**Purpose:** Educational exploration of Claude Code through hands-on exercises
**Student:** sjtroxel (Codefi Code Labs bootcamp graduate fall 2025)
**Framework:** Based on test prompts for observing AI coding assistant behavior

## What I'm Learning

This repository demonstrates key concepts about AI-powered development:
- **Context Gathering** - How Claude Code learns from existing code
- **Real-Time Observability** - Seeing the AI work in real-time
- **Planning Behavior** - How AI plans before executing
- **Orchestration** - Coordinating multi-file projects
- **Self-Correction** - How AI handles errors and adapts

## Repository Structure

```
first-claude-code/
├── 01-warmup/                          # Simple HTML/CSS/JS button demo
├── 02-context-gathering/               # React JSX components (Button, Card)
├── 03-planning-behavior/               # Angular 21 todo app with priorities
├── 04a-orchestration-rails/            # Ruby on Rails API (complex example)
├── 04b-orchestration-express/          # Express.js API (simple example)
├── 05-self-correction/                 # React data fetcher with debugging demo
├── 06-windows-95-games/                # Windows 95 game clones
│   └── minesweeper-clone/              #   Classic Minesweeper (vanilla JS)
├── Test_Prompts_for_Assignment.md      # Exercise instructions
└── README.md                           # This file
```

## Exercises Completed

### Exercise 01: Warmup (HTML/CSS/JS)
**Goal:** Get comfortable with Claude Code basics
**What I built:** Simple button that changes color when clicked
**Tech:** Vanilla HTML, CSS, JavaScript
**Run:** Open `01-warmup/index.html` in browser

### Exercise 02: Context Gathering (React Components)
**Goal:** Observe how Claude Code learns from existing code patterns
**What I built:** Button.jsx and matching Card.jsx component
**Tech:** React JSX (components only, no build setup)
**Key Learning:** Claude automatically read Button.jsx to match its style

### Exercise 03: Planning Behavior (Angular Todo App)
**Goal:** See how Claude plans complex tasks before coding
**What I built:** Full-featured todo app with localStorage and priorities
**Tech:** Angular 21, TypeScript, Signals
**Features:** Add/complete/delete todos, filter, priority levels (high/medium/low)
**Run:** `cd 03-planning-behavior/todo-app && ng serve`
**Key Learning:** Claude planned the approach, then adapted mid-task when I requested priority levels

### Exercise 04a: Orchestration (Ruby on Rails API)
**Goal:** Observe multi-file coordination in a complex framework
**What I built:** RESTful API with User endpoints
**Tech:** Rails 8.0.3, SQLite
**Endpoints:** GET /api/users, GET /api/users/:id, POST /api/users
**Run:** `cd 04a-orchestration-rails/users-api && rails server`
**Key Learning:** Rails generates many files (~85), heavy conventions

### Exercise 04b: Orchestration (Express API)
**Goal:** Same as 04a, but with simpler framework for clearer observation
**What I built:** RESTful API with User endpoints (same as Rails version)
**Tech:** Express.js, Node.js, JSON file storage
**Endpoints:** GET /api/users, GET /api/users/:id, POST /api/users
**Run:** `cd 04b-orchestration-express && npm install && npm start`
**Key Learning:** Express uses fewer files (~6), clearer dependency chain

### Exercise 05: Self-Correction (React Data Fetcher)
**Goal:** Observe how Claude debugs and fixes its own mistakes
**What I built:** React component that fetches and displays posts from an API
**Tech:** React 18 (CDN), JSONPlaceholder API
**Features:** Loading state, error handling, displays 100 posts
**Run:** Open `05-self-correction/index.html` in browser
**Key Learning:** Claude can introduce a bug, identify it from error messages, fix it, and verify the fix works - demonstrating real debugging workflow

### Exercise 06: Minesweeper Clone (Vanilla JS)
**Goal:** Build a fully playable game with Claude Code — authentic Windows 95 recreation
**What I built:** Classic Minesweeper with Win95 window chrome, menu bar, difficulty levels, and retro pixel aesthetics
**Tech:** Vanilla HTML, CSS (CSS Grid, beveled borders), JavaScript (ES6+), Press Start 2P pixel font
**Features:** 4 difficulty levels (Beginner/Intermediate/Expert/Custom), Win95 title bar & menus, smiley face reactions, LCD counter & timer, first-click safety, flood-fill reveal, F2 shortcut
**Run:** Open `06-windows-95-games/minesweeper-clone/index.html` in browser

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, React JSX, Angular 21
- **Backend:** Ruby on Rails 8, Express.js
- **Languages:** JavaScript, TypeScript, Ruby
- **Tools:** Node.js, npm, Angular CLI, Rails CLI

## Key Observations

### What I Learned About Claude Code:

1. **Context Awareness:** Claude automatically reads relevant files without being told
2. **Planning First:** For complex tasks, Claude outlines the approach before coding
3. **Real-Time Transparency:** I can see every file being created/edited
4. **Adaptability:** Claude can change direction mid-task (e.g., adding priorities)
5. **Orchestration:** Claude understands dependencies between files
6. **Framework Knowledge:** Works with Angular, Rails, Express, vanilla web tech

### Comparison: Rails vs Express Orchestration

| Aspect | Rails (04a) | Express (04b) |
|--------|-------------|---------------|
| Files Created | ~85 files | 6 files |
| Complexity | High | Low |
| Conventions | Strong (MVC) | Minimal |
| Dependencies | Many | One (express) |
| Better For Learning | Framework magic | Clear dependencies |

## How to Use This Repository

Each exercise folder contains:
- Complete, working code
- Individual README with setup instructions
- Observations about Claude Code's behavior

**To explore an exercise:**
1. Navigate to the exercise folder
2. Read the README.md
3. Follow the "How to Run" instructions
4. See the code in action!

## Assignment Context

This repository was created as part of a learning assignment to explore AI-powered coding assistants. The exercises are designed to observe specific behaviors:
- How does Claude gather context?
- Can I see it working in real-time?
- How does it plan complex tasks?
- Can it coordinate multiple files?

## About the Developer

**sjtroxel** - Codefi Code Labs bootcamp graduate (fall 2025)
**Background:** 1 year of coding experience, learned Rails and Angular in bootcamp, learned React, Node/Express and Tailwind on my own
**First Time:** This is my first experience with Claude Code
**Goal:** Understand how AI coding tools work before relying on them

## Credits

- **Claude Code:** AI-powered coding assistant by Anthropic
- **Test Prompts:** Based on structured exercises for learning Claude Code
- **Instructor Guidance:** "Your cheese will be moved. Workflows may feel 'wrong' to experienced devs."

---

*This repository is a learning exercise demonstrating AI-assisted development. All code was created collaboratively with Claude Code.*
