import React, { useRef } from 'react'
import { isEmpty } from 'lodash'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import * as ReactRouter from 'react-router-dom'

import { ErrorSummary } from '..'
import { FormContextProvider } from './hooks'
import Step from './elements/Step'

import multiInstance from '../../utils/multiinstance'
import reducer from './task-form-reducer'

import FormActions from './elements/FormActions'
import Task from '../Task'
import TaskLoadingBox from '../Task/LoadingBox'
import Resource from '../Resource'

import HardRedirect from '../HardRedirect'
import Wrap from '../Wrap'
import FlashMessage from '../FlashMessage'

const validateForm = (state) =>
  Object.values(state.fields)
    .map((field) => ({
      name: field.name,
      error: []
        .concat(field.validate)
        .map((validator) => validator(state.values?.[field.name], field, state))
        .filter(Boolean)[0],
    }))
    .filter(({ error }) => error)
    .reduce(
      (acc, { name, error }) => ({
        errors: {
          ...acc.errors,
          [name]: error,
        },
        touched: {
          ...acc.touched,
          [name]: true,
        },
      }),
      {}
    )

const Form = ({
  name,
  id,
  transformInitialValues = (x) => x,
  transformPayload = (x) => x,
  initialValuesTaskName,
  redirectTo,
  // TODO: Allow for react router redirection
  reactRouterRedirect,
  flashMessage,
  children,
  submissionError,
  submitButtonLabel = 'Save',
  actionLinks = [],
  // State props
  result,
  resolved,
  errors = {},
  values = {},
  touched = {},
  steps = [],
  hardRedirect,
  dispatch,
  ...props
}) => {
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
    isFirstStep: () => props?.currentStep === 0,
    isLastStep: () => !steps.length || props?.currentStep === steps?.length - 1,
    getFieldState: (fieldName) => ({
      value: values[fieldName] ?? '',
      touched: touched[fieldName] ?? false,
      error: errors[fieldName],
    }),
  }

  const ref = useRef()

  return (
    <Wrap
      with={Resource}
      when={initialValuesTaskName}
      props={{ id, name: initialValuesTaskName }}
    >
      {(initialValues = {}) => (
        <FormContextProvider
          {...contextProps}
          registerField={props.registerField(
            transformInitialValues(initialValues)
          )}
        >
          <Task>
            {(t) => (
              <TaskLoadingBox name={name} id={id}>
                <form
                  noValidate={true}
                  onSubmit={(e) => {
                    e.preventDefault()
                    const { errors, touched } = validateForm(contextProps)
                    props.onValidate(errors, touched)

                    if (isEmpty(errors)) {
                      contextProps.isLastStep()
                        ? t(name, id).start({
                            payload: transformPayload(values),
                            onSuccessDispatch: 'TASK_FORM__RESOLVED',
                          })
                        : props.goForward()
                    } else {
                      requestAnimationFrame(() => ref.current?.focus())
                    }
                  }}
                >
                  {(!isEmpty(errors) || submissionError) && (
                    <ErrorSummary
                      ref={ref}
                      id="form-errors"
                      errors={Object.entries(errors).map(([name, error]) => ({
                        targetName: name,
                        text: error,
                      }))}
                    />
                  )}
                  <HardRedirect to={redirectTo(result, values)} when={result} />
                  <FlashMessage
                    type="success"
                    when={result}
                    context={[result, values]}
                    template={(context) => flashMessage(...context)}
                  />
                  {typeof children === 'function'
                    ? children(contextProps)
                    : children}
                  <FormActions>
                    <Button>{submitButtonLabel}</Button>
                    {actionLinks.map(({ reactRouter, ...props }, i) =>
                      reactRouter ? (
                        <ReactRouter.Link {...props} key={i} />
                      ) : (
                        <Link {...props} key={i} />
                      )
                    )}
                  </FormActions>
                </form>
              </TaskLoadingBox>
            )}
          </Task>
        </FormContextProvider>
      )}
    </Wrap>
  )
}

// TODO: Clean up this mess
const dispatchToProps = (dispatch) => ({
  registerField: (initialValues) => (field) =>
    dispatch({
      type: 'TASK_FORM__FIELD_REGISTER',
      field: { ...field, initialValue: initialValues[field.name] },
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

const TaskForm = multiInstance({
  name: 'TaskForm',
  reducer,
  component: Form,
  dispatchToProps,
  actionPattern: 'TASK_FORM__',
})

// TODO: This doesn't seem to be needed
TaskForm.Step = Step

export default TaskForm
