import { expect, type Locator, type Page } from "@playwright/test";

type AffiliatePlacement = "card" | "detail_dialog";

type AffiliateTrackingExpectation = {
  placement: AffiliatePlacement;
  productSlug: string;
  sectionId: string;
  targetUrl: string;
};

const affiliateTrackingEndpoint = "/functions/v1/track-affiliate-product-click";

export const openAffiliatePreviewPage = async (page: Page) => {
  await page.goto("/?affiliateTestMode=1");
};

export const getRecommendationSection = (page: Page, sectionDomId: string) => page.locator(`section#${sectionDomId}`);

export const clickAffiliateCardCta = async (section: Locator, productIndex = 0) => {
  await section.scrollIntoViewIfNeeded();
  await section.getByRole("link", { name: /get best price on amazon/i }).nth(productIndex).click();
};

export const clickAffiliateModalCta = async (page: Page, section: Locator, productIndex = 0) => {
  await section.scrollIntoViewIfNeeded();
  await section.getByRole("button", { name: /view details/i }).nth(productIndex).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: /get best price on amazon/i }).click();
};

export const expectAffiliateTrackingRequest = async (
  page: Page,
  expected: AffiliateTrackingExpectation,
  trigger: () => Promise<void>,
) => {
  const requestPromise = page.waitForRequest(
    (request) => request.method() === "POST" && request.url().includes(affiliateTrackingEndpoint),
  );
  const responsePromise = page.waitForResponse(
    (response) => response.request().method() === "POST" && response.url().includes(affiliateTrackingEndpoint),
  );

  await trigger();

  const [request, response] = await Promise.all([requestPromise, responsePromise]);
  const payload = request.postDataJSON();

  expect(response.ok()).toBeTruthy();
  expect(payload.sectionId).toBe(expected.sectionId);
  expect(payload.placement).toBe(expected.placement);
  expect(payload.productSlug).toBe(expected.productSlug);
  expect(payload.targetUrl).toBe(expected.targetUrl);
};
