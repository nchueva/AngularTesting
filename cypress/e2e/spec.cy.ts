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
    ).intercept(
      { method: 'POST', url: 'http://localhost:3004/todos' },
      {
        body: {
          text: 'foo bar',
          isCompleted: false,
          id: '4',
        },
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
    cy.get('[data-cy="todo-checkbox"]').eq(0).should('be.checked');
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
});
