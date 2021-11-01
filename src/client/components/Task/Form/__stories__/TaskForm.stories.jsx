/* eslint-disable prettier/prettier */
import React from 'react'
import { storiesOf } from '@storybook/react'

import TaskForm from '..'
import FieldInput from '../../../Form/elements/FieldInput'
import FieldSelect from '../../../Form/elements/FieldSelect'
import FieldRadios from '../../../Form/elements/FieldRadios'

import rejectInitialValuesReadme from './reject-initial-values.md'
import basicExampleReadme from './basic-example.md'

storiesOf('Task/Form', module)
  .add('Basics', () => (
    <TaskForm
      id="task-form-example-resolve-initial-values"
      submissionTaskName="Submit TaskForm example"
      initialValuesTaskName="Load initial values"
      initialValuesPayload="resolve"
      transformInitialValues={initialValues => ({...initialValues, reject: 'yes'})}
      analyticsFormName="task-form-example"
      redirectTo={(submissionTaskResult, formValues) => '#' + JSON.stringify({submissionTaskResult, formValues})}
      // eslint-disable-next-line no-unused-vars
      flashMessage={(submissionTaskResult, formValues) => 'Form was submitted successfully'}
    >
      <FieldInput
        name="foo"
        type="text"
        label="Foo"
        hint='Initial value shold be "Blah Blah"'
      />
      <FieldSelect name="bar" label="Bar"  hint='Initial value shold be "B".' options={[
        {label: 'A', value: 'a'},
        {label: 'B', value: 'b'},
        {label: 'C', value: 'c'},
      ]}/>
      <FieldRadios
        name="reject"
        label="Reject"
        hint="Should the submission task reject?"
        options={[
          {label: 'Yes', value: 'yes'},
          {label: 'No', value: 'no'},
        ]}
      />
      <p>
        This example redirects to the same path with the result of the submission
        task together with the submitted form values JSON serialized in the
        URL fragment.
      </p>
      <p>
        Note that the expected result of a resolved submission is a hard
        redirection, which can only be seen in Storybook when the canvas
        is open in it's own tab.
      </p>
      <p>
        The form stays in the progress state until the next page is loaded
      </p>
    </TaskForm>
  ), {
    readme: {
      sidebar: basicExampleReadme,
    },
  })
  .add('Rejected initial values', () => (
    <TaskForm
      id="task-form-example-reject-initial-values"
      submissionTaskName="Submit TaskForm example"
      initialValuesTaskName="Load initial values"
      initialValuesPayload="reject"
      analyticsFormName="task-form-example"
      redirectTo={(submissionTaskResult, formValues) => '#' + JSON.stringify({submissionTaskResult, formValues})}
      // eslint-disable-next-line no-unused-vars
      flashMessage={(submissionTaskResult, formValues) => 'Form was submitted successfully'}
    >
      <FieldInput name="foo" type="text" label="Foo"/>
      <FieldSelect name="bar" label="Bar" options={[
        {label: 'A', value: 'a'},
        {label: 'B', value: 'b'},
        {label: 'C', value: 'c'},
      ]}/>
    </TaskForm>
  ), {
    readme: {
      sidebar: rejectInitialValuesReadme,
    },
  })

