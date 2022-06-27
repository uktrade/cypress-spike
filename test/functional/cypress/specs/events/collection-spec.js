import { assertBreadcrumbs, assertErrorDialog } from '../../support/assertions'
import { events } from '../../../../../src/lib/urls'
import { eventFaker, eventListFaker } from '../../fakers/events'
import { EVENT_ACTIVITY_FEATURE_FLAG } from '../../../../../src/apps/companies/apps/activity-feed/constants'

const urls = require('../../../../../src/lib/urls')

describe('Event Collection List Page - React', () => {
  context('when the activity stream flag is off', () => {
    const event1 = eventFaker({
      event_type: {
        id: 'event-type-id',
        name: 'Seminar',
      },
      address_country: {
        id: 'country-id',
        name: 'Malaysia',
      },
      disabled_on: null,
      start_date: '2017-09-24',
      end_date: '2018-09-24',
      lead_team: {
        id: 'team-id',
        name: 'The A Team',
      },
      organiser: {
        id: 'organiser-id',
        first_name: 'Hannibal',
        last_name: 'Smith',
        name: 'Hannibal Smith',
      },
    })
    const event2 = eventFaker({
      uk_region: {
        id: 'region-id',
        name: 'South East',
      },
      disabled_on: '2017-09-24T16:29:35.723886',
      start_date: '2020-10-01',
    })
    const otherEvents = eventListFaker(8)
    const eventList = [event1, event2, ...otherEvents]

    before(() => {
      // Visit the new react events page - note this will need to be changed
      // to `events.index()` when ready
      // cy.setUserFeatures([])
      cy.intercept('POST', '/api-proxy/v3/search/event', {
        body: {
          count: eventList.length,
          results: eventList,
        },
      }).as('apiRequest')
      cy.visit(events.index())
      cy.wait('@apiRequest')
    })

    beforeEach(() => {
      cy.get('[data-test="collection-list"]').as('collectionList')
      cy.get('[data-test="collection-item"]').as('collectionItems')
      cy.get('@collectionItems').eq(0).as('firstListItem')
      cy.get('@collectionItems').eq(1).as('secondListItem')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Events: null,
      })
    })

    it('should have a link to add event', () => {
      cy.get('[data-test="add-collection-item-button"]')
        .should('exist')
        .should('contain', 'Add event')
        .should('have.attr', 'href', '/events/create')
    })

    it('should display a list of events', () => {
      cy.get('@collectionList').should('have.length', 1)
      cy.get('@collectionItems').should('have.length', eventList.length)
    })

    it('should contain country badge', () => {
      cy.get('@firstListItem')
        .find('[data-test="badge"]')
        .eq(0)
        .should('contain', 'Malaysia')
    })

    it('should contain region badge', () => {
      cy.get('@secondListItem')
        .find('[data-test="badge"]')
        .eq(0)
        .should('contain', 'South East')
    })

    it('should contain disabled badge', () => {
      cy.get('@secondListItem')
        .find('[data-test="badge"]')
        .eq(1)
        .should('contain', 'Disabled')
    })

    it('should contain event type', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata"]')
        .should('contain', 'Type')
        .and('contain', 'Seminar')
    })

    it('should contain start date', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata"]')
        .should('contain', 'Begins')
        .and('contain', '24 Sep 2017')
    })

    it('should contain end date', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata"]')
        .should('contain', 'Ends')
        .and('contain', '24 Sep 2018')
    })

    it('should contain lead team', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata"]')
        .should('contain', 'Lead team')
        .and('contain', 'The A Team')
    })

    it('should contain organiser', () => {
      cy.get('@firstListItem')
        .find('[data-test="metadata"]')
        .should('contain', 'Organiser')
        .and('contain', 'Hannibal Smith')
    })
  })

  context('when the activity stream flag is on', () => {
    beforeEach(() => {
      cy.setUserFeatures([EVENT_ACTIVITY_FEATURE_FLAG])
      cy.visit(events.index())
    })
    it('should not display the data hub API collection list', () => {
      cy.get('[data-test="collection-list"]').should('not.exist')
    })
    it('should display an event', () => {
      cy.get('[data-test="data-hub-event"]').should('exist')
    })
    it('should display an event name', () => {
      cy.get('[data-test="data-hub-event-name"]')
        .should('exist')
        .should('contain', 'Holiday to the Seaside')
    })
    it('should display an event date', () => {
      cy.get('[data-test="event-date-label"]')
        .should('exist')
        .should('contain', '30 May to 14 Jun 2022')
    })
    it('should display the event organiser', () => {
      cy.get('[data-test="organiser-label"]')
        .should('exist')
        .should('contain', 'Joe Bloggs')
    })
    it('should display the service type', () => {
      cy.get('[data-test="service-type-label"]')
        .should('exist')
        .should('contain', 'Best service')
    })
    it('should display the lead team', () => {
      cy.get('[data-test="lead-team-label"]')
        .should('exist')
        .should('contain', 'Digital Data Hub - Live Service')
    })
    context(
      'viewing the events collection page when there is an error loading events',
      () => {
        before(() => {
          cy.intercept('GET', urls.events.activity.data(), { statusCode: 500 })
          cy.visit(urls.events.index())
        })

        it('should render an error message', () => {
          assertErrorDialog(
            'TASK_GET_DATA_HUB_EVENTS',
            'Unable to load Data Hub events.'
          )
        })
      }
    )
    after(() => {
      cy.resetUser()
    })
  })
})
