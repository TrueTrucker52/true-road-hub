// Amazon Associates tag. No tag was found in the existing links (the Vantrue
// dash cam uses an a.co short link). Fill this in, e.g. "yourtag-20", and every
// Amazon link on /gear and /start will pick it up automatically.
export const AMAZON_TAG = "brandstruesho-20";

export const withAmazonTag = (url: string) => {
  if (!AMAZON_TAG) return url;
  const u = new URL(url);
  u.searchParams.set("tag", AMAZON_TAG);
  return u.toString();
};

export const amazonSearch = (terms: string) =>
  withAmazonTag(`https://www.amazon.com/s?k=${terms.trim().split(/\s+/).map(encodeURIComponent).join("+")}`);

export const BOOK_URL = withAmazonTag("https://www.amazon.com/dp/B0H1JP4S5S");

export const VANTRUE_URL = withAmazonTag("https://www.amazon.com/dp/B0F8BQW4TR");

export const amazonDp = (asin: string) => withAmazonTag(`https://www.amazon.com/dp/${asin}`);
