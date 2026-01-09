import axios from "axios";
import { sanitizeHtml, injectCSPMetaTag } from "./sanitizeHtml";
import { CustomError } from "../errors/customError";
import { fetchPlaywright } from "./fetchPlaywright";
import type { FetchedResource } from "@typos/types";

const DEFAULT_HEADERS = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "accept-language": "es-AR,es;q=0.9,en;q=0.8",
} as const;

export const getData = async (url: string): Promise<FetchedResource> => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch (err) {
    throw new CustomError("Invalid URL", 400, "Bad Request");
  }

  if (parsed.protocol !== "https:") {
    throw new CustomError("Only https:// URLs are allowed", 400, "Bad Request");
  }

  // First try a normal HTTP fetch (fast). Some sites will still block this with a Cloudflare challenge.
  const response = await axios.get(url, {
    headers: DEFAULT_HEADERS,
    responseType: "text",
    timeout: 15000,
    maxRedirects: 5,
    validateStatus: () => true,
  });

  let rawHtml: string;

  if (response.status >= 200 && response.status < 300) {
    rawHtml = response.data;
  } else {
    rawHtml = await fetchPlaywright(url);
  }

  const slug = parsed.pathname.split("/").filter(Boolean).pop() || "";

  const sanitizedHtml = sanitizeHtml(rawHtml);
  const secureHtml = injectCSPMetaTag(sanitizedHtml);

  return {
    id: Date.now().toString(),
    html: secureHtml,
    slug,
    url,
  };
};
