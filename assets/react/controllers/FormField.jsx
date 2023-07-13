import React from "react";

import { Field, ErrorMessage } from "formik";

const FormField = ({ label, ...fieldProp }) => {
  let optionsArr = [`-- Select a ${fieldProp.name} --`];
  if (fieldProp.options) {
    fieldProp.options.forEach((element) => {
      optionsArr.push(element);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldProp.name} className="text-teal-900 font-medium">
        {label}
      </label>
      <Field
        {...fieldProp}
        className="rounded-sm py-0.5 px-1 border-2 border-teal-900"
      >
        {fieldProp.options &&
          optionsArr.map((option) => {
            return (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            );
          })}
      </Field>
      <span className="text-sm text-red-700 font-bold">
        {" "}
        <ErrorMessage name={fieldProp.name} />
      </span>
    </div>
  );
};

export default FormField;
