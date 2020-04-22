import React from 'react'
import HintText from '@govuk-react/hint-text'
import { SelectInput } from '@govuk-react/select'
import { SPACING } from '@govuk-react/constants'
import pluralize from 'pluralize'
import styled from 'styled-components'

import ContentWithHeading from '../ContentWithHeading'
import Task from '../Task'
import Referral from './Referral'
import {
  REFFERAL_LIST__LOADED,
  REFFERAL_LIST__FILTER_CHANGE,
} from '../../actions'
import multiInstance from '../../utils/multiinstance'
import { SENT, RECEIVED } from './constants'
import reducer from './reducer'

const StyledOl = styled.ol({
  listStyleType: 'none',
  '& > *': {
    marginTop: SPACING.SCALE_4,
  },
})

const StyledLabel = styled.label({
  display: 'flex',
  alignItems: 'baseline',
})

const StyledSelectInput = styled(SelectInput)({
  marginLeft: 10,
  // We need to increase specificity with & to override the 50% width
  '&': {
    width: 'initial',
  },
})

export default multiInstance({
  name: 'ReferralList',
  reducer,
  dispatchToProps: (dispatch) => ({
    onFilterChange: (filter) =>
      dispatch({
        type: REFFERAL_LIST__FILTER_CHANGE,
        filter,
      }),
  }),
  component: ({ id, referrals, onFilterChange, filter }) => (
    <Task.Status
      name="Referrals"
      id={id}
      progressMessage="Loading referrals"
      startOnRender={{
        onSuccessDispatch: REFFERAL_LIST__LOADED,
      }}
    >
      {() => {
        if (referrals) {
          const filteredReferrals = referrals.filter(
            ({ direction }) => direction === filter
          )
          return (
            <ContentWithHeading
              heading={pluralize(
                `${filter} referral`,
                filteredReferrals.length,
                true
              )}
              headingActions={
                <StyledLabel>
                  View
                  <StyledSelectInput
                    value={filter}
                    onChange={(e) => onFilterChange(e.target.value)}
                  >
                    <option value={RECEIVED}>Received referrals</option>
                    <option value={SENT}>Sent referrals</option>
                  </StyledSelectInput>
                </StyledLabel>
              }
            >
              {referrals.length ? (
                <StyledOl>
                  {filteredReferrals.map(({ id, ...referral }) => (
                    <li key={id}>
                      <Referral id={id} {...referral} />
                    </li>
                  ))}
                </StyledOl>
              ) : (
                <HintText>
                  You have not received or sent any referrals.
                  <br />
                  You can refer companies to other advisers from a company page.
                </HintText>
              )}
            </ContentWithHeading>
          )
        }
      }}
    </Task.Status>
  ),
})
