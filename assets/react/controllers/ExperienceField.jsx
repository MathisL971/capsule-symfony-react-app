import React from "react";
import { Field, useFormikContext } from "formik";

const ExperienceField = ({ name, index }) => {
  const { errors, touched } = useFormikContext();

  return (
    <div className="flex flex-row gap-1 justify-between w-10/12">
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
            ? "w-2/5 rounded-md py-0.5 px-1 border-2 border-red-700 h-full"
            : "w-2/5 rounded-md py-0.5 px-1 border-2 border-teal-900 h-full"
        }
      ></Field>
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
            ? "w-2/5 rounded-md py-0.5 px-1 border-2 border-red-700 h-full"
            : "w-2/5 rounded-md py-0.5 px-1 border-2 border-teal-900 h-full"
        }
      ></Field>
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
            ? "w-1/5 rounded-md py-0.5 px-1 border-2 border-red-700 h-full"
            : "w-1/5 rounded-md py-0.5 px-1 border-2 border-teal-900 h-full"
        }
      ></Field>
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
            ? "w-1/5 rounded-md py-0.5 px-1 border-2 border-red-700 h-full"
            : "w-1/5 rounded-md py-0.5 px-1 border-2 border-teal-900 h-full"
        }
      ></Field>
    </div>
  );
};

export default ExperienceField;
