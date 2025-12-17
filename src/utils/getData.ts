import axios from "axios";
import type { FetchedResource } from "@typos/types";
import { sanitizeHtml, injectCSPMetaTag } from "./sanitizeHtml";

export const getData = async (url: string): Promise<FetchedResource> => {
  try {
    let parsed: URL;

    try {
      parsed = new URL(url);
    } catch (err) {
      throw new Error("Invalid URL");
    }

    if (parsed.protocol !== "https:") {
      throw new Error("Only https:// URLs are allowed");
    }

    const response = await axios.get(url);
    const slug = parsed.pathname.split("/").filter(Boolean).pop() || "";

    const sanitizedHtml = sanitizeHtml(response.data);
    const secureHtml = injectCSPMetaTag(sanitizedHtml);

    return {
      id: Date.now().toString(),
      html: secureHtml,
      slug,
      url,
    };
  } catch (error: any) {
    throw error;
  }
};
