// Utility imports
import React from "react";
import { FieldArray, Form, Formik } from "formik";

// Services
import userService from "../services/user";

// Components
import FormField from "./FormField";
import EducationField from "./EducationField";
import ExperienceField from "./ExperienceField";

// Validations
import { validationSchema, initialValues } from "../validations/signup";

// Fields
import { topField, fields } from "../fields/signup";

const SignUpForm = () => {
  const handleSubmit = (values, setSubmitting, resetForm) => {
    setTimeout(() => {
      console.log(values);
      resetForm();
      setSubmitting(false);
    }, 1000);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) =>
        handleSubmit(values, setSubmitting, resetForm)
      }
    >
      {({ values, isSubmitting }) => {
        return (
          <Form className="flex flex-col w-3/4 h-min p-10 m-auto bg-teal-400 rounded-md gap-8 border-emerald-900 border-4">
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl text-teal-950 font-extrabold">
                Bienvenue sur Capsule!
              </h1>
              <h4 className="text-2xl text-teal-800 font-bold">
                Commençons par créer votre compte.
              </h4>
            </div>

            <div className="flex flex-col gap-2">
              <FormField key={topField.name} {...topField} />

              {fields.map((field) => {
                if (field.roles.includes(values.role)) {
                  return <FormField key={field.name} {...field} />;
                }
              })}

              {values.role === "professionel" && (
                <FieldArray
                  name="educations"
                  render={(arrayHelpers) => (
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="education"
                        className="text-teal-900 font-medium"
                      >
                        Ajoutez vos diplomes ou titres obtenus
                      </label>
                      {values.educations.map((ed, id) => {
                        return (
                          <div
                            key={id}
                            className="flex flex-row gap-1 justify-between"
                          >
                            <EducationField
                              index={id}
                              name={`educations.${id}`}
                            ></EducationField>
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(id)}
                              className="w-2/12 bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-md"
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })}
                      <button
                        className="bg-teal-950 hover:bg-teal-700 text-white text-sm font-bold py-2 px-4 rounded-md"
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({
                            diploma: "",
                            institution: "",
                            dateCompleted: "",
                          })
                        }
                      >
                        Ajouter une formation
                      </button>
                    </div>
                  )}
                />
              )}

              {values.role === "professionel" && (
                <FieldArray
                  name="experiences"
                  render={(arrayHelpers) => (
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="experience"
                        className="text-teal-900 font-medium"
                      >
                        Ajoutez vos experiences professionels
                      </label>
                      {values.experiences.map((ex, id) => {
                        return (
                          <div
                            key={id}
                            className="flex flex-row gap-1 justify-between"
                          >
                            <ExperienceField
                              index={id}
                              name={`experiences.${id}`}
                            ></ExperienceField>
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(id)}
                              className="w-2/12 bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded-md"
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })}
                      <button
                        className="bg-teal-950 hover:bg-teal-700 text-white text-sm font-bold py-2 px-4 rounded-md"
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({
                            position: "",
                            employer: "",
                            dateStarted: "",
                            dateCompleted: "",
                          })
                        }
                      >
                        Ajouter une experience
                      </button>
                    </div>
                  )}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={
                isSubmitting
                  ? "rounded-lg bg-teal-100 py-4 text-teal-50 font-extrabold shadow-lg"
                  : "rounded-lg bg-teal-950 py-4 text-teal-50 font-extrabold shadow-lg"
              }
            >
              S'inscrire
            </button>

            <p className="text-center font-medium">
              Vous possédez déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => console.log("Navigating to login page")}
              >
                <u>Clickez ici pour vous connecter!</u>
              </button>{" "}
            </p>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SignUpForm;
