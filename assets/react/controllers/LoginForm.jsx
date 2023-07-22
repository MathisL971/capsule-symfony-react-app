import React from "react";
import { Formik, Form } from "formik";

// Components
import FormField from "./FormField";

// Services
import loginService from "../services/login";

// Fields
import { fields } from "../fields/login";

// Validations
import { validationSchema, initialValues } from "../validations/login";

const LoginForm = () => {
  const handleSubmit = (values, setSubmitting, resetForm) => {
    setTimeout(() => {
      loginService
        .authenticate(values)
        .then((user) => {
          sessionStorage.setItem("sessionUserId", JSON.stringify(user.id));
          console.log(user.role);
          switch (user.role) {
            case "adolescent":
              window.location.href = "/ado/home";
            case "parent":
              window.location.href = "/parent/home";
            case "professionel":
              window.location.href = "/pro/home";
          }
        })
        .catch((e) => {
          console.error(e);
        });
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
      {({ isSubmitting }) => {
        return (
          <Form className="flex flex-col w-1/2 h-min p-10 m-auto bg-teal-400 rounded-md gap-8 border-emerald-900 border-4">
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl text-teal-950 font-extrabold">
                Content de vous revoir!
              </h1>
              <h4 className="text-2xl text-teal-800 font-bold">
                Entrez vos informations afin d'accéder à votre compte{" "}
              </h4>
            </div>

            <div className="flex flex-col gap-2">
              {fields.map((field) => {
                return <FormField key={field.name} {...field} />;
              })}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={
                isSubmitting
                  ? "rounded-lg bg-teal-100 py-4 text-teal-50 font-extrabold shadow-lg"
                  : "rounded-lg bg-teal-900 py-4 text-teal-50 font-extrabold shadow-lg"
              }
            >
              Se connecter
            </button>
            <p className="text-center font-medium">
              Première fois sur Capsule?{" "}
              <button
                type="button"
                onClick={() => console.log("Navigating to sign up page")}
              >
                <u>Clickez ici pour vous inscrire!</u>
              </button>{" "}
            </p>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
