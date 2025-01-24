import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { UtilsService } from '../../services/utils.service';
import { By } from '@angular/platform-browser';
import { first } from 'rxjs';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  const mockUtilsService = {
    range: () => [1, 2, 3, 4],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaginationComponent],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    }).compileComponents;

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('total', 40);
    fixture.componentRef.setInput('limit', 10);
    fixture.componentRef.setInput('currentPage', 1);

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('renders correct pagination', () => {
    const pageContainers = fixture.debugElement.queryAll(
      By.css('[data-testid="page-container"]')
    );
    // check how many pages we have at all
    expect(pageContainers.length).toBe(4);
    // text content of the first <li>
    expect(pageContainers[0].nativeElement.textContent).toEqual('1');
  });

  it('should emit a clicked page', () => {
    const pageContainers = fixture.debugElement.queryAll(
      By.css('[data-testid="page-container"]')
    );

    let clickedPage: number | undefined;
    // subscribe to click before triggering a click handler!
    component.pageChangeEvent.subscribe((page) => (clickedPage = page));

    // two ways to trigger a click event:
    // 1 - via on debug -> triggerEventHandler for 'click'
    pageContainers[0].triggerEventHandler('click');
    // or 2 - via nativeElement's click method
    pageContainers[0].nativeElement.click();

    expect(clickedPage).toEqual(1);
  });
});
