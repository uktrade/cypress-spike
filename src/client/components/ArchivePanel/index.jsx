import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Main from '@govuk-react/main'
import { SPACING, FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import Link from '@govuk-react/link'

import StatusMessage from '../../../client/components/StatusMessage'

const { format } = require('../../utils/date')

const negativeSpacing = '-' + SPACING.SCALE_4

const StyledMain = styled(Main)`
  padding-top: ${SPACING.SCALE_1};
  div {
    font-size: ${FONT_SIZE.SIZE_20};
  }
`

const StyledMessage = styled('p')`
  font-weight: ${FONT_WEIGHTS.bold};
`

const StyledReason = styled(StyledMessage)`
  margin-top: ${negativeSpacing};
`
/**
 * An extension of `StatusMessage` that is used to denote whether a record has been archived.
 */
const ArchivePanel = ({
  archivedBy = null,
  archivedOn,
  archiveReason,
  unarchiveUrl,
  onClick = null,
  type,
  archiveMessage = 'archived',
}) => {
  return (
    <StyledMain data-test="archive-panel">
      <StatusMessage>
        <StyledMessage data-test="archive-message">
          {archivedBy
            ? `This ${type} was ${archiveMessage} on ${format(archivedOn)} by ${
                archivedBy.first_name || archivedBy.firstName
              } ${archivedBy.last_name || archivedBy.lastName}.`
            : `This ${type} was automatically archived on ${format(
                archivedOn
              )}.`}
        </StyledMessage>
        <StyledReason data-test="archive-reason">{`Reason: ${archiveReason}`}</StyledReason>
        {unarchiveUrl && (
          <Link
            data-test="unarchive-link"
            onClick={onClick}
            href={unarchiveUrl}
          >
            Unarchive
          </Link>
        )}
      </StatusMessage>
    </StyledMain>
  )
}

ArchivePanel.propTypes = {
  /**
   * An object containg the first and last name of the person who archived the record. If this is not defined, the automatic archive text will appear.
   */
  archivedBy: PropTypes.object,
  /**
   * The date the record was archived.
   */
  archivedOn: PropTypes.string.isRequired,
  /**
   * The reason why the record was archived.
   */
  archiveReason: PropTypes.string.isRequired,
  /**
   * The URL to unarchive the record.
   */
  unarchiveUrl: PropTypes.string,
  /**
   * This is used when the unarchive link needs to contain an `onClick` event (such as displaying a flash message).
   */
  onClick: PropTypes.func,
  /**
   * The type of record.
   */
  type: PropTypes.string.isRequired,
}

export default ArchivePanel
