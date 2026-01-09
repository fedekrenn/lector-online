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
});
