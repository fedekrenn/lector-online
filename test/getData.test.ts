import { describe, expect, it, vi, beforeEach } from "vitest";
import { getData } from "../src/utils/getData";
import axios from "axios";
import { sanitizeHtml, injectCSPMetaTag } from "../src/utils/sanitizeHtml";
import { fetchPlaywright } from "../src/utils/fetchPlaywright";

vi.mock("axios");
vi.mock("../src/utils/sanitizeHtml");
vi.mock("../src/utils/fetchPlaywright");

describe("getData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("URL validation", () => {
    it("throws on invalid URL", async () => {
      await expect(getData("not-a-url")).rejects.toThrow("Invalid URL");
    });

    it("throws on non-https URL", async () => {
      await expect(getData("http://example.com")).rejects.toThrow(
        "Only https:// URLs are allowed",
      );
    });

    it("throws on ftp:// URL", async () => {
      await expect(getData("ftp://example.com")).rejects.toThrow(
        "Only https:// URLs are allowed",
      );
    });
  });

  describe("successful fetch with axios", () => {
    beforeEach(() => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: "<html><body>Test content</body></html>",
      });
      vi.mocked(sanitizeHtml).mockReturnValue("<body>Sanitized</body>");
      vi.mocked(injectCSPMetaTag).mockReturnValue("<body>Secure</body>");
    });

    it("fetches and processes HTML successfully", async () => {
      const result = await getData("https://example.com/article/test-slug");

      expect(result).toMatchObject({
        html: "<body>Secure</body>",
        slug: "test-slug",
        url: "https://example.com/article/test-slug",
      });
      expect(result.id).toBeDefined();
    });

    it("extracts slug from URL pathname", async () => {
      const result = await getData("https://example.com/blog/posts/my-post");

      expect(result.slug).toBe("my-post");
    });

    it("uses empty string as slug when pathname is empty", async () => {
      const result = await getData("https://example.com/");

      expect(result.slug).toBe("");
    });

    it("calls sanitizeHtml with raw HTML", async () => {
      await getData("https://example.com/test");

      expect(sanitizeHtml).toHaveBeenCalledWith(
        "<html><body>Test content</body></html>",
      );
    });

    it("calls injectCSPMetaTag with sanitized HTML", async () => {
      await getData("https://example.com/test");

      expect(injectCSPMetaTag).toHaveBeenCalledWith("<body>Sanitized</body>");
    });

    it("generates unique ID based on timestamp", async () => {
      const mockDateNow = vi.spyOn(Date, "now");
      mockDateNow.mockReturnValueOnce(1000000);
      const result1 = await getData("https://example.com/test1");

      mockDateNow.mockReturnValueOnce(2000000);
      const result2 = await getData("https://example.com/test2");

      expect(result1.id).toBe("1000000");
      expect(result2.id).toBe("2000000");
      expect(result1.id).not.toBe(result2.id);
      expect(typeof result1.id).toBe("string");

      mockDateNow.mockRestore();
    });
  });

  describe("fallback to Playwright", () => {
    beforeEach(() => {
      vi.mocked(sanitizeHtml).mockReturnValue("<body>Sanitized PW</body>");
      vi.mocked(injectCSPMetaTag).mockReturnValue("<body>Secure PW</body>");
      vi.mocked(fetchPlaywright).mockResolvedValue(
        "<html><body>Playwright content</body></html>",
      );
    });

    it("uses Playwright when axios returns 404", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 404,
        data: "Not found",
      });

      const result = await getData("https://example.com/blocked");

      expect(fetchPlaywright).toHaveBeenCalledWith(
        "https://example.com/blocked",
      );
      expect(result.html).toBe("<body>Secure PW</body>");
    });

    it("uses Playwright when axios returns 403", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 403,
        data: "Forbidden",
      });

      await getData("https://example.com/protected");

      expect(fetchPlaywright).toHaveBeenCalledWith(
        "https://example.com/protected",
      );
    });

    it("uses Playwright when axios returns 500", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 500,
        data: "Server error",
      });

      await getData("https://example.com/error");

      expect(fetchPlaywright).toHaveBeenCalledWith("https://example.com/error");
    });

    it("processes Playwright content correctly", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 403,
        data: "Forbidden",
      });

      await getData("https://example.com/test");

      expect(sanitizeHtml).toHaveBeenCalledWith(
        "<html><body>Playwright content</body></html>",
      );
    });
  });

  describe("HTTP status codes", () => {
    beforeEach(() => {
      vi.mocked(sanitizeHtml).mockReturnValue("<body>Sanitized</body>");
      vi.mocked(injectCSPMetaTag).mockReturnValue("<body>Secure</body>");
    });

    it("handles 200 OK status", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: "<html>OK</html>",
      });

      const result = await getData("https://example.com/ok");

      expect(fetchPlaywright).not.toHaveBeenCalled();
      expect(result.html).toBe("<body>Secure</body>");
    });

    it("handles 201 Created status", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 201,
        data: "<html>Created</html>",
      });

      const result = await getData("https://example.com/created");

      expect(fetchPlaywright).not.toHaveBeenCalled();
      expect(result.html).toBe("<body>Secure</body>");
    });

    it("handles 299 status within 2xx range", async () => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 299,
        data: "<html>Success</html>",
      });

      const result = await getData("https://example.com/success");

      expect(fetchPlaywright).not.toHaveBeenCalled();
      expect(result.html).toBe("<body>Secure</body>");
    });
  });

  describe("slug extraction", () => {
    beforeEach(() => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: "<html>test</html>",
      });
      vi.mocked(sanitizeHtml).mockReturnValue("<body>Sanitized</body>");
      vi.mocked(injectCSPMetaTag).mockReturnValue("<body>Secure</body>");
    });

    it("extracts last segment from simple path", async () => {
      const result = await getData("https://example.com/article");
      expect(result.slug).toBe("article");
    });

    it("extracts last segment from nested path", async () => {
      const result = await getData("https://example.com/blog/2024/my-article");
      expect(result.slug).toBe("my-article");
    });

    it("handles URL with trailing slash", async () => {
      const result = await getData("https://example.com/article/");
      expect(result.slug).toBe("article");
    });

    it("handles URL with query parameters", async () => {
      const result = await getData("https://example.com/article?id=123");
      expect(result.slug).toBe("article");
    });

    it("handles URL with hash", async () => {
      const result = await getData("https://example.com/article#section");
      expect(result.slug).toBe("article");
    });

    it("handles domain-only URL", async () => {
      const result = await getData("https://example.com");
      expect(result.slug).toBe("");
    });
  });
});
