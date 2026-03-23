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

  const gearGeorgeFirstProduct = {
    productSlug: "trucker-bluetooth-headset",
    targetUrl: "https://a.co/d/097DJd2d",
  };

  const roadsideFirstProduct = {
    productSlug: "rechargeable-flashlights-two-pack",
    targetUrl: "https://a.co/d/04ynevEg",
  };

  test("tracks card and modal clicks for Gear George Recommends", async ({ page }) => {
    await openAffiliatePreviewPage(page);

    const section = getRecommendationSection(page, "gear-recommends");

    await expectAffiliateTrackingRequest(page, { sectionId: "gear-george-recommends", placement: "card", ...gearGeorgeFirstProduct }, async () => {
      await clickFirstAffiliateCardCta(section);
    });

    await expectAffiliateTrackingRequest(page, { sectionId: "gear-george-recommends", placement: "detail_dialog", ...gearGeorgeFirstProduct }, async () => {
      await clickFirstAffiliateModalCta(page, section);
    });

    await expect(page).toHaveURL(/\/\?affiliateTestMode=1$/);
  });

  test("tracks card and modal clicks for Roadside Essentials", async ({ page }) => {
    await openAffiliatePreviewPage(page);

    const section = getRecommendationSection(page, "roadside-essentials");

    await expectAffiliateTrackingRequest(page, { sectionId: "roadside-essentials", placement: "card", ...roadsideFirstProduct }, async () => {
      await clickFirstAffiliateCardCta(section);
    });

    await expectAffiliateTrackingRequest(page, { sectionId: "roadside-essentials", placement: "detail_dialog", ...roadsideFirstProduct }, async () => {
      await clickFirstAffiliateModalCta(page, section);
    });

    await expect(page).toHaveURL(/\/\?affiliateTestMode=1$/);
  });
});