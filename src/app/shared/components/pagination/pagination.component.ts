import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  output,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'mc-pagination',
  templateUrl: './pagination.component.html',

  imports: [CommonModule],
})
export class PaginationComponent implements OnInit {
  total = input<number>(0);
  limit = input<number>(20);
  currentPage = input<number>(1);

  pageChangeEvent = output<number>({ alias: 'pageChange' });

  pagesCount: number = 1;
  pages: number[] = [];

  constructor(private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.pagesCount = Math.ceil(this.total() / this.limit());
    this.pages =
      this.pagesCount > 0
        ? this.utilsService.range(1, this.pagesCount + 1)
        : [];
  }

  selectPage(page: number): void {
    this.pageChangeEvent.emit(page);
  }
}
