describe('Teachers Component Tests', () => {
  let teachers;

  beforeEach(() => {
    cy.fixture('teachers').then((data) => {
      expect(data).to.have.length(2);
      teachers = data;
    });

    cy.intercept('GET', '**/api/teachers', {
      statusCode: 200,
      body: teachers,
    }).as('getTeachers');

    cy.visit('http://localhost:4200/teachers');
  });

  it('should display the initial controls', () => {
    cy.get('.search-field input').should('exist');
    cy.contains('button', 'Dodaj Profesora').should('exist');
  });

  it('should open and submit the "Add Teacher" modal', () => {
    cy.contains('button', 'Dodaj Profesora').click();

    cy.get('.modal').should('be.visible');

    cy.get('#firstName').should('have.value', '');
    cy.get('#lastName').should('have.value', '');
    cy.get('#titleSelect').should('have.value', null);

    cy.get('#firstName').type('Test');
    cy.get('#lastName').type('Testovic');
    cy.get('#titleSelect').select('nastavnik');

    cy.intercept('POST', '**/api/teachers', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          email: 'ttestovic@raf.rs',
          firstName: 'Test',
          lastName: 'Testovic',
          title: 'nastavnik',
          isAdmin: false
        }
      });
    }).as('saveTeacher');


    cy.contains('button', 'Sačuvaj').click();
    cy.get('.modal').should('not.be.visible');


    cy.get('table tbody tr').should('have.length', 3);
    cy.contains('td', 'Test').should('exist');
  });

  it('should open and update a teacher via the modal', () => {

    cy.get('table tbody tr').first().find('button[title="Izmeni"]').click();

    cy.get('.modal').should('be.visible');
    cy.get('#firstName').should('have.value', 'Marko');
    cy.get('#lastName').should('have.value', 'Markovic');
    cy.get('#titleSelect').should('have.value', 'nastavnik');


    cy.get('#firstName').clear().type('Test');
    cy.get('#lastName').clear().type('Testovic');

    cy.intercept('PUT', '**/api/teachers', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          firstName: 'Test',
          lastName: 'Testovic',
          title: 'nastavnik',
          email: 'ttestovic@raf.rs',
          isAdmin: false
        }
      });
    }).as('updateTeacher');

    cy.contains('button', 'Sačuvaj').click();
    cy.get('.modal').should('not.be.visible');


    cy.contains('td', 'Test').should('exist');
  });

  it('should delete a teacher', () => {
    cy.get('table tbody tr').last().find('button[title="Izbriši"]').click();

    cy.intercept('DELETE', '**/api/teachers/2', (req) => {
      req.reply({
        statusCode: 204,
        body: {}
      });
    }).as('deleteTeacher');

    cy.get('.modal').should('be.visible');
    cy.contains('button', 'Potvrdi').click();

    cy.get('table tbody tr').should('have.length', 1);
  });
});
