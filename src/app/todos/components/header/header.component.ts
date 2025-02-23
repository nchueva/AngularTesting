import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { TodosService } from '../../services/todos.service';

const shippingOptionsValues = {
  a: ['car', 'truck', 'train', 'plane'],
  b: ['truck', 'email', 'ship'],
};

@Component({
  selector: 'app-todos-header',
  templateUrl: './header.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  todosService = inject(TodosService);
  text: string = '';

  showCount = signal(false);
  count = signal(0);
  conditionalCount = computed(() => {
    if (this.showCount()) {
      return `The count is ${this.count()}.`;
    } else {
      return 'Nothing to see here!';
    }
  });

  shippingOptions = signal(['Ground', 'Air', 'Sea']);
  // Select the first shipping option by default.
  selectedOption = signal(this.shippingOptions()[0]);
  selectedOption2 = linkedSignal(() => this.shippingOptions()[0]);
  computed = computed(() => this.shippingOptions()[0]);

  private promiseText = 'Hello world';

  constructor() {
    // effect(() => {
    //   console.log(`!!The current count is: ${this.count()}`);
    // });
  }

  ngOnInit() {
    // console.log('count', this.conditionalCount());
    // this.showCount.set(true);

    // console.log('count', this.conditionalCount());
    // // this.count.set(6);

    // setTimeout(() => {
    //   this.count.set(9);
    //   console.log('count settimeout', this.conditionalCount());
    // });

    // console.log('1 linked signal - selected option', this.selectedOption());
    // this.selectedOption.set(this.shippingOptions()[2]);
    // console.log('2 signal - selected option set to 2', this.selectedOption());
    // this.shippingOptions.set(['Email', 'Will Call', 'Postal service']);
    // console.log('3 signal - selected option', this.selectedOption());
    // console.log('3 linked signal - selected option', this.selectedOption2());
    // console.log('3 computed signal - selected option', this.computed());
    // console.log('this.shippingOptions()', this.shippingOptions());

    this.callPromise();
  }

  changeText(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
  }

  addTodo(): void {
    this.todosService.addTodo(this.text);
    this.text = '';
  }

  // -- Promises --
  callPromise() {
    const myPromiseFn = new Promise<string>((myResolve, myReject) => {
      let x = 0;
      console.log('start first promise');
      if (x === 0) {
        myResolve('OK');
      } else {
        myReject('Error');
      }
    });

    myPromiseFn.then(
      (value) => {
        this.myDisplayer(value);
      },
      (error) => {
        this.myDisplayer(error);
      }
    );

    const promiseTwo = new Promise<string>((Resolve, Reject) => {
      // some things to implements
      console.log('start the promise Two', this.promiseText);

      if (this.promiseText === 'OK') {
        Resolve('OK');
      } else {
        Reject('error');
      }
    });

    promiseTwo
      .then(
        (value) => this.myDisplayer(value),
        (error) => this.myDisplayer(error)
      )
      .catch((reason) => console.log(`reason ${reason}`));

    // -- async/await --
    async function myFunction() {
      return Promise.resolve('Hello');
    }

    myFunction().then(
      (value) => {
        /* some code here */
      },
      (error) => {
        /* some error handling */
      }
    );

    // async keyword assures that the function returns a promise
    const secondPromise = async () => {
      const promise = new Promise<string>((resolve) => {
        resolve('Test resolve');
      });

      this.promiseText = await promise;
      console.log('second promise', this.promiseText);
    };

    secondPromise();
    console.log('second promise', this.promiseText);
  }

  myDisplayer(some: string): void {
    this.promiseText = some;
    console.log('promise:', this.promiseText);
  }
}
