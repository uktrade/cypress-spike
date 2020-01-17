import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { TASK__START, TASK__CLEAR } from '../../actions'
import Err from './Error'
import ProgressIndicator from '../ProgressIndicator'
import { useEffect } from 'react'

const mapStateToProps = (state, { name, id }) => {
  const taskState = _.get(state, ['tasks', name, id], {})
  return {
    ...taskState,
    progress: taskState.status === 'progress',
    success: taskState.status === 'success',
    error: taskState.status === 'error',
  }
}

const Task = ({
  children,
  name,
  noun = name,
  progress,
  success,
  error,
  renderError = Err,
  renderProgress = <ProgressIndicator />,
  payload,
  errorMessage,
  redirectToAction,
  clear,
  start,
}) => (
  <>
    {progress && renderProgress}
    {success && (typeof children === 'function' ? children() : children)}
    {error &&
      renderError({
        noun,
        errorMessage,
        clear,
        retry: () => start(payload, redirectToAction),
      })}
  </>
)

const ConnectedTask = connect(
  mapStateToProps,
  (dispatch, { id, name }) => ({
    start: (payload, redirectToAction, clearOnSuccess) =>
      dispatch({
        type: TASK__START,
        payload,
        id,
        name,
        redirectToAction,
        clearOnSuccess,
      }),
    clear: () =>
      dispatch({
        type: TASK__CLEAR,
        name,
        id,
      }),
  })
)(Task)

ConnectedTask.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  noun: PropTypes.string,
  renderError: PropTypes.func,
  renderProgress: PropTypes.element,
  renderBeforeStart: PropTypes.any,
}

ConnectedTask.StartOnRender = connect(
  (state, { name, id }) => _.get(state, ['tasks', name, id], {}),
  (dispatch, { id, name }) => ({
    start: (payload, redirectToAction, clearOnSuccess) =>
      dispatch({
        type: TASK__START,
        payload,
        id,
        name,
        redirectToAction,
        clearOnSuccess,
      }),
  })
)(
  ({
    start,
    name,
    id,
    payload,
    redirectToAction,
    clearOnSuccess,
    unless,
    status,
  }) => {
    useEffect(() => {
      unless || status || start(payload, redirectToAction, clearOnSuccess)
    }, [unless, name, id, payload, redirectToAction, clearOnSuccess])
    return null
  }
)

ConnectedTask.StartOnRender.propTypes = {
  id: PropTypes.string.isRequired,
}

ConnectedTask.Manager = connect(
  (state) => state.tasks,
  (dispatch) => ({
    start: (name, id, redirectToAction, payload, clearOnSuccess) =>
      dispatch({
        type: TASK__START,
        payload,
        id,
        name,
        redirectToAction,
        clearOnSuccess,
      }),
  })
)(({ start, children, ...props }) =>
  children((name, id) => {
    const taskState = _.get(props, [name, id], {})
    return {
      ...taskState,
      progress: taskState.status === 'progress',
      success: taskState.status === 'success',
      error: taskState.status === 'error',
      start: (...args) => start(name, id, ...args),
    }
  })
)

export default ConnectedTask
