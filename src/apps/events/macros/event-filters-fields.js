const { assign, flatten } = require('lodash')
const { globalFields } = require('../../macros')
const { collectionFilterLabels } = require('../labels')
const { transformObjectToOption } = require('../../transformers')

const eventFiltersFields = ({ advisers, userAgent }) => {
  return [
    {
      macroName: 'TextField',
      name: 'name',
    },
    {
      macroName: 'Typeahead',
      name: 'organiser',
      entity: 'adviser',
      options: advisers.map(transformObjectToOption),
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'start_date_after',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
    },
    {
      macroName: 'DateField',
      type: 'date',
      name: 'start_date_before',
      hint: userAgent.isIE ? 'DD/MM/YYYY' : null,
    },
    assign({}, globalFields.countries, {
      name: 'address_country',
      type: 'checkbox',
      modifier: 'option-select',
    }),
    assign({}, globalFields.ukRegions, {
      name: 'uk_region',
      type: 'checkbox',
      modifier: 'option-select',
    }),
    assign({}, globalFields.eventTypes, {
      name: 'event_type',
      type: 'checkbox',
      modifier: 'option-select',
    }),
  ].map(filter => {
    return assign(filter, {
      label: collectionFilterLabels.edit[filter.name],
      modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
    })
  })
}

module.exports = eventFiltersFields
