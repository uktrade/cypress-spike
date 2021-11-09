import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { isEmpty } from 'lodash'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import * as ReactRouter from 'react-router-dom'

import multiInstance from '../../../utils/multiinstance'
import { ErrorSummary } from '../..'
import Task from '..'
import TaskLoadingBox from '../LoadingBox'
import Resource from '../../Resource'
import Wrap from '../../Wrap'
import Analytics from '../../Analytics'

import reducer from './reducer'
import FormActions from '../../Form/elements/FormActions'
import { FormContextProvider } from '../../Form/hooks'

import { validateForm } from '../../Form/MultiInstanceForm'
import Effect from '../../Effect'
import { addMessage, addMessageWithBody } from '../../../utils/flash-messages'

const _TaskForm = ({
  // Required
  submissionTaskName,
  id,
  analyticsFormName,
  // Optional
  initialValuesTaskName,
  initialValuesPayload,
  redirectTo,
  flashMessage,
  children,
  initialValues,
  // TODO: Allow for react router redirection
  reactRouterRedirect,
  transformInitialValues = (x) => x,
  transformPayload = (x) => x,
  onSuccess,
  submitButtonLabel = 'Save',
  actionLinks = [],
  // State props
  onLoad,
  result,
  resolved,
  errors = {},
  values = {},
  touched = {},
  steps = [],
  ...props
}) => {
  useEffect(() => {
    onLoad(initialValues)
  }, [])

  // TODO: Clean up this mess
  const contextProps = {
    ...props,
    errors,
    values,
    touched,
    steps,
    getStepIndex: (stepName) => {
      const index = steps?.indexOf(stepName)
      return index !== -1 ? index : null
    },
    // FIXME: These don't need to be functions
    isFirstStep: () => props?.currentStep === 0,
    isLastStep: () => !steps.length || props?.currentStep === steps?.length - 1,
    getFieldState: (fieldName, initialValue) => ({
      value: values[fieldName] ?? initialValue,
      touched: touched[fieldName] ?? false,
      error: errors[fieldName],
    }),
  }

  const ref = useRef()

  return (
    <Wrap
      with={Resource}
      when={initialValuesTaskName}
      props={{
        id,
        name: initialValuesTaskName,
        progressBox: true,
        payload: initialValuesPayload,
        taskStatusProps: { dismissable: false },
      }}
    >
      {(initialValues) => (
        <Analytics>
          {(pushAnalytics) => {
            const analytics = (action, extra) =>
              pushAnalytics(
                'Form interaction',
                action,
                analyticsFormName,
                extra
              )
            return (
              <>
                <Effect
                  dependencyList={[initialValues]}
                  effect={() =>
                    initialValues &&
                    onLoad(transformInitialValues(initialValues))
                  }
                />
                <FormContextProvider
                  {...contextProps}
                  // FIXME: This needs to be called also when the initial values load
                  //        so we need to use the Effect component somewhere above
                  registerField={props.registerField(initialValues)}
                  // Required by the FieldDnbCompany
                  // eslint-disable-next-line no-unused-vars
                  setIsLoading={(isLoading) => {
                    // TODO: Is the isLoading actually needed in state?
                  }}
                  goBack={() => {
                    props.goBack()
                    analytics('previous step', {
                      currentStep: props.currentStep,
                    })
                  }}
                  validateForm={(fieldNamesToValidate) => {
                    // This method is supposed to validate only the fields whose names
                    // are listed in fieldNamesToValidate,
                    // or all fields if fieldNamesToValidate is empty, and
                    // set the form state so, that it renders the errors.
                    const { errors, touched } = validateForm({
                      ...contextProps,
                      fields: fieldNamesToValidate?.length
                        ? _.pick(contextProps.fields, fieldNamesToValidate)
                        : contextProps.fields,
                    })
                    props.onValidate(errors, touched)

                    // We also must return a map of field names to errors
                    return errors
                  }}
                >
                  <Task>
                    {(t) => {
                      const submissionTask = t(submissionTaskName, id)
                      return (
                        <TaskLoadingBox
                          name={submissionTaskName}
                          id={id}
                          // TODO: We only want to keep the spinner kept around with hard redirects
                          // The value shold be falsy for React Router redirection
                          when={resolved}
                        >
                          <form
                            noValidate={true}
                            onSubmit={(e) => {
                              e.preventDefault()
                              const { errors, touched } =
                                validateForm(contextProps)
                              props.onValidate(errors, touched)

                              if (isEmpty(errors)) {
                                if (contextProps.isLastStep()) {
                                  submissionTask.start({
                                    payload: transformPayload(values),
                                    onSuccessDispatch: 'TASK_FORM__RESOLVED',
                                  })

                                  analytics('Submit')
                                } else {
                                  props.goForward()
                                  analytics('Next step', {
                                    currentStep: props.currentStep,
                                  })
                                }
                              } else {
                                requestAnimationFrame(() =>
                                  ref.current?.focus()
                                )
                                analytics('Validation errors', { errors })
                              }
                            }}
                          >
                            <Route>
                              {({ history }) => (
                                <Effect
                                  dependencyList={[
                                    submissionTaskName,
                                    id,
                                    resolved,
                                  ]}
                                  effect={() => {
                                    if (resolved) {
                                      analytics('Submission request success')
                                      const message = flashMessage(
                                        result,
                                        values
                                      )
                                      onSuccess(result, values)
                                      Array.isArray(message)
                                        ? addMessageWithBody(
                                            'success',
                                            ...message
                                          )
                                        : addMessage('success', message)
                                      history.push(redirectTo(result, values))
                                    }
                                  }}
                                />
                              )}
                            </Route>
                            <Effect
                              dependencyList={[initialValues]}
                              effect={() =>
                                initialValues &&
                                onLoad(transformInitialValues(initialValues))
                              }
                            />
                            <Effect
                              dependencyList={[submissionTask.error]}
                              effect={() => {
                                submissionTask.error &&
                                  analytics('Submission request error', {
                                    error: submissionTask.errorMessage,
                                  })
                              }}
                            />
                            {!isEmpty(errors) && (
                              <ErrorSummary
                                ref={ref}
                                // TODO: Rewrite the tests that rely on this and remove it
                                id="form-errors"
                                errors={Object.entries(errors).map(
                                  ([name, error]) => ({
                                    targetName: name,
                                    text: error,
                                  })
                                )}
                              />
                            )}
                            {typeof children === 'function'
                              ? children(contextProps)
                              : children}
                            {/*
                      We don't want to render the submit button when the form
                      has multiple steps as the steps come with a built-in submit button
                      */}
                            {!steps.length && (
                              <FormActions>
                                <Button>{submitButtonLabel}</Button>
                                {actionLinks.map(({ to, href, children }, i) =>
                                  to ? (
                                    <ReactRouter.Link key={i} to={to}>
                                      {children}
                                    </ReactRouter.Link>
                                  ) : (
                                    <Link key={i} href={href}>
                                      {children}
                                    </Link>
                                  )
                                )}
                              </FormActions>
                            )}
                          </form>
                        </TaskLoadingBox>
                      )
                    }}
                  </Task>
                </FormContextProvider>
              </>
            )
          }}
        </Analytics>
      )}
    </Wrap>
  )
}

// TODO: Clean up this mess
const dispatchToProps = (dispatch) => ({
  onLoad: (initialValues) =>
    dispatch({
      type: 'TASK_FORM__LOADED',
      initialValues,
    }),
  registerField: (initialValues) => (field) =>
    dispatch({
      type: 'TASK_FORM__FIELD_REGISTER',
      field: { initialValue: initialValues?.[field.name], ...field },
    }),
  deregisterField: (fieldName) =>
    dispatch({
      type: 'TASK_FORM__FIELD_DEREGISTER',
      fieldName,
    }),
  setFieldValue: (fieldName, fieldValue) =>
    dispatch({
      type: 'TASK_FORM__FIELD_SET_VALUE',
      fieldName,
      fieldValue,
    }),
  setFieldTouched: (fieldName) =>
    dispatch({
      type: 'TASK_FORM__FIELD_TOUCHED',
      fieldName,
    }),
  onValidate: (errors, touched) =>
    dispatch({
      type: 'TASK_FORM__VALIDATE',
      errors,
      touched,
    }),
  goForward: (values) =>
    dispatch({
      type: 'TASK_FORM__FORWARD',
      values,
    }),
  goBack: () =>
    dispatch({
      type: 'TASK_FORM__BACK',
    }),
  registerStep: (stepName) =>
    dispatch({
      type: 'TASK_FORM__STEP_REGISTER',
      stepName,
    }),
  deregisterStep: (stepName) =>
    dispatch({
      type: 'TASK_FORM__STEP_DEREGISTER',
      stepName,
    }),
})

/**
 * @function TaskForm
 * @description A form component which
 * - Starts a _task_ when the form is submitted
 * - Renders a {ProgressBox} overlay while the _task_ is in progress
 * - Handles the _task_ rejection by delegating it to the underlying {TaskProgressBox}
 * - Hard redirects to a specified path when the _task_ resolves
 * - Can optionally be prepopulated with initial values resolved from a _task_
 * The form has built in
 * - Error summary rendered on top of the form when there are validation errors
 * - Submit button and secondary action links
 * - Success flash message on _task_ resolution
 * - Recording Google Tag Manager events on form submission and task resolution
 * @type {import("./types").TaskForm} TaskForm
 * @typedef { import("./types").Props } Props
 * @param {Props} props - Refer to the ./types.d.ts file for the concrete props
 * @param {string} props.id - A unique instance ID
 * @param {string} props.analyticsFormName - The name of the form that will be
 * used in the Google Analytics event
 * @param {Props['submissionTaskName']} props.submissionTaskName - Name of the
 * task that should be started when the form is submitted. The task will receive
 * the form values as payload.
 * @param {Props['redirectTo']} props.redirectTo - A function which should
 * convert the result of the submission task and the submitted form values into
 * a URL path to which the user should be redirected when the submission task
 * resolves.
 * @param {Props['flashMessage']} props.flashMessage - A function which should
 * convert the result of the submission task and the submitted form values into
 * a flash message text or a tuple of `[heading, body]`, which will be used as
 * a flash message when the submission task resolves.
 * @param {Props['initialValuesTaskName']} [props.initialValuesTaskName] -
 * Name of the task that shoud be used to resolve the initial form field values.
 * @param {any} [props.initialValuesPayload] - An optional payload for the
 * initial values task.
 * @param {Props['transformInitialValues']} [props.transformInitialValues=(x) => x] -
 * An optional function which takes the result of the resolved initial values
 * task and should return a map of field names to their initial values. You can
 * use this mechanism to mix in values comming from elsewhere than the task.
 * @param {Props['transformPayload']} [props.transformPayload=(x) => x] -
 * An optional function which takes the form values map as its only argument and
 * whose return value will be used as the payload of the submission task.
 * @param {Props['actionLinks']} [props.actionLinks] - An optional array of
 * a subset of props of action links rendered to the right of the submit button.
 * @param {Props['children']} [props.children] - The form fields should be
 * passed as children. Note that the form communicates with it's fields
 * through the context it provides to the {useFormContext} hook, which is used
 * directly, but mostly indirectly through the {useField} hook in the various
 * form fields. The context exposes a vast imperative interface of methods which
 * is not documented yet. The form optionally accepts a function as a child,
 * which will be passed the context provided by the form as it's only argument
 * and should return React vdom containing form fields.
 * */
const TaskForm = multiInstance({
  name: 'TaskForm',
  reducer,
  component: _TaskForm,
  dispatchToProps,
  actionPattern: 'TASK_FORM__',
})

TaskForm.propTypes = {
  id: PropTypes.string.isRequired,
  analyticsFormName: PropTypes.string.isRequired,
  submissionTaskName: PropTypes.string.isRequired,
  redirectTo: PropTypes.func.isRequired,
  flashMessage: PropTypes.func.isRequired,
  initialValuesTaskName: PropTypes.string,
  transformInitialValues: PropTypes.func,
  transformPayload: PropTypes.func,
  actionLinks: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.node,
      href: PropTypes.string.isRequired,
    })
  ),
}

export default TaskForm
