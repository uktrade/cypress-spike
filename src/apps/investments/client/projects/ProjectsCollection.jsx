import React from 'react'
import { connect } from 'react-redux'

import {
  FilterAdvisersTypeahead,
  RoutedTypeahead,
  CollectionFilters,
  ToggleSection,
  FilteredCollectionList,
  RoutedDateField,
  RoutedCheckboxGroupField,
} from '../../../../client/components'

import {
  TASK_GET_PROJECTS_LIST,
  TASK_GET_ADVISER_NAME,
  ID,
  state2props,
} from './state'

import {
  INVESTMENTS__PROJECTS_LOADED,
  INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
} from '../../../../client/actions'

const ProjectsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_PROJECTS_LIST,
    id: ID,
    progressMessage: 'loading projects...',
    startOnRender: {
      payload,
      onSuccessDispatch: INVESTMENTS__PROJECTS_LOADED,
    },
  }
  const adviserListTask = {
    name: TASK_GET_ADVISER_NAME,
    id: ID,
    progressMessage: 'loading advisers...',
    startOnRender: {
      payload: payload.adviser,
      onSuccessDispatch: INVESTMENTS__PROJECTS_SELECTED_ADVISERS,
    },
  }
  return (
    <FilteredCollectionList
      {...props}
      collectionName="Project"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
    >
      <CollectionFilters>
        <ToggleSection
          label="Company information"
          id="company-information-filters"
          isOpen={true}
        >
          <RoutedCheckboxGroupField
            {...props}
            label="Stage"
            name="stage"
            qsParam="stage"
            options={optionMetadata.projectStageOptions}
            selectedOptions={selectedFilters.selectedStages}
          />
          <FilterAdvisersTypeahead
            {...props}
            taskProps={adviserListTask}
            isMulti={true}
            label="Advisers"
            name="advisers"
            placeholder="Search advisers..."
            noOptionsMessage={() => <>No advisers found</>}
          />
          <RoutedTypeahead
            {...props}
            isMulti={true}
            label="Sector"
            name="sector"
            qsParam="sector_descends"
            placeholder="Search sectors..."
            options={optionMetadata.sectorOptions}
            selectedOptions={selectedFilters.selectedSectors}
          />
          <RoutedTypeahead
            {...props}
            isMulti={true}
            label="Country of origin"
            name="country"
            qsParam="country"
            placeholder="Search countries..."
            options={optionMetadata.countryOptions}
            selectedOptions={selectedFilters.selectedCountries}
          />
          <RoutedTypeahead
            {...props}
            isMulti={true}
            label="UK Region"
            name="uk_region"
            qsParam="uk_region"
            placeholder="Search UK regions..."
            options={optionMetadata.ukRegionOptions}
            selectedOptions={selectedFilters.selectedUkRegions}
          />
          <RoutedCheckboxGroupField
            {...props}
            label="Type of investment"
            name="investment_type"
            qsParam="investment_type"
            options={optionMetadata.investmentTypeOptions}
            selectedOptions={selectedFilters.selectedInvestmentTypes}
          />
          <RoutedDateField
            label="Estimated land date before"
            name="estimated_land_date_before"
            qsParamName="estimated_land_date_before"
          />
          <RoutedDateField
            label="Estimated land date after"
            name="estimated_land_date_after"
            qsParamName="estimated_land_date_after"
          />
          <RoutedDateField
            label="Actual land date before"
            name="actual_land_date_before"
            qsParamName="actual_land_date_before"
          />
          <RoutedDateField
            label="Actual land date after"
            name="actual_land_date_after"
            qsParamName="actual_land_date_after"
          />
        </ToggleSection>
      </CollectionFilters>
    </FilteredCollectionList>
  )
}
export default connect(state2props)(ProjectsCollection)
