/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.js",
    "./templates/**/*.html.twig",
    "./assets/react/controllers/*.jsx",
    "./assets/react/controllers/Chat/*.jsx",
    "./assets/react/controllers/Forms/*.jsx",
    "./assets/react/controllers/Utility/*.jsx",
    "./assets/react/controllers/Forms/LoginForm/*.jsx",
    "./assets/react/controllers/Forms/SignupForm/*.jsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
