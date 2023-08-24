import React from "react";
import { Field, ErrorMessage, useField } from "formik";

const FormField = ({ label, ...fieldProp }) => {
  let optionsArr = [`-- Select a ${fieldProp.name} --`];
  if (fieldProp.options) {
    fieldProp.options.forEach((element) => {
      optionsArr.push(element);
    });
  }

  const [field, meta] = useField(fieldProp);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldProp.name} className="text-teal-900 font-medium">
        {label}
      </label>

      <Field
        {...fieldProp}
        className={
          meta.error && meta.touched
            ? "rounded-md py-1 px-1 border-2 border-red-700 "
            : "rounded-md py-1 px-1 border-2 border-teal-900"
        }
      >
        {fieldProp.options &&
          optionsArr.map((option, i) => {
            return (
              <option key={option} value={i === 0 ? "" : option}>
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
