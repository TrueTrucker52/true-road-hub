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

export const expectContactMessageVisible = async (page: Page, message: RegExp) => {
  await expect(page.getByText(message)).toBeVisible();
};

export const expectContactMessageHidden = async (page: Page, message: RegExp) => {
  await expect(page.getByText(message)).not.toBeVisible();
};