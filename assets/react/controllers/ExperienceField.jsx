import React from 'react'
import { Field } from "formik";

const ExperienceField = ({ name }) => {
  return (
    <div className='flex flex-row gap-1 justify-between w-10/12'>
      <Field
          type="text"
          name={`${name}.position`}
          placeholder='Poste'
          className="w-2/5 rounded-sm py-0.5 px-1 border-2 border-teal-900"
      >
      </Field>
      <Field
          type="text"
          name={`${name}.employer`}
          placeholder='Employeur'
          className="w-2/5 rounded-sm py-0.5 px-1 border-2 border-teal-900"
      >
      </Field>
      <Field
          type="date"
          name={`${name}.dateStarted`}
          className="w-1/5 rounded-sm py-0.5 px-1 border-2 border-teal-900"
      >
      </Field>
      <Field
          type="date"
          name={`${name}.dateCompleted`}
          className="w-1/5 rounded-sm py-0.5 px-1 border-2 border-teal-900"
      >
      </Field>
    </div>
  )
}

export default ExperienceField