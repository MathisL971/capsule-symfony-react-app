import React, { useState } from "react";
import { Formik, Form } from "formik";

// Components
import FormField from "../FormField";

// Services
import loginService from "../../../services/login";

// Fields
import { fields } from "../fields/login";

// Validations
import { validationSchema, initialValues } from "../validations/login";

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (values, setSubmitting, resetForm) => {
    setTimeout(async () => {
      try {
        const user = await loginService.authenticate(values);
        sessionStorage.setItem("sessionUser", JSON.stringify(user));

        const { role } = user;

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
          <Form className="flex flex-col sm:w-10/12 md:w-8/12 lg:w-1/2 h-min p-10 m-auto bg-teal-400 rounded-md gap-8 border-teal-900 border-4">
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
              <div className="flex text-sm text-red-700 font-bold">
                {errorMessage}
              </div>
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
                onClick={() => (window.location.href = "/signup")}
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
