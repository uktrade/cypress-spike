const selectors = require('../../../../selectors')

const { createContact } = require('../../support/user-actions')

describe('Advisors', () => {
  const globalManagerTable = 2
  const AdviserTable = 3

  it('should display advisers for a GHQ for a given company', () => {
    cy.visit('/companies/375094ac-f79a-43e5-9c88-059a7caa17f0/advisers')

    cy.get(selectors.collection.contentHeader)
      .should('contain', 'Advisers on the core team')

    cy.get(selectors.collection.contentTable(globalManagerTable))
      .should('contain', 'IST - Sector Advisory Services')
      .and('contain', 'London')
      .and('contain', 'Travis Greene')

    cy.get(selectors.collection.contentTable(AdviserTable))
      .should('contain', 'Heart of the South West LEP')
      .and('contain', 'South West')
      .and('contain', 'Holly Collins')
      .and('contain', 'IG - Specialists - Knowledge Intensive Industry')
      .and('contain', 'London')
      .and('contain', 'Jenny Carey')
  })
})

describe('Contacts', () => {
  const data = {
    name: 'Company',
    lastName: 'Contact',
    jobTitle: 'Coffee machine operator',
    countryCode: '44',
    phone: '0778877778800',
    email: 'company.contact@dit.com',
  }

  it('should list a newly created contact in collection page', () => {
    cy.visit('/contacts/create?company=0fb3379c-341c-4da4-b825-bf8d47b26baa')
    createContact(data)

    cy.visit('/companies/0fb3379c-341c-4da4-b825-bf8d47b26baa/contacts')
    cy.get(selectors.collection.items)
      .should('contain', 'Company Contact')
      .and('contain', 'Coffee machine operator')
      .and('contain', '(44) 0778877778800')
      .and('contain', 'company.contact@dit.com')
  })
})
