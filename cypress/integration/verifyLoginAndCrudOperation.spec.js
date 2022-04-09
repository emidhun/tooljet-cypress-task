import loginSelectors from "../constants/selectors/loginSelectors.json";
import dashboardSelectors from "../constants/selectors/dashboardSelectors.json";
import appSelectors from "../constants/selectors/appSelectors.json";
import appPageTexts from "../constants/texts/appPageTexts.json";
import dashboardTexts from "../constants/texts/dashboardTexts.json";
import loginPageTexts from "../constants/texts/loginPageTexts.json";

import { backToAppLibrary, dragAndDropWidget, cleanUpDashboard, deleteApp } from "../support/utils/crudHelpers.js";
import { fake } from "../fixtures/fake";

describe("Login and CRUD operation on App", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.intercept("GET", "/api/library_apps/").as("appLibrary");
    cy.intercept("GET", "/api/apps").as("appEditor");
    cy.intercept("DELETE", "/api/apps/*").as("appDeleted");

  });
  it("Should verify login functionality", () => {
    const randomEmail = fake.email;
    let randomPassword = fake.password;

    cy.get(loginSelectors.loginButton).click();
    cy.verifyToastMessage(loginPageTexts.toastInvalidEmailOrPassword);

    cy.get(loginSelectors.emailInputField).type("dev@tooljet.io");
    cy.get(loginSelectors.loginButton).click();
    cy.verifyToastMessage(loginPageTexts.toastInvalidEmailOrPassword);

    cy.get(loginSelectors.passwordInputField).type(randomPassword);
    cy.verifyToastMessage(loginPageTexts.toastInvalidEmailOrPassword);

    randomPassword = fake.password;
    cy.login(randomEmail, randomPassword);
    cy.verifyToastMessage(loginPageTexts.toastInvalidEmailOrPassword);

    cy.login();
    cy.wait("@appLibrary");
    cleanUpDashboard();
    cy.get(dashboardSelectors.welcomeHeader).should("have.text", dashboardTexts.welcomeHeader);
  });

  it("Should perform and verify CRUD operation on an app", () => {
    let appName = fake.appName;

    cy.login();
    cy.wait("@appLibrary");
    cleanUpDashboard();

    cy.get(dashboardSelectors.buttonCreateNewApplication).click();
    cy.wait("@appEditor");

    cy.get(appSelectors.createVersionTitle).should("have.text", appPageTexts.createVersionHeader);
    cy.get(appSelectors.createVersionSubmitButton).click();
    cy.verifyToastMessage(appPageTexts.toastVersionCreated);
    cy.get(appSelectors.infoSkipButton).click();

    dragAndDropWidget(appPageTexts.widgetButton);
    cy.get(appSelectors.appNameInputField).clear().type(appName);

    backToAppLibrary();
    cy.get(dashboardSelectors.appCard).last().find(dashboardSelectors.appTitle).should("have.text", appName);
    cy.get(dashboardSelectors.appCard)
      .trigger("mousehover")
      .trigger("mouseenter")
      .find(dashboardSelectors.appEditButton)
      .click();

    cy.wait("@appEditor");
    cy.get(appSelectors.buttonOnCanvas).should("be.visible");
    dragAndDropWidget(appPageTexts.widgetChart);

    appName = fake.appName;
    cy.get(appSelectors.appNameInputField).clear().type(appName);

    backToAppLibrary();
    cy.get(dashboardSelectors.appCard).last().find(dashboardSelectors.appTitle).should("have.text", appName);

    deleteApp();
    cy.get(dashboardSelectors.welcomeHeader).should("have.text", dashboardTexts.welcomeHeader);
  });
});
