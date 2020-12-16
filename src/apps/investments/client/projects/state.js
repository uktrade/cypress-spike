import qs from 'qs'
import dateFns from 'date-fns'

import {
  actualLandDateBeforeLabel,
  actualLandDateAfterLabel,
  countryOptions,
  estimatedLandDateBeforeLabel,
  estimatedLandDateAfterLabel,
  investmentTypeOptions,
  likelihoodToLandLabel,
  likelihoodToLandOptions,
  projectStageOptions,
  sectorOptions,
  sortOptions,
  ukRegionOptions,
} from './metadata'

export const TASK_GET_PROJECTS_LIST = 'TASK_GET_PROJECTS_LIST'
export const TASK_GET_ADVISER_NAME = 'TASK_GET_ADVISER_NAME'

export const ID = 'projectsList'

const parseVariablePropType = (prop) =>
  prop ? (Array.isArray(prop) ? prop : [prop]) : prop

const searchParamProps = ({
  sortby = 'created_on:desc',
  page = 1,
  adviser = false,
  sector_descends = false,
  country = false,
  uk_region = false,
  stage = false,
  investment_type = false,
  likelihood_to_land = false,
  estimated_land_date_before = null,
  estimated_land_date_after = null,
  actual_land_date_before = null,
  actual_land_date_after = null,
}) => ({
  adviser: parseVariablePropType(adviser),
  sector_descends: parseVariablePropType(sector_descends),
  country: parseVariablePropType(country),
  uk_region: parseVariablePropType(uk_region),
  stage: parseVariablePropType(stage),
  investment_type: parseVariablePropType(investment_type),
  likelihood_to_land: parseVariablePropType(likelihood_to_land),
  estimated_land_date_before,
  estimated_land_date_after,
  actual_land_date_before,
  actual_land_date_after,
  sortby,
  page,
})

const collectionListPayload = (paramProps) => {
  return Object.fromEntries(
    Object.entries(searchParamProps(paramProps)).filter((v) => v[1])
  )
}

/**
 * Build the options filter - if specified, prfix label with the group name
 */
const buildOptionsFilter = (metadataOptions, filterProp, groupName = false) => {
  const optionsFilter = metadataOptions.filter((option) =>
    filterProp.includes(option.value)
  )
  if (groupName) {
    return optionsFilter.map(({ value, label }) => ({
      value,
      label: `${groupName}: ${label}`,
    }))
  } else {
    return optionsFilter
  }
}

const getDateLabel = (paramLabel, value) =>
  value ? `${paramLabel}: ${dateFns.format(value, 'D MMMM YYYY')}` : paramLabel

const buildDatesFilter = (paramLabel, value) =>
  value ? [{ label: getDateLabel(paramLabel, value), value }] : []

/**
 * Convert both location and redux state to investment projects props
 *
 * Selected filters are built from the page's query props as well as the
 * selected advisers in state.
 */
export const state2props = ({ router, ...state }) => {
  const queryProps = qs.parse(router.location.search.slice(1))
  const filteredQueryProps = collectionListPayload(queryProps)
  const { selectedAdvisers } = state.projectsList
  const {
    sector_descends = [],
    country = [],
    uk_region = [],
    stage = [],
    investment_type = [],
    likelihood_to_land = [],
    estimated_land_date_before,
    estimated_land_date_after,
    actual_land_date_before,
    actual_land_date_after,
  } = queryProps

  const selectedFilters = {
    selectedAdvisers: selectedAdvisers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
    })),
    selectedSectors: buildOptionsFilter(sectorOptions, sector_descends),
    selectedCountries: buildOptionsFilter(countryOptions, country),
    selectedUkRegions: buildOptionsFilter(ukRegionOptions, uk_region),
    selectedStages: buildOptionsFilter(projectStageOptions, stage),
    selectedInvestmentTypes: buildOptionsFilter(
      investmentTypeOptions,
      investment_type
    ),
    selectedLikelihoodToLands: buildOptionsFilter(
      likelihoodToLandOptions,
      likelihood_to_land,
      likelihoodToLandLabel
    ),
    selectedEstimatedLandDatesBefore: buildDatesFilter(
      estimatedLandDateBeforeLabel,
      estimated_land_date_before
    ),
    selectedEstimatedLandDatesAfter: buildDatesFilter(
      estimatedLandDateAfterLabel,
      estimated_land_date_after
    ),
    selectedActualLandDatesBefore: buildDatesFilter(
      actualLandDateBeforeLabel,
      actual_land_date_before
    ),
    selectedActualLandDatesAfter: buildDatesFilter(
      actualLandDateAfterLabel,
      actual_land_date_after
    ),
  }

  return {
    ...state[ID],
    payload: filteredQueryProps,
    optionMetadata: {
      countryOptions,
      sortOptions,
      sectorOptions,
      ukRegionOptions,
      projectStageOptions,
      investmentTypeOptions,
      likelihoodToLandOptions,
    },
    selectedFilters,
  }
}
