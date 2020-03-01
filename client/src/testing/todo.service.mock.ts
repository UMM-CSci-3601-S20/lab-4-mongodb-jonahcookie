import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo, StatusType } from '../app/todos/todo';
import { TodoService } from '../app/todos/todo.service';

/**
 * A "mock" version of the `TodoService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      _id: 'blanche_id',
      owner: 'Blanche',
      status: false,
      category: 'software design',
      body: 'In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.'
    },
    {
      _id: 'fry_id',
      owner: 'Fry',
      status: false,
      category: 'video games',
      body: 'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.'
    },
    {
      _id: 'fry_id',
      owner: 'Fry',
      status: true,
      category: 'homework',
      body: 'Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.'
    }
  ];

  constructor() {
    super(null);
  }

  getTodos(filters: { owner?: string, body?: string, category?: string, status?: StatusType }): Observable<Todo[]> {
    // Just return the test todos regardless of what filters are passed in
    return of(MockTodoService.testTodos);
  }

  getTodoById(id: string): Observable<Todo> {
    // If the specified ID is for the first test todo,
    // return that todo, otherwise return `null` so
    // we can test illegal todo requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else {
      return of(null);
    }
  }

}
