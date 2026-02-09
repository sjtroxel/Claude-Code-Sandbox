import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';
import { FilterType, Priority } from './todo.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  newTodoText = '';
  selectedPriority: Priority = 'medium';
  newTodoDueDate = ''; // Due date in YYYY-MM-DD format

  constructor(public todoService: TodoService) {}

  addTodo(): void {
    if (this.newTodoText.trim()) {
      this.todoService.addTodo(
        this.newTodoText,
        this.selectedPriority,
        this.newTodoDueDate || undefined
      );
      this.newTodoText = '';
      this.selectedPriority = 'medium';
      this.newTodoDueDate = '';
    }
  }

  toggleTodo(id: number): void {
    this.todoService.toggleTodo(id);
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  setFilter(filter: FilterType): void {
    this.todoService.setFilter(filter);
  }
}
