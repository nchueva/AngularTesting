import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { TodosService } from '../../services/todos.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let todosService: TodosService;
  const todo1 = { id: '1', text: 'foo', isCompleted: false };
  const todo2 = { id: '2', text: 'bar', isCompleted: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('creates todo component', () => {
    expect(component).toBeTruthy();
  });

  it('adds a new todo', () => {
    // INFO: jest will always make a call on spy, so we need to mock the call to prevent calling real TodoService
    jest.spyOn(todosService, 'addTodo').mockImplementation(() => {});

    const inputValue = fixture.debugElement.query(
      By.css('[data-testid="newTodoInput"]')
    );

    inputValue.nativeElement.value = 'foo';
    // simulate Enter event on input:
    inputValue.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter' })
    );

    expect(todosService.addTodo).toHaveBeenCalledWith('foo');
    // make sure to test that the input's text will be empty string after calling addTodo()
    expect(component.text).toEqual('');
  });
});
