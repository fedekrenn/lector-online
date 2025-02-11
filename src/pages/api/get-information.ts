import type { APIRoute } from "astro";
import { getData } from "../../utils/getData";

export const GET: APIRoute = async ({ request }): Promise<Response> => {
  const urlParams = new URL(request.url);
  const params = new URLSearchParams(urlParams.search);

  const url = params.get("url") || "https://www.lavoz.com.ar/deportes/";
  const res = await getData(url);

  return new Response(res, {
    headers: {
      "content-type": "application/json",
    },
  });
};
