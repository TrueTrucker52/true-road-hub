import { expect, test } from "../playwright-fixture";

const successMessages = {
  general: /your email app should open next so you can send your message directly to george/i,
  brand: /your email app should open next so you can send the sponsorship inquiry directly to george/i,
};

const errorMessages = {
  generalMissing: /please complete all fields before sending your message/i,
  generalInvalidEmail: /please enter a valid email address/i,
  brandMissing: /please complete all fields before sending your inquiry/i,
  brandInvalidEmail: /please enter a valid contact email address/i,
};

const openContactPageInTestMode = async (page: Parameters<(typeof test)["extend"]>[0] extends never ? never : any) => {
  await page.goto("/contact?contactTestMode=1");
  await expect(page.getByText(/test mode is on/i)).toBeVisible();
};

test.describe("Contact page preview test mode", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("shows a stable submit confirmation for the general contact flow", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel("Full Name").fill("Alex Driver");
    await page.getByLabel("Email Address").fill("alex@example.com");
    await page.getByLabel("Message").fill("Interested in working together.");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText(successMessages.general)).toBeVisible();
    await expect(page).toHaveURL(/contact\?contactTestMode=1/);
  });

  test("shows a stable submit confirmation for the sponsor inquiry flow", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel("Company Name").fill("Roadline Partners");
    await page.getByLabel("Contact Name").fill("Morgan Lee");
    await page.getByLabel("Contact Email").fill("morgan@roadline.com");
    await page.getByLabel("Budget Range").selectOption("$5,000 - $10,000");
    await page.getByLabel("Campaign Details").fill(
      "Need a sponsored integration for owner-operators this quarter.",
    );
    await page.getByRole("button", { name: "Submit Brand Deal Inquiry" }).click();

    await expect(page.getByText(successMessages.brand)).toBeVisible();
    await expect(page).toHaveURL(/contact\?contactTestMode=1/);
  });

  test("shows the general contact failure state for missing required fields", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel("Full Name").fill("Alex Driver");
    await page.getByLabel("Email Address").fill("alex@example.com");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText(errorMessages.generalMissing)).toBeVisible();
    await expect(page.getByText(successMessages.general)).not.toBeVisible();
  });

  test("shows the general contact failure state for invalid email", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel("Full Name").fill("Alex Driver");
    await page.getByLabel("Email Address").fill("not-an-email");
    await page.getByLabel("Message").fill("Interested in working together.");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText(errorMessages.generalInvalidEmail)).toBeVisible();
    await expect(page.getByText(successMessages.general)).not.toBeVisible();
  });

  test("shows the sponsor inquiry failure state for missing required fields", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel("Company Name").fill("Roadline Partners");
    await page.getByLabel("Contact Name").fill("Morgan Lee");
    await page.getByLabel("Budget Range").selectOption("$1,000 - $5,000");
    await page.getByRole("button", { name: "Submit Brand Deal Inquiry" }).click();

    await expect(page.getByText(errorMessages.brandMissing)).toBeVisible();
    await expect(page.getByText(successMessages.brand)).not.toBeVisible();
  });

  test("shows the sponsor inquiry failure state for invalid email", async ({ page }) => {
    await openContactPageInTestMode(page);

    await page.getByLabel("Company Name").fill("Roadline Partners");
    await page.getByLabel("Contact Name").fill("Morgan Lee");
    await page.getByLabel("Contact Email").fill("bad-email");
    await page.getByLabel("Budget Range").selectOption("$1,000 - $5,000");
    await page.getByLabel("Campaign Details").fill("Owner-operator sponsorship test.");
    await page.getByRole("button", { name: "Submit Brand Deal Inquiry" }).click();

    await expect(page.getByText(errorMessages.brandInvalidEmail)).toBeVisible();
    await expect(page.getByText(successMessages.brand)).not.toBeVisible();
  });
});