import axios from "axios";
import type { FetchedResource } from "@typos/types";
import { sanitizeHtml, injectCSPMetaTag } from "./sanitizeHtml";
import { CustomError } from "../errors/customError";

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
};
