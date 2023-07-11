import React from "react";
import loginService from "../services/login";
import FormField from "./FormField";

import { Formik, Form } from "formik";
import * as Yup from "yup";

const LoginForm = () => {
  const fields = [
    {
      name: "username",
      type: "text",
      label: "Enter your username",
    },
    {
      name: "password",
      type: "password",
      label: "Enter your password",
    },
  ];

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={Yup.object({
        username: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          loginService
            .authenticate(values)
            .then((user) => {
              console.log("User logged in successfully:", user);
              setSubmitting(false);
            })
            .catch((error) => {
              console.error("Error logging in user:", error);
              setSubmitting(false);
            });
        }, 2000); // Simulating a delay of 2 seconds
      }}
    >
      <Form className="flex flex-col w-2/4 h-min p-10 m-auto bg-teal-400 rounded-md gap-8 border-emerald-900 border-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-5xl text-teal-950 font-extrabold">Hey there!</h1>
          <h4 className="text-2xl text-teal-800 font-bold">
            We are happy to see you back here.
          </h4>
        </div>

        <div className="flex flex-col gap-2">
          {fields.map((field) => {
            return <FormField key={field.name} {...field} />;
          })}
        </div>

        <button
          type="submit"
          className="rounded-lg bg-teal-900 py-4 text-teal-50 font-extrabold shadow-lg"
        >
          Submit
        </button>
        <p className="text-center font-medium">
          First time using Capsule?{" "}
          <button>
            <u>Sign up here!</u>
          </button>{" "}
        </p>
      </Form>
    </Formik>
  );
};

export default LoginForm;
