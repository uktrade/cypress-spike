const config = require('../config')
const authorisedRequest = require('../lib/authorised-request')
const { getInflatedDitCompany } = require('../services/company.service')

function getCompanyInvestmentProjects (token, companyId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/project?investor_company_id=${companyId}`)
}

function getInvestmentProjectSummary (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/project`)
}

function getInvestmentValue (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/value`)
}

function getInvestmentRequirements (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/requirements`)
}

function getEquityCompanyDetails (token, equityCompanyId) {
  const promises = [
    getInflatedDitCompany(token, equityCompanyId),
    getCompanyInvestmentProjects(token, equityCompanyId),
  ]

  return Promise.all(promises)
    .then(([equityCompany, equityCompanyInvestments]) => {
      return {
        equityCompany,
        equityCompanyInvestments,
      }
    })
}

function createInvestmentProject (token, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/project`,
    method: 'POST',
    body,
  })
}

function updateInvestmentProject (token, investmentId, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/project`,
    method: 'PATCH',
    body,
  })
}

function getInvestmentProjectAuditLog (token, investmentId) {
  return authorisedRequest(token, `${config.apiRoot}/v3/investment/${investmentId}/audit`)
    .then((data) => {
      return data.results
    })
}

function updateInvestmentValue (token, investmentId, body) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v3/investment/${investmentId}/value`,
    method: 'PATCH',
    body,
  })
}

module.exports = {
  getCompanyInvestmentProjects,
  getInvestmentProjectSummary,
  getInvestmentValue,
  getInvestmentRequirements,
  getEquityCompanyDetails,
  createInvestmentProject,
  updateInvestmentProject,
  updateInvestmentValue,
  getInvestmentProjectAuditLog,
}
