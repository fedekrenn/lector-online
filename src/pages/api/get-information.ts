import type { APIRoute } from "astro";
import { getData } from "../../utils/getData";

export const GET: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const urlParams = new URL(request.url);
    const params = new URLSearchParams(urlParams.searchParams);
    const url = params.get("continue") || params.get("url") || "";

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing url parameter" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    if (parsed.protocol !== "https:") {
      return new Response(
        JSON.stringify({ error: "Only https:// URLs are allowed" }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const res = await getData(url);

    return new Response(JSON.stringify(res), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(error.message || "Internal Server Error", {
      status: 500,
    });
  }
};
