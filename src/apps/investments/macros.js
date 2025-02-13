const { assign, flatten } = require('lodash')

const metadata = require('../../lib/metadata')
const { globalFields } = require('../macros')
const { collectionFilterLabels, requirementsLabels } = require('./labels')

const requirementsFormConfig = ({
  strategicDrivers,
  countries,
  ukRegions,
  partners,
}) => {
  const labels = requirementsLabels.edit

  return {
    buttonText: 'Save',
    children: [
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'strategic_drivers',
        label: requirementsLabels.edit.strategic_drivers,
        inputData: {
          test: 'field-strategic_drivers',
        },
        children: [
          assign({}, globalFields.strategicDrivers, {
            label: labels.strategic_drivers,
            isLabelHidden: true,
            options: strategicDrivers,
          }),
        ],
      },
      {
        macroName: 'TextField',
        type: 'textarea',
        name: 'client_requirements',
        label: labels.client_requirements,
        inputData: {
          test: 'field-client_requirements',
        },
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        modifier: 'inline',
        name: 'client_considering_other_countries',
        label: labels.client_considering_other_countries,
        inputData: {
          test: 'field-client_considering_other_countries',
        },
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'competitor_countries',
        label: labels.competitor_countries,
        modifier: 'subfield',
        condition: {
          name: 'client_considering_other_countries',
          value: 'true',
        },
        inputData: {
          test: 'field-competitor_countries',
        },
        children: [
          assign({}, globalFields.countries, {
            name: 'competitor_countries',
            label: labels.competitor_countries,
            isLabelHidden: true,
            options: countries,
          }),
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'uk_region_locations',
        label: requirementsLabels.edit.uk_region_locations,
        inputData: {
          test: 'field-uk_region_locations',
        },
        children: [
          assign({}, globalFields.ukRegions, {
            label: labels.uk_region_locations,
            isLabelHidden: true,
            name: 'uk_region_locations',
            options: ukRegions,
          }),
        ],
      },
      {
        macroName: 'MultipleChoiceField',
        type: 'radio',
        modifier: 'inline',
        name: 'site_decided',
        label: labels.site_decided,
        inputData: {
          test: 'field-site_decided',
        },
        options: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
      {
        macroName: 'Fieldset',
        legend: 'Address',
        condition: {
          name: 'site_decided',
          value: 'true',
        },
        children: [
          {
            macroName: 'TextField',
            name: 'address_1',
            label: requirementsLabels.edit.address_1,
            modifier: 'compact',
            inputData: {
              test: 'field-address_1',
            },
          },
          {
            macroName: 'TextField',
            name: 'address_2',
            label: requirementsLabels.edit.address_2,
            isLabelHidden: true,
            modifier: 'compact',
            inputData: {
              test: 'field-address_2',
            },
          },
          {
            macroName: 'TextField',
            name: 'address_town',
            label: requirementsLabels.edit.address_town,
            inputData: {
              test: 'field-address_town',
            },
          },
          {
            macroName: 'TextField',
            name: 'address_postcode',
            label: requirementsLabels.edit.address_postcode,
            modifier: 'short',
            inputData: {
              test: 'field-address_postcode',
            },
          },
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'actual_uk_regions',
        label: requirementsLabels.edit.actual_uk_regions,
        condition: {
          name: 'site_decided',
          value: 'true',
        },
        inputData: {
          test: 'field-actual_uk_regions',
        },
        children: [
          assign({}, globalFields.ukRegions, {
            label: labels.actual_uk_regions,
            isLabelHidden: true,
            name: 'actual_uk_regions',
            options: ukRegions,
          }),
        ],
      },
      {
        macroName: 'AddAnother',
        buttonName: 'add_item',
        name: 'delivery_partners',
        inputData: {
          test: 'field-delivery_partners',
        },
        children: [
          {
            macroName: 'MultipleChoiceField',
            name: 'delivery_partners',
            label: labels.delivery_partners,
            isLabelHidden: true,
            options: partners,
            initialOption: '-- Select a partner --',
          },
        ],
      },
    ].map((field) => {
      return assign(field, {
        label: requirementsLabels.edit[field.name],
      })
    }),
  }
}

const statusFormConfig = {
  buttonText: 'Save',
  children: [
    {
      macroName: 'MultipleChoiceField',
      type: 'radio',
      name: 'status',
      label: 'Status',
      isLabelHidden: true,
      options: metadata.investmentStatusOptions,
    },
  ],
}

const investmentProfilesFiltersFields = function () {
  return [
    {
      macroName: 'MultipleChoiceField',
      name: 'level_of_involvement_simplified',
      type: 'checkbox',
      modifier: 'option-select',
      options: [
        { value: 'involved', label: 'Involved' },
        { value: 'not_involved', label: 'Not involved' },
        { value: 'unspecified', label: 'Unspecified' },
      ],
    },
  ].map((filter) => {
    return Object.assign(filter, {
      label: collectionFilterLabels.edit[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}

module.exports = {
  requirementsFormConfig,
  statusFormConfig,
  investmentProfilesFiltersFields,
}
