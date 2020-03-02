var fullExportHistoryPage1 = require('../../../fixtures/v4/export/full-export-history-page-1.json')
var emptyFullExportHistory = require('../../../fixtures/v4/export/empty-full-export-history.json')
var unkownUserExportHistory = require('../../../fixtures/v4/export/unkown-user-export-history.json')
var updateOnlyExportHistory = require('../../../fixtures/v4/export/update-only-export-history.json')
var countryExportHistory = require('../../../fixtures/v4/export/country-export-history.json')
var exportHistoryWithInteractions = require('../../../fixtures/v4/export/history-with-interactions.json')

var dnbCorp = require('../../../fixtures/v4/company/company-dnb-corp.json')
var marsExportsLtd = require('../../../fixtures/v4/company/company-mars-exports-ltd.json')
var dnbSubsidiary = require('../../../fixtures/v4/company/company-dnb-subsidiary.json')
var investigationLtd = require('../../../fixtures/v4/company/company-investigation-ltd.json')

exports.fetchExportHistory = function(req, res) {
  var companyId = req.body.company

  if (req.body.country === '975f66a0-5d95-e211-a939-e4115bead28a') {
    return res.json(countryExportHistory)
  }

  if (companyId === dnbCorp.id) {
    return res.json(fullExportHistoryPage1)
  }
  if (companyId === marsExportsLtd.id) {
    return res.json(unkownUserExportHistory)
  }
  if (companyId === dnbSubsidiary.id) {
    return res.json(updateOnlyExportHistory)
  }
  if (companyId === investigationLtd.id) {
    return res.json(exportHistoryWithInteractions)
  }

  return res.json(emptyFullExportHistory)
}
