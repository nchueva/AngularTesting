import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { TodosService } from '../../services/todos.service';
import { FilterEnum } from '../../types/filter.enum';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let todosService: TodosService;
  const todo1 = { id: '1', text: 'foo', isCompleted: false };
  const todo2 = { id: '2', text: 'bar', isCompleted: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('creates todo component', () => {
    expect(component).toBeTruthy();
    expect(todosService).toBeTruthy();
  });

  it('has hidden footer', () => {
    const footerContainer = fixture.debugElement.query(
      By.css('[data-testid="footer"]')
    );
    expect(footerContainer.classes['hidden']).toEqual(true);
  });

  it('shows footer', () => {
    todosService.todosSig.set([todo1]);
    fixture.detectChanges();

    const footerContainer = fixture.debugElement.query(
      By.css('[data-testid="footer"]')
    );
    expect(footerContainer.classes['hidden']).not.toBeDefined();
  });

  describe("todo's counter", () => {
    it('shows one todo left in counter', () => {
      todosService.todosSig.set([todo1]);
      fixture.detectChanges();

      const todoCounter = fixture.debugElement.query(
        By.css('[data-testid="todoCount"]')
      );
      expect(todoCounter.nativeElement.textContent).toEqual('1 item left ');
    });
    it('shows two todos left in counter', () => {
      todosService.todosSig.set([todo1, todo2]);
      fixture.detectChanges();

      const todoCounter = fixture.debugElement.query(
        By.css('[data-testid="todoCount"]')
      );
      expect(todoCounter.nativeElement.textContent).toEqual('2 items left ');
    });
  });

  describe("todo's filter", () => {
    it('highlights default filter', () => {
      const filters = fixture.debugElement.queryAll(
        By.css('[data-testid="filter"]')
      );
      expect(filters[0].classes['selected']).toBe(true);
    });

    it('highlights changed filter', () => {
      todosService.filterSig.set(FilterEnum.active);
      fixture.detectChanges();

      const filters = fixture.debugElement.queryAll(
        By.css('[data-testid="filter"]')
      );
      expect(filters.length).toBe(3);
      expect(filters[1].classes['selected']).toBe(true);
    });

    it('changes a filter', () => {
      const filters = fixture.debugElement.queryAll(
        By.css('[data-testid="filter"]')
      );
      // triggering clicking for second filter
      filters[1].triggerEventHandler('click');
      expect(todosService.filterSig()).toBe(FilterEnum.active);
    });
  });
});
