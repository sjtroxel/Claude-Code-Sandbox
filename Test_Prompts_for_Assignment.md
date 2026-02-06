# Test Prompts for Your Claude Code Exploration

## Purpose

These prompts are designed to help you observe the key concepts from your lecture:
- Context gathering
- Real-time observability
- Planning behavior
- Sub-agent orchestration
- Self-correction

Use these during your 20-minute exploration to see how Claude Code handles different scenarios.

---

## Warm-Up Prompt (5 minutes)

**Start simple to get comfortable:**

```
Create a simple HTML page with a button that changes color when clicked. 
Make it look nice with some basic CSS.
```

**What to observe:**
- Does it create one file or multiple?
- Does it explain what it's doing first?
- Can you see it writing the code in real-time?

---

## Context Gathering Test (5 minutes)

**Test how it learns your codebase:**

First, create a small project structure:
```
my-test-project/
  ├── components/
  │   └── Button.jsx
  └── utils/
      └── helpers.js
```

Put some simple code in Button.jsx:
```jsx
export function Button({ label }) {
  return <button>{label}</button>
}
```

Then prompt:
```
Look at my Button component and create a matching Card component 
that follows the same style and structure.
```

**What to observe:**
- Did it read Button.jsx automatically?
- Did it ask you to add files to context?
- How did it figure out what "same style and structure" meant?
- Look for messages like "Reading components/Button.jsx..."

---

## Planning Behavior Test (5 minutes)

**Test if it thinks before acting:**

```
I want to build a todo list app with these features:
- Add new todos
- Mark todos as complete
- Delete todos
- Filter by complete/incomplete
- Persist to localStorage

Can you create this? Please plan out the approach first before writing any code.
```

**What to observe:**
- Does it outline steps before coding?
- Does it break the work into logical chunks?
- Can you see the difference between "planning" and "executing"?
- Does it ask clarifying questions?

**Try interrupting:** Halfway through, send: "Wait, let's add priority levels to the todos too"
- Can you redirect it mid-task?
- How does it handle the interruption?

---

## Orchestration Test (5 minutes)

**Test how it handles multi-file coordination:**

```
Create a simple Express API with these endpoints:
- GET /api/users - returns list of users
- POST /api/users - creates a new user
- GET /api/users/:id - returns a single user

Use proper folder structure with routes, controllers, and a data file.
```

**What to observe:**
- Does it create multiple files at once or sequentially?
- Can you see it working on different parts in parallel?
- Does it explain the file structure before creating it?
- Does it show you what it's creating in real-time?

---

## Self-Correction Test (Optional - if you have time)

**Test if it can catch and fix its own mistakes:**

```
Create a simple React component that fetches data from 
https://jsonplaceholder.typicode.com/posts and displays the titles.
Add error handling and a loading state.
```

Then deliberately introduce a bug:
```
There's a typo in the URL (change 'posts' to 'psts'). 
Can you run this and see what happens? Then fix any issues.
```

**What to observe:**
- Can it run the code to test it?
- Does it see the error?
- How does it debug and fix the issue?
- Does it verify the fix worked?

---

## Comparison Prompts (For Homework - Testing Different Tools)

When you test the same prompt across different tools (Claude Code vs others), use this:

```
Build a simple contact form with:
- Name (required)
- Email (required, must be valid email)
- Message (required, min 10 characters)
- Submit button
- Show validation errors
- Display success message on submit
Use React and include basic styling.
```

**Document for each tool:**
1. How long did it take?
2. How many steps did it break the work into?
3. Did it plan first or just start coding?
4. How did it handle the validation logic?
5. Could you see what it was doing?
6. Could you interrupt or redirect?
7. Quality of the final code (does it actually work?)

---

## Questions to Answer About Each Prompt

For your assignment notes, try to answer:

1. **Context Gathering**
   - What files did it read?
   - Did it ask for more context?
   - How did it know what to include?

2. **Real-Time Observability**
   - Could you see it thinking/working?
   - Was the interface helpful or confusing?
   - Did it show tool use (reading files, running commands)?

3. **Planning**
   - Did it make a plan first?
   - Were the steps logical?
   - Did the plan match what it actually did?

4. **Surprises**
   - What worked better than expected?
   - What was confusing or frustrating?
   - Any "aha!" moments?

---

## Red Flags to Watch For

Based on your lecture about the "19% slower" problem, watch for:

1. **Over-confidence** - Does it make assumptions without asking?
2. **Context pollution** - Does it remember too much irrelevant stuff?
3. **Plan vs execution mismatch** - Does it say one thing and do another?
4. **Review burden** - How much time would you spend checking this code?

These aren't necessarily "bad" - they're learning opportunities. Notice them and think about how you'd work around them.

---

## Advanced: CLAUDE.md Pattern (Preview)

If you want to go deeper, try creating a CLAUDE.md file in your project root:

```markdown
# Project Context

## What this is
A simple todo list app for learning Claude Code.

## Tech stack
- React
- No build tools (using CDN)
- localStorage for persistence

## Coding style
- Use functional components
- Prefer const over let
- Add comments for complex logic
- Use semantic HTML

## What I'm trying to learn
How Claude Code gathers context and follows project patterns.
```

Then ask Claude Code to create something and see if it follows your guidelines. This is a preview of "context management" you'll learn more about later.

---

## Time Management for 20 Minutes

Suggested breakdown:
- **Minutes 1-5**: Warm-up prompt (get comfortable)
- **Minutes 6-10**: Context gathering test (observe how it learns)
- **Minutes 11-15**: Planning test (see how it thinks)
- **Minutes 16-20**: Orchestration test (watch it coordinate)

Don't try to do all prompts! Pick 2-3 that interest you most. The goal is **observation**, not completion.

---

## What Success Looks Like

By the end of 20 minutes, you should be able to answer:

1. "How does Claude Code gather context?" (with a specific example)
2. "Can I see what it's doing in real-time?" (yes/no, with details)
3. "How does it plan?" (with a specific example)
4. "What surprised me?" (at least one good and one bad surprise)

These answers become your discussion points for class. They're way more valuable than having perfectly working code.

---

## Remember

Your instructor said: **"Your cheese will be moved. Workflows may feel 'wrong' to experienced devs."**

You have one year of experience. You don't have deeply ingrained habits yet. That's actually an advantage here! You get to learn the AI-powered way without unlearning the traditional way first.

Be curious. Take notes. Don't worry about productivity yet. You're building your mental model - that's the whole point.
