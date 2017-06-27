const router = require('express').Router()

const {
  getCommon,
  getServiceDeliveryEdit,
  postServiceDeliveryEdit,
  getServiceDeliveryDetails,
} = require('./controllers')

router.get('/servicedelivery/:serviceDeliveryId/*', getCommon)

router.get('/servicedelivery/:serviceDeliveryId/details', getServiceDeliveryDetails)

router
  .route(['/servicedelivery/:serviceDeliveryId/edit', '/servicedelivery/edit/'])
  .get(getServiceDeliveryEdit)
  .post(postServiceDeliveryEdit)

module.exports = router
