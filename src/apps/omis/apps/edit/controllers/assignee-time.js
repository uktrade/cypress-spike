const { filter, flatten, get, pick } = require('lodash')

const { EditController } = require('../../../controllers')
const { Order } = require('../../../models')

class EditAssigneeHoursController extends EditController {
  async configure (req, res, next) {
    const orderId = get(res.locals, 'order.id')
    const token = get(req.session, 'token')
    const assignees = await Order.getAssignees(token, orderId)

    if (!assignees.length) {
      req.form.options.hidePrimaryFormAction = true
    }

    res.locals.assignees = assignees

    super.configure(req, res, next)
  }

  async successHandler (req, res, next) {
    const data = pick(req.sessionModel.toJSON(), Object.keys(req.form.options.fields))
    const timeValues = flatten([data.assignee_time])
    const assignees = timeValues.map((value, index) => {
      if (!value) { return }

      const [ hours, minutes ] = value.split(':')

      return {
        adviser: {
          id: res.locals.assignees[index].adviser.id,
        },
        estimated_time: parseInt((hours * 60)) + parseInt(minutes),
      }
    })

    try {
      await Order.saveAssignees(req.session.token, res.locals.order.id, filter(assignees))
      const nextUrl = req.form.options.next || `/omis/${res.locals.order.id}`

      req.journeyModel.reset()
      req.journeyModel.destroy()
      req.sessionModel.reset()
      req.sessionModel.destroy()

      req.flash('success', 'Order updated')
      res.redirect(nextUrl)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = EditAssigneeHoursController
