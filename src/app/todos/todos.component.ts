import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { createUserNickname } from '../shared/utils/utils';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeaderComponent, FooterComponent, MainComponent],
})
export class TodosComponent {
  getNickname(): string {
    return createUserNickname('');
  }
}
