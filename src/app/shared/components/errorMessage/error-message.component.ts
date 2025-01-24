import { Component, input,  } from '@angular/core';

@Component({
  selector: 'mc-error-message',
  template: '<div data-testid="message-container">{{message()}}</div>',
  standalone: true,
})
export class ErrorMessageComponent {
  // @Input() message: string = 'Something went wrong';
  message = input<string>('Something went wrong');
}
