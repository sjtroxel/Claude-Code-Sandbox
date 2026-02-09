import { Injectable, signal, computed } from '@angular/core';
import { Todo, FilterType, Priority } from './todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'angular-todos';

  // Signals for reactive state management
  private todos = signal<Todo[]>(this.loadFromStorage());
  private filter = signal<FilterType>('all');

  // Computed signal for filtered todos
  filteredTodos = computed(() => {
    const currentFilter = this.filter();
    const allTodos = this.todos();

    switch (currentFilter) {
      case 'active':
        return allTodos.filter(todo => !todo.completed);
      case 'completed':
        return allTodos.filter(todo => todo.completed);
      default:
        return allTodos;
    }
  });

  currentFilter = this.filter.asReadonly();

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

  toggleTodo(id: number): void {
    this.todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    this.saveToStorage();
  }

  deleteTodo(id: number): void {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
    this.saveToStorage();
  }

  setFilter(filter: FilterType): void {
    this.filter.set(filter);
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos()));
  }

  private loadFromStorage(): Todo[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
