import type { APIRoute } from "astro";
import { getData } from "../../utils/getData";
import { CustomError } from "../../errors/customError";

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

    const res = await getData(url);

    return new Response(JSON.stringify(res), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error: any) {
    if (error instanceof CustomError) {
      return new Response(
        JSON.stringify({ error: error.message, statusText: error.statusText }),
        {
          status: error.status,
          headers: { "content-type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: error?.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
};
