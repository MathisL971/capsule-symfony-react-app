import React from "react";
import { Field, useFormikContext } from "formik";

const EducationField = ({ name, index, handleDelete }) => {
  const { errors, touched } = useFormikContext();

  return (
    <div className="flex flex-col gap-1 justify-between w-full bg-teal-600 p-2 border-2 border-emerald-900 rounded-md">
      <Field
        type="text"
        name={`${name}.diploma`}
        placeholder="Diplome ou titre obtenu"
        className={
          errors.educations &&
          errors.educations[index] &&
          touched.educations &&
          touched.educations[index] &&
          errors.educations[index].includes("diploma") &&
          touched.educations[index].includes("diploma")
            ? "rounded-md p-1.5 border-2 border-red-700 h-full"
            : "rounded-md p-1.5 border-2 border-teal-900 h-full"
        }
      />
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
            errors.educations[index].includes("institution") &&
            touched.educations[index].includes("institution")
              ? "flex-grow w-2/3 rounded-md p-1.5 border-2 border-red-700 h-full"
              : "flex-grow w-2/3 rounded-md p-1.5 border-2 border-teal-900 h-full"
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
            errors.educations[index].includes("dateCompleted") &&
            touched.educations[index].includes("dateCompleted")
              ? "px-1 w-1/3 rounded-md border-2 border-red-700 h-auto"
              : "px-1 w-1/3 rounded-md border-2 border-teal-900 h-auto"
          }
        ></Field>
      </div>
      <button
        type="button"
        onClick={() => handleDelete(index)}
        className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1.5 px-4 rounded-md"
      >
        Supprimer
      </button>
    </div>
  );
};

export default EducationField;
