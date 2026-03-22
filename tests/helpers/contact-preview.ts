import { expect, type Page } from "@playwright/test";

export const contactMessages = {
  generalSuccess: /your email app should open next so you can send your message directly to george/i,
  brandSuccess: /your email app should open next so you can send the sponsorship inquiry directly to george/i,
  generalMissing: /please complete all fields before sending your message/i,
  generalInvalidEmail: /please enter a valid email address/i,
  brandMissing: /please complete all fields before sending your inquiry/i,
  brandInvalidEmail: /please enter a valid contact email address/i,
};

export const contactSelectors = {
  general: {
    fullName: "Full Name",
    email: "Email Address",
    message: "Message",
    submitButton: "Send Message",
  },
  brand: {
    companyName: "Company Name",
    contactName: "Contact Name",
    contactEmail: "Contact Email",
    budgetRange: "Budget Range",
    campaignDetails: "Campaign Details",
    submitButton: "Submit Brand Deal Inquiry",
  },
};

export const openContactPageInTestMode = async (page: Page) => {
  await page.goto("/contact?contactTestMode=1");
  await expect(page.getByText(/test mode is on/i)).toBeVisible();
};

export const fillGeneralContactForm = async (
  page: Page,
  values: {
    fullName?: string;
    email?: string;
    message?: string;
  } = {},
) => {
  if (values.fullName !== undefined) {
    await page.getByLabel(contactSelectors.general.fullName).fill(values.fullName);
  }

  if (values.email !== undefined) {
    await page.getByLabel(contactSelectors.general.email).fill(values.email);
  }

  if (values.message !== undefined) {
    await page.getByLabel(contactSelectors.general.message).fill(values.message);
  }
};

export const fillBrandInquiryForm = async (
  page: Page,
  values: {
    companyName?: string;
    contactName?: string;
    contactEmail?: string;
    budgetRange?: string;
    campaignDetails?: string;
  } = {},
) => {
  if (values.companyName !== undefined) {
    await page.getByLabel(contactSelectors.brand.companyName).fill(values.companyName);
  }

  if (values.contactName !== undefined) {
    await page.getByLabel(contactSelectors.brand.contactName).fill(values.contactName);
  }

  if (values.contactEmail !== undefined) {
    await page.getByLabel(contactSelectors.brand.contactEmail).fill(values.contactEmail);
  }

  if (values.budgetRange !== undefined) {
    await page.getByLabel(contactSelectors.brand.budgetRange).selectOption(values.budgetRange);
  }

  if (values.campaignDetails !== undefined) {
    await page.getByLabel(contactSelectors.brand.campaignDetails).fill(values.campaignDetails);
  }
};

export const submitGeneralContactForm = async (
  page: Page,
  values: {
    fullName?: string;
    email?: string;
    message?: string;
  } = {},
) => {
  await fillGeneralContactForm(page, values);
  await page.getByRole("button", { name: contactSelectors.general.submitButton }).click();
};

export const submitBrandInquiryForm = async (
  page: Page,
  values: {
    companyName?: string;
    contactName?: string;
    contactEmail?: string;
    budgetRange?: string;
    campaignDetails?: string;
  } = {},
) => {
  await fillBrandInquiryForm(page, values);
  await page.getByRole("button", { name: contactSelectors.brand.submitButton }).click();
};

export const expectContactMessageVisible = async (page: Page, message: RegExp) => {
  await expect(page.getByText(message)).toBeVisible();
};

export const expectContactMessageHidden = async (page: Page, message: RegExp) => {
  await expect(page.getByText(message)).not.toBeVisible();
};