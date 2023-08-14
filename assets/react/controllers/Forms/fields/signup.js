import moment from "moment-timezone";
const { getData } = require("country-list");

const countries = getData().map((d) => d.name);

export const topField = {
  name: "role",
  as: "select",
  label: "Selectionnez un role",
  options: ["adolescent", "parent", "professionel"],
};

export const fields = [
  {
    name: "title",
    as: "select",
    label: "Selectionnez un titre de civilite",
    options: ["madame", "monsieur", "docteur", "professeur"],
    roles: ["professionel"],
  },
  {
    name: "profession",
    as: "select",
    label: "Selectionnez votre metier",
    options: [
      "psychologue",
      "coach",
      "psychiatre",
      "sage-femme",
      "gynecologue",
    ],
    roles: ["professionel"],
  },
  {
    name: "username",
    type: "text",
    label: "Choisissez un nom d'utilisateur",
    roles: ["parent", "adolescent", "professionel"],
  },
  {
    name: "email",
    type: "email",
    label: "Entrez votre adresse email",
    roles: ["parent", "adolescent", "professionel"],
  },
  {
    name: "password",
    type: "password",
    label: "Choisissez un mot de passe",
    roles: ["parent", "adolescent", "professionel"],
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirmez votre mot de passe",
    roles: ["parent", "adolescent", "professionel"],
  },
  {
    name: "firstName",
    type: "text",
    label: "Entrez votre prenom",
    roles: ["parent", "adolescent", "professionel"],
  },
  {
    name: "name",
    type: "text",
    label: "Entrez votre nom de famille",
    roles: ["parent", "adolescent", "professionel"],
  },
  {
    name: "birthDate",
    type: "date",
    label: "Selectionnez votre date de naissance",
    roles: ["parent", "adolescent", "professionel"],
  },
  {
    name: "timezone",
    as: "select",
    label: "Selectionnez votre fuseau horaire",
    options: moment.tz.names().map((zone) => {
      return `${zone} (${moment.tz(zone).format("Z")})`;
    }),
    roles: ["parent", "adolescent", "professionel"],
  },
  {
    name: "bio",
    as: "textarea",
    label: "Laissez une petite description de vous pour vos visiteurs",
    roles: ["professionel"],
  },
  {
    name: "phoneMobile",
    type: "text",
    label: "Entrez votre numero de telephone mobile",
    roles: ["professionel"],
  },
  {
    name: "phoneOffice",
    type: "text",
    label: "Entrez votre numero de telephone au travail",
    roles: ["professionel"],
  },
  {
    name: "street1",
    type: "text",
    label: "Entrez votre numero civique et nom de rue",
    roles: ["professionel"],
  },
  {
    name: "street2",
    type: "text",
    label: "Entrez votre complement d'adresse (si applicable)",
    roles: ["professionel"],
  },
  {
    name: "postcode",
    type: "text",
    label: "Entrez votre code postal",
    roles: ["professionel"],
  },
  {
    name: "city",
    type: "text",
    label: "Entrez votre ville de residence",
    roles: ["professionel"],
  },
  {
    name: "country",
    as: "select",
    label: "Entrez votre pays de residence",
    options: countries,
    roles: ["professionel"],
  },
];
