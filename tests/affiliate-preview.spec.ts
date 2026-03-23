import { expect, test } from "../playwright-fixture";
import {
  clickAffiliateCardCta,
  clickAffiliateModalCta,
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

  const gearGeorgeSecondProduct = {
    productSlug: "cobra-cb-radio",
    targetUrl: "https://a.co/d/0869GBch",
  };

  const roadsideFirstProduct = {
    productSlug: "rechargeable-flashlights-two-pack",
    targetUrl: "https://a.co/d/04ynevEg",
  };

  const roadsideSecondProduct = {
    productSlug: "vantrue-n4-pro-s-dash-cam",
    targetUrl: "https://a.co/d/036B6pdj",
  };

  test("tracks card and modal clicks for Gear George Recommends", async ({ page }) => {
    await openAffiliatePreviewPage(page);

    const section = getRecommendationSection(page, "gear-recommends");

    await expectAffiliateTrackingRequest(page, { sectionId: "gear-george-recommends", placement: "card", ...gearGeorgeFirstProduct }, async () => {
      await clickAffiliateCardCta(section, 0);
    });

    await expectAffiliateTrackingRequest(page, { sectionId: "gear-george-recommends", placement: "detail_dialog", ...gearGeorgeFirstProduct }, async () => {
      await clickAffiliateModalCta(page, section, 0);
    });

    await expectAffiliateTrackingRequest(page, { sectionId: "gear-george-recommends", placement: "card", ...gearGeorgeSecondProduct }, async () => {
      await clickAffiliateCardCta(section, 1);
    });

    await expectAffiliateTrackingRequest(page, { sectionId: "gear-george-recommends", placement: "detail_dialog", ...gearGeorgeSecondProduct }, async () => {
      await clickAffiliateModalCta(page, section, 1);
    });

    await expect(page).toHaveURL(/\/\?affiliateTestMode=1$/);
  });

  test("tracks card and modal clicks for Roadside Essentials", async ({ page }) => {
    await openAffiliatePreviewPage(page);

    const section = getRecommendationSection(page, "roadside-essentials");

    await expectAffiliateTrackingRequest(page, { sectionId: "roadside-essentials", placement: "card", ...roadsideFirstProduct }, async () => {
      await clickAffiliateCardCta(section, 0);
    });

    await expectAffiliateTrackingRequest(page, { sectionId: "roadside-essentials", placement: "detail_dialog", ...roadsideFirstProduct }, async () => {
      await clickAffiliateModalCta(page, section, 0);
    });

    await expectAffiliateTrackingRequest(page, { sectionId: "roadside-essentials", placement: "card", ...roadsideSecondProduct }, async () => {
      await clickAffiliateCardCta(section, 1);
    });

    await expectAffiliateTrackingRequest(page, { sectionId: "roadside-essentials", placement: "detail_dialog", ...roadsideSecondProduct }, async () => {
      await clickAffiliateModalCta(page, section, 1);
    });

    await expect(page).toHaveURL(/\/\?affiliateTestMode=1$/);
  });
});