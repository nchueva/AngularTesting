import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from './error-message.component';
import { By } from '@angular/platform-browser';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  // fixture is needed to access and debug DOM
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ErrorMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create error-message component', () => {
    expect(component).toBeTruthy();
  });

  it('creates default message text', () => {
    const messageContainer = fixture.debugElement.query(
      By.css('[data-testid="message-container"]')
    );
    expect(messageContainer).toBeTruthy();
    expect(messageContainer.nativeElement.textContent).toEqual(
      'Something went wrong'
    );
  });

  it('renders custom text', () => {
    // update input() signal with a new value
    // 2 ways: 1 - access componentRef and use setInput() or create a new parent component wrapper (@Component({})) inside the describe() and provide there a custom value for the input
    fixture.componentRef.setInput('message', 'New text');

    const messageContainer = fixture.debugElement.query(
      By.css('[data-testid="message-container"]')
    );
    fixture.detectChanges();

    // the message container is a debugElement and not a nativeElement, so we need to access it additionally
    expect(messageContainer.nativeElement.textContent).toEqual('New text');
  });
});
