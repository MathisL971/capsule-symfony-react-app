import React from "react";
import { Field, useFormikContext } from "formik";

const EducationField = ({ name, index }) => {
  const { errors, touched } = useFormikContext();

  return (
    <div className="flex flex-row gap-1 justify-between w-10/12">
      <div className="flex flex-col w-2/5">
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
              ? "rounded-md py-0.5 px-1 border-2 border-red-700 h-full"
              : "rounded-md py-0.5 px-1 border-2 border-teal-900 h-full"
          }
        ></Field>
      </div>
      <div className="flex flex-col w-2/5">
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
              ? "rounded-md py-0.5 px-1 border-2 border-red-700 h-full"
              : "rounded-md py-0.5 px-1 border-2 border-teal-900 h-full"
          }
        ></Field>
      </div>
      <div className="flex flex-col w-1/5">
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
              ? "rounded-md py-0.5 px-1 border-2 border-red-700 h-full"
              : "rounded-md py-0.5 px-1 border-2 border-teal-900 h-full"
          }
        ></Field>
      </div>
    </div>
  );
};

export default EducationField;
