import { expect, test } from "../playwright-fixture";
import {
  contactMessages,
  contactSelectors,
  fillBrandInquiryForm,
  fillGeneralContactForm,
  expectContactMessageHidden,
  expectContactMessageVisible,
  openContactPageInTestMode,
} from "./helpers/contact-preview";

test.describe("Contact page preview test mode", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("shows a stable submit confirmation for the general contact flow", async ({ page }) => {
    await openContactPageInTestMode(page);

    await fillGeneralContactForm(page, {
      fullName: "Alex Driver",
      email: "alex@example.com",
      message: "Interested in working together.",
    });
    await page.getByRole("button", { name: contactSelectors.general.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.generalSuccess);
    await expect(page).toHaveURL(/contact\?contactTestMode=1/);
  });

  test("shows a stable submit confirmation for the sponsor inquiry flow", async ({ page }) => {
    await openContactPageInTestMode(page);

    await fillBrandInquiryForm(page, {
      companyName: "Roadline Partners",
      contactName: "Morgan Lee",
      contactEmail: "morgan@roadline.com",
      budgetRange: "$5,000 - $10,000",
      campaignDetails: "Need a sponsored integration for owner-operators this quarter.",
    });
    await page.getByRole("button", { name: contactSelectors.brand.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.brandSuccess);
    await expect(page).toHaveURL(/contact\?contactTestMode=1/);
  });

  test("shows the general contact failure state for missing required fields", async ({ page }) => {
    await openContactPageInTestMode(page);

    await fillGeneralContactForm(page, {
      fullName: "Alex Driver",
      email: "alex@example.com",
    });
    await page.getByRole("button", { name: contactSelectors.general.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.generalMissing);
    await expectContactMessageHidden(page, contactMessages.generalSuccess);
  });

  test("shows the general contact failure state for invalid email", async ({ page }) => {
    await openContactPageInTestMode(page);

    await fillGeneralContactForm(page, {
      fullName: "Alex Driver",
      email: "not-an-email",
      message: "Interested in working together.",
    });
    await page.getByRole("button", { name: contactSelectors.general.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.generalInvalidEmail);
    await expectContactMessageHidden(page, contactMessages.generalSuccess);
  });

  test("shows the sponsor inquiry failure state for missing required fields", async ({ page }) => {
    await openContactPageInTestMode(page);

    await fillBrandInquiryForm(page, {
      companyName: "Roadline Partners",
      contactName: "Morgan Lee",
      budgetRange: "$1,000 - $5,000",
    });
    await page.getByRole("button", { name: contactSelectors.brand.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.brandMissing);
    await expectContactMessageHidden(page, contactMessages.brandSuccess);
  });

  test("shows the sponsor inquiry failure state for invalid email", async ({ page }) => {
    await openContactPageInTestMode(page);

    await fillBrandInquiryForm(page, {
      companyName: "Roadline Partners",
      contactName: "Morgan Lee",
      contactEmail: "bad-email",
      budgetRange: "$1,000 - $5,000",
      campaignDetails: "Owner-operator sponsorship test.",
    });
    await page.getByRole("button", { name: contactSelectors.brand.submitButton }).click();

    await expectContactMessageVisible(page, contactMessages.brandInvalidEmail);
    await expectContactMessageHidden(page, contactMessages.brandSuccess);
  });
});