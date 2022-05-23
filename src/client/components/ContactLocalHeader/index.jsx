import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Button from '@govuk-react/button'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import Link from '@govuk-react/link'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'
import PropTypes from 'prop-types'

import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'
import LocalHeaderHeading from '../../../client/components/LocalHeader/LocalHeaderHeading'
import { Badge, Main, StatusMessage } from '..'
import urls from '../../../lib/urls'
import { format } from '../../../client/utils/date'

const dispatchToProps = (dispatch) => ({
  writeFlashMessage: (message) =>
    dispatch({
      type: 'FLASH_MESSAGE__WRITE_TO_SESSION',
      messageType: 'success',
      message,
    }),
})

const StyledLink = styled(Link)({
  fontSize: FONT_SIZE.SIZE_20,
})

const StyledLocalHeaderHeading = styled(LocalHeaderHeading)({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: SPACING.SCALE_2,
  marginTop: SPACING.SCALE_1,
})

const StyledMain = styled(Main)`
  padding-top: ${SPACING.SCALE_1};
  div {
    font-size: ${FONT_SIZE.SIZE_20};
  }
`

const path = location.pathname
const getCurrentTab = (currentPath) =>
  currentPath.includes('/interactions')
    ? 'Activity'
    : currentPath.includes('/audit')
    ? 'Audit history'
    : currentPath.includes('/documents')
    ? 'Documents'
    : null

const currentTab = getCurrentTab(path)

const buildBreadcrumbs = (currentTab, id, name) => {
  const initalBreadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    { link: urls.contacts.index(), text: 'Contacts' },
  ]
  const dynamicBreadcrumbs = currentTab
    ? [
        {
          link: urls.contacts.contact(id),
          text: name,
        },
        { text: currentTab },
      ]
    : [{ text: name }]
  return initalBreadcrumbs.concat(dynamicBreadcrumbs)
}

const ContactLocalHeader = ({
  contact,
  isContactActivitiesFeatureOn,
  writeFlashMessage,
}) => {
  return (
    <>
      <LocalHeader
        breadcrumbs={buildBreadcrumbs(currentTab, contact.id, contact.name)}
      >
        <GridRow>
          <GridCol>
            <StyledLink
              data-test="company-link"
              href={urls.companies.details(contact.company.id)}
            >
              {contact.company.name}
            </StyledLink>
            <StyledLocalHeaderHeading data-test="contact-name">
              {contact.name}
              {contact.primary && (
                <Badge
                  data-test="primary-badge"
                  borderColour="purple"
                  textColour="purple"
                  fontSize={FONT_SIZE.SIZE_24}
                >
                  Primary
                </Badge>
              )}
            </StyledLocalHeaderHeading>
          </GridCol>
          {isContactActivitiesFeatureOn && !contact.archived && (
            <GridCol setWidth="one-quarter">
              <Button
                data-test="add-interaction-button"
                as={Link}
                href={urls.companies.interactions.create(contact.company.id)}
              >
                Add interaction
              </Button>
            </GridCol>
          )}
        </GridRow>
        {contact.archived && (
          <StyledMain>
            <StatusMessage data-test="contact-archived-message">
              {contact.archived_on
                ? `This contact was archived on ${format(
                    contact.archived_on
                  )} by ${contact.archived_by.first_name} ${
                    contact.archived_by.last_name
                  }.`
                : `This contact was automatically archived on ${format(
                    contact.archived_on
                  )}.`}
              <br />
              <strong>Reason:</strong> {contact.archived_reason}
              <br />
              <br />
              <Link
                data-test="unarchive-link"
                onClick={() => {
                  writeFlashMessage('Contact record updated')
                }}
                href={urls.contacts.unarchive(contact.id)}
              >
                Unarchive
              </Link>
            </StatusMessage>
          </StyledMain>
        )}
      </LocalHeader>
    </>
  )
}

ContactLocalHeader.propTypes = {
  contactId: PropTypes.string.isRequired,
  isContactActivitiesFeatureOn: PropTypes.bool.isRequired,
  writeFlashMessage: PropTypes.func,
}

export default connect(null, dispatchToProps)(ContactLocalHeader)
