describe("when logged out", function () {
  it("home page can be accessed", function () {
    cy.visit("");
    cy.checkNavBar();
    cy.contains("L'appli qui parle aux jeunes");
  });

  describe("when on home page page", function () {
    beforeEach(function () {
      cy.visit("");
      cy.checkNavBar();
    });

    it("signup page can be accessed", function () {
      cy.get("#hamburger-button").click();
      cy.checkDropDown();
      cy.get("#signup-nav-button").click();

      cy.get("form")
        .should("be.visible")
        .within(() => {
          cy.contains("Bienvenue sur Capsule!");
          cy.contains("Commençons par créer votre compte.");
          cy.contains("Selectionnez un role");
          cy.get("select").should("be.visible").contains("-- Select a role --");
          cy.get("button").should("be.visible").contains("S'inscrire");
          cy.contains(
            "Vous possédez déjà un compte ? Clickez ici pour vous connecter!"
          );
        });
    });

    it("login page can be accessed", function () {
      cy.get("#hamburger-button").click();
      cy.checkDropDown();
      cy.get("#login-nav-button").click();

      cy.get("form")
        .should("be.visible")
        .within(() => {
          cy.contains("Content de vous revoir!");
          cy.contains("Entrez vos informations afin d'accéder à votre compte");
          cy.contains("Entrez votre nom d'utilisateur");
          cy.get('input[type="text"]').should("have.length", 1);
          cy.contains("Entrez votre mot de passe");
          cy.get('input[type="password"]').should("have.length", 1);
          cy.get("button").should("be.visible").contains("Se connecter");
          cy.contains(
            "Première fois sur Capsule? Clickez ici pour vous inscrire!"
          );
        });
    });
  });

  describe("when on signup page", function () {
    it("the same form can be extended and submited for a parent or teenager", function () {
      //
    });

    it("the form can be extended and submited for professionals", function () {
      //
    });

    it("the login form can be accessed if the user already has an account", function () {
      //
    });
  });
});

describe.only("when logged in", function () {
  beforeEach(function () {
    cy.login({ username: "Malia", password: "BrebeufMTL5174" });
  });

  it("user menu can be toggled", function () {
    cy.get("#user-menu-button").should("be.visible").click();
    // cy.checkUserMenu();
  });

  // it("chat app feature can be accessed", function () {
  //   cy.visit("/message");
  //   cy.contains("Thismadu971");
  // });
});
