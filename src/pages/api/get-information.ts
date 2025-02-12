import type { APIRoute } from "astro";
import { getData } from "../../utils/getData";

export const GET: APIRoute = async ({ request }): Promise<Response> => {
  const urlParams = new URL(request.url);
  const params = new URLSearchParams(urlParams.searchParams);

  const url = params.get("continue") || params.get("url") || "";
  const res = await getData(url);

  return new Response(res, {
    headers: {
      "content-type": "application/json",
    },
  });
};
