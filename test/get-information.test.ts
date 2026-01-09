import { describe, expect, it } from "vitest";
import request from "supertest";

const URL = "http://localhost:4321";

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
