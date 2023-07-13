import React from 'react'
import SignUpForm from './SignupForm'
import { Formik } from "formik";
import * as Yup from "yup";

const FormikFormWrapper = () => {
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
        title: "",
        profession: "",
        bio: "",
        phoneMobile: "",
        phoneOffice: "",
        street1: "",
        street2: "",
        postalCode: "",
        city: "",
        country: "",
        educations: [{ diploma: "", institution: "", dateCompleted: "" }],
        experiences: [{ position: "", employer: "", dateStarted: "", dateCompleted: "" }],
      }}
      validationSchema={Yup.object({
        role: Yup.string().required("Required"),
        timezone: Yup.string().required("Required"),
        username: Yup.string()
          .max(15, "Username must be 15 characters or less")
          .required("Required")
          // .test("username-unique", "Username already exists", async (value) => {
          //   const users = await userService.getAll();
          //   return users.every((user) => user.username !== value);
          // })
          ,
        email: Yup.string()
          .email("Invalid email address")
          .required("Required")
          // .test("email-unique", "Email is already taken", async (value) => {
          //   const users = await userService.getAll();
          //   return users.every((user) => user.email !== value);
          // })
          ,
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
        title: Yup.string()
          .when('role', {
            is: (role) => role === "professionel",
            then: () => Yup.string().required("Required"),
          }),
        profession: Yup.string()
          .when('role', {
            is: (role) => role === "professionel",
            then: () => Yup.string().required("Required"),
          })
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          // userService
          //   .create(values)
          //   .then((users) => {
          //     console.log("User created successfully:", users);
          //     setSubmitting(false);
          //   })
          //   .catch((error) => {
          //     console.error("Error creating user:", error);
          //     setSubmitting(false);
          //   });
          console.log(values);
          setSubmitting(false);
          resetForm();
        }, 2000);
         // Simulating a delay of 2 seconds
      }}
    >
        <SignUpForm />
    </Formik>
  )
}

export default FormikFormWrapper