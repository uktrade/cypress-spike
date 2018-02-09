/* eslint-disable camelcase */
const {
  assign,
  find,
  get,
  isPlainObject,
  mapValues,
} = require('lodash')

const metadataRepository = require('../../../lib/metadata')

// TODO: This is a temporary transformer to transform an API response into
// a format needed for the form view
//
// Will be replaced with newer form builder transformers once the form view is
// replaced with newer form macros
module.exports = function transformCompanyToForm (body) {
  if (!isPlainObject(body)) { return }

  const schema = {
    registered_address_country: String,
    trading_address_country: String,
    business_type: String,
    headquarter_type: Object,
    uk_region: String,
    sector: String,
    employee_range: String,
    turnover_range: String,
  }

  const formatted = mapValues(schema, (type, key) => {
    if (type === Object) {
      return get(body, key)
    }
    return get(body, `${key}.id`)
  })

  // TODO we need to create an "other" business_type on DH to place any Companies House company_category that do not match DH business_type
  if (body.company_category) {
    const businessType = find(metadataRepository.businessTypeOptions, (type) => {
      return type.name.toLowerCase() === body.company_category.toLowerCase()
    })

    formatted.business_type = get(businessType, 'id')
  }

  formatted.headquarter_type = get(formatted, 'headquarter_type.id', 'not_headquarters')

  return assign({}, body, formatted)
}
