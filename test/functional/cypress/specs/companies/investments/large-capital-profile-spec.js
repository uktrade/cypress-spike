const { localHeader, companyInvestment: selectors } = require('../../../selectors')
const fixtures = require('../../../fixtures/index.js')
const baseUrl = Cypress.config().baseUrl
const { oneListCorp } = fixtures.company

describe('Company Investments and Large capital profile', () => {
  context('when viewing the company header', () => {
    before(() => cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`))

    it('should display the "One List Corp" heading', () => {
      cy.get(localHeader().heading).should('have.text', 'One List Corp')
    })
  })

  context('when viewing the 3 tabs', () => {
    before(() => cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`))

    it('should display an "Investments projects" tab with the correct URL', () => {
      cy.get(selectors.tabs.investmentProjects).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/projects`)
    })

    it('should display a "Large capital profile" tab with the correct URL', () => {
      cy.get(selectors.tabs.largeCapitalProfile).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/large-capital-profile`)
    })

    it('should display a "Growth capital profile" tab with the correct URL', () => {
      cy.get(selectors.tabs.growthCapitalProfile).find('a')
        .should('have.prop', 'href')
        .and('equal', `${baseUrl}/companies/${oneListCorp.id}/investments/growth-capital-profile`)
    })
  })

  context('when the Large capital profile tab is selected', () => {
    before(() => cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`))

    it('should not have an "active" class on the "Investment projects" tab', () => {
      cy.get(selectors.tabs.investmentProjects).should('not.have.class', 'active')
    })

    it('should have an "active" class on the "Large capital profile" tab', () => {
      cy.get(selectors.tabs.largeCapitalProfile).should('have.class', 'active')
    })

    it('should not have an "active" class on the "Growth capital profile" tab', () => {
      cy.get(selectors.tabs.growthCapitalProfile).should('not.have.class', 'active')
    })
  })

  context('when viewing the tabbed area content', () => {
    before(() => cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`))

    it('should display the "Large capital investor profile" subheading', () => {
      cy.get(selectors.subHeading).should('have.text', 'Large capital investor profile')
    })
  })

  context('when clicking on a profile summary', () => {
    before(() => cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`))

    it('should expand the "Investor details" summary and have an enabled edit button', () => {
      cy.get(selectors.investorDetails.summary).click()
        .get(selectors.investorDetails.edit).should('be.visible').should('be.not.disabled')
    })

    it('should expand the "Investor requirements" summary and have an enabled edit button', () => {
      cy.get(selectors.investorRequirements.summary).click()
        .get(selectors.investorRequirements.edit).should('be.visible').should('be.not.disabled')
    })

    it('should expand the "Location" summary and have an enabled edit button', () => {
      cy.get(selectors.location.summary).click()
        .get(selectors.location.edit).should('be.visible').should('be.not.disabled')
    })
  })

  context('when editing the "Investor details" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor requirements" and "Location" edit button', () => {
      cy.get(selectors.investorDetails.edit).click()
        .get(selectors.investorRequirements.edit).should('be.disabled')
        .get(selectors.location.edit).should('be.disabled')
    })
  })

  context('when editing the "Investor requirements" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor details" and "Location" edit button', () => {
      cy.get(selectors.investorRequirements.edit).click()
        .get(selectors.investorDetails.edit).should('be.disabled')
        .get(selectors.location.edit).should('be.disabled')
    })
  })

  context('when editing the "Location" profile summary', () => {
    before(() => visitLargeCapitalProfileAndExpandAllSections())

    it('should disable both the "Investor details" and "Investor requirements" edit button', () => {
      cy.get(selectors.location.edit).click()
        .get(selectors.investorDetails.edit).should('be.disabled')
        .get(selectors.investorRequirements.edit).should('be.disabled')
    })
  })

  context('when viewing the incomplete fields on each summary', () => {
    before(() => cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`))

    it('should display "5 fields incomplete"', () => {
      cy.get(selectors.investorDetails.incompleteFields).contains('5 fields incomplete')
    })

    it('should display "9 fields incomplete"', () => {
      cy.get(selectors.investorRequirements.incompleteFields).contains('9 fields incomplete')
    })

    it('should display "3 fields incomplete"', () => {
      cy.get(selectors.location.incompleteFields).contains('3 fields incomplete')
    })
  })
})

const visitLargeCapitalProfileAndExpandAllSections = () => {
  cy.visit(`/companies/${oneListCorp.id}/investments/large-capital-profile`)
    .get(selectors.investorDetails.summary).click()
    .get(selectors.investorRequirements.summary).click()
    .get(selectors.location.summary).click()
}
