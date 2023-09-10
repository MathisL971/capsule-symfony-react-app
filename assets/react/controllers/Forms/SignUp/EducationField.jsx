import React from "react";
import { Field, useFormikContext } from "formik";

const EducationField = ({ name, index, handleDelete }) => {
  const { errors, touched } = useFormikContext();
  const educationErrors = errors.educations && errors.educations[index];
  const educationTouched = touched.educations && touched.educations[index];

  return (
    <div className="flex flex-col gap-1 justify-between w-full bg-teal-600 p-2 border-2 border-emerald-900 rounded-md">
      <Field
        type="text"
        name={`${name}.diploma`}
        placeholder="Diplome ou titre obtenu"
        className={
          educationErrors?.diploma && educationTouched?.diploma
            ? "rounded-md p-1.5 border-2 border-red-700 bg-red-100 h-full"
            : "rounded-md p-1.5 border-2 border-teal-900 h-full"
        }
      />
      <div className="flex flex-row gap-1">
        <Field
          type="text"
          name={`${name}.institution`}
          placeholder="Ecole ou organisme certificateur"
          className={
            educationErrors?.institution && educationTouched?.institution
              ? "flex-grow w-2/3 rounded-md p-1.5 border-2 border-red-700 bg-red-100 h-full"
              : "flex-grow w-2/3 rounded-md p-1.5 border-2 border-teal-900 h-full"
          }
        ></Field>
        <Field
          type="date"
          name={`${name}.dateCompleted`}
          className={
            educationErrors?.dateCompleted && educationTouched?.dateCompleted
              ? "px-1 w-1/3 rounded-md border-2 border-red-700 bg-red-100 h-auto"
              : "px-1 w-1/3 rounded-md border-2 border-teal-900 h-auto"
          }
        ></Field>
      </div>
      {index !== 0 && (
        <button
          type="button"
          onClick={() => handleDelete(index)}
          className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1.5 px-4 rounded-md"
        >
          Supprimer
        </button>
      )}
    </div>
  );
};

export default EducationField;
