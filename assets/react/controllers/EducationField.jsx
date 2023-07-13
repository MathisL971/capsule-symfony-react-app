import React from 'react'
import { Field } from "formik";

const EducationField = ({ name }) => {
  return (
    <div className='flex flex-row gap-1 justify-between w-10/12'>
        <Field
            type="text"
            name={`${name}.diploma`}
            placeholder='Diplome ou titre obtenu'
            className="w-2/5 rounded-sm py-0.5 px-1 border-2 border-teal-900"
        >
        </Field>
        <Field
            type="text"
            name={`${name}.institution`}
            placeholder='Ecole ou organisme certificateur'
            className="w-2/5 rounded-sm py-0.5 px-1 border-2 border-teal-900"
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

export default EducationField