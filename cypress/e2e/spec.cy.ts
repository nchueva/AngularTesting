describe('e2e Todos', () => {
  beforeEach(() => {
    cy.intercept(
      { method: 'GET', url: 'http://localhost:3004/todos' },
      {
        body: [
          {
            text: 'first todo',
            isCompleted: true,
            id: '1',
          },
          {
            text: 'second todo',
            isCompleted: false,
            id: '2',
          },
          {
            text: 'third todo',
            isCompleted: false,
            id: '3',
          },
        ],
      }
    )
      .intercept(
        { method: 'POST', url: 'http://localhost:3004/todos' },
        {
          body: {
            text: 'foo bar',
            isCompleted: false,
            id: '4',
          },
        }
      )
      .intercept(
        { method: 'DELETE', url: 'http://localhost:3004/todos/1' },
        {
          body: {},
        }
      )
      .intercept(
        { method: 'PATCH', url: 'http://localhost:3004/todos/1' },
        {
          body: { text: 'foo', isCompleted: false, id: '1' },
        }
      );
    cy.visit('/');
  });

  it('Visits the initial project page', () => {
    cy.contains('todos');
  });

  it('renders 3 todos', () => {
    cy.get('[data-cy="todo"]').should('have.length', 3);
    cy.get('[data-cy="todoLabel"]').eq(0).should('contain.text', 'first todo');
    cy.get('[data-cy="todoLabel"]').eq(1).should('contain.text', 'second todo');
    cy.get('[data-cy="todoLabel"]').eq(2).should('contain.text', 'third todo');
    cy.get('[data-cy="todoCheckbox"]').eq(0).should('be.checked');
  });

  it('renders footer', () => {
    cy.get('[data-cy="todoCount"]').should('contain.text', '2 items');
    cy.get('[data-cy="filter"]')
      .eq(0)
      .should('contain.text', 'All')
      .should('have.class', 'selected');
    cy.get('[data-cy="filter"]').eq(1).should('contain.text', 'Active');
    cy.get('[data-cy="filter"]').eq(2).should('contain.text', 'Completed');
  });

  it('can change filter', () => {
    cy.get('[data-cy="filter"]').eq(1).click();
    cy.get('[data-cy="filter"]').eq(1).should('have.class', 'selected');
  });

  it('creates new todo', () => {
    cy.get('[data-cy="newTodoInput"]').type('foo{enter}');
    cy.get('[data-cy="todoCount"]').should('contain.text', '3 items');
    cy.get('[data-cy="todoLabel"]').eq(3).should('contain.text', 'foo');
  });

  it('delete todo', () => {
    cy.get('[data-cy="destroy"]').eq(0).click({ force: true });
    cy.get('[data-cy="todo"]').should('have.length', 2);
  });

  it('toggle first todo', () => {
    cy.get('[data-cy="todoCheckbox"]').eq(0).click({ force: true });
    cy.get('[data-cy="todoCheckbox"]').eq(0).should('not.be.checked');
  });

  it('toggle all todo', () => {
    cy.intercept(
      { method: 'PATCH', url: 'http://localhost:3004/todos/*' },
      {
        body: { text: 'foo', isCompleted: true, id: '1' },
      }
    );
    cy.get('[data-cy="toggleAll"]').click();
    cy.get('[data-cy="todoCheckbox"]').eq(0).should('be.checked');
    cy.get('[data-cy="todoCheckbox"]').eq(1).should('be.checked');
    cy.get('[data-cy="todoCheckbox"]').eq(2).should('be.checked');
  });

  it('should update a todo', () => {
    cy.intercept(
      { method: 'PATCH', url: 'http://localhost:3004/todos/1' },
      { body: { text: 'bar', isCompleted: false, id: '1' } }
    );
    cy.get('[data-cy="todoLabel"]').eq(0).dblclick();
    cy.get('[data-cy="edit"]').eq(0).type('bar{enter}');
    cy.get('[data-cy="todoLabel"]').eq(0).should('contain.text', 'bar');
  });
});
