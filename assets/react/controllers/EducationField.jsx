import React from "react";
import { Field, useFormikContext } from "formik";

const EducationField = ({ name, index, handleDelete }) => {
  const { errors, touched } = useFormikContext();

  return (
    <div className="flex flex-col gap-1 justify-between w-full">
      <Field
        type="text"
        name={`${name}.diploma`}
        placeholder="Diplome ou titre obtenu"
        className={
          errors.educations &&
          errors.educations[index] &&
          touched.educations &&
          touched.educations[index] &&
          "diploma" in errors.educations[index] &&
          "diploma" in touched.educations[index]
            ? "rounded-md p-1.5 border-2 border-red-700 h-full"
            : "rounded-md p-1.5 border-2 border-teal-900 h-full"
        }
      ></Field>
      <div className="flex flex-row gap-1">
        <Field
          type="text"
          name={`${name}.institution`}
          placeholder="Ecole ou organisme certificateur"
          className={
            errors.educations &&
            errors.educations[index] &&
            touched.educations &&
            touched.educations[index] &&
            "institution" in errors.educations[index] &&
            "institution" in touched.educations[index]
              ? "flex-grow rounded-md p-1.5 border-2 border-red-700 h-full"
              : "flex-grow rounded-md p-1.5 border-2 border-teal-900 h-full"
          }
        ></Field>
        <Field
          type="date"
          name={`${name}.dateCompleted`}
          className={
            errors.educations &&
            errors.educations[index] &&
            touched.educations &&
            touched.educations[index] &&
            "dateCompleted" in errors.educations[index] &&
            "dateCompleted" in touched.educations[index]
              ? "px-1 rounded-md border-2 border-red-700 h-auto"
              : "px-1 rounded-md border-2 border-teal-900 h-auto"
          }
        ></Field>
        <button
          type="button"
          onClick={() => handleDelete(index)}
          className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1.5 px-4 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EducationField;
