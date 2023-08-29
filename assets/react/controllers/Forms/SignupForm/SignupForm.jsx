// Utility imports
import React, { useState } from "react";
import { FieldArray, Form, Formik } from "formik";
import { ErrorMessage } from "formik";

// Components
import FormField from "../FormField";
import EducationField from "./EducationField";
import ExperienceField from "./ExperienceField";

// Services
import signupService from "../../../services/signup";

// Fields
import { topField, fields } from "../fields/signup";

// Validations
import { validationSchema, initialValues } from "../validations/signup";

const SignUpForm = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (values, setSubmitting, resetForm) => {
    setTimeout(async () => {
      try {
        delete values["confirmPassword"];
        const response = await signupService.signup(values);
        sessionStorage.setItem("sessionUser", JSON.stringify(response));
        const { role } = response;

        switch (role) {
          case "ado":
            window.location.href = "/ado/home";
            break;
          case "parent":
            window.location.href = "/parent/home";
            break;
          case "pro":
            window.location.href = "/pro/home";
            break;
          case "admin":
            window.location.href = "/admin/home";
            break;
          default:
            console.log("Invalid role");
        }

        resetForm();
        setSubmitting(false);
      } catch (e) {
        setErrorMessage(e.response.data);
        resetForm();
        setSubmitting(false);
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
    }, 2000);
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
          <Form className="flex flex-col sm:w-10/12 md:w-8/12 lg:w-1/2 h-min p-10 m-auto bg-teal-400 rounded-md gap-8 border-emerald-900 border-4">
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

              {values.role === "pro" && (
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
                          <EducationField
                            key={id}
                            index={id}
                            name={`educations.${id}`}
                            handleDelete={arrayHelpers.remove}
                          ></EducationField>
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

              {values.role === "pro" && (
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
                          <ExperienceField
                            key={id}
                            index={id}
                            name={`experiences.${id}`}
                            handleDelete={arrayHelpers.remove}
                          ></ExperienceField>
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
                onClick={() => (window.location.href = "/login")}
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
