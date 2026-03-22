import { expect, test } from "../playwright-fixture";
import {
  contactMessages,
  expectContactMessageHidden,
  expectContactMessageVisible,
  openContactPageInTestMode,
  submitBrandInquiryForm,
  submitGeneralContactForm,
} from "./helpers/contact-preview";

test.describe("Contact page preview test mode", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.describe("success states", () => {
    test("shows a stable submit confirmation for the general contact flow", async ({ page }) => {
      await openContactPageInTestMode(page);

      await submitGeneralContactForm(page, {
        fullName: "Alex Driver",
        email: "alex@example.com",
        message: "Interested in working together.",
      });

      await expectContactMessageVisible(page, contactMessages.generalSuccess);
      await expect(page).toHaveURL(/contact\?contactTestMode=1/);
    });

    test("shows a stable submit confirmation for the sponsor inquiry flow", async ({ page }) => {
      await openContactPageInTestMode(page);

      await submitBrandInquiryForm(page, {
        companyName: "Roadline Partners",
        contactName: "Morgan Lee",
        contactEmail: "morgan@roadline.com",
        budgetRange: "$5,000 - $10,000",
        campaignDetails: "Need a sponsored integration for owner-operators this quarter.",
      });

      await expectContactMessageVisible(page, contactMessages.brandSuccess);
      await expect(page).toHaveURL(/contact\?contactTestMode=1/);
    });
  });

  test.describe("failure states", () => {
    test("shows the general contact failure state for missing required fields", async ({ page }) => {
      await openContactPageInTestMode(page);

      await submitGeneralContactForm(page, {
        fullName: "Alex Driver",
        email: "alex@example.com",
      });

      await expectContactMessageVisible(page, contactMessages.generalMissing);
      await expectContactMessageHidden(page, contactMessages.generalSuccess);
    });

    test("shows the general contact failure state for invalid email", async ({ page }) => {
      await openContactPageInTestMode(page);

      await submitGeneralContactForm(page, {
        fullName: "Alex Driver",
        email: "not-an-email",
        message: "Interested in working together.",
      });

      await expectContactMessageVisible(page, contactMessages.generalInvalidEmail);
      await expectContactMessageHidden(page, contactMessages.generalSuccess);
    });

    test("shows the sponsor inquiry failure state for missing required fields", async ({ page }) => {
      await openContactPageInTestMode(page);

      await submitBrandInquiryForm(page, {
        companyName: "Roadline Partners",
        contactName: "Morgan Lee",
        budgetRange: "$1,000 - $5,000",
      });

      await expectContactMessageVisible(page, contactMessages.brandMissing);
      await expectContactMessageHidden(page, contactMessages.brandSuccess);
    });

    test("shows the sponsor inquiry failure state for invalid email", async ({ page }) => {
      await openContactPageInTestMode(page);

      await submitBrandInquiryForm(page, {
        companyName: "Roadline Partners",
        contactName: "Morgan Lee",
        contactEmail: "bad-email",
        budgetRange: "$1,000 - $5,000",
        campaignDetails: "Owner-operator sponsorship test.",
      });

      await expectContactMessageVisible(page, contactMessages.brandInvalidEmail);
      await expectContactMessageHidden(page, contactMessages.brandSuccess);
    });
  });
});