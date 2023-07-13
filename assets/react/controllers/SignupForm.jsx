import React, { useState } from "react";
import userService from "../services/user";
import FormField from "./FormField";

import { FieldArray, Form, useFormikContext } from "formik";
import moment from "moment-timezone";
import EducationField from "./EducationField";
import ExperienceField from "./ExperienceField";

const SignUpForm = () => {
  const roleField = {
    name: "role",
    as: "select",
    label: "Selectionnez un role",
    options: ["adolescent", "parent", "professionel"],
  }

  const fields = [
    {
      name: "title",
      as: "select",
      label: "Selectionnez un titre de civilite",
      options: ["madame", "monsieur", "docteur", "professeur"],
      roles: ["professionel"]
    },
    {
      name: "profession",
      as: "select",
      label: "Selectionnez votre metier",
      options: ["psychologue", "coach", "psychiatre", "sage-femme", "gynecologue"],
      roles: ["professionel"]
    },
    {
      name: "username",
      type: "text",
      label: "Choisissez un nom d'utilisateur",
      roles: ["parent", "adolescent", "professionel"]
    },
    {
      name: "email",
      type: "email",
      label: "Entrez votre adresse email",
      roles: ["parent", "adolescent", "professionel"]
    },
    {
      name: "password",
      type: "password",
      label: "Choisissez un mot de passe",
      roles: ["parent", "adolescent", "professionel"]
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Confirmez votre mot de passe",
      roles: ["parent", "adolescent", "professionel"]
    },
    {
      name: "firstName",
      type: "text",
      label: "Entrez votre prenom",
      roles: ["parent", "adolescent", "professionel"]
    },
    {
      name: "lastName",
      type: "text",
      label: "Entrez votre nom de famille",
      roles: ["parent", "adolescent", "professionel"]
    },
    {
      name: "birthDate",
      type: "date",
      label: "Selectionnez votre date de naissance",
      roles: ["parent", "adolescent", "professionel"]
    },
    {
      name: "timezone",
      as: "select",
      label: "Selectionnez votre fuseau horaire",
      options: moment.tz.names().map((zone) => {
        return `${zone} (${moment.tz(zone).format("Z")})`;
      }),
      roles: ["parent", "adolescent", "professionel"]
    },
    {
      name: "bio",
      as: "textarea",
      label: "Laissez une petite description de vous pour vos visiteurs",
      roles: ["professionel"]
    },
    {
      name: "phoneMobile",
      type: "text",
      label: "Entrez votre numero de telephone mobile",
      roles: ["professionel"]
    },
    {
      name: "phoneOffice",
      type: "text",
      label: "Entrez votre numero de telephone au travail",
      roles: ["professionel"]
    },
    {
      name: "street1",
      type: "text",
      label: "Entrez votre numero civique et nom de rue",
      roles: ["professionel"]
    },
    {
      name: "street2",
      type: "text",
      label: "Entrez votre complement d'adresse (si applicable)",
      roles: ["professionel"]
    },
    {
      name: "postalCode",
      type: "text",
      label: "Entrez votre code postal",
      roles: ["professionel"]
    },
    {
      name: "city",
      type: "text",
      label: "Entrez votre ville de residence",
      roles: ["professionel"]
    },
    {
      name: "country",
      type: "text",
      label: "Entrez votre pays de residence",
      roles: ["professionel"]
    }
  ];

  const formik = useFormikContext();
  const role = formik.values.role;
  

  return (
    <Form className="flex flex-col w-3/4 h-min p-10 m-auto bg-teal-400 rounded-md gap-8 border-emerald-900 border-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-5xl text-teal-950 font-extrabold">
          Welcome to Capsule!
        </h1>
        <h4 className="text-2xl text-teal-800 font-bold">
          Let's get you set up with an account.
        </h4>
      </div>

      <div className="flex flex-col gap-2">
        <FormField key={roleField.name} {...roleField} />

        {fields.map((field) => {
          if (field.roles.includes(role)) {
            return <FormField key={field.name} {...field} />;
          }
        })}

        { role === "professionel" && <FieldArray
          name="educations"
          render={arrayHelpers => (
            <div className="flex flex-col gap-1">
              <label htmlFor="education" className="text-teal-900 font-medium">
                Education
              </label>
              {formik.values.educations.map((ed, id) => {
                return (
                  <div key={id} className="flex flex-row gap-1 justify-between">
                    <EducationField name={`educations.${id}`}></EducationField>
                    <button type="button" onClick={() => arrayHelpers.remove(id)} className="w-2/12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                  </div>
                )
              })}
              <button className="bg-teal-950 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={() => arrayHelpers.push({ diploma: "", institution: "", dateCompleted: "" })}>Ajouter une formation</button>
            </div>
          )}
        /> }

        { role === "professionel" && <FieldArray
          name="experiences"
          render={arrayHelpers => (
            <div className="flex flex-col gap-1">
              <label htmlFor="experience" className="text-teal-900 font-medium">
                Experience
              </label>
              {formik.values.experiences.map((ex, id) => {
                return (
                  <div key={id} className="flex flex-row gap-1 justify-between">
                    <ExperienceField name={`experiences.${id}`}></ExperienceField>
                    <button type="button" onClick={() => arrayHelpers.remove(id)} className="w-2/12 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                  </div>
                )
              })}
              <button className="bg-teal-950 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded" type="button" onClick={() => arrayHelpers.push({ position: "", employer: "", dateStarted: "", dateCompleted: "" })}>Ajouter une experience</button>
            </div>
          )}
        /> }
      </div>

      <button
        type="submit"
        className="rounded-lg bg-teal-950 py-4 text-teal-50 font-extrabold shadow-lg"
      >
        Submit
      </button>
      
      <p className="text-center font-medium">
        Already have an account?{" "}
        <button type="button">
          <u>Login here!</u>
        </button>{" "}
      </p>
    </Form>
  );
};

export default SignUpForm;
