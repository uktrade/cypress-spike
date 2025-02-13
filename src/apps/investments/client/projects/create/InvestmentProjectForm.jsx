import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { get } from 'lodash'

import { Form, Main } from '../../../../../client/components'
import CompanySummaryTable from './CompanySummaryTable'
import InvestmentTypeStep from './InvestmentTypeStep'
import CompanySearchStep from './CompanySearchStep'
import InvestmentDetailsStep from './InvestmentDetailsStep'

import { getQueryParamsFromLocation } from '../../../../../client/utils/url'
import { transformFormValuesToPayload } from './transformers'
import urls from '../../../../../lib/urls'
import {
  TASK_CREATE_INVESTMENT_PROJECT,
  TASK_GET_INVESTMENT_PROJECT_INITIAL_VALUES,
} from './state'

const getContactFromQueryParams = (queryParams) => {
  const label = get(queryParams, 'new-contact-name')
  const value = get(queryParams, 'new-contact-id')
  return label && value ? { label, value } : null
}

const InvestmentProjectForm = ({ company, csrfToken }) => (
  <Main>
    <Route>
      {({ location }) => {
        const queryParams = getQueryParamsFromLocation(location)
        const contact = getContactFromQueryParams(queryParams)
        return (
          <Form
            id="add-investment-project"
            initialStepIndex={
              company && contact ? 1 : !company && contact ? 2 : 0
            }
            initialValuesTaskName={TASK_GET_INVESTMENT_PROJECT_INITIAL_VALUES}
            initialValuesPayload={{
              fetchFromStorage: !!contact,
              contact,
              company,
            }}
            submissionTaskName={TASK_CREATE_INVESTMENT_PROJECT}
            analyticsFormName="Create investment project"
            redirectTo={({ data }) =>
              urls.investments.projects.details(data.id)
            }
            transformPayload={(values) =>
              transformFormValuesToPayload(
                {
                  ...values,
                  ...(company ? { company } : {}),
                },
                csrfToken
              )
            }
            flashMessage={() => 'Investment project created'}
          >
            {({ values, errors }) => {
              const dhCompany = company || values.company
              return (
                <>
                  {dhCompany && <CompanySummaryTable company={dhCompany} />}
                  {!company && <CompanySearchStep />}
                  <InvestmentTypeStep
                    investmentTypes={values.investmentTypes}
                    fdiTypes={values.fdiTypes}
                  />
                  <InvestmentDetailsStep
                    company={dhCompany}
                    values={values}
                    errors={errors}
                  />
                </>
              )
            }}
          </Form>
        )
      }}
    </Route>
  </Main>
)

InvestmentProjectForm.propTypes = {
  company: PropTypes.object,
  csrfToken: PropTypes.string.isRequired,
}

export default InvestmentProjectForm
