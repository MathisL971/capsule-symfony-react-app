/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.js",
    "./templates/**/*.html.twig",
    "./assets/react/controllers/*.jsx",
    "./assets/react/controllers/Chat/*.jsx",
    "./assets/react/controllers/Forms/*.jsx",
    "./assets/react/controllers/Utility/*.jsx",
    "./assets/react/controllers/Forms/Login/*.jsx",
    "./assets/react/controllers/Forms/SignUp/*.jsx",
  ],
  theme: {
    extend: {},
    darkMode: false, // Disable dark and light modes
  },
  plugins: [],
};
