import loginSelectors from "../constants/selectors/loginSelectors.json";
import credentials from "../fixtures/credentials.json";

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
Cypress.Commands.add("login", (email = credentials.email, password = credentials.password) => {
  cy.get(loginSelectors.emailInputField).clear().type(email);
  cy.get(loginSelectors.passwordInputField).clear().type(password);
  cy.get(loginSelectors.loginButton).click();
});

Cypress.Commands.add("verifyToastMessage", (text) => {
  cy.get(".go2072408551").should("have.text", text);
});
