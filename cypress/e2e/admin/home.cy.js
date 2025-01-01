describe('home', () => {
  let teachers;
  let subjects;
  let distributions;

  beforeEach(() => {
    // Load the fixtures before setting up the intercepts
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

    cy.visit('http://localhost:4200/');
  });

  it('should display search input', () => {
    cy.get('.search-field input').should('exist');
  });

  it('should display buttons', () => {
    cy.contains('Raspodela').should('be.visible');
    cy.contains('Prikaži Nastavnike').should('be.visible');
    cy.contains('Prikaži Predmete').should('be.visible');
  });

  it('should display table', () => {
    cy.get('table.mat-mdc-table').should('exist');
  });

  it('should update table when clicking on "Prikaži Nastavnike"', () => {

    cy.contains('Prikaži Nastavnike').click();

    cy.get('table.mat-mdc-table thead th')
      .should('contain', 'Ime')
      .and('contain', 'Prezime')
      .and('contain', 'Email')
      .and('contain', 'Zvanje')
      .and('contain', 'Ukupno predavanja')
      .and('contain', 'Ukupno vežbi');

    cy.get('table.mat-mdc-table tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain', 'Marko');
      cy.get('td').eq(1).should('contain', 'Markovic');
      cy.get('td').eq(2).should('contain', 'mmarkovic@raf.rs');
    });

    cy.get('table.mat-mdc-table tbody tr').eq(1).within(() => {
      cy.get('td').eq(0).should('contain', 'Jovana');
      cy.get('td').eq(1).should('contain', 'Jovanovic');
      cy.get('td').eq(2).should('contain', 'jjovanovic@raf.rs');
    });
  });

  it('should update table when clicking on "Prikaži Predmete"', () => {
    cy.contains('Prikaži Predmete').click();

    cy.get('table.mat-mdc-table thead th')
      .should('contain', 'Naziv')
      .and('contain', 'Studijski program')
      .and('contain', 'Semestar')
      .and('contain', 'Fond predavanja')
      .and('contain', 'Fond vežbe')
      .and('contain', 'Fond praktikum')
      .and('contain', 'Obaveznost');

    cy.get('table.mat-mdc-table tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain', 'Matematika');
      cy.get('td').eq(1).should('contain', 'RN');
    });

    cy.get('table.mat-mdc-table tbody tr').eq(1).within(() => {
      cy.get('td').eq(0).should('contain', 'Programiranje');
      cy.get('td').eq(1).should('contain', 'SI');
    });
  });

  it('should display table with teachers and open distribution on row click', () => {

    cy.contains('Prikaži Nastavnike').click();
    cy.wait('@getTeachers');

    cy.get('table.mat-mdc-table tbody tr').should('have.length', teachers.length);

    cy.get('table.mat-mdc-table tbody tr').first().click();
    cy.wait('@getDistributions');

    cy.get('table.mat-mdc-table thead th')
      .should('contain', 'Nastavnik').and('contain', 'Predmet');

    cy.get('table.mat-mdc-table tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain', 'MarkoMarkovic');
      cy.get('td').eq(1).should('contain', 'Matematika');
    });
  });

  it('should display table with subjects and open distribution on row click', () => {

    cy.contains('Prikaži Predmete').click();
    cy.wait('@getSubjects');

    cy.get('table.mat-mdc-table tbody tr').should('have.length', subjects.length);

    cy.get('table.mat-mdc-table tbody tr').first().click();
    cy.wait('@getDistributions');

    cy.get('table.mat-mdc-table tbody tr').first().within(() => {
      cy.get('td').eq(0).should('contain', 'MarkoMarkovic');
      cy.get('td').eq(1).should('contain', 'Matematika');
    });
  });

});
