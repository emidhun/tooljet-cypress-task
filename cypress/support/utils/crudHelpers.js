import dashboardSelectors from "../../constants/selectors/dashboardSelectors.json";
import appSelectors from "../../constants/selectors/appSelectors.json";
import dashboardTexts from "../../constants/texts/dashboardTexts.json";

export const backToAppLibrary = () => {
  cy.contains(appSelectors.sideBarButtons, "Back").click();
  cy.get(appSelectors.buttondangerYes).click();
  cy.wait("@appLibrary");
};

export const dragAndDropWidget = (widgetName, position = "top") => {
  const dataTransfer = new DataTransfer();

  cy.get(appSelectors.widgetSearchInputField).type(widgetName);
  cy.get(appSelectors.firstWidget).trigger("dragstart", { dataTransfer }, { force: true });
  cy.get(appSelectors.canvas).trigger("drop", position, { dataTransfer, force: true });
  cy.get(appSelectors.autoSaveIndication, { timeout: 15000 }).should("have.text", "Saved");
};

export const deleteApp = () => {
  cy.get(dashboardSelectors.appEllipsisMenu).first().click();
  cy.contains(dashboardSelectors.appPopoverMenuItem, dashboardTexts.dropdownTextDeleteApp).click();
  cy.get(dashboardSelectors.deleteWarningText).should("have.text", dashboardTexts.deleteWarningText);
  cy.get(dashboardSelectors.buttonDanger).click();
  cy.wait('@appDeleted')
  cy.verifyToastMessage(dashboardTexts.toastAppDeleted);
};

export const cleanUpDashboard = () => {
  const clean = () => {
    cy.wait(1500);
    cy.get(".page-body").then(($body) => {
      if (
        $body.find(dashboardSelectors.appCard, { timeout: 8000 }).length) {
        deleteApp();
        clean();
      }
    });
  };
  clean();
};
