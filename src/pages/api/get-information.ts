import type { APIRoute } from "astro";
import { getData } from "../../utils/getData";

export const GET: APIRoute = async ({ request }): Promise<Response> => {
  try {
    const urlParams = new URL(request.url);
    const params = new URLSearchParams(urlParams.searchParams);
    const url = params.get("continue") || params.get("url") || "";

    const res = await getData(url);

    return new Response(JSON.stringify(res), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};
