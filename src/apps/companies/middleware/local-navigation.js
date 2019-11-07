/* eslint-disable camelcase */
const { setLocalNav } = require('../../middleware')
const { isItaTierDAccount } = require('../../../lib/is-tier-type-company')
const { LOCAL_NAV } = require('../constants')

function setCompaniesLocalNav (req, res, next) {
  const { company, features } = res.locals
  if (features.lead_advisers) {
    const isCoreTeamCompany = !isItaTierDAccount(company) && company.one_list_group_tier
    const navItems = LOCAL_NAV.map((item) =>
      item.path === 'advisers' && isCoreTeamCompany
        ? { ...item, label: 'Core team' }
        : item
    )
    setLocalNav(navItems)(req, res, next)
  } else {
    const navItems = LOCAL_NAV.map((item) =>
      item.path === 'advisers'
        ? { ...item, label: 'Core team' }
        : item
    ).filter((item) => item.path !== 'advisers' || company.one_list_group_tier)
    setLocalNav(navItems)(req, res, next)
  }
}

module.exports = setCompaniesLocalNav
