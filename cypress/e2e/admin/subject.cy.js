describe('Subject Component Tests', () => {
  let subjects;

  beforeEach(() => {
    cy.fixture('subjects').then((data) => {
      expect(data).to.have.length(2);
      subjects = data;
    });

    cy.intercept('GET', '**/api/subjects', {
      statusCode: 200,
      body: subjects,
    }).as('getSubjects');

    cy.visit('http://localhost:4200/subjects');
  });

  it('should display the initial controls', () => {
    cy.get('.search-field input').should('exist');
    cy.contains('button', 'Dodaj Predmet').should('exist');
  });

  it('should open and submit the "Add Subject" modal', () => {
    cy.contains('button', 'Dodaj Predmet').click();

    cy.get('.modal').should('be.visible');

    cy.get('#name').type('Test');
    cy.get('select[formControlName="studyProgram"]').select('RN');
    cy.get('#mandatory').select('obavezan');
    cy.get('#semester').type('2');
    cy.get('#lectureHours').type('30');
    cy.get('#exerciseHours').type('15');
    cy.get('#practicumHours').type('10');
    cy.get('#lectureSessions').type('5');
    cy.get('#exerciseSessions').type('3');

    cy.intercept('POST', '**/api/subjects', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 3,
          name: "Test",
          studyProgram: "RN",
          semester: 2,
          lectureHours: 30,
          exerciseHours: 15,
          practicumHours: 5,
          mandatory: "obavezan",
          lectureSessions: 2,
          exerciseSessions: 3
        }
      });
    }).as('saveSubject');


    cy.contains('button', 'Sačuvaj').click();
    cy.get('.modal').should('not.be.visible');


    cy.get('table tbody tr').should('have.length', 3);
    cy.contains('td', 'Test').should('exist');
  });

  it('should open and update a subject using modal', () => {

    cy.get('table tbody tr').first().find('button[title="Izmeni"]').click();

    cy.get('.modal').should('be.visible');

    cy.get('#name').clear().type('Test');
    cy.get('#mandatory').select('izborni');


    cy.intercept('PUT', '**/api/subjects', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 1,
          name: "Test",
          studyProgram: "RN",
          semester: 2,
          lectureHours: 30,
          exerciseHours: 15,
          practicumHours: 5,
          mandatory: "izborni",
          lectureSessions: 5,
          exerciseSessions: 15
        }
      });
    }).as('updateSubject');

    cy.contains('button', 'Sačuvaj').click();
    cy.get('.modal').should('not.be.visible');


    cy.contains('td', 'Test').should('exist');
  });

  it('should delete a subject', () => {
    cy.get('table tbody tr').last().find('button[title="Izbriši"]').click();

    cy.intercept('DELETE', '**/api/subjects/2', (req) => {
      req.reply({
        statusCode: 204,
        body: {}
      });
    }).as('deleteSubject');

    cy.get('.modal').should('be.visible');
    cy.contains('button', 'Potvrdi').click();


    cy.get('table tbody tr').should('have.length', 1);
  });
});
