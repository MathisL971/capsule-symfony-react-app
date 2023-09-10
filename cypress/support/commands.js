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

Cypress.Commands.add("login", ({ email, password }) => {
  cy.request("POST", `${Cypress.env("DEV_BACKEND")}/login`, {
    email,
    password,
  }).then(({ body }) => {
    sessionStorage.setItem("sessionUser", JSON.stringify(body));
    cy.visit(body);
  });
});

Cypress.Commands.add("logout", () => {
  cy.request("POST", `${Cypress.env("DEV_BACKEND")}/logout`);
  cy.visit("");
});

Cypress.Commands.add("checkNavBar", () => {
  cy.get("nav")
    .should("be.visible")
    .within(() => {
      cy.contains("Capsule").should("be.visible");
      cy.get("#hamburger-button").should("be.visible");
    });
});

Cypress.Commands.add("checkDropDown", () => {
  cy.get("#dropdown-menu")
    .should("be.visible")
    .within(() => {
      cy.get("#login-nav-button").should("be.visible").contains("Se Connecter");
      cy.get("#signup-nav-button").should("be.visible").contains("S'inscrire");
    });
});

Cypress.Commands.add("checkUserMenu", () => {
  cy.get("#user-menu")
    .should("be.visible")
    .within(() => {
      cy.get("#user-menu-logout-button")
        .should("be.visible")
        .contains("Se Déconnecter");
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
