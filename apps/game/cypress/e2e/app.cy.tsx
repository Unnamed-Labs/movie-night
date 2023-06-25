describe('navigation', () => {
  it('should navigate to the home page', () => {
    cy.visit('http://localhost:3000');
    cy.get('h1').contains('Movie Night');
  });
});
