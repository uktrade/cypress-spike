const router = require('express').Router()

const { LOCAL_NAV, DEFAULT_COLLECTION_QUERY, APP_PERMISSIONS } = require('./constants')
const {
  renderAddStepOne,
  postAddStepOne,
  renderAddStepTwo,
} = require('./controllers/add')

const { renderCompanyList } = require('./controllers/list')
const { renderForm } = require('./controllers/edit')
const { renderDetails } = require('./controllers/details')
const { renderInvestments } = require('./controllers/investments')
const { renderOrders } = require('./controllers/orders')
const { renderAuditLog } = require('./controllers/audit')
const { renderInteractions } = require('./controllers/interactions')
const { archiveCompany, unarchiveCompany } = require('./controllers/archive')
const { renderContacts } = require('./controllers/contacts')
const { renderDocuments } = require('./controllers/documents')
const { renderAddGlobalHQ } = require('./controllers/hierarchies')
const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
} = require('./controllers/exports')
const { renderAccountManagementEditPage } = require('./controllers/account-management')

const { setDefaultQuery, setLocalNav, redirectToFirstNavItem, handleRoutePermissions } = require('../middleware')
const {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
} = require('../interactions/middleware/collection')

const {
  getRequestBody,
  getCompanyCollection,
  getLimitedCompaniesCollection,
  getGlobalHQCompaniesCollection,
} = require('./middleware/collection')
const { setCompanyContactRequestBody, getCompanyContactCollection } = require('./middleware/contact-collection')
const { populateForm, handleFormPost, setIsEditMode } = require('./middleware/form')
const { getCompany, getCompaniesHouseRecord } = require('./middleware/params')
const { setInteractionsReturnUrl, setInteractionsEntityName } = require('./middleware/interactions')
const { populateAccountManagementForm, postAccountManagementDetails } = require('./middleware/account-management')

const interactionsRouter = require('../interactions/router.sub-app')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('companyId', getCompany)
router.param('companyNumber', getCompaniesHouseRecord)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getRequestBody, getCompanyCollection, renderCompanyList)

router
  .route('/add-step-1')
  .get(renderAddStepOne)
  .post(postAddStepOne, renderAddStepOne)

router.get('/add-step-2', getLimitedCompaniesCollection, renderAddStepTwo)

router
  .route('/:companyId/exports/edit')
  .get(populateExportForm, renderExportEdit)
  .post(populateExportForm, handleEditFormPost, renderExportEdit)

router
  .route([
    '/add',
    '/add/:companyNumber',
  ])
  .get(populateForm, renderForm)
  .post(handleFormPost, populateForm, renderForm)

router
  .route('/:companyId/edit')
  .get(setIsEditMode, populateForm, renderForm)
  .post(handleFormPost, setIsEditMode, populateForm, renderForm)

router
  .route('/:companyId/account-management/edit')
  .get(populateAccountManagementForm, renderAccountManagementEditPage)
  .post(populateAccountManagementForm, postAccountManagementDetails, renderAccountManagementEditPage)

router.post('/:companyId/archive', archiveCompany)
router.get('/:companyId/unarchive', unarchiveCompany)

router.use('/:companyId', handleRoutePermissions(LOCAL_NAV), setLocalNav(LOCAL_NAV))

router.get('/:companyId', redirectToFirstNavItem)
router.get('/:companyId/details', renderDetails)

router.get('/:companyId/hierarchies/ghq/search', getGlobalHQCompaniesCollection, renderAddGlobalHQ)
router.get('/:companyId/contacts',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  setCompanyContactRequestBody,
  getCompanyContactCollection,
  renderContacts
)

router.get('/:companyId/interactions',
  setInteractionsReturnUrl,
  getInteractionsRequestBody,
  getInteractionCollection,
  getInteractionSortForm,
  renderInteractions
)
router.get('/:companyId/exports', renderExports)
router.get('/:companyId/investments', renderInvestments)
router.get('/:companyId/orders', renderOrders)
router.get('/:companyId/audit', renderAuditLog)
router.get('/:companyId/documents', renderDocuments)

router.use('/:companyId', setInteractionsReturnUrl, setInteractionsEntityName, interactionsRouter)

module.exports = router
