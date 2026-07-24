import { chromium } from "playwright";
import { CustomError } from "@errors/customError";
import { logger } from "@utils/logger";

const log = logger.child({ module: "fetchPlaywright" });

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const fetchPlaywright = async (url: string): Promise<string> => {
  const startTime = Date.now();

  log.info({ url }, "Launching headless browser");

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (launchError) {
    log.error(
      { err: launchError instanceof Error ? launchError : { message: String(launchError) } },
      "Failed to launch browser — binary may be missing"
    );
    throw new CustomError(
      "No se pudo iniciar el navegador para procesar esta página",
      500,
      "Internal Server Error"
    );
  }

  try {
    const context = await browser.newContext({
      userAgent: DEFAULT_USER_AGENT,
      locale: "es-AR",
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    log.debug({ url }, "Navigating to page");
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Best-effort: if the page is JS-heavy, wait a bit for it to settle.
    try {
      await page.waitForLoadState("networkidle", { timeout: 15000 });
    } catch {
      log.debug({ url }, "Network idle timeout reached, proceeding with current content");
    }

    const html = await page.content();

    // Cloudflare block/challenge pages commonly contain these markers.
    const isCloudflareChallenge =
      html.includes("/cdn-cgi/challenge-platform") ||
      html.includes("Just a moment") ||
      html.toLowerCase().includes("enable javascript and cookies");

    if (isCloudflareChallenge) {
      log.warn({ url }, "Cloudflare challenge detected, access blocked");
      throw new CustomError(
        "Blocked by Cloudflare challenge (requires a real browser session)",
        403,
        "Forbidden"
      );
    }

    const durationMs = Date.now() - startTime;
    log.info({ url, durationMs }, "Playwright fetch completed successfully");

    return html;
  } finally {
    await browser.close();
    log.debug("Browser closed");
  }
};
