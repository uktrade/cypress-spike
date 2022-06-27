import { getPageOffset } from '../../utils/pagination'
import { apiProxyAxios } from '../../components/Task/utils'
import { formatDays, transformReminderDaysToForm } from './transformers'
import { settings } from './constants'

const transformAllSubscriptions = ([eld, nri]) => ({
  estimatedLandDate: {
    formattedReminderDays: formatDays(
      eld.data.reminder_days.sort((a, b) => a - b).reverse(),
      'days before the estimated land date'
    ),
    emailRemindersOnOff: eld.data.email_reminders_enabled
      ? settings.ON
      : settings.OFF,
  },
  noRecentInteraction: {
    formattedReminderDays: formatDays(
      nri.data.reminder_days.sort((a, b) => a - b),
      'days after the last interaction'
    ),
    emailRemindersOnOff: nri.data.email_reminders_enabled
      ? settings.ON
      : settings.OFF,
  },
})

export const getAllSubscriptions = () =>
  Promise.all([
    apiProxyAxios.get('/v4/reminder/subscription/estimated-land-date'),
    apiProxyAxios.get(
      '/v4/reminder/subscription/no-recent-investment-interaction'
    ),
  ]).then(transformAllSubscriptions)

export const getEldSubscriptions = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/estimated-land-date')
    .then(({ data }) => ({
      estimatedLandDate: {
        reminderDays: data.reminder_days,
        emailRemindersEnabled: data.email_reminders_enabled,
      },
    }))

export const saveEldSubscriptions = (payload) =>
  apiProxyAxios.patch('/v4/reminder/subscription/estimated-land-date', payload)

export const getNriSubscriptions = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/no-recent-investment-interaction')
    .then(({ data }) => ({
      ...transformReminderDaysToForm(
        [...data.reminder_days].sort((a, b) => a - b)
      ),
      reminder_days: data.reminder_days,
      email_reminders_enabled: data.email_reminders_enabled,
    }))

export const saveNriSubscriptions = (payload) =>
  apiProxyAxios.patch(
    '/v4/reminder/subscription/no-recent-investment-interaction',
    payload
  )

export const getEstimatedLandDateReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/estimated-land-date', {
      params: { sortby, limit, offset: getPageOffset({ page, limit }) },
    })
    .then(({ data }) => data)

export const getNoRecentInteractionReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/no-recent-investment-interaction', {
      params: { sortby, limit, offset: getPageOffset({ page, limit }) },
    })
    .then(({ data }) => data)
