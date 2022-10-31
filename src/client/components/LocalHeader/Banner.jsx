import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { state2props } from './state'

import PropTypes from 'prop-types'

import styled from 'styled-components'
import { WHITE } from 'govuk-colours'

import {
  BANNER_DISMISSED__WRITE_TO_LOCALSTORAGE,
  BANNER_DISMISSED__READ_FROM_LOCALSTORAGE,
} from '../../actions'

const MEDIUMBLUE = '#003399'

const StyledBody = styled('div')`
  background-color: ${MEDIUMBLUE};
  color: ${WHITE};
  height: 20%;
`

const StyledDiv = styled('div')`
  margin-left: 20%;
  position: relative;
  padding-top: 0.2%;
`

const StyledTextLink = styled('a')`
  position: relative;
  color: ${WHITE};
  margin-left: 5px;
  &:visited,
  &:hover,
  &:active {
    color: ${WHITE};
  }
`

const StyledDismissTextLink = styled('button')`
  position: relative;
  color: ${WHITE};
  margin-left: 3%;
  background: none;
  border: none;
  padding: 0;
  font-family: arial, sans-serif;
  text-decoration: underline;
  cursor: pointer;
`

const Banner = ({
  items,
  writeToLocalStorage,
  readFromLocalStorage,
  bannerHeading,
}) => {
  useEffect(() => {
    readFromLocalStorage()
  }, [])
  const [showDismissButton, setShowDismissButton] = useState(true)

  const updateLocalStorage = () => {
    setShowDismissButton(false)
    writeToLocalStorage(items[0].heading)
  }

  if (items.length > 0 && bannerHeading == items[0].heading) {
    return null
  }

  return items.length > 0 && showDismissButton ? (
    <StyledBody>
      <StyledDiv>
        Update:
        <StyledTextLink href={items[0].link}>{items[0].heading}</StyledTextLink>
        <StyledDismissTextLink onClick={updateLocalStorage}>
          Dismiss
        </StyledDismissTextLink>
      </StyledDiv>
    </StyledBody>
  ) : null
}

Banner.propTypes = {
  bannerHeading: PropTypes.string,
  writeToLocalStorage: PropTypes.func,
  readFromLocalStorage: PropTypes.func,
}

export default connect(state2props, (dispatch) => ({
  writeToLocalStorage: (bannerHeading) => {
    dispatch({
      type: BANNER_DISMISSED__WRITE_TO_LOCALSTORAGE,
      bannerHeading,
    })
  },
  readFromLocalStorage: () => {
    dispatch({
      type: BANNER_DISMISSED__READ_FROM_LOCALSTORAGE,
    })
  },
}))(Banner)
