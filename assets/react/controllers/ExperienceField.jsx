import React from "react";
import { Field, useFormikContext } from "formik";

const ExperienceField = ({ name, index, handleDelete }) => {
  const { errors, touched } = useFormikContext();

  return (
    <div className="flex flex-col gap-1 justify-between">
      <div className="flex flew-row gap-1 justify-between">
        <Field
          type="text"
          name={`${name}.position`}
          placeholder="Poste"
          className={
            errors.experiences &&
            errors.experiences[index] &&
            touched.experiences &&
            touched.experiences[index] &&
            "position" in errors.experiences[index] &&
            "position" in touched.experiences[index]
              ? "flex-grow rounded-md p-1.5 border-2 border-red-700 h-full"
              : "flex-grow rounded-md p-1.5 border-2 border-teal-900 h-full"
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
            "employer" in errors.experiences[index] &&
            "employer" in touched.experiences[index]
              ? "flex-grow rounded-md p-1.5 border-2 border-red-700 h-full"
              : "flex-grow rounded-md p-1.5 border-2 border-teal-900 h-full"
          }
        />
      </div>

      <div className="flex flex-row gap-1">
        <Field
          type="date"
          name={`${name}.dateStarted`}
          className={
            errors.experiences &&
            errors.experiences[index] &&
            touched.experiences &&
            touched.experiences[index] &&
            "dateStarted" in errors.experiences[index] &&
            "dateStarted" in touched.experiences[index]
              ? "flex-grow px-1 rounded-md border-2 border-red-700 h-auto"
              : "flex-grow px-1 rounded-md border-2 border-teal-900 h-auto"
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
            "dateCompleted" in errors.experiences[index] &&
            "dateCompleted" in touched.experiences[index]
              ? "flex-grow px-1 rounded-md border-2 border-red-700 h-auto"
              : "flex-grow px-1 rounded-md border-2 border-teal-900 h-auto"
          }
        />
        <button
          type="button"
          onClick={() => handleDelete(index)}
          className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExperienceField;
