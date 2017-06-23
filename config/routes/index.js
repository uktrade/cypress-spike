const routers = []
const controllers = [
  '../../src/apps/contacts/router',

  '../../src/controllers/api.controller',
  '../../src/controllers/pingdom.controller',
  '../../src/controllers/login.controller',
  '../../src/controllers/support.controller',
  '../../src/controllers/index.controller',
  '../../src/controllers/my-account.controller',
  '../../src/controllers/search.controller',
  '../../src/controllers/interaction.controller',
  '../../src/controllers/interaction-edit.controller',
  '../../src/controllers/service-delivery.controller',
  '../../src/controllers/company-ch.controller',
  '../../src/controllers/company-foreign.controller',
  '../../src/controllers/company-ltd.controller',
  '../../src/controllers/company-ukother.controller',
  '../../src/controllers/company-interaction.controller',
  '../../src/controllers/company-contact.controller',
  '../../src/controllers/company-investments.controller',
  '../../src/controllers/company-export.controller',
  '../../src/controllers/company-add.controller',
  '../../src/controllers/company-archive.controller',
  '../../src/controllers/investment',
]

controllers.forEach((ctrl) => {
  routers.push(require(ctrl).router)
})

module.exports = routers
