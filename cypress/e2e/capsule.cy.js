describe("when logged out", function () {
  it("home page can be accessed", function () {
    cy.visit("");
    cy.checkNavBar();
    cy.contains("L'appli qui parle aux jeunes");
  });

  it("signup page can be accessed", function () {
    cy.visit("/signup");
    cy.checkNavBar();
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

  it("login page can be accessed", function () {
    cy.visit("/login");
    cy.checkNavBar();
    cy.contains("Content de vous revoir!");
  });
});

describe("when logged in", function () {
  beforeEach(function () {
    cy.login({ username: "Thismadu971", password: "BrebeufMTL5174" });
  });

  it("chat app feature can be accessed", function () {
    cy.visit("/message");
    cy.contains("Thismadu971");
  });
});
