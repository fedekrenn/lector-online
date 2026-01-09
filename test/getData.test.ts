import { describe, expect, it } from "vitest";
import { getData } from "../src/utils/getData";

describe("getData", () => {
  it("throws on invalid URL", async () => {
    await expect(getData("not-a-url")).rejects.toThrow("Invalid URL");
  });

  it("throws on non-https URL", async () => {
    await expect(getData("http://example.com")).rejects.toThrow(
      "Only https:// URLs are allowed"
    );
  });

  it("fetches HTML via axios, sanitizes it, and returns slug", async () => {
    const res = await getData("https://example.com/foo/bar");

    expect(res).toEqual({
      id: "1700000000000",
      html: "CSP:SANITIZED:<html><body>ok</body></html>",
      slug: "bar",
      url: "https://example.com/foo/bar",
    });
  });
});
