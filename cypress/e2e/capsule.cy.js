describe("when logged out", function () {
  it("home page can be accessed", function () {
    cy.visit("");
    cy.contains("L'appli qui parle aux jeunes");
  });

  it("signup form can be accessed", function () {
    cy.visit("/signup");
    cy.contains("Bienvenue sur Capsule!");
  });

  it("login form can be accessed", function () {
    cy.visit("/login");
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
