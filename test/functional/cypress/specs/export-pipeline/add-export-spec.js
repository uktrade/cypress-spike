import { contactFaker, contactsListFaker } from '../../fakers/contacts'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const {
  assertUrl,
  assertExactUrl,
  assertFlashMessage,
  assertPayload,
  assertFieldTypeahead,
  assertFieldError,
  assertLocalHeader,
  assertBreadcrumbs,
  assertFieldEmpty,
} = require('../../support/assertions')

const {
  ERROR_MESSAGES,
} = require('../../../../../src/client/modules/ExportPipeline/ExportForm/constants')
const {
  generateExport,
} = require('../../../../sandbox/routes/v4/export/exports')
const {
  fill,
  fillTypeahead,
  fillMultiOptionTypeahead,
  fillSelect,
  clearTypeahead,
} = require('../../support/form-fillers')
const autoCompleteAdvisers =
  require('../../../../sandbox/fixtures/autocomplete-adviser-list.json').results
const { faker } = require('@faker-js/faker')

describe('Export pipeline create', () => {
  before(() => {
    // Clear the session storage to avoid caching of contact form data in the application sessionStorage
    Cypress.session.clearCurrentSessionData()
  })

  context('when adding an export for unknown company id', () => {
    before(() => {
      cy.intercept('GET', '/api-proxy/v4/company/not_real', {
        statusCode: 404,
      }).as('getServerFailure')
      cy.visit('/export/create?companyId=not_real')
    })

    it('should render the header', () => {
      assertLocalHeader('Add export')
      cy.get('[data-test="subheading"]').should('not.exist')
    })

    it('should render add event breadcrumb', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        'Add export': null,
      })
    })

    it('should render the error message', () => {
      cy.get('[data-test="error-dialog"]').should('be.visible')
    })
  })

  context('when adding an export for known company id', () => {
    const company = fixtures.company.venusLtd
    const addPageUrl = `/export/create?companyId=${company.id}`
    const newExport = generateExport()
    const newContact = contactFaker()

    const add_contact_and_return_to_export_form = () => {
      cy.get('[data-test="add-a-new-contact-link"').click()
      fill('[data-test=group-field-first_name]', newContact.first_name)
      fill('[data-test=group-field-last_name]', newContact.last_name)
      fill('[data-test=job-title-input]', newContact.job_title)
      fill('[data-test=job-title-input]', newContact.job_title)
      fill('[data-test=email-input]', newContact.email)
      cy.get('[name="addressSameAsCompany"]').check('Yes')
      cy.get('[name="primary"]').check('No')
      cy.get('[data-test="submit-button"').click()
    }

    context('when verifying the page', () => {
      before(() => {
        cy.visit(addPageUrl)
      })

      it('should render the header', () => {
        assertLocalHeader('Add export')
        cy.get('[data-test="subheading"]').should('have.text', company.name)
      })

      it('should render the add export breadcrumb', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          Companies: urls.companies.index(),
          [company.name]: urls.companies.activity.index(company.id),
          'Add export': null,
        })
      })

      it('should render a form with display a save button', () => {
        cy.get('[data-test=submit-button]').should('have.text', 'Save')
      })

      it('should render a form with a cancel link', () => {
        cy.get('[data-test=cancel-button]')
          .should('have.text', 'Cancel')
          .should(
            'have.attr',
            'href',
            urls.companies.activity.index(company.id)
          )
      })

      it('should render a form with the default values set', () => {
        cy.get('[data-test="field-owner"]').then((element) => {
          assertFieldTypeahead({
            element,
            label: 'Owner',
            value: 'DBT Staff',
            isMulti: false,
          })
        })
      })
    })

    context('when the form cancel button is clicked', () => {
      before(() => {
        cy.visit(addPageUrl)
      })

      it('the form should redirect to the company page', () => {
        cy.get('[data-test=cancel-button]').click()
        assertUrl(urls.companies.activity.index(company.id))
      })
    })

    context('when the form is populated but not submitted', () => {
      before(() => {
        cy.visit(addPageUrl)
      })

      it('leaving and returning to the page should not keep any values', () => {
        fill('[data-test=title-input]', newExport.title)
        fill('[data-test=estimated_win_date-month]', '09')
        fill('[data-test=estimated_win_date-year]', '2029')
        add_contact_and_return_to_export_form()
        cy.visit('/')
        cy.visit(addPageUrl)
        assertFieldEmpty('[data-test=title-input]')
        assertFieldEmpty('[data-test=estimated_win_date-month]')
        assertFieldEmpty('[data-test=estimated_win_date-year]')
      })
    })

    context('when the form contains invalid data and is submitted', () => {
      before(() => {
        cy.visit(addPageUrl)
      })

      it('the form should display validation error message for mandatory inputs', () => {
        //clear any default values first
        clearTypeahead('[data-test=field-owner]')
        clearTypeahead('[data-test=field-destination_country]')
        clearTypeahead('[data-test=field-sector]')
        cy.get('[data-test=submit-button]').click()
        assertFieldError(
          cy.get('[data-test="field-title"]'),
          ERROR_MESSAGES.title
        )
        assertFieldError(
          cy.get('[data-test="field-owner"]'),
          ERROR_MESSAGES.owner
        )
        assertFieldError(
          cy.get('[data-test="field-estimated_export_value_years"]'),
          ERROR_MESSAGES.estimated_export_value_years
        )
        assertFieldError(
          cy.get('[data-test="field-estimated_export_value_amount"]'),
          ERROR_MESSAGES.estimated_export_value_amount,
          false
        )
        assertFieldError(
          cy.get('[data-test="field-destination_country"]'),
          ERROR_MESSAGES.destination_country,
          false
        )
        assertFieldError(
          cy.get('[data-test="field-status"]'),
          ERROR_MESSAGES.status
        )
        assertFieldError(
          cy.get('[data-test="field-sector"]'),
          ERROR_MESSAGES.sector
        )
        assertFieldError(
          cy.get('[data-test="field-status"]'),
          ERROR_MESSAGES.status
        )
        assertFieldError(
          cy.get('[data-test="field-export_potential"]'),
          ERROR_MESSAGES.export_potential
        )
        assertFieldError(
          cy.get('[data-test="field-contacts"]'),
          ERROR_MESSAGES.contacts,
          false
        )
      })

      it('the form should display validation error message for too many team members', () => {
        const advisers = faker.helpers.arrayElements(autoCompleteAdvisers, 6)
        fillMultiOptionTypeahead(
          '[data-test=field-team_members]',
          advisers.map((adviser) => adviser.name)
        )
        cy.get('[data-test=submit-button]').click()

        assertFieldError(
          cy.get('[data-test="field-team_members"]'),
          ERROR_MESSAGES.team_members
        )
      })

      it('the form should display validation error message for invalid estimated dates', () => {
        fill('[data-test=estimated_win_date-month]', '65')
        fill('[data-test=estimated_win_date-year]', '-54')
        cy.get('[data-test=submit-button]').click()

        assertFieldError(
          cy.get('[data-test="field-estimated_win_date"]'),
          ERROR_MESSAGES.estimated_win_date.invalid
        )
      })
    })

    context(
      'when the form contains valid data and the form is submitted',
      () => {
        const contacts = contactsListFaker((length = 3))

        before(() => {
          cy.intercept('POST', `/api-proxy/v4/export`).as(
            'postExportItemApiRequest'
          )
          cy.intercept('POST', `/api-proxy/v4/contact`, newContact).as(
            'postContactApiRequest'
          )
          cy.intercept(
            'GET',
            `/api-proxy/v4/contact?company_id=${company.id}`,
            { count: 4, results: [newContact, ...contacts] }
          ).as('getContactApiRequest')
          cy.visit(addPageUrl)
        })

        it('the form should redirect to the dashboard page and display a success message', () => {
          const teamMember = faker.helpers.arrayElement(autoCompleteAdvisers)

          fill('[data-test=title-input]', newExport.title)
          fillTypeahead('[data-test=field-team_members]', teamMember.name)
          fillSelect(
            '[data-test=field-estimated_export_value_years]',
            newExport.estimated_export_value_years.id
          )
          fill(
            '[data-test=estimated-export-value-amount-input]',
            newExport.estimated_export_value_amount
          )
          fill('[data-test=estimated_win_date-month]', '03')
          fill('[data-test=estimated_win_date-year]', '2035')
          fillTypeahead(
            '[data-test=field-destination_country]',
            newExport.destination_country.name
          )
          fillTypeahead('[data-test=field-sector]', newExport.sector.name)
          cy.get('[name="status"]').check(newExport.status)
          cy.get('[name="export_potential"]').check(newExport.export_potential)

          cy.get('[name="exporter_experience"]').check(
            newExport.exporter_experience.id
          )
          fill('[data-test=field-notes]', newExport.notes)
          add_contact_and_return_to_export_form()
          assertFlashMessage(
            `You have successfully added a new contact ${newContact.name}`
          )

          fillTypeahead('[data-test=field-contacts]', newContact.name)
          cy.window()
            .its('sessionStorage')
            .invoke('getItem', 'exportForm')
            .should('exist')

          cy.get('[data-test=submit-button]').click()

          assertPayload('@postExportItemApiRequest', {
            title: newExport.title,
            owner: '7d19d407-9aec-4d06-b190-d3f404627f21',
            team_members: [teamMember.id],
            company: { id: company.id, name: company.name },
            estimated_export_value_years:
              newExport.estimated_export_value_years.id,
            estimated_export_value_amount:
              newExport.estimated_export_value_amount,
            estimated_win_date: '2035-03-01T00:00:00',
            destination_country: newExport.destination_country.id,
            sector: newExport.sector.id,
            status: newExport.status,
            export_potential: newExport.export_potential,
            contacts: [newContact.id],
            exporter_experience: newExport.exporter_experience.id,
            notes: newExport.notes,
          })

          assertExactUrl('')
          assertFlashMessage(`'${newExport.title}' created`)

          cy.window()
            .its('sessionStorage')
            .invoke('getItem', 'exportForm')
            .should('not.exist')
        })
      }
    )
  })
})
