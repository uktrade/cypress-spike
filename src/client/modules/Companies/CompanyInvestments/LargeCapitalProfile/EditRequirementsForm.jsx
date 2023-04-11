import React from 'react'
import PropTypes from 'prop-types'

import urls from '../../../../../lib/urls'
import {
  FieldCheckboxes,
  FieldRadios,
  Form,
  Main,
} from '../../../../components'
import ResourceOptionsField from '../../../../components/Form/elements/ResourceOptionsField'
import { transformArrayIdNameToValueLabel } from '../../../../transformers'
import {
  transformInitialValuesForCheckbox,
  transformInvestorRequirementsToApi,
} from './transformers'
import { FieldAssetClassTypeahead } from '../../../../components/Form/elements/AssetClassOptions'
import { TASK_SAVE_LARGE_CAPITAL_INVESTOR_REQUIREMENTS } from './state'

import TimeHorizonsResource from '../../../../components/Resource/TimeHorizons'
import LargeCapitalInvestmentRestrictionsResource from '../../../../components/Resource/LargeCapitalInvestmentRestrictions'
import ConstructionRisksResource from '../../../../components/Resource/ConstructionRisks'
import DesiredDealRolesResource from '../../../../components/Resource/DesiredDealRoles'
import LargeCapitalInvestmentReturnRateResource from '../../../../components/Resource/LargeCapitalInvestmentReturnRate'
import LargeCapitalInvestmentEquityPercentagesResource from '../../../../components/Resource/LargeCapitalInvestmentEquityPercentages'
import DealTicketSizesResource from '../../../../components/Resource/DealTicketSizes'
import LargeCapitalInvestmentTypesResource from '../../../../components/Resource/LargeCapitalInvestmentTypes'

const EditRequirementsForm = ({ profile }) => {
  const {
    id: profileId,
    investorCompany,
    assetClassesOfInterest,
    constructionRisks,
    dealTicketSizes,
    desiredDealRoles,
    investmentTypes,
    minimumEquityPercentage,
    minimumReturnRate,
    restrictions,
    timeHorizons,
  } = profile

  return (
    <Main>
      <Form
        id="edit-large-capital-profile-requirements"
        analyticsFormName="editLargeCapitalProfileRequirements"
        cancelButtonLabel="Return without saving"
        cancelRedirectTo={() =>
          urls.companies.investments.largeCapitalProfile(investorCompany.id)
        }
        flashMessage={() => 'Investor requirements updated'}
        submitButtonlabel="Save and return"
        submissionTaskName={TASK_SAVE_LARGE_CAPITAL_INVESTOR_REQUIREMENTS}
        redirectTo={() =>
          urls.companies.investments.largeCapitalProfile(investorCompany.id)
        }
        transformPayload={(values) =>
          transformInvestorRequirementsToApi({
            profileId,
            companyId: investorCompany.id,
            values,
          })
        }
      >
        <ResourceOptionsField
          name="deal_ticket_size"
          label="Deal ticket size"
          resource={DealTicketSizesResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(dealTicketSizes)}
        />
        <FieldAssetClassTypeahead
          isMulti={true}
          name="asset_classes"
          initialValue={transformArrayIdNameToValueLabel(
            assetClassesOfInterest
          )}
        />
        <p>
          If the asset class you wish to select is not shown above, then request
          it from&nbsp;
          <a href={`mailto:capitalinvestment@trade.gov.uk`}>
            capitalinvestment@trade.gov.uk
          </a>
          .
        </p>
        <ResourceOptionsField
          name="investment_types"
          label="Types of investment"
          resource={LargeCapitalInvestmentTypesResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(investmentTypes)}
        />
        <ResourceOptionsField
          name="minimum_return_rate"
          label="Minimum return rate"
          resource={LargeCapitalInvestmentReturnRateResource}
          field={FieldRadios}
          initialValue={minimumReturnRate ? minimumReturnRate.id : null}
        />
        <ResourceOptionsField
          name="time_horizons"
          label="Time horizon / tenor"
          resource={TimeHorizonsResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(timeHorizons)}
        />
        <ResourceOptionsField
          name="restrictions"
          label="Restrictions / conditions"
          resource={LargeCapitalInvestmentRestrictionsResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(restrictions)}
        />
        <ResourceOptionsField
          name="construction_risk"
          label="Construction risk"
          resource={ConstructionRisksResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(constructionRisks)}
        />
        <ResourceOptionsField
          name="minimum_equity_percentage"
          label="Minimum equity percentage"
          resource={LargeCapitalInvestmentEquityPercentagesResource}
          field={FieldRadios}
          initialValue={
            minimumEquityPercentage ? minimumEquityPercentage.id : null
          }
        />
        <ResourceOptionsField
          name="desired_deal_role"
          label="Desired deal role"
          resource={DesiredDealRolesResource}
          field={FieldCheckboxes}
          initialValue={transformInitialValuesForCheckbox(desiredDealRoles)}
        />
      </Form>
    </Main>
  )
}
EditRequirementsForm.propTypes = {
  profile: PropTypes.object.isRequired,
}

export default EditRequirementsForm
