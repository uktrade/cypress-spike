import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import { H3 } from '@govuk-react/heading'
import { SummaryTable } from '../../../../../client/components/'
import { SPACING } from '@govuk-react/constants'

import urls from '../../../../../lib/urls'
import ExportWins from './ExportWins/'
import GreatProfile from './GreatProfile'
import { CompanyResource } from '../../../../../client/components/Resource'
import CompanyLayout from '../../../../../client/components/Layout/CompanyLayout'
import { exportDetailsLabels, exportPotentialLabels } from '../../../labels'
import { transformExportCountries } from '../transformer'

const StyledSummaryTable = styled(SummaryTable)`
  margin-top: 0;
`

const StyledLink = styled(Link)`
  display: inline-block;
  margin-bottom: ${SPACING.SCALE_5};
`

const getExportPotential = (exportPotential) =>
  exportPotentialLabels[exportPotential] &&
  exportPotentialLabels[exportPotential].text

const ExportsIndex = ({
  companyId,
  returnUrl,
  dnbRelatedCompaniesCount,
  localNavItems,
}) => {
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <CompanyLayout
          company={company}
          breadcrumbs={[{ text: 'Exports' }]}
          dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
          returnUrl={returnUrl}
          localNavItems={localNavItems}
        >
          <SummaryTable
            caption="Exports"
            actions={
              !company.archived && (
                <Link href={urls.companies.exports.edit(companyId)}>Edit</Link>
              )
            }
          >
            <SummaryTable.Row
              heading={exportDetailsLabels.exportExperienceCategory}
              key={exportDetailsLabels.exportExperienceCategory}
            >
              {company.exportExperienceCategory
                ? company.exportExperienceCategory.name
                : 'None'}
            </SummaryTable.Row>
            <SummaryTable.Row
              heading={exportDetailsLabels.greatProfile}
              key={exportDetailsLabels.greatProfile}
            >
              <GreatProfile
                profileStatus={company.greatProfileStatus}
                companyNumber={company.companyNumber}
              />
            </SummaryTable.Row>
            <SummaryTable.Row
              heading={exportDetailsLabels.exportPotential}
              key={exportDetailsLabels.exportPotential}
            >
              {company.exportPotential
                ? getExportPotential(company.exportPotential)
                : 'No score given'}
            </SummaryTable.Row>
          </SummaryTable>

          <Details summary="What is export potential">
            The export potential score is a prediction of a company's likelihood
            of exporting, and was originally created for the{' '}
            <Link
              href={urls.external.findExporters()}
              target="_blank"
              aria-label="opens in a new tab"
            >
              Find Exporters tool
            </Link>
            . DBT's data science team compared all HMRC export information with
            the features of all UK companies to find patterns; they then
            repeatedly tested their model against a subset of known-good data to
            improve it. The scores are as follows:
            <ol>
              {Object.values(exportPotentialLabels).map((category) => (
                <li key={category.text}>
                  <strong>{category.text}</strong> - {category.description}
                </li>
              ))}
            </ol>
            <br />
            We are continuing to improve the algorithm so please do share your
            feedback or let us know of any anomalies through the{' '}
            <a href={urls.support()}>support channel</a>.
          </Details>

          <StyledSummaryTable
            caption="Export countries information"
            actions={
              !company.archived && (
                <Link
                  href={urls.companies.exports.editCountries(companyId)}
                  data-test-id="edit-export-countries"
                >
                  Edit
                </Link>
              )
            }
          >
            {transformExportCountries(company.exportCountries).map(
              ({ name, values }) => (
                <SummaryTable.Row heading={name} key={name}>
                  <>
                    {values?.length
                      ? values.map(({ id, name }, i) => {
                          const isLastItem = i === values.length - 1
                          return (
                            <React.Fragment key={id}>
                              <Link
                                href={urls.companies.exports.history.country(
                                  companyId,
                                  id
                                )}
                              >
                                {name}
                              </Link>
                              {isLastItem ? null : ', '}
                            </React.Fragment>
                          )
                        })
                      : 'None'}
                  </>
                </SummaryTable.Row>
              )
            )}
          </StyledSummaryTable>

          <StyledLink href={urls.companies.exports.history.index(companyId)}>
            View full export countries history
          </StyledLink>

          <H3>Export wins</H3>
          <p>
            <Link
              data-test-id="exportWinsLink"
              href={urls.external.exportWins()}
              target="_blank"
              aria-label="opens in a new tab"
            >
              Record your win
            </Link>{' '}
            on our Export Wins site
          </p>
          <Details summary="What is an Export Win">
            <p>
              Export wins capture the export deals that Department for Business
              and Trade (DBT) support and quantify their expected export value.
              If applicable, they also quantify the non-export and outward
              direct investment (ODI) value, up to a 5-year period. They give a
              picture of DBT support for business.
            </p>
            <p>
              The export win metric is currently the only way the department
              measures export activity.
            </p>
          </Details>
          <ExportWins
            companyId={companyId}
            companyName={company.name}
          ></ExportWins>
        </CompanyLayout>
      )}
    </CompanyResource>
  )
}

ExportsIndex.propTypes = {
  companyId: PropTypes.string.isRequired,
}

export default ExportsIndex
