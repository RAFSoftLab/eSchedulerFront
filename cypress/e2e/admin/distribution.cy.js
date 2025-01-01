describe('Distribution Component Tests', () => {
  let teachers;
  let subjects;
  let distributions;

  beforeEach(() => {
    cy.fixture('teachers').then((data) => {
      expect(data).to.have.length(2);
      teachers = data;
    });

    cy.fixture('subjects').then((data) => {
      expect(data).to.have.length(2);
      subjects = data;
    });

    cy.fixture('distributions').then((data) => {
      expect(data).to.have.length(2);
      distributions = data;
    });

    cy.intercept('GET', '**/api/teachers', {
      statusCode: 200,
      body: teachers,
    }).as('getTeachers');

    cy.intercept('GET', '**/api/subjects', {
      statusCode: 200,
      body: subjects,
    }).as('getSubjects');

    cy.intercept('GET', '**/api/distributions', {
      statusCode: 200,
      body: distributions,
    }).as('getDistributions');

    cy.visit('http://localhost:4200/distribution');
  });

  it('should display the initial controls', () => {
    cy.get('.search-field input').should('exist');
    cy.get('.toggle-text').should('contain.text', 'Raspodeljeno');
    cy.get('.toggle-text').should('contain.text', 'Za raspodelu');
  });

  it('should open and submit the distribution', () => {
    cy.get('.toggle-text').last().click();
    cy.get('table tbody tr').first().find('button[title="Napravi raspodelu"]').click();

    cy.get('.modal').should('be.visible');

    cy.get('ng-select[formControlName="teacher"]').click();
    cy.get('ng-dropdown-panel .ng-option').contains('Jovana Jovanovic').click();

    cy.get('#studyProgram').should('have.value', 'SI');
    cy.get('#semester').should('have.value', '2');
    cy.get('#countHours').should('have.value','30');
    cy.get('#sessionCount').type('1');
    cy.get('#classTypeF').should('have.value','Vežbe');

    // Mock the POST request for saving a new distribution
    cy.intercept('POST', '**/api/distributions', (req) => {
      const newDistribution = {
        id: 3,
        teacher: {
          id: 2,
          firstName: 'Jovana',
          lastName: 'Jovanovic',
          email: 'jjovanovic@raf.rs',
          title: 'saradnik',
          summaryLectureHours: 15,
          summaryExerciseHours: 5
        },
        subject: {
          id: 2,
          name: 'Programiranje',
          studyProgram: 'SI',
          semester: 2,
          lectureHours: 30,
          exerciseHours: 15,
          practicumHours: 5,
          mandatory: false
        },
        classType: 'Vežbe',
        sessionCount: 10
      };

      req.reply({
        statusCode: 200,
        body: newDistribution
      });
    }).as('saveDistribution');

    cy.contains('button', 'Sačuvaj').click();

    cy.get('.modal').should('not.be.visible');
  });


  it('should display two distributions and open the correct distribution for editing', () => {
    cy.get('table tbody tr').should('have.length', 2);
    cy.get('table tbody tr').first().find('button[title="Izmeni"]').click();

    cy.get('.modal').should('be.visible');

    cy.get('.modal:visible').should('be.visible').within(() => {
      cy.get('ng-select[formControlName="teacher"]').should('contain.text', 'Marko Markovic - mmarkovic@raf.rs');
      cy.get('ng-select[formControlName="subject"]').should('contain.text', 'Matematika');
      cy.get('#studyProgram').should('have.value', 'RN');
      cy.get('#semester').should('have.value', '1');
      cy.get('#countHours').should('have.value', '30');
      cy.get('#sessionCount').should('have.value', '5');
      cy.get('#classType').should('contain.text', 'Predavanja');

      // Change the teacher to the second teacher
      cy.get('ng-select[formControlName="teacher"]').click();
      cy.get('ng-dropdown-panel .ng-option').contains('Jovana Jovanovic').click();
    });


    cy.intercept('PUT', '**/api/distributions', (req) => {
      const updatedDistribution = {
        id: 1,
        teacher: {
          id: 2,
          firstName: 'Jovana',
          lastName: 'Jovanovic',
          email: 'jjovanovic@raf.rs',
          title: 'saradnik',
          summaryLectureHours: 15,
          summaryExerciseHours: 5
        },
        subject: {
          id: 1,
          name: 'Matematika',
          studyProgram: 'RN',
          semester: 1,
          lectureHours: 30,
          exerciseHours: 15,
          practicumHours: 0,
          mandatory: true
        },
        classType: 'Predavanja',
        sessionCount: 30
      };

      req.reply({
        statusCode: 200,
        body: updatedDistribution
      });
    }).as('updateDistribution');

    cy.contains('button', 'Sačuvaj').click();

    cy.get('.modal').should('not.be.visible');

    cy.get('table tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain.text', 'Jovana Jovanovic');
      cy.get('td').eq(2).should('contain.text', 'Matematika');
    });
  });

  it('should delete a distribution', () => {
    cy.get('table tbody tr').last().find('button[title="Izbriši"]').click();

    cy.intercept('DELETE', '**/api/distributions/2', (req) => {
      req.reply({
        statusCode: 204,
        body: {}
      });
    }).as('deleteDistribution');

    cy.get('.modal').should('be.visible');
    cy.contains('button', 'Potvrdi').click();


    cy.get('table tbody tr').should('have.length', 1);
  });
});
