import { apiProxyAxios } from '../../../../../client/components/Task/utils'
import { transformAdvisersForAPI } from './transformers'

export const getAssignees = (id) =>
  apiProxyAxios.get(`/v3/omis/order/${id}/assignee`)

export function saveOrderAssignees({ values, id, canRemoveAssignees }) {
  const url = canRemoveAssignees
    ? `/v3/omis/order/${id}/assignee?force-delete=1`
    : `/v3/omis/order/${id}/assignee`
  return apiProxyAxios.patch(url, transformAdvisersForAPI(values))
}
