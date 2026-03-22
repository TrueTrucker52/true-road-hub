import { expect, test } from "../playwright-fixture";
import {
  contactMessages,
  contactSelectors,
  expectContactMessageHidden,
  expectContactMessageVisible,
  openContactPageInTestMode,
} from "./helpers/contact-preview";

test.describe("Contact page preview test mode", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("shows a stable submit confirmation for the general contact flow", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel(contactSelectors.general.fullName).fill("Alex Driver");
    await page.getByLabel(contactSelectors.general.email).fill("alex@example.com");
    await page.getByLabel(contactSelectors.general.message).fill("Interested in working together.");
    await page.getByRole("button", { name: contactSelectors.general.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.generalSuccess);
    await expect(page).toHaveURL(/contact\?contactTestMode=1/);
  });

  test("shows a stable submit confirmation for the sponsor inquiry flow", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel(contactSelectors.brand.companyName).fill("Roadline Partners");
    await page.getByLabel(contactSelectors.brand.contactName).fill("Morgan Lee");
    await page.getByLabel(contactSelectors.brand.contactEmail).fill("morgan@roadline.com");
    await page.getByLabel(contactSelectors.brand.budgetRange).selectOption("$5,000 - $10,000");
    await page.getByLabel(contactSelectors.brand.campaignDetails).fill(
      "Need a sponsored integration for owner-operators this quarter.",
    );
    await page.getByRole("button", { name: contactSelectors.brand.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.brandSuccess);
    await expect(page).toHaveURL(/contact\?contactTestMode=1/);
  });

  test("shows the general contact failure state for missing required fields", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel(contactSelectors.general.fullName).fill("Alex Driver");
    await page.getByLabel(contactSelectors.general.email).fill("alex@example.com");
    await page.getByRole("button", { name: contactSelectors.general.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.generalMissing);
    await expectContactMessageHidden(page, contactMessages.generalSuccess);
  });

  test("shows the general contact failure state for invalid email", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel(contactSelectors.general.fullName).fill("Alex Driver");
    await page.getByLabel(contactSelectors.general.email).fill("not-an-email");
    await page.getByLabel(contactSelectors.general.message).fill("Interested in working together.");
    await page.getByRole("button", { name: contactSelectors.general.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.generalInvalidEmail);
    await expectContactMessageHidden(page, contactMessages.generalSuccess);
  });

  test("shows the sponsor inquiry failure state for missing required fields", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel(contactSelectors.brand.companyName).fill("Roadline Partners");
    await page.getByLabel(contactSelectors.brand.contactName).fill("Morgan Lee");
    await page.getByLabel(contactSelectors.brand.budgetRange).selectOption("$1,000 - $5,000");
    await page.getByRole("button", { name: contactSelectors.brand.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.brandMissing);
    await expectContactMessageHidden(page, contactMessages.brandSuccess);
  });

  test("shows the sponsor inquiry failure state for invalid email", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel(contactSelectors.brand.companyName).fill("Roadline Partners");
    await page.getByLabel(contactSelectors.brand.contactName).fill("Morgan Lee");
    await page.getByLabel(contactSelectors.brand.contactEmail).fill("bad-email");
    await page.getByLabel(contactSelectors.brand.budgetRange).selectOption("$1,000 - $5,000");
    await page.getByLabel(contactSelectors.brand.campaignDetails).fill("Owner-operator sponsorship test.");
    await page.getByRole("button", { name: contactSelectors.brand.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.brandInvalidEmail);
    await expectContactMessageHidden(page, contactMessages.brandSuccess);
  });
});