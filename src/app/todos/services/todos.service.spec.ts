import { TestBed } from '@angular/core/testing';
import { TodosService } from './todos.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { FilterEnum } from '../types/filter.enum';

describe('TodosService', () => {
  let todosService: TodosService;
  let httpTestingController: HttpTestingController;
  const baseUrl = 'http://localhost:3004/todos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodosService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    todosService = TestBed.inject(TodosService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('creates todo service', () => {
    expect(todosService).toBeTruthy();
  });

  it('has initial data', () => {
    expect(todosService.todosSig()).toEqual([]);
    expect(todosService.filterSig()).toEqual('all');
    expect(todosService.apiBaseUrl).toEqual(baseUrl);
  });

  describe('changeFilter', () => {
    it('changes filter', () => {
      todosService.changeFilter(FilterEnum.active);
      expect(todosService.filterSig()).toEqual(FilterEnum.active);
    });
  });

  describe('getTodos', () => {
    it('gets a todo', () => {
      todosService.getTodos();
      const req = httpTestingController.expectOne(baseUrl);
      req.flush([{ id: '1', text: 'foo', isCompleted: true }]);
      expect(todosService.todosSig()).toEqual([
        { id: '1', text: 'foo', isCompleted: true },
      ]);
    });
  });

  describe('addTodo', () => {
    it('add a todo', () => {
      todosService.addTodo('foo');
      const req = httpTestingController.expectOne(baseUrl);
      req.flush({ id: '1', text: 'foo', isCompleted: false });
      expect(todosService.todosSig()).toEqual([
        { id: '1', text: 'foo', isCompleted: false },
      ]);
    });
  });
  describe('changeTodo', () => {
    it('change a todo', () => {
      todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: false }]);
      todosService.changeTodo('1', 'bar');
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      req.flush({ id: '1', text: 'bar', isCompleted: false });
      expect(todosService.todosSig()).toEqual([
        { id: '1', text: 'bar', isCompleted: false },
      ]);
    });
  });
  describe('removeTodo', () => {
    it('remove a todo', () => {
      todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: false }]);
      todosService.removeTodo('1');
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      req.flush({});
      expect(todosService.todosSig()).toEqual([]);
    });
  });
  describe('toggleTodo', () => {
    it('toggle a todo', () => {
      todosService.todosSig.set([
        { id: '1', text: 'foo', isCompleted: false },
        { id: '2', text: 'bar', isCompleted: false },
      ]);
      todosService.toggleTodo('1');
      // make only one request for the given url
      const req = httpTestingController.expectOne(`${baseUrl}/1`);
      req.flush({ id: '1', text: 'foo', isCompleted: true });
      expect(todosService.todosSig()).toEqual([
        { id: '1', text: 'foo', isCompleted: true },
        { id: '2', text: 'bar', isCompleted: false },
      ]);
    });
  });
  describe('toggleAll', () => {
    it('toggle all todos', () => {
      todosService.todosSig.set([
        { id: '1', text: 'foo', isCompleted: false },
        { id: '2', text: 'bar', isCompleted: false },
      ]);
      todosService.toggleAll(true);

      // mock all requests that have baseUrl, so it's for many url requests
      // so the reqs will return an array
      const reqs = httpTestingController.match((request) =>
        request.url.includes(baseUrl)
      );
      reqs[0].flush({ id: '1', text: 'foo', isCompleted: true });
      reqs[1].flush({ id: '2', text: 'bar', isCompleted: true });

      expect(todosService.todosSig()).toEqual([
        { id: '1', text: 'foo', isCompleted: true },
        { id: '2', text: 'bar', isCompleted: true },
      ]);
    });
  });
});
