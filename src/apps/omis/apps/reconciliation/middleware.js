const { assign, pick, pickBy } = require('lodash')

const { search } = require('../../../search/services')
const { transformApiResponseToSearchCollection } = require('../../../../modules/search/transformers')
const { transformOrderToTableItem } = require('../../transformers')
const { ENTITIES } = require('../../../search/constants')

async function setResults (req, res, next) {
  try {
    res.locals.results = await search({
      searchEntity: 'order',
      requestBody: req.body,
      token: req.session.token,
      page: req.query.page,
      isAggregation: false,
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        ENTITIES,
        transformOrderToTableItem,
      ))

    next()
  } catch (error) {
    next(error)
  }
}

function setRequestBody (req, res, next) {
  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null
  const selectedFiltersQuery = pick(req.query, [
    'status',
    'company_name',
    'contact_name',
    'primary_market',
    'reference',
    'total_cost',
    'net_cost',
  ])

  req.body = assign({}, req.body, selectedSortBy, pickBy(selectedFiltersQuery))

  const currencyFields = ['total_cost', 'net_cost']
  currencyFields.forEach((field) => {
    if (req.body[field]) {
      req.body[field] = parseFloat(req.query[field]) * 100
    }
  })

  next()
}

function setReconciliationJourney (req, res, next) {
  res.locals.reconciliationJourney = true
  next()
}

module.exports = {
  setResults,
  setRequestBody,
  setReconciliationJourney,
}
