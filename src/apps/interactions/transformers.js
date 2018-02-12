/* eslint-disable camelcase */
const { get, assign, isNil, mapKeys, pickBy, camelCase } = require('lodash')
const { format, isValid } = require('date-fns')

const { transformDateObjectToDateString } = require('../transformers')
const config = require('../../../config')
const labels = require('./labels')

const transformEntityLink = (entity, entityPath, noLinkText = null) => {
  return entity ? {
    url: `/${entityPath}/${entity.id}`,
    name: entity.name,
  } : noLinkText
}

const transformDocumentsLink = (archived_documents_url_path) => {
  if (archived_documents_url_path) {
    return {
      url: config.archivedDocumentsBaseUrl + archived_documents_url_path,
      name: 'View files and documents',
      hint: '(will open another website)',
      hintId: 'external-link-label',
    }
  }

  return { name: 'There are no files or documents' }
}

function transformInteractionResponseToForm ({
  id,
  contact,
  dit_team,
  dit_adviser,
  event,
  service,
  service_delivery_status,
  subject,
  notes,
  date,
  company,
  communication_channel,
} = {}) {
  if (!id) return null

  const isValidDate = isValid(new Date(date))

  return {
    id: id,
    contact: get(contact, 'id'),
    dit_team: get(dit_team, 'id'),
    dit_adviser: get(dit_adviser, 'id'),
    is_event: isNil(event) ? 'false' : 'true',
    event: get(event, 'id'),
    service: get(service, 'id'),
    service_delivery_status: get(service_delivery_status, 'id', null),
    subject: subject,
    notes: notes,
    date: {
      day: isValidDate ? format(date, 'DD') : '',
      month: isValidDate ? format(date, 'MM') : '',
      year: isValidDate ? format(date, 'YYYY') : '',
    },
    company: get(company, 'id'),
    communication_channel: get(communication_channel, 'id'),
  }
}

function transformInteractionToListItem ({
  id,
  subject,
  kind,
  contact,
  company,
  date,
  dit_adviser,
  dit_team,
  communication_channel,
}) {
  return {
    id,
    type: 'interaction',
    name: subject || 'No subject',
    meta: [
      {
        label: 'Type',
        type: 'badge',
        value: (kind === 'interaction') ? 'Interaction' : 'Service delivery',
      },
      {
        label: 'Contact',
        value: contact,
      },
      {
        label: 'Date',
        value: date,
        type: 'date',
      },
      {
        label: 'Company',
        value: company,
      },
      {
        label: 'Channel',
        value: communication_channel,
      },
      {
        label: 'Adviser',
        value: dit_adviser,
      },
      {
        label: 'Service provider',
        value: dit_team,
      },
    ],
  }
}

function transformInteractionResponseToViewRecord ({
  company,
  subject,
  notes,
  date,
  dit_adviser,
  service,
  dit_team,
  contact,
  investment_project,
  communication_channel,
  event,
  kind,
  archived_documents_url_path,
}) {
  const defaultEventText = kind === 'service_delivery' ? 'No' : null
  const transformed = {
    company: transformEntityLink(company, 'companies'),
    contact: transformEntityLink(contact, 'contacts'),
    dit_team,
    service,
    subject,
    notes,
    date: {
      type: 'date',
      name: date,
    },
    dit_adviser,
    investment_project: transformEntityLink(investment_project, 'investment-projects'),
    event: transformEntityLink(event, 'events', defaultEventText),
    communication_channel: communication_channel,
    documents: transformDocumentsLink(archived_documents_url_path),
  }

  return pickBy(mapKeys(transformed, (value, key) => {
    return labels[camelCase(kind)][key]
  }))
}

function transformInteractionFormBodyToApiRequest (props) {
  return assign({}, props, {
    date: transformDateObjectToDateString('date')(props),
  })
}

function transformInteractionListItemToHaveUrlPrefix (urlPrefix) {
  return function (item) {
    if (!urlPrefix) return item
    return assign({}, item, { urlPrefix: urlPrefix.charAt(0) === '/' ? urlPrefix.substring(1) : urlPrefix })
  }
}

module.exports = {
  transformInteractionResponseToForm,
  transformInteractionToListItem,
  transformInteractionFormBodyToApiRequest,
  transformInteractionResponseToViewRecord,
  transformInteractionListItemToHaveUrlPrefix,
}
