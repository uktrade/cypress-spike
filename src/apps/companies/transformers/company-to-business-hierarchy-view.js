/* eslint-disable camelcase */
const { pickBy } = require('lodash')

const { getDataLabels } = require('../../../lib/controller-utils')
const { businessHierarchyLabels, hqLabels } = require('../labels')
const { pluralise } = require('../../../../config/nunjucks/filters')
const { NONE_TEXT } = require('../constants')

const transformHeadquarterType = (headquarter_type) => {
  if (headquarter_type) {
    return hqLabels[headquarter_type.name]
  }
}

const transformSubsidiaries = (id, headquarter_type, subsidiariesCount, duns_number) => {
  if (headquarter_type) {
    if (subsidiariesCount) {
      return {
        url: `/companies/${id}/subsidiaries`,
        name: `${subsidiariesCount} ${pluralise('subsidiary', subsidiariesCount)}`,
      }
    }

    if (headquarter_type.name === 'ghq' && !duns_number) {
      return {
        name: NONE_TEXT,
        actions: [
          {
            url: `/companies/${id}/subsidiaries/link`,
            label: 'Link a subsidiary',
          },
        ],
      }
    }

    return NONE_TEXT
  }
}

const transformGlobalHq = (id, headquarter_type, global_headquarters, duns_number) => {
  if (!headquarter_type && !global_headquarters) {
    return pickBy({
      name: NONE_TEXT,
      actions: duns_number ? null : [
        {
          url: `/companies/${id}/hierarchies/ghq/search`,
          label: 'Link to the Global HQ',
        },
      ],
    })
  }

  if (global_headquarters) {
    return pickBy({
      url: `/companies/${global_headquarters.id}`,
      name: global_headquarters.name,
      actions: duns_number ? null : [
        {
          url: `/companies/${id}/hierarchies/ghq/remove`,
          label: 'Remove link',
        },
      ],
    })
  }
}

module.exports = ({ id, headquarter_type, global_headquarters, duns_number }, subsidiariesCount) => {
  const viewRecord = {
    headquarter_type: transformHeadquarterType(headquarter_type),
    subsidiaries: transformSubsidiaries(id, headquarter_type, subsidiariesCount, duns_number),
    global_headquarters: transformGlobalHq(id, headquarter_type, global_headquarters, duns_number),
  }

  return pickBy(getDataLabels(viewRecord, businessHierarchyLabels))
}
