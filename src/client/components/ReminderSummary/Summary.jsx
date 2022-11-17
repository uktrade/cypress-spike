import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { kebabCase } from 'lodash'

import { LINK_COLOUR } from 'govuk-colours'
import { H5 } from '@govuk-react/heading'
import { FONT_SIZE, SPACING, FONT_WEIGHTS } from '@govuk-react/constants'

import urls from '../../../lib/urls'

const StyledSubHeading = styled(H5)`
  font-size: ${FONT_SIZE.SIZE_10};
  font-weight: ${FONT_WEIGHTS.bold};
  margin-top: ${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
`

const StyledReminderLink = styled('a')`
  display: inline;
  font-size: ${FONT_SIZE.SIZE_16};
  color: ${LINK_COLOUR};
`

const StyledList = styled('ul')`
  list-style-type: disc;
  padding: 0 0;
  margin: ${SPACING.SCALE_5} ${SPACING.SCALE_5};
`

const StyledListItem = styled('li')(() => ({
  margin: `${SPACING.SCALE_2} 0`,
}))

const Summary = ({ summary }) => (
  <>
    <StyledSubHeading data-test="investment-heading">
      Investment
    </StyledSubHeading>
    <StyledList>
      {summary &&
        summary.investment.map((reminder) => (
          <StyledListItem
            key={reminder.name}
            data-test={`investment-${kebabCase(reminder.name)}`}
          >
            <StyledReminderLink href={reminder.url}>
              {reminder.name}
            </StyledReminderLink>
            &nbsp;({reminder.count})
          </StyledListItem>
        ))}
    </StyledList>
    <StyledSubHeading data-test="export-heading">Export</StyledSubHeading>
    <StyledList>
      {summary &&
        summary.export.map((reminder) => (
          <StyledListItem
            key={reminder.name}
            data-test={`export-${kebabCase(reminder.name)}`}
          >
            <StyledReminderLink href={reminder.url}>
              {reminder.name}
            </StyledReminderLink>
            &nbsp;({reminder.count})
          </StyledListItem>
        ))}
    </StyledList>
    <StyledReminderLink href={urls.reminders.settings.index()}>
      Reminders and email notifications settings
    </StyledReminderLink>
  </>
)

const reminderType = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })
)

Summary.propTypes = {
  count: PropTypes.number,
  investment: reminderType,
  export: reminderType,
}

export default Summary
