import { describe, expect, it } from "vitest";
import request from "supertest";

const URL = "http://localhost:4321";

/*
describe("GET /api/get-information", () => {
  it("returns 400 when url is missing", async () => {
    const request = new Request("http://localhost/api/get-information");

    const response = await GET({ request } as any);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Missing url parameter",
    });
  });

  it("returns 400 when url is invalid", async () => {
    const request = new Request(
      "http://localhost/api/get-information?url=not-a-url"
    );

    const response = await GET({ request } as any);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid URL" });
  });

  it("returns 400 when url is not https", async () => {
    const request = new Request(
      "http://localhost/api/get-information?url=http://example.com"
    );

    const response = await GET({ request } as any);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Only https:// URLs are allowed",
    });
  });

  it("uses continue param over url and returns getData result", async () => {
    mockedGetData.mockResolvedValue({
      id: "1",
      html: "<html />",
      slug: "x",
      url: "https://a.example/x",
    });

    const request = new Request(
      "http://localhost/api/get-information?url=https://b.example/y&continue=https://a.example/x"
    );

    const response = await GET({ request } as any);

    expect(mockedGetData).toHaveBeenCalledWith("https://a.example/x");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: "1",
      html: "<html />",
      slug: "x",
      url: "https://a.example/x",
    });
  });

  it("returns 500 when getData throws", async () => {
    mockedGetData.mockRejectedValue(new Error("boom"));

    const request = new Request(
      "http://localhost/api/get-information?url=https://example.com"
    );

    const response = await GET({ request } as any);

    expect(response.status).toBe(500);
    await expect(response.text()).resolves.toBe("boom");
  });
});
*/

describe("API Endpoints", () => {
  it("GET /api/get-information should return 200", async () => {
    const response = await request(URL).get(
      "/api/get-information?url=https://example.com"
    );
    expect(response.status).toBe(200);
  });

  it("GET /api/get-information should return 400 for missing url", async () => {
    const response = await request(URL).get("/api/get-information");
    expect(response.status).toBe(400);
  });

  it("GET /api/get-information should return 400 for invalid url", async () => {
    const response = await request(URL).get(
      "/api/get-information?url=invalid-url"
    );
    expect(response.status).toBe(400);
  });

  it("GET /api/get-information should return 400 if not https", async () => {
    const response = await request(URL).get(
      "/api/get-information?url=http://example.com"
    );
    expect(response.status).toBe(400);
  });
});
