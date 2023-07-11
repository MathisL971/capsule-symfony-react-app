import React from "react";
import userService from "../services/user";
import FormField from "./FormField";

import { Formik, Form } from "formik";
import moment from "moment-timezone";
import * as Yup from "yup";

const SignUpForm = () => {
  const fields = [
    {
      name: "role",
      as: "select",
      label: "Select a role",
      options: ["adolescent", "parent", "professionel"],
    },
    {
      name: "username",
      type: "text",
      label: "Choose a username",
    },
    {
      name: "email",
      type: "email",
      label: "Enter your email",
    },
    {
      name: "password",
      type: "password",
      label: "Choose a password",
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Confirm password",
    },
    {
      name: "firstName",
      type: "text",
      label: "Enter your first name",
    },
    {
      name: "lastName",
      type: "text",
      label: "Enter your last name",
    },
    {
      name: "birthDate",
      type: "date",
      label: "Select your birth date",
    },
    {
      name: "timezone",
      as: "select",
      label: "Select a time zone",
      options: moment.tz.names().map((zone) => {
        return `${zone} (${moment.tz(zone).format("Z")})`;
      }),
    },
  ];

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthDate: "",
        username: "",
        role: "",
        timezone: "",
      }}
      validationSchema={Yup.object({
        role: Yup.string().required("Required"),
        timezone: Yup.string().required("Required"),
        username: Yup.string()
          .max(15, "Username must be 15 characters or less")
          .required("Required")
          .test("username-unique", "Username already exists", async (value) => {
            const users = await userService.getAll();
            return users.every((user) => user.username !== value);
          }),
        email: Yup.string()
          .email("Invalid email address")
          .required("Required")
          .test("email-unique", "Email is already taken", async (value) => {
            const users = await userService.getAll();
            return users.every((user) => user.email !== value);
          }),
        password: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Password must contain at least one letter, one number, and one special character"
          )
          .required("Required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Required"),
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        lastName: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Required"),
        birthDate: Yup.date()
          .max(new Date(), "Birth date must be in the past")
          .required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          userService
            .create(values)
            .then((users) => {
              console.log("User created successfully:", users);
              setSubmitting(false);
            })
            .catch((error) => {
              console.error("Error creating user:", error);
              setSubmitting(false);
            });
        }, 2000); // Simulating a delay of 2 seconds
      }}
    >
      <Form className="flex flex-col w-2/4 h-min p-10 m-auto bg-teal-400 rounded-md gap-8 border-emerald-900 border-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-5xl text-teal-950 font-extrabold">
            Welcome to Capsule!
          </h1>
          <h4 className="text-2xl text-teal-800 font-bold">
            Let's get you set up with an account.
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
          Already have an account?{" "}
          <button>
            <u>Login here!</u>
          </button>{" "}
        </p>
      </Form>
    </Formik>
  );
};

export default SignUpForm;
