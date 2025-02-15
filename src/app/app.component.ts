import { Component } from '@angular/core';
import { TodosComponent } from './todos/todos.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TodosComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
