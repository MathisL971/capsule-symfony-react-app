// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", `${Cypress.env("DEV_BACKEND")}/login`, {
    username,
    password,
  }).then(({ body }) => {
    sessionStorage.setItem("sessionUser", JSON.stringify(body));
    cy.visit("");
  });
});

Cypress.Commands.add("checkNavBar", () => {
  cy.get("nav")
    .should("be.visible")
    .within(() => {
      cy.contains("Capsule").should("be.visible");
      cy.contains("Home").should("be.visible");
      cy.contains("Se Connecter").should("be.visible");
      cy.contains("S'inscrire").should("be.visible");
    });
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
