const typeaheadId = '#group-field-dit_participants'
const { EXPORT_INTEREST_STATUS } = require('../../src/apps/constants')

module.exports = {
  form: 'form',
  subject: '#field-subject',
  notes: '#field-notes',
  dateOfInteractionYear: '#field-date_year',
  dateOfInteractionMonth: '#field-date_month',
  dateOfInteractionDay: '#field-date_day',
  contact: '#field-contacts',
  add: '#interaction-details-form button[name=forward]',
  service: '#field-service select',
  serviceDeliveryStatus: '#field-service_delivery_status',
  subService: '.is-active > .c-form-group__inner > #field-subService',
  grantOffered: '#field-grant_amount_offered',
  netReceipt: '#field-net_company_receipt',
  ditAdviserTypeahead: {
    fieldset: typeaheadId,
    placeHolder: `${typeaheadId} .multiselect__input`,
    textInput: `${typeaheadId} .multiselect__tags`,
    selectedOption: `${typeaheadId} .multiselect__single`,
    addAnotherBtn: `${typeaheadId} .js-AddItems__add--typeahead`,
    secondTypeahead: `${typeaheadId} .c-form-group__inner .c-form-group--AddItems:nth-child(2) .multiselect__input`,
    secondTypeaheadRemoveLink: `${typeaheadId} .c-form-group__inner .c-form-group--AddItems:nth-child(2) .js-AddItems__remove`,
  },
  communicationChannel: '#field-communication_channel',
  eventLabel: '#group-field-is_event legend',
  eventYes: '#field-is_event [value=yes]',
  eventNo: '#field-is_event [value=no]',
  event: '#field-event',
  policyFeedbackYes: '#field-was_policy_feedback_provided [value=yes]',
  policyFeedbackNo: '#field-was_policy_feedback_provided [value=no]',
  policyArea: '#field-policy_areas',
  policyFeedbackNotes: '#field-policy_feedback_notes',
  teamSearch: '#dit_team__typeahead .multiselect__single',
  countriesDiscussed: {
    yes: '#field-were_countries_discussed [value=yes]',
    no: '#field-were_countries_discussed [value=no]',
  },
  countries: {
    future: '#field-' + EXPORT_INTEREST_STATUS.FUTURE_INTEREST,
    export: '#field-' + EXPORT_INTEREST_STATUS.EXPORTING_TO,
    noInterest: '#field-' + EXPORT_INTEREST_STATUS.NOT_INTERESTED,
  },
  hasRelatedTradeAgreementsNo: '#field-has_related_trade_agreements [value=no]',
  hasRelatedOpportunityNo: '#field-has_related_opportunity [value=no]',
}
