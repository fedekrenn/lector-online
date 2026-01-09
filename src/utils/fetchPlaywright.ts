import { chromium } from "playwright";
import { CustomError } from "../errors/customError";

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const fetchPlaywright = async (url: string): Promise<string> => {
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      userAgent: DEFAULT_USER_AGENT,
      locale: "es-AR",
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Best-effort: if the page is JS-heavy, wait a bit for it to settle.
    try {
      await page.waitForLoadState("networkidle", { timeout: 15000 });
    } catch {
      // ignore
    }

    const html = await page.content();

    // Cloudflare block/challenge pages commonly contain these markers.
    const isCloudflareChallenge =
      html.includes("/cdn-cgi/challenge-platform") ||
      html.includes("Just a moment") ||
      html.toLowerCase().includes("enable javascript and cookies");

    if (isCloudflareChallenge) {
      throw new CustomError(
        "Blocked by Cloudflare challenge (requires a real browser session)",
        403,
        "Forbidden"
      );
    }

    return html;
  } finally {
    await browser.close();
  }
};
