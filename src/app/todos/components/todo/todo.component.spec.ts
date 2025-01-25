import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { TodosService } from '../../services/todos.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { first } from 'rxjs';
import { SimpleChange } from '@angular/core';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let todosService: TodosService;
  const todo1 = { id: '1', text: 'foo', isCompleted: false };
  const todo2 = { id: '2', text: 'bar', isCompleted: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoComponent],
      providers: [
        TodosService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);

    component.todo = todo1;
    component.isEditing = false;
    fixture.detectChanges();
  });

  it('creates todo components', () => {
    expect(component).toBeTruthy();
  });

  it('has correct default states', () => {
    const todo = fixture.debugElement.query(By.css('[data-testid="todo"]'));
    const edit = fixture.debugElement.query(By.css('[data-testid="edit"]'));
    expect(todo.classes['editing']).not.toBeDefined();
    expect(todo.classes['completed']).not.toBeDefined();
    expect(edit).toBeFalsy();
  });

  it('highlights todo when in editing', () => {
    component.isEditing = true;
    fixture.detectChanges();
    const todoContainer = fixture.debugElement.query(
      By.css('[data-testid="todo"]')
    );

    expect(todoContainer.classes['editing']).toBe(true);
  });

  it('adds completed class when todo is completed', () => {
    component.todo.isCompleted = true;
    fixture.detectChanges();
    const todoContainer = fixture.debugElement.query(
      By.css('[data-testid="todo"]')
    );
    expect(todoContainer.classes['completed']).toBe(true);
  });

  it('shows checked checkbox when todo is completed', () => {
    jest.spyOn(todosService, 'toggleTodo').mockImplementation(() => {});

    component.todo.isCompleted = true;
    fixture.detectChanges();
    const checkbox = fixture.debugElement.query(
      By.css('[data-testid="toggle"]')
    );

    expect(checkbox.nativeElement.checked).toBe(true);
    expect;
  });

  it('toggle todo', () => {
    jest.spyOn(todosService, 'toggleTodo').mockImplementation(() => {});

    const checkbox = fixture.debugElement.query(
      By.css('[data-testid="toggle"]')
    );
    checkbox.nativeElement.click();
    expect(todosService.toggleTodo).toHaveBeenCalledWith('1');
  });

  it("show todo's text", () => {
    const label = fixture.debugElement.query(By.css('[data-testid="label"]'));
    expect(label.nativeElement.textContent).toBe('foo');
  });

  it('remove todo', () => {
    jest.spyOn(todosService, 'removeTodo').mockImplementation(() => {});
    const destroyButton = fixture.debugElement.query(
      By.css('[data-testid="destroy"]')
    );
    destroyButton.nativeElement.click();
    expect(todosService.removeTodo).toHaveBeenCalledWith('1');
  });

  describe("todo's editing", () => {
    it('shows input when editing', () => {
      component.isEditing = true;
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('[data-testid="edit"]'));
      expect(input).toBeTruthy();
    });

    it('activates editing', () => {
      let editingId: string | null | undefined;
      component.setEditingId.pipe(first()).subscribe((id) => (editingId = id));
      const label = fixture.debugElement.query(By.css('[data-testid="label"]'));
      label.triggerEventHandler('dblclick');
      expect(editingId).toEqual('1');
    });

    it("changes todo's label", () => {
      component.isEditing = true;
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('[data-testid="edit"]'));
      input.nativeElement.value = 'bar';
      input.nativeElement.dispatchEvent(new KeyboardEvent('keyup'));
      expect(component.editingText).toEqual('bar');
    });

    it('changes todo and clears editingId', () => {
      jest.spyOn(todosService, 'changeTodo').mockImplementation(() => {});
      component.isEditing = true;
      fixture.detectChanges();

      let editingId: string | null = todo1.id;
      // subscribe to EventEmitter before keyup handled
      component.setEditingId.pipe(first()).subscribe((id) => (editingId = id));

      const input = fixture.debugElement.query(By.css('[data-testid="edit"]'));
      input.nativeElement.value = 'bar';

      input.nativeElement.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Enter' })
      );
      expect(todosService.changeTodo).toHaveBeenCalledWith('1', 'bar');
      expect(editingId).toBeNull();
    });

    it('should focus after editing activation', fakeAsync(() => {
      component.isEditing = true;
      fixture.detectChanges();
      // call ngOnChanges
      component.ngOnChanges({
        isEditing: new SimpleChange(false, true, false),
      });
      fixture.detectChanges();
      // call tick to prevent waiting for time that is set in SetTimeOut(()=>{}, *500)
      tick(); // = tick(0) - waiting 0ms, this value should be the same with what is written in setTimeOut(, 0)

      // get an element that is in focus
      const edit = fixture.debugElement.query(By.css(':focus'));
      expect(edit).toBeTruthy();
    }));
  });
});
