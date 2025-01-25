import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { TodosService } from '../../services/todos.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TodoInterface } from '../../types/todo.interface';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoComponent } from '../todo/todo.component';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-todos-todo',
  template: '',
})
export class TodoComponentMock {
  @Input({ required: true }) todo!: TodoInterface;
  @Input({ required: true }) isEditing!: boolean;
  @Output() setEditingId: EventEmitter<string | null> = new EventEmitter();
}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let todosService: TodosService;
  const todo1 = { id: '1', text: 'foo', isCompleted: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
      .overrideComponent(MainComponent, {
        remove: { imports: [TodoComponent] },
        add: { imports: [TodoComponentMock] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('creates todo component', () => {
    expect(component).toBeTruthy();
  });

  describe('component visibility', () => {
    it('should be hidden without todos', () => {
      const mainContainer = fixture.debugElement.query(
        By.css('[data-testid="main"]')
      );
      expect(mainContainer.classes['hidden']).toEqual(true);
    });

    it('should be visible with todos', () => {
      todosService.todosSig.set([todo1]);
      fixture.detectChanges();

      const mainContainer = fixture.debugElement.query(
        By.css('[data-testid="main"]')
      );
      expect(mainContainer.classes['hidden']).not.toBeDefined();
    });

    it('should highlight toggle all check', () => {
      todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: true }]);
      fixture.detectChanges();
      const toggle = fixture.debugElement.query(
        By.css('[ data-testid="toggleAll"]')
      );
      // native element checked state of a checkbox
      expect(toggle.nativeElement.checked).toEqual(true);
    });

    it('should toggle all todos', () => {
      jest.spyOn(todosService, 'toggleAll').mockImplementation(() => {});
      // false originally should become true after the toggle
      todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: false }]);
      fixture.detectChanges();

      const toggle = fixture.debugElement.query(
        By.css('[ data-testid="toggleAll"]')
      );
      toggle.nativeElement.click();
      // the toggle previously was false so the function should be called with true as an opposite of it (toggle triggers false vs true)
      expect(todosService.toggleAll).toHaveBeenCalledWith(true);
    });

    it('should render a list of todos', () => {
      todosService.todosSig.set([todo1]);
      fixture.detectChanges();

      const todos = fixture.debugElement.queryAll(
        By.css('[data-testid="todo"]')
      );
      expect(todos.length).toEqual(1);
      // access to child-todo via component instance and get whatever we need from the component, e.g. inputs
      expect(todos[0].componentInstance.todo).toEqual(todo1);
      expect(todos[0].componentInstance.isEditing).toEqual(false);
    });

    it('should change editing id', () => {
      todosService.todosSig.set([todo1]);
      fixture.detectChanges();
      const todos = fixture.debugElement.queryAll(
        By.css('[data-testid="todo"]')
      );

      // emit editing id from the child component
      todos[0].componentInstance.setEditingId.emit('1');
      // check in the parent component what we got from the child component's output
      expect(component.editingId).toEqual('1');
    });
  });
});
