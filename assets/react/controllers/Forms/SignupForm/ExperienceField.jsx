import React from "react";
import { Field, useFormikContext } from "formik";

const ExperienceField = ({ name, index, handleDelete }) => {
  const { errors, touched } = useFormikContext();

  return (
    <div className="flex flex-col gap-1 justify-between w-full bg-teal-600 p-2 border-2 border-emerald-900 rounded-md">
      <Field
        type="text"
        name={`${name}.position`}
        placeholder="Poste"
        className={
          errors.experiences &&
          errors.experiences[index] &&
          touched.experiences &&
          touched.experiences[index] &&
          errors.experiences[index].includes("position") &&
          touched.experiences[index].includes("position")
            ? "flex flex-grow rounded-md p-1.5 border-2 border-red-700 h-full"
            : "flex flex-grow rounded-md p-1.5 border-2 border-teal-900 h-full"
        }
      />
      <Field
        type="text"
        name={`${name}.employer`}
        placeholder="Employeur"
        className={
          errors.experiences &&
          errors.experiences[index] &&
          touched.experiences &&
          touched.experiences[index] &&
          errors.experiences[index].includes("employer") &&
          touched.experiences[index].includes("employer")
            ? "flex flex-grow rounded-md p-1.5 border-2 border-red-700 h-full"
            : "flex flex-grow rounded-md p-1.5 border-2 border-teal-900 h-full"
        }
      />

      <div className="flex flex-row gap-1">
        <Field
          type="date"
          name={`${name}.dateStarted`}
          className={
            errors.experiences &&
            errors.experiences[index] &&
            touched.experiences &&
            touched.experiences[index] &&
            errors.experiences[index].includes("dateStarted") &&
            touched.experiences[index].includes("dateStarted")
              ? "px-1.5 py-1 w-1/2 rounded-md border-2 border-red-700 h-auto"
              : "px-1.5 py-1 w-1/2 rounded-md border-2 border-teal-900 h-auto"
          }
        />
        <Field
          type="date"
          name={`${name}.dateCompleted`}
          className={
            errors.experiences &&
            errors.experiences[index] &&
            touched.experiences &&
            touched.experiences[index] &&
            errors.experiences[index].includes("dateCompleted") &&
            touched.experiences[index].includes("dateCompleted")
              ? "px-1.5 py-1 w-1/2 rounded-md border-2 border-red-700 h-auto"
              : "px-1.5 py-1 w-1/2 rounded-md border-2 border-teal-900 h-auto"
          }
        />
      </div>
      <button
        type="button"
        onClick={() => handleDelete(index)}
        className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-md"
      >
        Supprimer
      </button>
    </div>
  );
};

export default ExperienceField;
