# Todo App - Project Context for Claude Code

## What This Project Is

A learning project demonstrating Angular 21 features through a full-featured todo list application. Built as part of Exercise 03 (Planning Behavior) to observe how AI coding assistants plan and execute complex tasks.

**Primary Goal:** Learn Angular 21 modern patterns (signals, standalone components) while exploring Claude Code's planning capabilities.

## Tech Stack

### Core Technologies
- **Angular:** 21.1.2 (latest)
- **TypeScript:** Strict mode enabled
- **Node.js:** 22.20.0
- **Package Manager:** npm 11.8.0

### Key Angular Features Used
- **Signals** for reactive state management (not Observables/RxJS)
- **Standalone Components** (no NgModules)
- **Computed Signals** for derived state (filtered todos)
- **Two-way Binding** with `[(ngModel)]`
- **Control Flow** using `@if`, `@for`, `@else` (new syntax, not `*ngIf`/`*ngFor`)

### Storage
- **localStorage** for client-side persistence (no backend/database)

## Project Features

### Implemented Features ✅
1. **Add Todos** - Create new todo items with text and priority
2. **Complete Todos** - Toggle completion status with checkbox
3. **Delete Todos** - Remove todos from the list
4. **Filter Todos** - View all/active/completed todos
5. **Priority Levels** - Assign high/medium/low priority to each todo
6. **Persist Data** - All todos saved to localStorage automatically
7. **Visual Priority** - Color-coded borders and badges for priorities

### Not Implemented ❌
- Due dates
- Categories/tags
- Sorting/reordering
- Search/filter by text
- Backend sync
- User accounts/authentication

## File Structure

```
todo-app/
├── src/
│   ├── app/
│   │   ├── app.ts                    # Main component (UI + logic)
│   │   ├── app.html                  # Template
│   │   ├── app.css                   # Styles
│   │   ├── todo.model.ts             # TypeScript interfaces
│   │   ├── todo.service.ts           # Business logic + state
│   │   └── app.config.ts             # App configuration
│   ├── main.ts                       # Bootstrap
│   ├── index.html                    # Entry point
│   └── styles.css                    # Global styles
├── angular.json                      # Angular CLI config
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
└── CLAUDE.md                         # This file
```

## Architecture Patterns

### State Management
- **Service-based state** using Angular Signals
- `TodoService` is the single source of truth
- Components consume state via service injection
- No global state libraries (NgRx, Akita, etc.)

### Component Pattern
```typescript
// Standalone component with imports
@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Inject service
  constructor(public todoService: TodoService) {}

  // Delegate to service
  addTodo(): void {
    this.todoService.addTodo(this.newTodoText, this.selectedPriority);
  }
}
```

### Service Pattern
```typescript
// Use signals for reactive state
private todos = signal<Todo[]>([]);

// Use computed for derived state
filteredTodos = computed(() => {
  // Filtering logic
});

// Public readonly signal for external access
currentFilter = this.filter.asReadonly();
```

## Coding Conventions

### TypeScript Rules
- ✅ **Use `const`** for all variables that don't change
- ✅ **Use `let`** only when reassignment is needed
- ✅ **Avoid `var`** entirely
- ✅ **Strict mode enabled** - all types must be explicit
- ✅ **Use interfaces** for object shapes (`Todo`, `Priority`, `FilterType`)
- ✅ **Use type aliases** for union types (`type FilterType = 'all' | 'active' | 'completed'`)

### Angular Specific
- ✅ **Standalone components** (no NgModules)
- ✅ **Signals over Observables** for state management
- ✅ **Computed signals** for derived state
- ✅ **New control flow syntax** (`@if`, `@for`, not `*ngIf`, `*ngFor`)
- ✅ **Services with `providedIn: 'root'`** for singleton behavior
- ✅ **Template-driven forms** (using `ngModel`, not reactive forms)

### File Organization
- ✅ **One component per file** (`app.ts`, `app.html`, `app.css`)
- ✅ **Separate models** into their own files (`todo.model.ts`)
- ✅ **Services in separate files** (`todo.service.ts`)
- ✅ **Clear naming** - `todoService`, not `ts` or `service`

### Styling
- ✅ **Component-scoped CSS** (`:host` selector)
- ✅ **CSS custom properties** for theming (`:root` variables)
- ✅ **Linear gradients** for visual appeal
- ✅ **Responsive design** (max-width, mobile-friendly)
- ✅ **Smooth transitions** for hover/active states

### Comments
- ✅ **Comment complex logic** (why, not what)
- ✅ **Document public API methods** in services
- ❌ **Don't comment obvious code** (`// add todo` before `addTodo()`)
- ✅ **Use JSDoc** for function signatures if helpful

## Code Quality Standards

### What Good Code Looks Like Here
```typescript
// ✅ Good - clear, typed, uses signals
addTodo(text: string, priority: Priority = 'medium'): void {
  if (!text.trim()) return;

  const newTodo: Todo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    priority
  };

  this.todos.update(todos => [...todos, newTodo]);
  this.saveToStorage();
}
```

### What to Avoid
```typescript
// ❌ Bad - no types, mutating state directly
addTodo(text) {
  this.todos.push({ text }); // Don't mutate signal arrays!
}
```

## Development Workflow

### Running the App
```bash
ng serve                    # Start dev server on localhost:4200
ng build                    # Production build
ng test                     # Run unit tests (if any)
```

### Making Changes
1. **Read existing code first** - understand current patterns
2. **Follow the architecture** - state in service, UI in component
3. **Use signals** - not Observables or imperative updates
4. **Update localStorage** - call `saveToStorage()` after state changes
5. **Test in browser** - verify changes work visually

## Common Tasks

### Adding a New Feature
1. **Update the model** (`todo.model.ts`) if needed
2. **Add service method** (`todo.service.ts`) for business logic
3. **Update component** (`app.ts`) to call service method
4. **Update template** (`app.html`) for UI
5. **Add styles** (`app.css`) as needed

### Example: Adding a "Due Date" Feature
```typescript
// 1. Update model
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;  // Add this
}

// 2. Update service
addTodo(text: string, priority: Priority, dueDate?: Date): void {
  const newTodo: Todo = {
    // ...existing fields
    dueDate
  };
  // ...rest of logic
}

// 3. Update component template
<input type="date" [(ngModel)]="newTodoDueDate" name="dueDate" />
```

## What I'm Learning

This project is specifically for learning:
- **Angular Signals** - how reactive state works without RxJS
- **Standalone Components** - modern Angular architecture
- **TypeScript** - strict typing and interfaces
- **Claude Code Planning** - how AI plans complex tasks before executing

## When Working on This Project

### Do:
- ✅ Read existing code to understand patterns
- ✅ Follow the established architecture (signals, services)
- ✅ Use TypeScript strictly (explicit types)
- ✅ Update localStorage when state changes
- ✅ Match the existing code style
- ✅ Test changes in the browser

### Don't:
- ❌ Introduce NgModules (this is standalone)
- ❌ Use RxJS Observables (use signals instead)
- ❌ Mutate signal state directly (use `.update()` or `.set()`)
- ❌ Use old control flow syntax (`*ngIf`, `*ngFor`)
- ❌ Add dependencies without asking (keep it simple)
- ❌ Break localStorage persistence

## Testing the App

Since this is a learning project, testing is manual:
1. Run `ng serve`
2. Open browser to `localhost:4200`
3. Try all features:
   - Add todos with different priorities
   - Mark some as complete
   - Use filters (all/active/completed)
   - Refresh page - data should persist
4. Check console for errors

## Future Enhancements (Ideas)

Possible features to add for learning:
- [ ] Due dates with date picker
- [ ] Todo categories/tags
- [ ] Drag-and-drop reordering
- [ ] Search/filter by text
- [ ] Dark mode toggle
- [ ] Export/import todos (JSON)
- [ ] Undo/redo functionality
- [ ] Keyboard shortcuts

## Notes for Claude Code

When working on this project:
1. **Always read the existing code first** to understand current patterns
2. **Follow the signal-based architecture** - don't introduce Observables
3. **Use the new Angular syntax** (`@if`, `@for`) not the old syntax
4. **Keep it simple** - this is a learning project, not production
5. **Explain your changes** - help me learn Angular patterns
6. **Test suggestions** - verify they work before calling them done

---

*Last updated: Feb 2025*
*Project: Exercise 03 - Planning Behavior Test*
*Student: sjtroxel (learning Angular 21 + Claude Code)*
