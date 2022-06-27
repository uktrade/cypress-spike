import { assertBreadcrumbs } from '../../support/assertions'
import urls from '../../../../../src/lib/urls'
import { reminderFaker, reminderListFaker } from '../../fakers/reminders'

const remindersEndpoint =
  '/api-proxy/v4/reminder/no-recent-investment-interaction'

describe('No Recent Interaction Reminders', () => {
  const reminders = [
    reminderFaker({
      created_on: '2022-01-01T10:00:00.000000Z',
    }),
    ...reminderListFaker(9),
  ]
  const totalCount = 25

  const interceptApiCalls = () => {
    cy.intercept(
      {
        method: 'GET',
        pathname: remindersEndpoint,
        query: { limit: '10', offset: '0', sortby: '-created_on' },
      },
      {
        body: {
          count: totalCount,
          results: reminders,
          next: null,
          previous: null,
        },
      }
    ).as('remindersApiRequest')
    cy.intercept(
      {
        method: 'GET',
        pathname: remindersEndpoint,
        query: { limit: '10', offset: '20', sortby: '-created_on' },
      },
      {
        body: {
          count: totalCount,
          results: reminderListFaker(5),
          next: null,
          previous: null,
        },
      }
    ).as('remindersApiRequestPage3')
  }

  context('Reminders List', () => {
    before(() => {
      interceptApiCalls()
      cy.visit(urls.reminders.noRecentInteraction())
      cy.wait('@remindersApiRequest')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        'Reminders for projects with no recent interaction': null,
      })
    })

    it('should render the heading', () => {
      cy.get('[data-test="heading"]').should(
        'have.text',
        'Reminders for projects with no recent interaction'
      )
    })

    it('should include a list of links to other reminders', () => {
      cy.get('[data-test="link-list-item"]')
        .should('have.length', 3)
        .as('listItems')
      cy.get('@listItems')
        .eq(0)
        .find('a')
        .should('contain', 'Reminders for approaching estimated land dates')
        .should('have.attr', 'href', urls.reminders.estimatedLandDate())

      cy.get('@listItems')
        .eq(1)
        .find('a')
        .should('contain', 'Reminders for projects with no recent interaction')
        .should('have.attr', 'href', urls.reminders.noRecentInteraction())

      cy.get('@listItems')
        .eq(2)
        .find('a')
        .should('contain', 'Reminders for outstanding propositions')
        .should('have.attr', 'href', urls.reminders.outstandingProposition())
    })

    it('should render the list heading with the total number of reminders', () => {
      cy.get('[data-test="reminder-list-header"]').should(
        'contain',
        `${totalCount} reminders`
      )
    })

    it('should include a link to the reminder settings', () => {
      cy.get('[data-test="reminders-settings-link"]')
        .should('contain', 'Reminders settings')
        .should('have.attr', 'href', urls.reminders.settings.index())
    })

    it('should include a list of reminders', () => {
      cy.get('[data-test="reminders-list"]').should('be.visible')
      cy.get('[data-test="reminders-list-item"]').should('have.length', 10)

      cy.get('[data-test="reminders-list-item"]').eq(0).as('reminder')
      cy.get('@reminder')
        .find('[data-test="item-header"]')
        .should('contain', 'Received 1 Jan 2022')
      cy.get('@reminder')
        .find('[data-test="item-content"]')
        .should(
          'contain',
          `${reminders[0].event} for ${reminders[0].project.name}`
        )
        .find('a')
        .should(
          'have.attr',
          'href',
          urls.investments.projects.details(reminders[0].project.id)
        )
        .should('contain', reminders[0].project.name)
      cy.get('@reminder')
        .find('[data-test="item-footer"]')
        .should('contain', `Project code ${reminders[0].project.project_code}`)
    })
  })

  context('Pagination', () => {
    beforeEach(() => {
      interceptApiCalls()
      cy.visit(urls.reminders.noRecentInteraction())
      cy.wait('@remindersApiRequest')
    })

    it('should show pagination controls', () => {
      cy.get('[data-test="pagination"]')
        .should('have.attr', 'data-total-pages', '3')
        .find('li')
        .should('have.length', 4)
        .as('paginationItems')
      cy.get('@paginationItems').eq(0).should('have.text', '1')
      cy.get('@paginationItems').eq(1).should('have.text', '2')
      cy.get('@paginationItems').eq(2).should('have.text', '3')
      cy.get('@paginationItems').eq(3).should('have.text', 'Next')
    })

    it('should navigate to another page when clicked', () => {
      cy.get('[data-test="pagination"]').find('li').eq(2).click()
      cy.wait('@remindersApiRequestPage3')
      cy.get('[data-test="reminders-list-item"]').should('have.length', 5)
      cy.get('[data-test="page-number-active"]').should(
        'have.attr',
        'data-page-number',
        '3'
      )
    })
  })

  context('Sort', () => {
    beforeEach(() => {
      cy.intercept('GET', `${remindersEndpoint}*`).as('remindersApiRequest')
      cy.visit(urls.reminders.noRecentInteraction())
    })

    it('should apply the default sort', () => {
      cy.wait('@remindersApiRequest').then(({ request }) => {
        expect(request.url).to.contain('sortby=-created_on')
      })
    })

    it('should have all sort options', () => {
      cy.wait('@remindersApiRequest')
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => [o.value, o.text])
        expect(sortOptions).to.deep.eq([
          ['-created_on', 'Most recent'],
          ['created_on', 'Oldest'],
        ])
      })
    })

    it('should sort by "Oldest" and "Most recent"', () => {
      cy.wait('@remindersApiRequest')
      cy.get('[data-test="sortby"] select').select('created_on')
      cy.wait('@remindersApiRequest').then(({ request }) => {
        expect(request.url).to.contain('sortby=created_on')
      })
      cy.get('[data-test="sortby"] select').select('-created_on')
      cy.wait('@remindersApiRequest').then(({ request }) => {
        expect(request.url).to.contain('sortby=-created_on')
      })
    })
  })
})
