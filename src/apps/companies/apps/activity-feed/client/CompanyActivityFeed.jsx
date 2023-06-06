import React from 'react'
import PropTypes from 'prop-types'

import {
  ActivityFeedApp,
  ActivityFeedAction,
} from '../../../../../client/components'
import { companies } from '../../../../../lib/urls'

const CompanyActivityFeed = ({
  company,
  activityTypeFilter,
  isGlobalUltimate,
  dnbHierarchyCount,
  apiEndpoint,
}) => {
  const actions = (
    <>
      <ActivityFeedAction
        text="Refer this company"
        link={companies.referrals.send(company.id)}
      />
      <ActivityFeedAction
        text="Add interaction"
        link={companies.interactions.create(company.id)}
      />
    </>
  )

  return (
    <>
      <ActivityFeedApp
        actions={!company.archived && actions}
        activityTypeFilter={activityTypeFilter}
        isGlobalUltimate={isGlobalUltimate}
        dnbHierarchyCount={dnbHierarchyCount}
        apiEndpoint={apiEndpoint}
        companyIsArchived={company.archived}
      />
    </>
  )
}

CompanyActivityFeed.propTypes = {
  companyId: PropTypes.string,
  actions: PropTypes.node,
  activityTypeFilter: [PropTypes.string],
  apiEndpoint: PropTypes.string.isRequired,
  isGlobalUltimate: PropTypes.bool,
  dnbHierarchyCount: PropTypes.number,
}

CompanyActivityFeed.defaultProps = {
  companyId: null,
  activityTypeFilter: [],
  actions: null,
  isGlobalUltimate: false,
  dnbHierarchyCount: null,
}

export default CompanyActivityFeed
