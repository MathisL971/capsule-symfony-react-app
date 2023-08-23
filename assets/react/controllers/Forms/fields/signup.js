import moment from "moment-timezone";
const { getData } = require("country-list");

const countries = getData().map((d) => d.name);

export const topField = {
  name: "role",
  as: "select",
  label: "Selectionnez un role",
  options: ["ado", "parent", "pro"],
};

export const fields = [
  {
    name: "title",
    as: "select",
    label: "Selectionnez un titre de civilite",
    options: ["madame", "monsieur", "docteur", "professeur"],
    roles: ["pro"],
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
    roles: ["pro"],
  },
  {
    name: "username",
    type: "text",
    label: "Choisissez un nom d'utilisateur",
    roles: ["parent", "ado", "pro"],
  },
  {
    name: "email",
    type: "email",
    label: "Entrez votre adresse email",
    roles: ["parent", "ado", "pro"],
  },
  {
    name: "password",
    type: "password",
    label: "Choisissez un mot de passe",
    roles: ["parent", "ado", "pro"],
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirmez votre mot de passe",
    roles: ["parent", "ado", "pro"],
  },
  {
    name: "firstName",
    type: "text",
    label: "Entrez votre prenom",
    roles: ["parent", "ado", "pro"],
  },
  {
    name: "name",
    type: "text",
    label: "Entrez votre nom de famille",
    roles: ["parent", "ado", "pro"],
  },
  {
    name: "birthDate",
    type: "date",
    label: "Selectionnez votre date de naissance",
    roles: ["parent", "ado", "pro"],
  },
  {
    name: "timezone",
    as: "select",
    label: "Selectionnez votre fuseau horaire",
    options: moment.tz.names().map((zone) => {
      return `${zone} (${moment.tz(zone).format("Z")})`;
    }),
    roles: ["parent", "ado", "pro"],
  },
  {
    name: "bio",
    as: "textarea",
    label: "Laissez une petite description de vous pour vos visiteurs",
    roles: ["pro"],
  },
  {
    name: "phoneMobile",
    type: "text",
    label: "Entrez votre numero de telephone mobile",
    roles: ["pro"],
  },
  {
    name: "phoneOffice",
    type: "text",
    label: "Entrez votre numero de telephone au travail",
    roles: ["pro"],
  },
  {
    name: "street1",
    type: "text",
    label: "Entrez votre numero civique et nom de rue",
    roles: ["pro"],
  },
  {
    name: "street2",
    type: "text",
    label: "Entrez votre complement d'adresse (si applicable)",
    roles: ["pro"],
  },
  {
    name: "postcode",
    type: "text",
    label: "Entrez votre code postal",
    roles: ["pro"],
  },
  {
    name: "city",
    type: "text",
    label: "Entrez votre ville de residence",
    roles: ["pro"],
  },
  {
    name: "country",
    as: "select",
    label: "Entrez votre pays de residence",
    options: countries,
    roles: ["pro"],
  },
];
