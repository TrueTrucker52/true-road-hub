import { expect, test } from "../playwright-fixture";
import {
  clickFirstAffiliateCardCta,
  clickFirstAffiliateModalCta,
  expectAffiliateTrackingRequest,
  getRecommendationSection,
  openAffiliatePreviewPage,
} from "./helpers/affiliate-preview";

test.describe("Affiliate tracking preview coverage", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("tracks card and modal clicks for Gear George Recommends", async ({ page }) => {
    await openAffiliatePreviewPage(page);

    const section = getRecommendationSection(page, "gear-recommends");

    await expectAffiliateTrackingRequest(page, { sectionId: "gear-george-recommends", placement: "card" }, async () => {
      await clickFirstAffiliateCardCta(section);
    });

    await expectAffiliateTrackingRequest(page, { sectionId: "gear-george-recommends", placement: "detail_dialog" }, async () => {
      await clickFirstAffiliateModalCta(page, section);
    });

    await expect(page).toHaveURL(/\/$/);
  });

  test("tracks card and modal clicks for Roadside Essentials", async ({ page }) => {
    await openAffiliatePreviewPage(page);

    const section = getRecommendationSection(page, "roadside-essentials");

    await expectAffiliateTrackingRequest(page, { sectionId: "roadside-essentials", placement: "card" }, async () => {
      await clickFirstAffiliateCardCta(section);
    });

    await expectAffiliateTrackingRequest(page, { sectionId: "roadside-essentials", placement: "detail_dialog" }, async () => {
      await clickFirstAffiliateModalCta(page, section);
    });

    await expect(page).toHaveURL(/\/$/);
  });
});