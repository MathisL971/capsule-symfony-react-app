import * as Yup from "yup";

export const validationSchema = Yup.object({
  role: Yup.string().required("Required"),
  timezone: Yup.string().required("Required"),
  username: Yup.string()
    .max(15, "Username must be 15 characters or less")
    .required("Required"),
  // .test("username-unique", "Username already exists", async (value) => {
  //   const users = await userService.getAll();
  //   return users.every((user) => user.username !== value);
  // })
  email: Yup.string().email("Invalid email address").required("Required"),
  // .test("email-unique", "Email is already taken", async (value) => {
  //   const users = await userService.getAll();
  //   return users.every((user) => user.email !== value);
  // })
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
  name: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  birthDate: Yup.date()
    .max(new Date(), "Birth date must be in the past")
    .required("Required"),
  title: Yup.string().when("role", {
    is: (role) => role === "pro",
    then: () => Yup.string().required("Required"),
  }),
  profession: Yup.string().when("role", {
    is: (role) => role === "pro",
    then: () => Yup.string().required("Required"),
  }),
  phoneMobile: Yup.string().when("role", {
    is: (role) => role === "pro",
    then: () =>
      Yup.string()
        .required("Required")
        .matches(/^\d{10}$/, "Phone number must contain 10 digits"),
  }),
  phoneOffice: Yup.string().when("role", {
    is: (role) => role === "pro",
    then: () =>
      Yup.string()
        .required("Required")
        .matches(/^\d{10}$/, "Phone number must contain 10 digits"),
  }),
  street1: Yup.string().when("role", {
    is: (role) => role === "pro",
    then: () => Yup.string().required("Required"),
  }),
  street2: Yup.string().when("role", {
    is: (role) => role === "pro",
    then: () => Yup.string().required("Required"),
  }),
  postcode: Yup.string().when("role", {
    is: (role) => role === "pro",
    then: () => Yup.string().required("Required"),
  }),
  city: Yup.string().when("role", {
    is: (role) => role === "pro",
    then: () => Yup.string().required("Required"),
  }),
  country: Yup.string().when("role", {
    is: (role) => role === "pro",
    then: () => Yup.string().required("Required"),
  }),
  educations: Yup.array()
    .when("role", {
      is: (role) => role === "pro",
      then: () =>
        Yup.object().shape({
          diploma: Yup.string().required("Required"),
          institution: Yup.string().required("Required"),
          dateCompleted: Yup.string().required("Required"),
        }),
    })
    .required("At least one education record is required"),
  experiences: Yup.array()
    .when("role", {
      is: (role) => role === "pro",
      then: () =>
        Yup.object().shape({
          position: Yup.string().required("Required"),
          employer: Yup.string().required("Required"),
          dateStarted: Yup.string().required("Required"),
          dateCompleted: Yup.string().required("Required"),
        }),
    })
    .required("At least one experience record is required"),
});

export const initialValues = {
  firstName: "",
  name: "",
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
  postcode: "",
  city: "",
  country: "",
  educations: [{ diploma: "", institution: "", dateCompleted: "" }],
  experiences: [
    { position: "", employer: "", dateStarted: "", dateCompleted: "" },
  ],
};
